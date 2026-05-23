"""Domain-specific exceptions for Closira.

Raising typed exceptions rather than generic ones lets exception handlers in
main.py map each case to a precise HTTP status and error code without any
isinstance() chains in business logic.
"""


class ClosiraBaseError(Exception):
    """Root for all application-level exceptions."""


class EnquiryNotFoundError(ClosiraBaseError):
    def __init__(self, enquiry_id: str) -> None:
        self.enquiry_id = enquiry_id
        super().__init__(f"No enquiry found with id '{enquiry_id}'")


class EnquiryAlreadyEscalatedError(ClosiraBaseError):
    def __init__(self, enquiry_id: str) -> None:
        self.enquiry_id = enquiry_id
        super().__init__(f"Enquiry '{enquiry_id}' is already escalated")


class EnquiryNotActionableError(ClosiraBaseError):
    """Raised when a followup is requested on a resolved or escalated enquiry."""

    def __init__(self, enquiry_id: str, current_status: str) -> None:
        self.enquiry_id = enquiry_id
        self.current_status = current_status
        super().__init__(
            f"Enquiry '{enquiry_id}' has status '{current_status}' "
            "and cannot accept new followups"
        )


class InvalidChannelError(ClosiraBaseError):
    def __init__(self, channel: str) -> None:
        self.channel = channel
        super().__init__(
            f"'{channel}' is not a supported channel. "
            "Accepted values: whatsapp, email, call"
        )
