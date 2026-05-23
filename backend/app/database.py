from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

# connect_args is SQLite-specific: allows the same connection to be used
# across threads (necessary because FastAPI runs handlers in a thread pool).
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},
    echo=settings.debug,
)


# WAL mode dramatically improves concurrent read performance for SQLite —
# readers never block writers and vice versa.
@event.listens_for(engine, "connect")
def _set_sqlite_pragmas(dbapi_connection, _connection_record) -> None:
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Session:  # type: ignore[return]
    """FastAPI dependency that yields a scoped DB session and guarantees cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connectivity(db: Session) -> bool:
    """Used by the health endpoint — returns False instead of raising so the
    caller can decide whether to degrade gracefully or return 503."""
    try:
        db.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
