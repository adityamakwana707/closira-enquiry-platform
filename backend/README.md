# Closira Backend Service

A full-stack prototype of Closira's customer enquiry pipeline. This service exposes a REST API with async background processing to ingest omnichannel enquiries, match them against Standard Operating Procedures (SOPs), and schedule automated follow-ups.

## Setup & Run

### Prerequisites
Python 3.11 or above.
Check with: 
```bash
python --version
```

### Installation

1. Clone and enter the backend directory:
   ```bash
   git clone <repo-url>
   cd closira/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate      # macOS / Linux
   venv\Scripts\activate         # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy environment config:
   ```bash
   cp .env.example .env
   ```
   *(No changes needed for local development — SQLite runs file-based.)*

5. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

6. Verify it is running:
   ```bash
   curl http://localhost:8000/health
   ```
   Expected: 
   ```json
   { "status": "ok", "database": "connected", "timestamp": "..." }
   ```

### Interactive Docs
FastAPI's auto-generated docs are the fastest way to explore the API:
- `http://localhost:8000/docs` ← Swagger UI
- `http://localhost:8000/redoc` ← ReDoc

Every endpoint has a description and example payload inline. No Postman required — `/docs` is the full API explorer.

## API Reference

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| POST   | `/enquiry`                    | Submit a new inbound enquiry         |
| POST   | `/enquiry/{id}/followup`      | Schedule a follow-up                 |
| POST   | `/enquiry/{id}/escalate`      | Manually escalate to human agent     |
| GET    | `/enquiry/{id}/history`       | Full conversation history + timeline |
| GET    | `/health`                     | API + database health check          |

### POST /enquiry
Ingests a new customer enquiry from any channel and begins asynchronous processing.

Request Body:
```json
{
  "customer_name": "Priya Sharma",
  "channel": "whatsapp",
  "message": "What are your pricing plans?"
}
```

Response — `202 Accepted`:
```json
{
  "enquiry_id": "b3f1a2d4-...",
  "status": "open",
  "message": "Enquiry received. Processing in background."
}
```
The response is immediate — the background task that matches this message to an SOP runs asynchronously and does not block the caller.

Error Conditions:
| Status | Condition                    |
|--------|------------------------------|
| 422    | Invalid channel value        |
| 422    | Missing required fields      |

### POST /enquiry/{id}/followup
Request Body:
```json
{
  "delay_minutes": 30,
  "message_template": "Hi {customer_name}, just checking in…"
}
```
Response — `201 Created`:
```json
{
  "id": "f8a7e2b1-...",
  "enquiry_id": "b3f1a2d4-...",
  "delay_minutes": 30,
  "message_template": "Hi {customer_name}, just checking in…",
  "scheduled_at": "2025-05-23T09:44:00Z",
  "status": "pending"
}
```

Error Conditions:
| Status | Condition                    |
|--------|------------------------------|
| 404    | Enquiry ID not found         |
| 409    | Enquiry already resolved     |

### POST /enquiry/{id}/escalate
Request Body:
```json
{
  "reason": "Customer requesting immediate callback from senior staff"
}
```

Response — `200 OK`:
```json
{
  "enquiry_id": "b3f1a2d4-...",
  "status": "escalated",
  "message": "Enquiry escalated successfully."
}
```

Error Conditions:
| Status | Condition                    |
|--------|------------------------------|
| 409    | Conflict: Enquiry already escalated |

### GET /enquiry/{id}/history
Returns the full state of the enquiry, its event timeline, and pending follow-ups.

Response:
```json
{
  "enquiry": {
    "id": "b3f1a2d4-...",
    "customer_name": "Priya Sharma",
    "channel": "whatsapp",
    "message": "What are your pricing plans?",
    "status": "resolved",
    "matched_sop": "Pricing Question",
    "created_at": "2025-05-23T09:14:00Z"
  },
  "timeline": [
    {
      "event_type": "enquiry_created",
      "description": "Enquiry received via whatsapp",
      "created_at": "2025-05-23T09:14:00Z"
    }
  ],
  "followups": [
    {
      "id": "f8a7e2b1-...",
      "scheduled_at": "2025-05-23T09:44:00Z",
      "status": "pending"
    }
  ]
}
```

