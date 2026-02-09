# ceylon3D — Monorepo

This repository contains both the frontend and backend for the project.

Structure
- frontend/ — Vite + React app
- itp-ecommerce/ — Spring Boot backend
- scripts/ — helper scripts (build, embed, start)

Quick commands
- Start frontend dev: cd frontend && npm install && npm run dev
- Start backend: cd itp-ecommerce && mvn spring-boot:run
- Start both in background: ./scripts/start-dev.sh
- Build and embed frontend into backend static: ./scripts/build-all.sh

Notes
- `frontend/dist` is copied to `itp-ecommerce/src/main/resources/static` when you run `./scripts/build-all.sh` or `./scripts/embed-frontend.sh`.
