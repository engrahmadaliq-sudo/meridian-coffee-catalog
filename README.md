# Meridian Coffee Catalog

A full-stack demo project: a single-origin coffee product catalog with a
**React** frontend and a **Flask** REST API backend, containerized with
**Docker**, deployed via a **Jenkins** pipeline.

```
meridian-coffee-catalog/
├── backend/              Flask API (SQLite, seeded with sample products)
│   ├── app.py
│   ├── models.py
│   ├── seed.py
│   ├── tests/test_api.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/             React (Vite) single-page app
│   ├── src/
│   ├── package.json
│   ├── Dockerfile         (multi-stage: build with Node, serve with nginx)
│   └── nginx.conf
├── docker-compose.yml    Wires both containers together
├── Jenkinsfile           CI/CD pipeline definition
└── JENKINS_SETUP.md      Step-by-step Jenkins installation & pipeline setup
```

## Run it the fast way (no Jenkins yet)

This is the quickest way to see the app working before wiring up Jenkins.

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api/products

Stop everything with `docker compose down` (add `-v` to also wipe the seeded
database volume).

## Run it without Docker at all (plain local dev)

**Backend:**
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py          # runs on http://localhost:5000
```

**Frontend** (separate terminal):
```bash
cd frontend
npm install
npm run dev             # runs on http://localhost:5173, proxies /api to :5000
```

## API reference

| Method | Endpoint                | Description                                  |
|--------|--------------------------|-----------------------------------------------|
| GET    | `/api/health`            | Health check                                  |
| GET    | `/api/meta`               | Distinct origins/processes/roast levels for filters |
| GET    | `/api/products`           | List products. Query params: `origin`, `process`, `roast`, `search` |
| GET    | `/api/products/<id>`      | Single product                                |
| POST   | `/api/orders`             | Place an order: `{ customer_name, items: [{product_id, qty}] }` |

## Setting up the Jenkins pipeline

See **[JENKINS_SETUP.md](./JENKINS_SETUP.md)** for the full walkthrough —
installing Jenkins in Docker, the plugins you need, and creating the pipeline
job that runs this project's `Jenkinsfile` automatically (test → build →
deploy → smoke test).

## What the pipeline does

1. **Checkout** — pulls the project from your Git repo
2. **Backend: Install & Test** — installs Python deps, runs `pytest`
3. **Frontend: Install & Build** — installs npm deps, runs the production build
4. **Docker: Build Images** — builds both container images via `docker compose build`
5. **Deploy** — `docker compose down` + `docker compose up -d`
6. **Smoke Test** — curls both the API and the frontend to confirm they're up
