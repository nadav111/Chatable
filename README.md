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
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Environment Variables](#environment-variables)
- [Deployment](#deployment)
  - [Docker](#docker)
  - [Kubernetes](#kubernetes)
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

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose
- [PostgreSQL](https://www.postgresql.org/) (or use Docker)
- [Redis](https://redis.io/) (or use Docker)

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/nadav111/Chatable.git
cd Chatable
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies** (if applicable)

```bash
cd ../frontend
npm install
```

4. **Set up environment variables** (see below)

5. **Start the development servers**

```bash
# From the backend directory
npm run dev
```

Then open `http://localhost:3000` (or your configured port) in your browser.

### Environment Variables

Create a `.env` file in the `backend/` directory based on the following:

```env
# Server
PORT=3000
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatable
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Auth
JWT_SECRET=your_jwt_secret
```

---

## Deployment

### Docker

Build and run the full stack with Docker Compose:

```bash
docker compose up --build
```

This spins up the backend, frontend, PostgreSQL, and Redis services together.

### Kubernetes

Kubernetes manifests are located in the `deployment/` directory.

```bash
# Apply all manifests
kubectl apply -f deployment/

# Check running pods
kubectl get pods
```

Make sure to configure your secrets (DB credentials, JWT secret, etc.) as Kubernetes Secrets before applying.

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
