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

The demo gives you full access to the web console: browse nodes and node groups, create and release policies, check the compliance results, and review the audit log.

> **Note:** The demo data is recreated every 6 hours. Anything you create — policies, node groups, enrolled nodes — will be wiped at the next reset.

## Enrolling your own agents

You can also connect real Bor agents from your own machines to the demo server. The quickest way is the **Deploy agent** wizard in the demo console (the download icon in the masthead, or the button on the **Nodes** page): pick your distribution, the architecture and a node group, and run the generated script on a test desktop or VM. It installs the agent from the demo server's package repository and enrolls it.

By hand, with a package from the [Download](/download/) page:

1. Point the agent at the demo server in `/etc/bor/config.yaml`:

   ```yaml
   server:
     address: "demo.getbor.dev:443"
   ```

2. Generate a one-time enrollment token in the demo console under **Node Groups**, save it to a root-only file and enroll:

   ```bash
   sudo install -m 0600 /dev/null /etc/bor/enroll-token
   echo "<TOKEN>" | sudo tee /etc/bor/enroll-token >/dev/null
   sudo bor-agent --token-file /etc/bor/enroll-token
   ```

3. Start the agent service:

   ```bash
   sudo systemctl enable --now bor-agent
   ```

Your node will appear in the demo console, and released policies will stream to it in real time. Keep in mind that enrolled nodes are removed at each 6-hour reset, so agents will need to be re-enrolled afterwards — use a test machine or VM, not a production desktop.
