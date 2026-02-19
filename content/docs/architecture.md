---
title: "Architecture"
weight: 20
---

Bor is a two-component system: a central **server** and one or more **agents** deployed on Linux desktops.

```
┌─────────────────┐      gRPC/mTLS         ┌─────────────────┐
│   Go Agent      │◄──────────────────────►│   Go Server     │
│   (Daemon)      │   Streaming Policies   │   + Web UI      │
│                 │                        │   (PatternFly)  │
└─────────────────┘                        └────────┬────────┘
  • Enrollment                                      │
  • mTLS Auth                                       │ SQL
  • Policy Apply                                    ▼
  • Compliance                              ┌─────────────────┐
                                            │   PostgreSQL    │
                                            │    Database     │
                                            └─────────────────┘
```

## Server

The server exposes a single HTTPS port (`:8443`) that multiplexes two protocols:

- **REST API** — serves the PatternFly web UI and admin endpoints. Authenticated with JWT.
- **gRPC** — serves agent RPCs (enrollment, policy streaming, compliance reporting). Authenticated with mTLS.

Routing is by `Content-Type`: requests with `application/grpc*` go to the gRPC handler; everything else goes to REST.

### Server layers

| Layer | Package | Responsibility |
|-------|---------|---------------|
| REST handlers | `internal/api/` | HTTP routes, request validation, JSON responses |
| gRPC services | `internal/grpc/` | Policy streaming, enrollment, compliance |
| Business logic | `internal/services/` | PolicyService, EnrollmentService, NodeService, AuthService |
| Data access | `internal/database/` | PostgreSQL repositories, migrations |
| PKI | `internal/pki/` | Internal CA, certificate signing |
| RBAC | `internal/authz/` | Role-based access control |

### PolicyHub

The **PolicyHub** (`internal/grpc/policy_hub.go`) is an in-memory pub/sub component that bridges the REST layer and streaming agents:

- Maintains a ring buffer of the last 1000 policy events with a monotonic revision counter
- When an admin creates, updates, or deletes a policy (or changes a binding), the hub broadcasts to all connected agent streams
- Supports delta sync: if an agent reconnects and its last-known revision is still in the ring buffer, only the missed events are sent. Otherwise, a full snapshot is delivered.

## Agent

The agent is a Go daemon that runs on each managed desktop.

1. **Enrollment** — on first run, the agent presents a one-time token and a CSR. The server signs the CSR with its internal CA and returns the signed certificate plus the CA cert. The agent persists these to disk.
2. **Streaming** — the agent opens a `SubscribePolicyUpdates` server-streaming RPC. It receives an initial snapshot, then real-time delta events (CREATED, UPDATED, DELETED) as admins make changes.
3. **Enforcement** — received policies are merged and written atomically to the target location (e.g., Firefox's `policies.json`).
4. **Compliance** — after applying, the agent calls `ReportCompliance` to report success or failure back to the server.
5. **Reconnection** — if the stream drops, the agent reconnects with exponential backoff (capped at 60 seconds), sending its last-known revision to resume with minimal data transfer.

## Enrollment Flow

```
Admin generates token (Web UI, 5-min TTL)
       │
       ▼
Agent starts with --token flag
  → Generates RSA 2048 key pair
  → Creates CSR
  → Calls Enroll RPC (TLS only, no client cert yet)
       │
       ▼
Server validates token
  → Signs CSR with internal CA
  → Creates Node record in database
  → Returns signed cert + CA cert
       │
       ▼
Agent persists credentials to /var/lib/bor/agent/
  → agent.crt, agent.key, ca.crt
  → Switches to mTLS for all future RPCs
```

## Policy Delivery

```
Agent connects with mTLS
  → Calls SubscribePolicyUpdates(last_known_revision)
       │
       ▼
Server checks revision
  → If delta available: sends only missed events
  → If too old: sends full SNAPSHOT
       │
       ▼
Stream stays open
  → Admin changes policy or binding
  → PolicyHub broadcasts to connected agents
  → Agent receives update, applies policy, reports compliance
```

## Data Model

- **Policies** — have a lifecycle: DRAFT → RELEASED. Only released policies are delivered to agents.
- **Node Groups** — logical groupings of enrolled agents.
- **Policy Bindings** — many-to-many relationships between policies and node groups.
- **Nodes** — enrolled agents, each belonging to one node group.
- **Users / User Groups / Roles** — RBAC for the web UI.

## Security

- **mTLS** for all agent-server communication after enrollment
- **JWT** for web UI authentication, with optional LDAP integration
- **Internal PKI** auto-generates a CA and server certificate on first startup
- **RBAC** with granular permissions (resource:action) for the web UI
- **TLS 1.2+** for all connections
- **Private keys** protected with 0600 file permissions
