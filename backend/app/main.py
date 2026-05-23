from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI

from app.config import settings
from app.database import Base, engine
from app.exceptions.handlers import register_exception_handlers
from app.routers import enquiry, health


@asynccontextmanager
async def _lifespan(_app: FastAPI) -> AsyncIterator[None]:
    # Create all tables on startup if they don't exist. In production this would
    # be replaced by Alembic migrations, but for a prototype this is acceptable.
    Base.metadata.create_all(bind=engine)
    yield
    # Nothing to tear down — SQLite connections are managed per-request via get_db()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Closira Backend API",
        description=(
            "AI-powered customer communication platform for SMBs. "
            "Handles inbound enquiries via WhatsApp, email, and phone — "
            "routes them through SOP matching and exposes a full audit trail."
        ),
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=_lifespan,
    )

    register_exception_handlers(app)

    app.include_router(health.router)
    app.include_router(enquiry.router)

    return app


app = create_app()
