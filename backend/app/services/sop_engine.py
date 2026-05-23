"""SOP matching engine — pure, stateless, no I/O.

Keeping this free of DB access means it can be unit-tested without a database
fixture and reused from any context (worker, webhook handler, CLI tool, etc.).
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class SOP:
    name: str
    trigger_keywords: tuple[str, ...]
    suggested_response: str


# Ordered list — first match wins, so more specific SOPs should come before
# broad catch-alls. Complaint is placed before General Information because
# "problem" or "issue" often appears in messages that also mention "information".
_SOPS: tuple[SOP, ...] = (
    SOP(
        name="Booking Enquiry",
        trigger_keywords=("book", "appointment", "schedule", "slot", "availability", "reserve"),
        suggested_response=(
            "Thanks for reaching out! We'd love to help you book an appointment. "
            "Please share your preferred date and time and we'll confirm availability."
        ),
    ),
    SOP(
        name="Pricing Question",
        trigger_keywords=("price", "pricing", "cost", "how much", "charges", "fee", "quote", "rate"),
        suggested_response=(
            "Great question! Our pricing depends on your requirements. "
            "Could you share a few details about what you're looking for "
            "so we can give you an accurate quote?"
        ),
    ),
    SOP(
        name="Complaint",
        trigger_keywords=(
            "complaint", "unhappy", "disappointed", "upset", "refund",
            "wrong", "issue", "problem", "bad", "terrible", "awful",
        ),
        suggested_response=(
            "We're really sorry to hear about your experience. "
            "Your feedback matters to us. A team member will review your "
            "concern and get back to you within 2 hours."
        ),
    ),
    SOP(
        name="After-Hours Message",
        trigger_keywords=(
            "after hours", "closed", "weekend", "tonight", "tomorrow morning",
            "when do you open", "office hours",
        ),
        suggested_response=(
            "Thanks for contacting us! We're currently outside business hours. "
            "We'll get back to you first thing when we're back. "
            "Our hours are Mon–Sat, 9 AM to 6 PM."
        ),
    ),
    SOP(
        name="General Information Request",
        trigger_keywords=(
            "information", "details", "tell me more", "what do you offer",
            "services", "how does it work", "explain",
        ),
        suggested_response=(
            "Thanks for your interest in Closira! We help businesses manage "
            "customer conversations across WhatsApp, email, and phone — "
            "all from one place. Would you like to know more about a specific feature?"
        ),
    ),
)


def match_sop(message: str) -> SOP | None:
    """Return the first SOP whose keywords appear in the lowercased message.

    Multi-word keywords (e.g. "how much") are checked with a substring match
    against the full message so word-boundary edge cases don't silently drop
    valid matches.
    """
    normalised = message.lower()
    for sop in _SOPS:
        if any(keyword in normalised for keyword in sop.trigger_keywords):
            return sop
    return None
