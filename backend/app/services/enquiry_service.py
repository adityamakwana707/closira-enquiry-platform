"""Core business logic for enquiry lifecycle management.

This layer owns all DB reads/writes for enquiries. Routes delegate here and
receive typed models or domain exceptions — they never touch the DB directly.
"""

import json
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.exceptions import (
    EnquiryAlreadyEscalatedError,
    EnquiryNotActionableError,
    EnquiryNotFoundError,
)
from app.logger import get_logger
from app.models.enquiry import Enquiry, EnquiryEvent, Followup
from app.schemas.enquiry import (
    EnquiryCreateRequest,
    EscalateRequest,
    FollowupCreateRequest,
    _DEFAULT_FOLLOWUP_TEMPLATE,
)

_log = get_logger(__name__)

# Statuses that indicate the enquiry lifecycle is closed — followups make no
# sense on these and the UI should show a locked state.
_TERMINAL_STATUSES = frozenset({"resolved", "escalated"})


def create_enquiry(payload: EnquiryCreateRequest, db: Session) -> Enquiry:
    enquiry_id = str(uuid.uuid4())

    enquiry = Enquiry(
        id=enquiry_id,
        customer_name=payload.customer_name,
        channel=payload.channel,
        message=payload.message,
    )
    db.add(enquiry)

    creation_event = EnquiryEvent(
        enquiry_id=enquiry_id,
        event_type="enquiry_created",
        description=f"Inbound {payload.channel} enquiry received from {payload.customer_name}.",
    )
    db.add(creation_event)
    db.commit()
    db.refresh(enquiry)

    _log.info(
        "New enquiry created",
        extra={
            "event": "enquiry_created",
            "enquiry_id": enquiry.id,
            "channel": enquiry.channel,
            "customer_name": enquiry.customer_name,
        },
    )
    return enquiry


def get_enquiry_or_raise(enquiry_id: str, db: Session) -> Enquiry:
    enquiry = db.get(Enquiry, enquiry_id)
    if enquiry is None:
        raise EnquiryNotFoundError(enquiry_id)
    return enquiry


def schedule_followup(
    enquiry_id: str,
    payload: FollowupCreateRequest,
    db: Session,
) -> Followup:
    enquiry = get_enquiry_or_raise(enquiry_id, db)

    if enquiry.status in _TERMINAL_STATUSES:
        raise EnquiryNotActionableError(enquiry_id, enquiry.status)

    template = payload.message_template or _DEFAULT_FOLLOWUP_TEMPLATE
    scheduled_at = datetime.now(timezone.utc) + timedelta(minutes=payload.delay_minutes)

    followup = Followup(
        enquiry_id=enquiry_id,
        delay_minutes=payload.delay_minutes,
        message_template=template,
        scheduled_at=scheduled_at,
    )
    db.add(followup)

    followup_event = EnquiryEvent(
        enquiry_id=enquiry_id,
        event_type="followup_scheduled",
        description=f"Follow-up scheduled in {payload.delay_minutes} minutes.",
        event_metadata=json.dumps({"delay_minutes": payload.delay_minutes, "scheduled_at": scheduled_at.isoformat()}),
    )
    db.add(followup_event)
    db.commit()
    db.refresh(followup)

    _log.info(
        "Follow-up scheduled",
        extra={
            "event": "followup_scheduled",
            "enquiry_id": enquiry_id,
            "delay_minutes": payload.delay_minutes,
        },
    )
    return followup


def escalate_enquiry(
    enquiry_id: str,
    payload: EscalateRequest,
    db: Session,
) -> Enquiry:
    enquiry = get_enquiry_or_raise(enquiry_id, db)

    if enquiry.status == "escalated":
        raise EnquiryAlreadyEscalatedError(enquiry_id)

    enquiry.status = "escalated"
    enquiry.escalation_reason = payload.reason

    escalation_event = EnquiryEvent(
        enquiry_id=enquiry_id,
        event_type="escalated",
        description=f"Manually escalated: {payload.reason}",
    )
    db.add(escalation_event)
    db.commit()
    db.refresh(enquiry)

    _log.warning(
        "Enquiry manually escalated",
        extra={
            "event": "manual_escalated",
            "enquiry_id": enquiry_id,
            "reason": payload.reason,
        },
    )
    return enquiry


def get_enquiry_history(enquiry_id: str, db: Session) -> Enquiry:
    enquiry = get_enquiry_or_raise(enquiry_id, db)
    # Relationships are lazy-loaded by default; access them here while the
    # session is open so the router doesn't need to know about lazy loading.
    _ = enquiry.events
    _ = enquiry.followups
    return enquiry
