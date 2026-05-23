# 💬 Chatable

> A real-time chat application with direct messages and group conversations.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

**Live:** [snas.website](http://snas.website)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Local Deployment](#local-deployment)
- [Production Deployment](#production-deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Chatable is a full-stack real-time messaging platform that supports one-on-one direct messages and multi-user group chats. Built with a Node.js/Express backend, a vanilla JS/HTML/CSS frontend, PostgreSQL for persistent storage, and Redis as a Socket.io adapter for scaling WebSocket connections across multiple backend replicas.

---

## Features

- 💬 **Real-time messaging** — Instant message delivery via Socket.io WebSockets
- 📨 **Direct Messages** — Private one-on-one conversations created automatically when accepting a friend request
- 👥 **Group Chats** — Create and manage multi-user chat rooms
- 👫 **Friend system** — Send, accept, and decline friend requests with real-time badge notifications
- 🔐 **Authentication** — JWT-based sign-up and login
- 📦 **Persistent storage** — Message history stored in PostgreSQL
- ⚡ **Redis adapter** — Socket.io Redis adapter for multi-replica WebSocket scaling
- 🐳 **Containerized** — Docker + Kubernetes production deployment with CI/CD via GitHub Actions

---

## Architecture

```
                        ┌─────────────────────────────┐
                        │        Nginx Ingress         │
                        │       snas.website           │
                        └──────────────┬──────────────┘
                                       │
              ┌────────────────────────┼──────────────────────┐
              │ /                      │ /api                  │ /socket.io
              ▼                        ▼                       ▼
    ┌──────────────────┐    ┌──────────────────────────────────────┐
    │     Frontend     │    │          Backend (x3 replicas)       │
    │  Nginx + HTML/   │    │         Node.js + Express            │
    │   CSS / JS       │    │         Socket.io server             │
    └──────────────────┘    └───────────────┬──────────────────────┘
                                            │
                            ┌───────────────┼───────────────┐
                            ▼               ▼               ▼
                    ┌──────────────┐  ┌──────────┐  ┌────────────┐
                    │  PostgreSQL  │  │  Redis   │  │  Socket.io │
                    │  (messages,  │  │ (adapter)│  │   rooms    │
                    │  users, etc) │  └──────────┘  └────────────┘
                    └──────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Real-time | Socket.io |
| Database | PostgreSQL |
| Cache / PubSub | Redis (Socket.io adapter) |
| Containerization | Docker |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |
| Registry | GitHub Container Registry (GHCR) |

---

## Local Deployment

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) v20+

### Run with Docker Compose

```bash
git clone https://github.com/nadav111/Chatable.git
cd Chatable
```

Create a `.env` file in `backend/`:

```env
# Database
DB_HOST=db
DB_USER=chatable_user
DB_PASSWORD=chatable_password
DB_NAME=chatable

# JWT
JWT_SECRET=your_jwt_secret_here

# Redis
REDIS_URL=redis://redis:6379
```

Start all services:

```bash
docker compose up --build
```

Open `http://localhost` in your browser.

To stop:

```bash
docker compose down
```

---

## Production Deployment

### Prerequisites

- A running Kubernetes cluster
- `kubectl` configured to point at your cluster
- Helm installed
- A domain pointing to your cluster IP

### 1. Create secrets

```bash
kubectl create secret generic app-secrets \
  --from-literal=JWT_SECRET=your_jwt_secret \
  --from-literal=DB_URI=postgresql://chatable_user:chatable_password@db-service:5432/chatable

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=your_github_username \
  --docker-password=your_PAT
```

### 2. Apply manifests

```bash
kubectl apply -f deployment/db/
kubectl apply -f deployment/redis/
kubectl apply -f deployment/backend/
kubectl apply -f deployment/frontend/
```

### 3. Verify

```bash
kubectl get pods
kubectl get ingress
```

### CI/CD

Every push to `main` triggers the GitHub Actions pipeline which:
1. Builds and pushes Docker images to GHCR
2. SSHs into the server and applies updated manifests
3. Rolls out new images with zero downtime via `kubectl rollout`

---

## Project Structure

```
Chatable/
├── .github/
│   └── workflows/
│       └── pipeline.yml        # CI/CD pipeline
├── backend/
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── routes/                 # Express routes
│   ├── db/                     # PostgreSQL connection
│   ├── socket/                 # Socket.io setup + events
│   ├── middleware/             # Auth, error handling
│   ├── app.js
│   └── Dockerfile
├── frontend/
│   ├── css/                    # Stylesheets
│   ├── js/
│   │   ├── managers/           # ChatManager, FriendManager, UIManager
│   │   └── utils/              # State management
│   ├── lib/                    # API client, toast, socket
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── Dockerfile
├── deployment/
│   ├── backend/                # Backend K8s manifests
│   ├── frontend/               # Frontend + ingress manifests
│   ├── db/                     # PostgreSQL StatefulSet + PVC
│   └── redis/                  # Redis deployment
└── docker-compose.yml
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).
