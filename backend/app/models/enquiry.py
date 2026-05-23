import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _new_uuid() -> str:
    return str(uuid.uuid4())


class Enquiry(Base):
    __tablename__ = "enquiries"

    id: Mapped[str] = mapped_column(Text, primary_key=True, default=_new_uuid)
    customer_name: Mapped[str] = mapped_column(Text, nullable=False)
    channel: Mapped[str] = mapped_column(Text, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(Text, nullable=False, default="open")

    # Populated by the background worker after SOP matching
    matched_sop: Mapped[str | None] = mapped_column(Text, nullable=True)
    suggested_response: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Set on manual escalation (via /escalate) or auto-escalation (no SOP match)
    escalation_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow
    )

    events: Mapped[list["EnquiryEvent"]] = relationship(
        "EnquiryEvent",
        back_populates="enquiry",
        order_by="EnquiryEvent.created_at",
        cascade="all, delete-orphan",
    )
    followups: Mapped[list["Followup"]] = relationship(
        "Followup",
        back_populates="enquiry",
        cascade="all, delete-orphan",
    )


class EnquiryEvent(Base):
    __tablename__ = "enquiry_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    enquiry_id: Mapped[str] = mapped_column(
        Text, ForeignKey("enquiries.id", ondelete="CASCADE"), nullable=False
    )
    event_type: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    # Stored as a JSON string — avoids a JSON column type that SQLite doesn't natively index.
    # Named 'event_metadata' because 'metadata' is reserved by SQLAlchemy's Declarative API.
    event_metadata: Mapped[str | None] = mapped_column("metadata", Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow
    )

    enquiry: Mapped["Enquiry"] = relationship("Enquiry", back_populates="events")


class Followup(Base):
    __tablename__ = "followups"

    id: Mapped[str] = mapped_column(Text, primary_key=True, default=_new_uuid)
    enquiry_id: Mapped[str] = mapped_column(
        Text, ForeignKey("enquiries.id", ondelete="CASCADE"), nullable=False
    )
    delay_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    message_template: Mapped[str | None] = mapped_column(Text, nullable=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(Text, nullable=False, default="pending")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow
    )

    enquiry: Mapped["Enquiry"] = relationship("Enquiry", back_populates="followups")
