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

Open `https://your-server:8443` in your browser. TLS certificates and the internal CA are auto-generated on first run and stored in `/var/lib/bor/pki/`. See the [Server guide](https://docs.getbor.dev) for configuration options.

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

See the [Agent guide](https://docs.getbor.dev) for full configuration options.