### GET /health
Health check endpoint for load balancers and monitoring tools.

Response — Healthy:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-05-23T09:14:00Z"
}
```

Response — Degraded:
```json
{
  "status": "degraded",
  "database": "unreachable",
  "timestamp": "2025-05-23T09:14:00Z"
}
```
Returns 200 in both cases — the caller decides how to handle degraded state. 503 would be appropriate in production, but for a prototype the distinction is surfaced in the response body rather than the status code.

## Database Schema

### Why SQLite
For a prototype that runs on a single machine with no concurrent write contention, SQLite is the right choice. It requires zero infrastructure — no Docker, no connection pooling, no credentials — which means a reviewer can clone this repo and be running in under two minutes.

The schema is designed with PostgreSQL migration in mind: every column type, constraint, and relationship maps directly to Postgres without changes. Switching requires one line in `.env`: `DATABASE_URL=postgresql://…`

### Schema Overview

```text
┌─────────────────────────────────────────────────────────────┐
│  enquiries                                                  │
├──────────────────┬──────────────┬───────────────────────────┤
│  id              │ TEXT (PK)    │ UUID, server-generated    │
│  customer_name   │ TEXT         │ NOT NULL                  │
│  channel         │ TEXT         │ whatsapp | email | call   │
│  message         │ TEXT         │ Original inbound text     │
│  status          │ TEXT         │ open|processing|resolved  │
│                  │              │ |escalated                │
│  matched_sop     │ TEXT         │ Set by background worker  │
│  suggested_resp  │ TEXT         │ Set by background worker  │
│  escalation_rsn  │ TEXT         │ Manual or auto-escalation │
│  created_at      │ DATETIME     │ Server timestamp          │
│  updated_at      │ DATETIME     │ Updated on every change   │
└──────────────────┴──────────────┴───────────────────────────┘
           │ 1
           │
           │ *
┌─────────────────────────────────────────────────────────────┐
│  enquiry_events                                             │
├──────────────────┬──────────────┬───────────────────────────┤
│  id              │ INTEGER (PK) │ Autoincrement             │
│  enquiry_id      │ TEXT (FK)    │ → enquiries.id            │
│  event_type      │ TEXT         │ See event types below     │
│  description     │ TEXT         │ Human-readable log entry  │
│  metadata        │ TEXT         │ JSON string, nullable     │
│  created_at      │ DATETIME     │                           │
└──────────────────┴──────────────┴───────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  followups                                                  │
├──────────────────┬──────────────┬───────────────────────────┤
│  id              │ TEXT (PK)    │ UUID                      │
│  enquiry_id      │ TEXT (FK)    │ → enquiries.id            │
│  delay_minutes   │ INTEGER      │ NOT NULL                  │
│  message_template│ TEXT         │ Nullable, has default     │
│  scheduled_at    │ DATETIME     │ created_at + delay        │
│  status          │ TEXT         │ pending | sent | cancelled│
│  created_at      │ DATETIME     │                           │
└──────────────────┴──────────────┴───────────────────────────┘
```

## How the SOP Engine Works

SOPs (Standard Operating Procedures) are the core of how Closira responds to enquiries. Instead of generating a response from scratch every time, the system matches an inbound message to a predefined playbook — giving businesses predictability and control over what their AI says.

### The 5 SOPs
| SOP                    | Trigger Keywords                              |
|------------------------|-----------------------------------------------|
| Booking Enquiry        | book, appointment, schedule, slot, availability|
| Pricing Question       | price, pricing, cost, how much, quote, fee    |
| Complaint              | complaint, unhappy, refund, issue, upset      |
| After-Hours Message    | after hours, closed, weekend, when do you open|
| General Info Request   | information, tell me more, services, explain  |

### Matching Logic
The engine lowercases the inbound message and checks for the presence of any trigger keyword using simple string contains. The first SOP whose keywords appear in the message wins — order matters and is intentional (complaints are checked before general info).

