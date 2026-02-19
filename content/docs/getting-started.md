---
title: "Getting Started"
weight: 10
---

This guide walks you through deploying the Bor server and enrolling your first agent.

## Prerequisites

- **Server**: Podman or Docker with compose support
- **Agent**: Go 1.21+ (for building from source)
- **Development**: Protocol Buffers compiler (`protoc`), Node.js 22+

## Deploy the Server

1. **Clone the repository**

   ```bash
   git clone https://github.com/VuteTech/bor.git
   cd bor
   ```

2. **Start with Podman Compose**

   ```bash
   podman-compose up -d
   ```

   This starts:
   - PostgreSQL database (port 5432)
   - Bor server (HTTPS on port 8443)
   - Auto-generated internal CA and TLS certificates

3. **Open the Web UI**

   Navigate to `https://localhost:8443` in your browser.

## Build and Enroll the Agent

1. **Build the agent binary**

   ```bash
   make agent
   ```

2. **Create a configuration file**

   ```bash
   mkdir -p /etc/bor
   cp config.yaml.example /etc/bor/config.yaml
   ```

   Edit `/etc/bor/config.yaml` and set the server address:

   ```yaml
   server:
     address: "your-server:8443"
   ```

3. **Generate an enrollment token**

   In the Web UI, go to the Node Groups page and generate a one-time enrollment token.

4. **Enroll the agent**

   ```bash
   ./bor-agent --token <ENROLLMENT_TOKEN>
   ```

   The agent generates a key pair, sends a CSR to the server, and receives a signed certificate. Credentials are stored in `/var/lib/bor/agent/`.

5. **Run the agent**

   After enrollment, start the agent normally:

   ```bash
   ./bor-agent
   ```

   Or install it as a systemd service — see the [Agent guide](/docs/agent/) for details.

## Next Steps

- [Create policies and bind them to node groups](/docs/server/)
- [Understand the architecture](/docs/architecture/)
- [Configure the agent](/docs/agent/)
