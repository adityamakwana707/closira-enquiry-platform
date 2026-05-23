from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import check_db_connectivity, get_db

router = APIRouter(tags=["Operations"])


@router.get(
    "/health",
    summary="Service health check",
    description=(
        "Returns current service status and database connectivity. "
        "Suitable for use as a load balancer or container readiness probe."
    ),
)
def health_check(db: Session = Depends(get_db)) -> dict:
    db_reachable = check_db_connectivity(db)
    return {
        "status": "ok" if db_reachable else "degraded",
        "database": "connected" if db_reachable else "unreachable",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
