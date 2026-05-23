"""Background worker for post-ingestion enquiry processing.

FastAPI's BackgroundTasks runs this in the same process after the HTTP response
is sent. The function must be self-contained: it opens its own DB session rather
than reusing the request session, which is already closed by the time this runs.
"""

import json

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.logger import get_logger
from app.models.enquiry import Enquiry, EnquiryEvent
from app.services.sop_engine import match_sop

_log = get_logger(__name__)


def process_enquiry(enquiry_id: str) -> None:
    """Runs SOP matching and updates enquiry status.

    Opens its own session so this is safe to call from BackgroundTasks where
    the original request session is already torn down.
    """
    db: Session = SessionLocal()
    try:
        _run_processing_pipeline(enquiry_id, db)
    except Exception:
        db.rollback()
        _log.error(
            "Background processing failed — rolled back all changes",
            extra={"event": "db_error", "enquiry_id": enquiry_id},
            exc_info=True,
        )
    finally:
        db.close()


def _run_processing_pipeline(enquiry_id: str, db: Session) -> None:
    enquiry = db.get(Enquiry, enquiry_id)
    if enquiry is None:
        # Guard against race conditions where the record was deleted between
        # the HTTP response being sent and this task starting.
        _log.warning(
            "Background task found no enquiry — likely deleted before task ran",
            extra={"event": "unhandled_error", "enquiry_id": enquiry_id},
        )
        return

    # ── Step 1: mark as processing ──────────────────────────────────────────
    enquiry.status = "processing"
    db.add(
        EnquiryEvent(
            enquiry_id=enquiry_id,
            event_type="processing_started",
            description="Background SOP matching pipeline started.",
        )
    )
    db.commit()

    _log.info(
        "SOP matching started",
        extra={"event": "processing_started", "enquiry_id": enquiry_id},
    )

    # ── Step 2: SOP matching ─────────────────────────────────────────────────
    matched = match_sop(enquiry.message)

    if matched:
        enquiry.matched_sop = matched.name
        enquiry.suggested_response = matched.suggested_response
        # Return to "open" so a human agent can review the suggestion before
        # the reply goes out — we're not auto-sending anything.
        enquiry.status = "open"

        db.add(
            EnquiryEvent(
                enquiry_id=enquiry_id,
                event_type="sop_matched",
                description=f"SOP '{matched.name}' matched. Suggested response prepared for review.",
                event_metadata=json.dumps({"sop": matched.name}),
            )
        )
        db.commit()

        _log.info(
            "SOP matched",
            extra={
                "event": "sop_matched",
                "enquiry_id": enquiry_id,
                "sop_name": matched.name,
            },
        )

    else:
        # No SOP covers this message — escalate automatically so a human sees it.
        escalation_reason = "No SOP matched for inbound message. Manual review required."
        enquiry.status = "escalated"
        enquiry.escalation_reason = escalation_reason

        db.add(
            EnquiryEvent(
                enquiry_id=enquiry_id,
                event_type="auto_escalated",
                description=(
                    "No SOP keywords found in message. "
                    "Enquiry auto-escalated for human review."
                ),
            )
        )
        db.commit()

        _log.warning(
            "No SOP match — enquiry auto-escalated",
            extra={"event": "auto_escalated", "enquiry_id": enquiry_id},
        )
