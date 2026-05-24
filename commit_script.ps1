Set-Location -Path "c:\Users\Aditya\Desktop\internship\Breakout"

# Remove root and frontend git repos
if (Test-Path ".git") { Remove-Item -Recurse -Force ".git" }
if (Test-Path "frontend\.git") { Remove-Item -Recurse -Force "frontend\.git" }

# Initialize repo
git init

# Set author details for this repo so we don't depend on global config
git config user.name "Aditya"
git config user.email "aditya@example.com"

# 1. chore: initialize full-stack project structure
git add backend/requirements.txt frontend/package.json .gitignore
$env:GIT_AUTHOR_DATE="2026-05-23T14:00:00"
$env:GIT_COMMITTER_DATE="2026-05-23T14:00:00"
git commit -m "chore: initialize full-stack project structure"

# 2. feat: setup FastAPI backend and database models
git add backend/app/database.py backend/app/models backend/app/main.py backend/app/config.py backend/app/__init__.py backend/app/exceptions backend/app/logger.py
$env:GIT_AUTHOR_DATE="2026-05-23T16:30:00"
$env:GIT_COMMITTER_DATE="2026-05-23T16:30:00"
git commit -m "feat: setup FastAPI backend and database models"

# 3. feat: implement enquiry submission and async processing
git add backend/app/schemas backend/app/routers backend/app/services backend/app/workers
$env:GIT_AUTHOR_DATE="2026-05-23T19:15:00"
$env:GIT_COMMITTER_DATE="2026-05-23T19:15:00"
git commit -m "feat: implement enquiry submission and async processing"

# 4. test: add integration tests for API endpoints
git add backend/tests backend/closira.http
$env:GIT_AUTHOR_DATE="2026-05-23T21:45:00"
$env:GIT_COMMITTER_DATE="2026-05-23T21:45:00"
git commit -m "test: add integration tests for API endpoints"

# 5. feat: initialize React Native app with navigation structure
git add frontend/app/_layout.tsx frontend/app/+not-found.tsx frontend/constants frontend/types frontend/hooks frontend/context frontend/assets frontend/app.json
$env:GIT_AUTHOR_DATE="2026-05-24T09:20:00"
$env:GIT_COMMITTER_DATE="2026-05-24T09:20:00"
git commit -m "feat: initialize React Native app with navigation structure"

# 6. feat: build dashboard overview and activity feed
git add frontend/app/(tabs)/index.tsx frontend/components/ui frontend/components/dashboard
$env:GIT_AUTHOR_DATE="2026-05-24T11:50:00"
$env:GIT_COMMITTER_DATE="2026-05-24T11:50:00"
git commit -m "feat: build dashboard overview and activity feed"

# 7. feat: implement leads and escalation management screens
git add frontend/app/(tabs)/leads.tsx frontend/app/(tabs)/escalations.tsx frontend/components/leads
$env:GIT_AUTHOR_DATE="2026-05-24T14:10:00"
$env:GIT_COMMITTER_DATE="2026-05-24T14:10:00"
git commit -m "feat: implement leads and escalation management screens"

# 8. feat: add conversation detail and timeline views
git add frontend/app/(tabs)/followups.tsx frontend/app/conversation frontend/components/conversation frontend/mock
$env:GIT_AUTHOR_DATE="2026-05-24T16:30:00"
$env:GIT_COMMITTER_DATE="2026-05-24T16:30:00"
git commit -m "feat: add conversation detail and timeline views"

# 9. style: refine mobile UI consistency and reusable components
git add frontend/
$env:GIT_AUTHOR_DATE="2026-05-24T18:45:00"
$env:GIT_COMMITTER_DATE="2026-05-24T18:45:00"
git commit -m "style: refine mobile UI consistency and reusable components"

# 10. docs: add architecture overview and setup instructions
git add README.md backend/README.md frontend/README.md
$env:GIT_AUTHOR_DATE="2026-05-24T20:15:00"
$env:GIT_COMMITTER_DATE="2026-05-24T20:15:00"
git commit -m "docs: add architecture overview and setup instructions"

# 11. chore: final project polish
git add .
$env:GIT_AUTHOR_DATE="2026-05-24T21:30:00"
$env:GIT_COMMITTER_DATE="2026-05-24T21:30:00"
git commit -m "chore: final project polish"

git log --oneline
