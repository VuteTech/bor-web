---
title: "Server"
weight: 30
---

The Bor server is a Go binary that serves both the web UI and gRPC agent API on a single HTTPS port.

> **Note:** Bor is in active development and has not yet reached an official release. Configuration and APIs may change.

## Deployment

### Container-based (recommended)

The provided `podman-compose.yml` starts the server and PostgreSQL:

```bash
podman-compose up -d
```

This creates:
- A PostgreSQL container (port 5432)
- The Bor server container (HTTPS on port 8443)
- Named volumes for database persistence and PKI data

The container image is built on UBI 10 (Red Hat Universal Base Image), runs as a non-root user (UID 1001), and supports a read-only filesystem.

### Building from source

```bash
# Build the server binary
cd server
go build -o bor-server ./cmd/server

# Build the frontend
cd web/frontend
npm install
npm run build
```

Or use `make server` and `make frontend` from the project root.

## Configuration

All settings are controlled via environment variables. Copy `.env.example` to `.env` and adjust:

### Database

| Variable | Default | Description |
|----------|---------|-------------|
| `REGULA_DB_HOST` | `localhost` | PostgreSQL host |
| `REGULA_DB_PORT` | `5432` | PostgreSQL port |
| `REGULA_DB_USER` | `regula` | Database user |
| `REGULA_DB_PASSWORD` | — | Database password |
| `REGULA_DB_NAME` | `regula` | Database name |

### Server

| Variable | Default | Description |
|----------|---------|-------------|
| `REGULA_ADDR` | `:8443` | Listen address (host:port) |
| `JWT_SECRET` | — | Secret for JWT token signing |
| `REGULA_ADMIN_PASSWORD` | — | Initial admin password |

### PKI (optional)

If these are not set, the server auto-generates an internal CA and server certificate on first startup.

| Variable | Description |
|----------|-------------|
| `REGULA_CA_CERT_FILE` | Path to CA certificate |
| `REGULA_CA_KEY_FILE` | Path to CA private key |
| `REGULA_TLS_CERT_FILE` | Path to server TLS certificate |
| `REGULA_TLS_KEY_FILE` | Path to server TLS private key |

Auto-generated PKI files are stored in `/var/lib/bor/pki/`.

### LDAP (optional)

| Variable | Description |
|----------|-------------|
| `LDAP_ENABLED` | Set to `true` to enable LDAP authentication |

## Database Migrations

Migrations are embedded in the server binary and run automatically on startup. You can also run them manually:

```bash
make migrate-up    # Apply pending migrations
make migrate-down  # Roll back the last migration
```

## Development

For local development, start only the database:

```bash
podman-compose up -d postgres
```

Then run the server with hot reload:

```bash
cd server
go run cmd/server/main.go
```

For frontend development with watch mode:

```bash
cd server/web/frontend
npm run dev
```
