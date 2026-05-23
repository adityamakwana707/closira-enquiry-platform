"""Integration tests for all 5 Closira API endpoints.

These tests use FastAPI's TestClient which runs synchronously over HTTPX,
so no async test runner configuration is required. Each test function is
self-contained: a fresh in-memory SQLite DB is created and torn down via
the `client` fixture so tests never share state.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import create_app

# Trigger model registration with Base.metadata before any create_all call
import app.models.enquiry  # noqa: F401

# ─── Fixtures ────────────────────────────────────────────────────────────────

_IN_MEMORY_DB = "sqlite:///:memory:"


@pytest.fixture()
def client():
    """Yields a TestClient backed by a fresh in-memory database.

    SQLite :memory: databases are per-connection, so we use StaticPool to force
    every session to reuse the same underlying connection — otherwise tables
    created by create_all() would be invisible to subsequent sessions.
    """
    from sqlalchemy.pool import StaticPool

    test_engine = create_engine(
        _IN_MEMORY_DB,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    def _override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app = create_app()
    app.dependency_overrides[get_db] = _override_get_db

    with TestClient(app, raise_server_exceptions=False) as tc:
        yield tc

    Base.metadata.drop_all(bind=test_engine)


def _submit_enquiry(client: TestClient, *, channel: str = "whatsapp", message: str = "I need pricing info") -> dict:
    """Helper to reduce boilerplate in tests that need an existing enquiry."""
    response = client.post(
        "/enquiry",
        json={"customer_name": "Sarah Mitchell", "channel": channel, "message": message},
    )
    assert response.status_code == 202, response.text
    return response.json()


# ─── POST /enquiry ────────────────────────────────────────────────────────────

class TestSubmitEnquiry:
    def test_returns_202_with_expected_shape(self, client: TestClient):
        body = _submit_enquiry(client)
        assert "enquiry_id" in body
        assert body["status"] == "open"
        assert "Processing in background" in body["message"]

    def test_all_channels_accepted(self, client: TestClient):
        for channel in ("whatsapp", "email", "call"):
            body = _submit_enquiry(client, channel=channel)
            assert body["status"] == "open", f"Failed for channel: {channel}"

    def test_invalid_channel_returns_422(self, client: TestClient):
        response = client.post(
            "/enquiry",
            json={"customer_name": "Test", "channel": "fax", "message": "Hello"},
        )
        assert response.status_code == 422
        assert response.json()["error"] == "validation_error"

    def test_empty_message_returns_422(self, client: TestClient):
        response = client.post(
            "/enquiry",
            json={"customer_name": "Test", "channel": "email", "message": ""},
        )
        assert response.status_code == 422

    def test_missing_fields_returns_422(self, client: TestClient):
        response = client.post("/enquiry", json={"customer_name": "Test"})
        assert response.status_code == 422


# ─── POST /enquiry/{id}/followup ──────────────────────────────────────────────

class TestCreateFollowup:
    def test_creates_followup_successfully(self, client: TestClient):
        enquiry = _submit_enquiry(client)
        response = client.post(
            f"/enquiry/{enquiry['enquiry_id']}/followup",
            json={"delay_minutes": 30, "message_template": "Hi, checking in!"},
        )
        assert response.status_code == 201
        body = response.json()
        assert body["enquiry_id"] == enquiry["enquiry_id"]
        assert body["delay_minutes"] == 30
        assert body["status"] == "pending"
        assert "scheduled_at" in body

    def test_default_template_used_when_omitted(self, client: TestClient):
        enquiry = _submit_enquiry(client)
        response = client.post(
            f"/enquiry/{enquiry['enquiry_id']}/followup",
            json={"delay_minutes": 60},
        )
        assert response.status_code == 201
        assert response.json()["message_template"] is not None

    def test_nonexistent_enquiry_returns_404(self, client: TestClient):
        response = client.post(
            "/enquiry/does-not-exist/followup",
            json={"delay_minutes": 10},
        )
        assert response.status_code == 404
        assert response.json()["error"] == "enquiry_not_found"

    def test_zero_delay_returns_422(self, client: TestClient):
        enquiry = _submit_enquiry(client)
        response = client.post(
            f"/enquiry/{enquiry['enquiry_id']}/followup",
            json={"delay_minutes": 0},
        )
        assert response.status_code == 422


# ─── POST /enquiry/{id}/escalate ─────────────────────────────────────────────

class TestEscalateEnquiry:
    def test_escalates_successfully(self, client: TestClient):
        enquiry = _submit_enquiry(client)
        response = client.post(
            f"/enquiry/{enquiry['enquiry_id']}/escalate",
            json={"reason": "Customer demanded immediate refund"},
        )
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "escalated"
        assert body["escalation_reason"] == "Customer demanded immediate refund"

    def test_double_escalation_returns_409(self, client: TestClient):
        enquiry = _submit_enquiry(client)
        eid = enquiry["enquiry_id"]
        client.post(f"/enquiry/{eid}/escalate", json={"reason": "First escalation"})
        response = client.post(f"/enquiry/{eid}/escalate", json={"reason": "Second escalation"})
        assert response.status_code == 409
        assert response.json()["error"] == "enquiry_already_escalated"

    def test_nonexistent_enquiry_returns_404(self, client: TestClient):
        response = client.post(
            "/enquiry/ghost-id/escalate",
            json={"reason": "Does not matter"},
        )
        assert response.status_code == 404

    def test_short_reason_returns_422(self, client: TestClient):
        enquiry = _submit_enquiry(client)
        response = client.post(
            f"/enquiry/{enquiry['enquiry_id']}/escalate",
            json={"reason": "ok"},  # less than min_length=5
        )
        assert response.status_code == 422


# ─── GET /enquiry/{id}/history ────────────────────────────────────────────────

class TestEnquiryHistory:
    def test_returns_enquiry_timeline_and_followups(self, client: TestClient):
        enquiry = _submit_enquiry(client)
        eid = enquiry["enquiry_id"]
        client.post(f"/enquiry/{eid}/followup", json={"delay_minutes": 15})
        response = client.get(f"/enquiry/{eid}/history")
        assert response.status_code == 200
        body = response.json()
        assert body["enquiry"]["id"] == eid
        assert isinstance(body["timeline"], list)
        assert len(body["timeline"]) >= 1
        assert isinstance(body["followups"], list)
        assert len(body["followups"]) == 1

    def test_timeline_has_enquiry_created_event(self, client: TestClient):
        enquiry = _submit_enquiry(client)
        response = client.get(f"/enquiry/{enquiry['enquiry_id']}/history")
        event_types = [e["event_type"] for e in response.json()["timeline"]]
        assert "enquiry_created" in event_types

    def test_nonexistent_enquiry_returns_404(self, client: TestClient):
        response = client.get("/enquiry/fake-uuid/history")
        assert response.status_code == 404
        assert response.json()["error"] == "enquiry_not_found"


# ─── GET /health ─────────────────────────────────────────────────────────────

class TestHealthCheck:
    def test_returns_ok_when_db_reachable(self, client: TestClient):
        response = client.get("/health")
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "ok"
        assert body["database"] == "connected"
        assert "timestamp" in body
