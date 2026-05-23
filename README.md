# 💬 Chatable

> A real-time chat application with direct messages and group conversations.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Local Deployment](#local-deployment)
  - [Prerequisites](#prerequisites)
  - [Run with Docker Compose](#run-with-docker-compose)
  - [Environment Variables](#environment-variables)
- [Production Deployment (Kubernetes)](#production-deployment-kubernetes)
  - [Prerequisites](#prerequisites-1)
  - [Configure Secrets & ConfigMaps](#configure-secrets--configmaps)
  - [Apply Manifests](#apply-manifests)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Chatable is a full-stack real-time messaging platform that supports one-on-one direct messages and multi-user group chats. Built with a Node.js/Express backend, a vanilla JS/HTML/CSS frontend, and backed by PostgreSQL for persistent storage and Redis for fast session and pub/sub handling.

---

## Features

- 💬 **Real-time messaging** — Instant message delivery via WebSockets
- 📨 **Direct Messages (DM)** — Private one-on-one conversations
- 👥 **Group Chats** — Create and manage multi-user chat rooms
- 🔐 **Authentication** — Secure user sign-up and login
- 📦 **Persistent storage** — Message history stored in PostgreSQL
- ⚡ **Redis caching** — Fast session management and pub/sub for scalability
- 🐳 **Containerized** — Docker + Kubernetes ready for production deployments

---

## Architecture

```
┌─────────────┐        ┌──────────────────┐        ┌─────────────┐
│   Frontend  │◄──────►│  Express Backend  │◄──────►│  PostgreSQL │
│  (HTML/CSS/ │  HTTP/ │  (Node.js)        │        │     DB      │
│    JS)      │   WS   │                  │◄──────►│    Redis    │
└─────────────┘        └──────────────────┘        └─────────────┘
```

The frontend communicates with the backend over HTTP (REST) and WebSockets for real-time events. The backend persists messages and user data in PostgreSQL, and uses Redis for session storage and pub/sub messaging between server instances.

---

## Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | HTML, CSS, JavaScript            |
| Backend    | Node.js, Express.js              |
| Database   | PostgreSQL                       |
| Cache/PubSub | Redis                          |
| Containerization | Docker, Kubernetes         |
| CI/CD      | GitHub Actions                   |

---

## Local Deployment

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose

### Run with Docker Compose

1. **Clone the repository**

```bash
git clone https://github.com/nadav111/Chatable.git
cd Chatable
```

2. **Set up environment variables** (see below)

3. **Start all services**

```bash
docker compose up --build
```

This starts the backend, frontend, PostgreSQL, and Redis containers together. Open `http://localhost:3000` in your browser.

To stop:

```bash
docker compose down
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=postgres

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## Production Deployment (Kubernetes)

### Prerequisites

- A running Kubernetes cluster (e.g. EKS, GKE, AKS, or self-hosted)
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/) configured to point at your cluster
- Docker images built and pushed to a container registry

### Configure Secrets & ConfigMaps

Before applying the manifests, fill in your production values in the files under `deployment/`.

**`backend-secret.yaml`** — JWT secret for the backend:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secret
type: Opaque
stringData:
  JWT_SECRET: "your_jwt_secret_here"
```

**`db-configmap.yaml`** — PostgreSQL user config:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: db-config
data:
  DB_USER: "chatable"
  DB_PASSWORD: "your_db_password"
```

**`db-secret.yaml`** — PostgreSQL admin password:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  POSTGRES_PASSWORD: "your_postgres_password"
```

> ⚠️ Never commit real secrets to source control. Use a secrets manager (e.g. AWS Secrets Manager, Vault) or sealed secrets in production.

### Apply Manifests

```bash
# Apply secrets and config first
kubectl apply -f deployment/db-secret.yaml
kubectl apply -f deployment/db-configmap.yaml
kubectl apply -f deployment/backend-secret.yaml

# Apply the rest of the manifests
kubectl apply -f deployment/

# Verify everything is running
kubectl get pods
kubectl get services
```

---

## Project Structure

```
Chatable/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── backend/
│   ├── src/                # Express app, routes, controllers
│   └── package.json
├── frontend/
│   ├── src/                # HTML, CSS, JavaScript
│   └── ...
├── deployment/             # Kubernetes manifests
└── docker-compose.yml
```

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please make sure your code follows the existing style and that any new features are reasonably tested.

---

## License

This project is licensed under the [MIT License](LICENSE).
