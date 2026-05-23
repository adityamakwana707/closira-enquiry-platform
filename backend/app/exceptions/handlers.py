from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.exceptions import (
    EnquiryAlreadyEscalatedError,
    EnquiryNotActionableError,
    EnquiryNotFoundError,
)
from app.logger import get_logger

_log = get_logger(__name__)


def _error_body(error: str, detail: str, status_code: int) -> dict:
    return {"error": error, "detail": detail, "status_code": status_code}


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(EnquiryNotFoundError)
    async def _handle_not_found(
        _request: Request, exc: EnquiryNotFoundError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=404,
            content=_error_body("enquiry_not_found", str(exc), 404),
        )

    @app.exception_handler(EnquiryAlreadyEscalatedError)
    async def _handle_already_escalated(
        _request: Request, exc: EnquiryAlreadyEscalatedError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=409,
            content=_error_body("enquiry_already_escalated", str(exc), 409),
        )

    @app.exception_handler(EnquiryNotActionableError)
    async def _handle_not_actionable(
        _request: Request, exc: EnquiryNotActionableError
    ) -> JSONResponse:
        return JSONResponse(
            status_code=409,
            content=_error_body("enquiry_not_actionable", str(exc), 409),
        )

    @app.exception_handler(RequestValidationError)
    async def _handle_validation(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        # FastAPI's default 422 body is fine structurally but the envelope differs
        # from our error contract — normalise it so clients always see the same shape.
        readable = "; ".join(
            f"{' → '.join(str(loc) for loc in err['loc'])}: {err['msg']}"
            for err in exc.errors()
        )
        return JSONResponse(
            status_code=422,
            content=_error_body("validation_error", readable, 422),
        )

    @app.exception_handler(Exception)
    async def _handle_unhandled(request: Request, exc: Exception) -> JSONResponse:
        _log.error(
            "Unhandled exception on %s %s",
            request.method,
            request.url.path,
            extra={"event": "unhandled_error", "exc_type": type(exc).__name__},
            exc_info=True,
        )
        return JSONResponse(
            status_code=500,
            content=_error_body(
                "internal_server_error",
                "An unexpected error occurred. Please try again later.",
                500,
            ),
        )
