---
title: "Download"
layout: "download"
description: "Download Bor for your Linux distribution"
---

## Verify your download

Every release since v0.10.0 publishes a `SHA256SUMS` file and a detached
signature `SHA256SUMS.asc` next to the packages. The signature is made with
the Bor release key, the same key that signs the agent package repositories
a Bor server serves at `/agent/`:

| | |
|---|---|
| **Key** | Bor Release Signing `<releases@getbor.dev>` |
| **Fingerprint** | `2BF2 F494 7388 D2CD F35D C9F5 BCC1 0DDB B54F 79FC` |
| **Public key** | [bor-release-key.asc](/bor-release-key.asc) |

```bash
curl -LO https://getbor.dev/bor-release-key.asc
gpg --import bor-release-key.asc
gpg --fingerprint releases@getbor.dev     # compare with the fingerprint above

# in the directory with the downloaded packages, SHA256SUMS and SHA256SUMS.asc
gpg --verify SHA256SUMS.asc SHA256SUMS
sha256sum --check --ignore-missing SHA256SUMS
```

`gpg --verify` must report a good signature from the key above, and
`sha256sum` must print `OK` for every package you downloaded.

## After downloading

### Server

The server package installs the `bor-server` binary, a default configuration, and a systemd unit. Start it with:

```bash
systemctl enable --now bor-server
```

Open `https://your-server:8443` in your browser. TLS certificates and the internal CA are auto-generated on first run and stored in `/var/lib/bor/pki/`. See [Installing the server](https://docs.getbor.dev/installation/server/) for the configuration options.

### Agent

The quickest way is the **Deploy agent** wizard in the server's web console (the download icon in the masthead, or the button on the **Nodes** page). Pick the distribution, the architecture and the node group, and run the generated script on the desktop: it trusts the server's CA, adds the server's signed package repository, installs the agent and enrolls it with a one-time token. Nothing on the desktop needs internet access.

To do it by hand with a downloaded package:

1. Install the package, then point the agent at your server in `/etc/bor/config.yaml`:

   ```yaml
   server:
     address: "your-server:8443"
   ```

2. Generate a one-time enrollment token in the web console under **Node Groups**, save it to a root-only file and enroll:

   ```bash
   sudo install -m 0600 /dev/null /etc/bor/enroll-token
   echo "<TOKEN>" | sudo tee /etc/bor/enroll-token >/dev/null
   sudo bor-agent --token-file /etc/bor/enroll-token
   ```

3. Start the agent service:

   ```bash
   sudo systemctl enable --now bor-agent
   ```

See [Installing the agent](https://docs.getbor.dev/installation/agent/) for the repository setup, Kerberos enrollment without tokens, and troubleshooting.
