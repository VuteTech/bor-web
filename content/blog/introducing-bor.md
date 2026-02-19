---
title: "Introducing Bor"
author: "Blagovest Petrov"
date: 2025-06-01
tags: ["announcement"]
---

Bor is an open-source policy management system for Linux desktops. It gives IT administrators a central web console to define configuration policies and push them to managed workstations in real time.

## Why Bor?

Managing desktop configuration at scale on Linux has traditionally meant choosing between heavyweight enterprise suites and ad-hoc scripting. Bor fills the gap with a focused, purpose-built tool:

- **Web-based policy management** — create, version, and organize policies from a browser. Assign them to groups of machines with a few clicks.
- **Real-time delivery** — policy changes reach agents the moment they happen. No polling intervals, no waiting for a configuration run to complete.
- **Zero-touch enrollment** — generate a one-time token, pass it to the agent on first run. The agent provisions its own certificates automatically.
- **Role-based access control** — fine-grained permissions let you delegate policy authoring and node management to different teams.

## How Bor differs from Foreman, Uyuni, and configuration management tools

Systems like Foreman and Uyuni are built around Infrastructure-as-Code engines — Ansible, Puppet, Salt, or Chef. These tools are powerful and flexible: you write code (playbooks, manifests, states) that can do virtually anything on a target machine. That flexibility comes with complexity. Someone has to write and maintain the code, review changes for safety, and reason about ordering, idempotency, and drift detection. For desktop fleets managed by IT teams rather than DevOps engineers, this is often more machinery than the problem requires.

Bor takes a different approach. Instead of arbitrary code execution, Bor works with **strictly defined, declarative policies**. A policy is a structured document — a set of key-value settings for a specific application or subsystem. There is no scripting language, no imperative logic, and no way for a policy to run arbitrary commands on an endpoint. This constraint is deliberate:

- **Simpler administration** — IT staff define what the configuration should look like, not how to get there. There is no code to write or debug.
- **Better for compliance** — every policy is a well-defined, auditable document. There are no hidden side effects, no conditional branches, and no risk of a misconfigured playbook breaking a machine. Auditors can review exactly what is enforced on every desktop.
- **Predictable enforcement** — the agent applies the declared state. If a user changes a setting locally, the next policy push restores it. There is no drift to detect because the desired state is always re-applied.

If you need to install packages, run scripts, or orchestrate multi-step workflows, a configuration management tool is the right choice. But if your goal is to manage desktop settings — browser policies, application defaults, security baselines — Bor gives you a simpler, safer path.

## Similarities to Windows Group Policy

If you have managed Windows desktops with Active Directory, Bor will feel familiar. The model is intentionally close to **Group Policy Objects (GPOs)**:

- **Policies** in Bor are analogous to GPOs — structured settings that define how desktops should be configured.
- **Node Groups** work like Organizational Units (OUs) — logical containers that determine which machines receive which policies.
- **Policy Bindings** link policies to node groups, just as GPOs are linked to OUs.
- **Central management console** — the Bor web UI serves the same role as the Group Policy Management Console (GPMC).
- **Agent enforcement** — the Bor agent on each desktop enforces the assigned policies, similar to how the Group Policy Client processes GPOs on Windows.

The goal is to bring this straightforward, policy-driven management model to Linux desktops — without requiring Active Directory or Windows infrastructure.

## Current Status

Bor is in **active development** and has not yet reached an official release. The core functionality is working:

- Policy management with draft/released lifecycle
- Real-time streaming delivery with delta sync and snapshot fallback
- Certificate-based agent authentication (mTLS)
- Firefox ESR policy enforcement
- Role-based access control with granular permissions
- Container-based server deployment

We are working toward a first stable release. If you are interested in trying Bor or contributing, check out the [Getting Started](/docs/getting-started/) guide and the [GitHub repository](https://github.com/VuteTech/bor).

## What's Next

The most significant upcoming feature is **Active Directory and FreeIPA integration**. Once connected to a directory service, Bor will authenticate agents using **Kerberos** instead of the current one-time enrollment token. Machines that are already joined to your AD domain or FreeIPA realm will appear automatically in Bor's node inventory — no manual enrollment step required. This brings Bor closer to the zero-configuration experience that Windows administrators expect from Group Policy.

Beyond directory integration, we plan to expand the range of policy types Bor can enforce:

- **dconf settings** — manage GNOME desktop configuration (wallpapers, screen lock, default applications, privacy settings)
- **KConfig / KDE Kiosk Framework** — enforce KDE Plasma desktop policies for locked-down kiosk and enterprise deployments
- **Polkit rules** — control privilege escalation by defining which users and groups can perform administrative actions
- **Chromium** — browser policies for Chrome-based browsers (Chrome, Chromium, Edge), alongside the existing Firefox support
- **Flatpak** — application lifecycle management and security restrictions for sandboxed desktop apps (permitted apps, repository sources, filesystem/network permissions)
- **Networking** — FirewallD zone and rule management, NetworkManager connection profiles and restrictions

We also plan to introduce a **user-session agent** — a non-privileged daemon that runs in the logged-in user's session and communicates with the root agent over D-Bus. The user agent will handle settings that belong to the user's desktop rather than the system — for example, configuring KDE Dolphin bookmarks or displaying notifications when a policy update has been applied. This split keeps the root agent focused on system-level enforcement while giving Bor a way to manage per-user configuration safely.

Other near-term priorities include persistent compliance reporting and a node status dashboard.

Follow the blog for updates as the project progresses.