If no SOP matches, the enquiry is automatically escalated and flagged for human review. This is a deliberate product decision: it is safer to route an unrecognised message to a human than to respond with something generic and wrong.

### Why Not AI Matching
Keyword matching is faster, cheaper, deterministic, and auditable. For an SMB platform where business owners define their own SOPs, predictability matters more than sophistication. An owner needs to be able to say 'when someone mentions pricing, this is what we reply' — not debug why a language model misclassified a message.

In production, this engine would sit behind an interface where business owners manage their own SOPs with custom keywords and response templates.

## Async Processing Decision

When a new enquiry arrives, the API returns immediately with a job ID and fires a background task to match the message against SOPs. This design ensures the caller never waits on processing — critical when the inbound channel is WhatsApp and the customer expects an instant acknowledgement.

### FastAPI BackgroundTasks vs Celery

| Concern              | BackgroundTasks          | Celery                    |
|----------------------|--------------------------|---------------------------|
| Infrastructure       | Zero — same process      | Redis or RabbitMQ broker  |
| Setup complexity     | None                     | Medium                    |
| Task persistence     | None — lost on crash     | Persisted in broker       |
| Horizontal scaling   | Not supported            | Fully supported           |
| Retry on failure     | Manual                   | Built-in                  |
| Monitoring           | Logs only                | Flower dashboard          |
| Right for prototype  | ✓ Yes                    | Overkill                  |
| Right for production | Depends on load          | Yes, above ~100 req/min   |

I chose BackgroundTasks over Celery because this prototype does not need a distributed task queue — the overhead of running a broker (Redis/RabbitMQ) would outweigh the benefit at this scale. For this prototype, BackgroundTasks is the correct choice. There is no broker to run, no worker process to manage, and no network call between the API and the task runner. An evaluator can clone this repo and run one command — no Docker Compose, no Redis, no environment gymnastics.

The switch to Celery is intentionally designed to be surgical. The worker function in `enquiry_worker.py` has no FastAPI-specific imports — it takes a plain `enquiry_id` and a database session. Replacing BackgroundTasks with a Celery task is a 10-line change to the router. The business logic does not move.

## Structured Logging

Every key event in the enquiry lifecycle emits a structured JSON log entry. This makes logs machine-parseable from day one — ready for ingestion into Datadog, Loki, or CloudWatch without a parser change.

`enquiry_created`:
```json
{"timestamp": "2025-05-23T09:14:00Z", "level": "INFO", "event": "enquiry_created", "enquiry_id": "b3f1a2d4-...", "channel": "whatsapp", "customer": "Priya Sharma"}
```

`sop_matched`:
```json
{"timestamp": "2025-05-23T09:14:01Z", "level": "INFO", "event": "sop_matched", "enquiry_id": "b3f1a2d4-...", "sop": "Pricing Question"}
```

`auto_escalated`:
```json
{"timestamp": "2025-05-23T09:14:01Z", "level": "WARNING", "event": "auto_escalated", "enquiry_id": "b3f1a2d4-...", "reason": "No SOP matched for inbound message"}
```

Log level is configurable via `LOG_LEVEL` in `.env`. In production, set to WARNING to reduce noise while retaining all actionable signals.

## Testing the API

The `closira.http` file at the root of `/backend` is a REST Client file (VS Code extension: `humao.rest-client`) that covers all five endpoints in logical order.

To test a complete enquiry lifecycle:
1. `POST /enquiry` — creates the enquiry, fires background task
2. Wait 1–2 seconds for background processing
3. `GET /enquiry/{id}/history` — confirm SOP was matched
4. `POST /enquiry/{id}/followup` — schedule a follow-up
5. `GET /enquiry/{id}/history` — confirm followup appears in timeline
6. `POST /enquiry/{id}/escalate` — manually escalate
7. `GET /enquiry/{id}/history` — confirm final state

Alternatively, to create an enquiry via curl:
```bash
curl -X POST http://localhost:8000/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Priya Sharma",
    "channel": "whatsapp",
    "message": "What are your pricing plans for small businesses?"
  }'
```

---
*For the complete full-stack context including the mobile dashboard frontend, see the [Root README](../README.md).*
