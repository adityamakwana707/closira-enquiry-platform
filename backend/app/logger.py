import logging
import sys
from typing import Any

from pythonjsonlogger.json import JsonFormatter as _BaseJsonFormatter

from app.config import settings


class _ClosiraJsonFormatter(_BaseJsonFormatter):
    """Ensures every record carries a consistent set of top-level fields so
    log aggregators (Datadog, CloudWatch, etc.) can index without extra parsing."""

    ALWAYS_PRESENT = ("timestamp", "level", "event", "message")

    def add_fields(
        self,
        log_record: dict[str, Any],
        record: logging.LogRecord,
        message_dict: dict[str, Any],
    ) -> None:
        super().add_fields(log_record, record, message_dict)

        log_record["timestamp"] = log_record.pop("asctime", record.asctime)
        log_record["level"] = record.levelname
        # "event" is the structured identifier; "message" is the human description
        log_record.setdefault("event", record.funcName)
        log_record.setdefault("message", record.getMessage())


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)

    if logger.handlers:
        # Avoid duplicate handlers when the logger is fetched multiple times
        return logger

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        _ClosiraJsonFormatter(
            fmt="%(asctime)s %(levelname)s %(event)s %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S%z",
        )
    )

    numeric_level = getattr(logging, settings.log_level.upper(), logging.INFO)
    logger.setLevel(numeric_level)
    logger.addHandler(handler)
    logger.propagate = False

    return logger
