# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Chatable, please report it responsibly.

**Do not open a public GitHub issue.**

Instead, contact us directly at: nadav111@github.com

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes if you have them

We will respond within 48 hours and aim to release a fix within 7 days depending on severity.

---

## Secrets Management

Kubernetes secrets are **never committed to this repository**.

The following secrets must be created manually on the cluster before deploying:

**`backend-secret.yaml`:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secret
type: Opaque
stringData:
  JWT_SECRET: "your_jwt_secret_here"
```

**`db-secret.yaml`:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  DB_HOST: "db-service"
  DB_USER: "your_db_user"
  DB_PASSWORD: "your_db_password"
  DB_NAME: "chatable"
```

Apply manually:
```bash
kubectl apply -f backend-secret.yaml
kubectl apply -f db-secret.yaml
```

Delete the local files after applying — never push them to the repository.

Add them to `.gitignore`:
```
backend-secret.yaml
db-secret.yaml
*.secret.yaml
.env
```

---

## Security Practices

- All passwords are hashed with **bcrypt** before storage
- Authentication uses **JWT** with expiry — tokens are never stored server-side
- All API routes require a valid token except `/api/home/login` and `/api/home/register`
- Database credentials are injected via Kubernetes Secrets, never hardcoded
- Docker images are stored in a private GitHub Container Registry (GHCR)
- Redis is not exposed outside the cluster

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest (main) | ✅ |
| older branches | ❌ |

Only the latest version on `main` receives security updates.
