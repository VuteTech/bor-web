---
title: "Download"
layout: "download"
description: "Download Bor for your Linux distribution"
---

## After downloading

### Server

The server package installs the `bor-server` binary, a default configuration, and a systemd unit. Start it with:

```bash
systemctl enable --now bor-server
```

Open `https://your-server:8443` in your browser. TLS certificates and the internal CA are auto-generated on first run and stored in `/var/lib/bor/pki/`. See the [Server guide](/docs/server/) for configuration options.

### Agent

1. Create `/etc/bor/config.yaml`:

   ```yaml
   server:
     address: "your-server:8443"
   ```

2. Generate a one-time enrollment token in the web UI under **Node Groups**.

3. Enroll the agent:

   ```bash
   bor-agent --token <TOKEN>
   ```

4. Start the agent service:

   ```bash
   systemctl enable --now bor-agent
   ```

See the [Agent guide](/docs/agent/) for full configuration options.
