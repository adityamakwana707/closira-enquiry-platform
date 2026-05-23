from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


# ─── Shared literals ──────────────────────────────────────────────────────────

ChannelType = Literal["whatsapp", "email", "call"]
StatusType = Literal["open", "processing", "resolved", "escalated"]
FollowupStatusType = Literal["pending", "sent", "cancelled"]


# ─── Enquiry ──────────────────────────────────────────────────────────────────

class EnquiryCreateRequest(BaseModel):
    customer_name: str = Field(
        ...,
        min_length=1,
        max_length=120,
        description="Full name of the customer submitting the enquiry.",
        examples=["Sarah Mitchell"],
    )
    channel: ChannelType = Field(
        ...,
        description="Communication channel through which the enquiry arrived.",
        examples=["whatsapp"],
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="Raw inbound message text from the customer.",
        examples=["Hi, I wanted to know about your pricing plans"],
    )


class EnquiryCreateResponse(BaseModel):
    enquiry_id: str = Field(
        description="UUID of the newly created enquiry.",
        examples=["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
    )
    status: StatusType = Field(
        description="Initial status; always 'open' immediately after creation.",
        examples=["open"],
    )
    message: str = Field(
        description="Human-readable confirmation that background processing has started.",
        examples=["Enquiry received. Processing in background."],
    )


class EnquiryDetail(BaseModel):
    id: str
    customer_name: str
    channel: ChannelType
    message: str
    status: StatusType
    matched_sop: Optional[str] = None
    suggested_response: Optional[str] = None
    escalation_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Followup ─────────────────────────────────────────────────────────────────

_DEFAULT_FOLLOWUP_TEMPLATE = (
    "Hi {customer_name}, just following up on your recent enquiry. "
    "Is there anything else we can help you with?"
)


class FollowupCreateRequest(BaseModel):
    delay_minutes: int = Field(
        ...,
        ge=1,
        le=10080,  # cap at one week
        description="How many minutes from now the follow-up should be sent.",
        examples=[30],
    )
    message_template: Optional[str] = Field(
        default=None,
        max_length=2000,
        description=(
            "Optional message template. Supports {customer_name} placeholder. "
            "Defaults to a standard follow-up message if omitted."
        ),
        examples=["Hi {customer_name}, just checking in on your enquiry."],
    )


class FollowupDetail(BaseModel):
    id: str
    enquiry_id: str
    delay_minutes: int
    message_template: Optional[str] = None
    scheduled_at: datetime
    status: FollowupStatusType
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Escalation ───────────────────────────────────────────────────────────────

class EscalateRequest(BaseModel):
    reason: str = Field(
        ...,
        min_length=5,
        max_length=1000,
        description="Clear explanation of why the enquiry requires escalation.",
        examples=["Customer is upset and demanding a refund immediately"],
    )


# ─── History ──────────────────────────────────────────────────────────────────

class TimelineEvent(BaseModel):
    event_type: str
    description: str
    event_metadata: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class EnquiryHistoryResponse(BaseModel):
    enquiry: EnquiryDetail
    timeline: list[TimelineEvent]
    followups: list[FollowupDetail]


# ─── Error response ───────────────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    error: str = Field(description="Machine-readable error code.", examples=["enquiry_not_found"])
    detail: str = Field(description="Human-readable explanation.", examples=["No enquiry found with id abc-123"])
    status_code: int = Field(description="HTTP status code mirrored in body for client convenience.", examples=[404])
