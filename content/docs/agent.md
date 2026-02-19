---
title: "Agent"
weight: 40
---

The Bor agent is a Go daemon that runs on each managed Linux desktop. It enrolls with the server, maintains a persistent gRPC stream, and enforces policies locally.

> **Note:** Bor is in active development and has not yet reached an official release. The agent configuration format may change.

## Building

```bash
make agent
# or
cd agent && go build -o bor-agent ./cmd/agent
```

## Configuration

Create the configuration directory and file:

```bash
mkdir -p /etc/bor
cp config.yaml.example /etc/bor/config.yaml
```

The main setting is the server address:

```yaml
server:
  address: "your-server:8443"
```

The default config path is `/etc/bor/config.yaml`. See `config.yaml.example` for all available options.

## Enrollment

Enrollment is a one-time bootstrap process that gives the agent its mTLS credentials.

1. In the Bor web UI, navigate to **Node Groups** and generate an enrollment token. Tokens are single-use and expire after 5 minutes.

2. Run the agent with the token:

   ```bash
   ./bor-agent --token <ENROLLMENT_TOKEN>
   ```

3. The agent will:
   - Generate an RSA 2048 key pair
   - Send a Certificate Signing Request (CSR) to the server
   - Receive a signed client certificate and the CA certificate
   - Persist credentials to `/var/lib/bor/agent/`:
     - `agent.crt` — signed client certificate
     - `agent.key` — private key
     - `ca.crt` — CA certificate for verifying the server

After enrollment, the agent uses mTLS for all communication. No token is needed for subsequent runs.

## Running

After enrollment, start the agent:

```bash
./bor-agent
```

### systemd service

To run the agent as a system service, install the binary and create a unit file:

```bash
cp bor-agent /usr/local/bin/

cat > /etc/systemd/system/bor-agent.service << 'EOF'
[Unit]
Description=Bor Policy Agent
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/bor-agent
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now bor-agent
```

## Policy Enforcement

The agent currently supports **Firefox ESR** policy enforcement.

When a policy update arrives via the gRPC stream, the agent:

1. Validates the policy content
2. Merges multiple policies targeting the same application
3. Writes the result atomically to the target location (e.g., `/usr/lib64/firefox/distribution/policies.json`)
4. Reports compliance status back to the server

## Reconnection

If the connection to the server drops, the agent reconnects automatically with exponential backoff, capped at 60 seconds. On reconnect, it sends its last-known revision so the server can send only the changes that were missed.
