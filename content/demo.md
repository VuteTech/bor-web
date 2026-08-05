---
title: "Demo"
description: "Try Bor in a live demo environment"
---

Try Bor without installing anything. A public demo instance of the Bor server is available at:

**[https://demo.getbor.dev](https://demo.getbor.dev)**

## Credentials

Log in to the web console with:

| | |
|---|---|
| **Username** | `demo` |
| **Password** | `demodemodemo` |

## What you can do

The demo gives you full access to the web console: browse nodes and node groups, create and release policies, explore compliance reports, and review the audit log.

> **Note:** The demo data is recreated every 6 hours. Anything you create — policies, node groups, enrolled nodes — will be wiped at the next reset.

## Enrolling your own agents

You can also connect real Bor agents from your own machines to the demo server:

1. [Install the agent](/download/) on a Linux desktop or VM.

2. Point it at the demo server in `/etc/bor/config.yaml`:

   ```yaml
   server:
     address: "demo.getbor.dev:443"
   ```

3. Generate a one-time enrollment token in the demo web UI under **Node Groups**, then enroll:

   ```bash
   bor-agent --token <TOKEN>
   ```

4. Start the agent service:

   ```bash
   systemctl enable --now bor-agent
   ```

Your node will appear in the demo console, and released policies will stream to it in real time. Keep in mind that enrolled nodes are removed at each 6-hour reset, so agents will need to be re-enrolled afterwards — use a test machine or VM, not a production desktop.
