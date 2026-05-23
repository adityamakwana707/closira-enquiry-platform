from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.enquiry import (
    EnquiryCreateRequest,
    EnquiryCreateResponse,
    EnquiryDetail,
    EnquiryHistoryResponse,
    EscalateRequest,
    FollowupCreateRequest,
    FollowupDetail,
    TimelineEvent,
)
from app.services import enquiry_service
from app.workers.enquiry_worker import process_enquiry

router = APIRouter(prefix="/enquiry", tags=["Enquiries"])


@router.post(
    "",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=EnquiryCreateResponse,
    summary="Submit a new customer enquiry",
    description=(
        "Accepts an inbound customer enquiry from WhatsApp, email, or phone. "
        "The record is persisted immediately and SOP matching runs in the background — "
        "the response is returned before processing completes."
    ),
)
def submit_enquiry(
    payload: EnquiryCreateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> EnquiryCreateResponse:
    enquiry = enquiry_service.create_enquiry(payload, db)
    # Fire-and-forget: response returns while the worker runs post-commit
    background_tasks.add_task(process_enquiry, enquiry.id)
    return EnquiryCreateResponse(
        enquiry_id=enquiry.id,
        status=enquiry.status,  # type: ignore[arg-type]
        message="Enquiry received. Processing in background.",
    )


@router.post(
    "/{enquiry_id}/followup",
    status_code=status.HTTP_201_CREATED,
    response_model=FollowupDetail,
    summary="Schedule a follow-up for an enquiry",
    description=(
        "Creates a timed follow-up message attached to the enquiry. "
        "Not permitted on resolved or escalated enquiries."
    ),
)
def create_followup(
    enquiry_id: str,
    payload: FollowupCreateRequest,
    db: Session = Depends(get_db),
) -> FollowupDetail:
    followup = enquiry_service.schedule_followup(enquiry_id, payload, db)
    return FollowupDetail.model_validate(followup)


@router.post(
    "/{enquiry_id}/escalate",
    status_code=status.HTTP_200_OK,
    response_model=EnquiryDetail,
    summary="Manually escalate an enquiry",
    description=(
        "Marks an enquiry as escalated with a mandatory reason. "
        "Returns 409 if the enquiry is already escalated."
    ),
)
def escalate_enquiry(
    enquiry_id: str,
    payload: EscalateRequest,
    db: Session = Depends(get_db),
) -> EnquiryDetail:
    enquiry = enquiry_service.escalate_enquiry(enquiry_id, payload, db)
    return EnquiryDetail.model_validate(enquiry)


@router.get(
    "/{enquiry_id}/history",
    status_code=status.HTTP_200_OK,
    response_model=EnquiryHistoryResponse,
    summary="Retrieve full enquiry history",
    description=(
        "Returns the enquiry record, chronological event timeline, "
        "and all associated followups."
    ),
)
def get_enquiry_history(
    enquiry_id: str,
    db: Session = Depends(get_db),
) -> EnquiryHistoryResponse:
    enquiry = enquiry_service.get_enquiry_history(enquiry_id, db)
    return EnquiryHistoryResponse(
        enquiry=EnquiryDetail.model_validate(enquiry),
        timeline=[TimelineEvent.model_validate(e) for e in enquiry.events],
        followups=[FollowupDetail.model_validate(f) for f in enquiry.followups],
    )
