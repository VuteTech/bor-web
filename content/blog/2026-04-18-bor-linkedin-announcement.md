---
title: "Announcing Bor: Open Source Linux Desktop Policy Management"
author: "Blagovest Petrov"
author_url: "https://vute.tech"
date: 2026-04-18
tags: ["announcement"]
---

*This is the original announcement published on [LinkedIn](https://www.linkedin.com/posts/blpetrov_linux-opensource-enterprisesecurity-activity-7449596723062095872-pmut?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAbrx7sByW-Flfp57OGyT78-U6K_I_g6644) on April 14, 2026.*

---

I'm happy to announce Bor! — an open source Linux desktop policy manager I've been quietly building for the past several months. Today it's finally available for download 🎉

If you've ever managed a fleet of Linux desktops in an enterprise or government environment, you know the pain: no native equivalent of Group Policy, no central way to enforce browser settings, restrict system access, or prove to an auditor that your configuration is consistent across hundreds of machines.

Bor is my answer to that.

It works like this: a central server lets you author policies through a web console, organise desktops into groups, and publish changes in real time. A lightweight agent on each machine receives updates instantly over a secure gRPC stream and enforces them — no polling, no scripts, no manual SSH.

**What's in the first release:**

→ Policy types: Firefox, Chrome, KDE/KConfig, GNOME/dconf, Polkit  
→ Zero-touch enrollment for domain-joined machines via Kerberos; token-based enrollment for everything else  
→ mTLS between server and agents, auto-generated internal CA  
→ LDAP/AD integration with group-to-role mapping  
→ WebAuthn/Passkey and TOTP MFA for the web console  
→ Full audit log — every change, every login, every enforcement event  
→ RBAC, Prometheus metrics, tamper detection  
→ Native packages for Debian, RHEL, Alpine, and Arch Linux — amd64, aarch64, and ppc64le  

Bor is licensed under the LGPL. It's built in the EU, and I intend to keep it that way — designed from the ground up with GDPR, NIS2, and FIPS 140-3 compliance requirements in mind. I believe European enterprises and public sector organisations deserve a sovereign, auditable alternative to proprietary policy management stacks.

This is still a side project, but I'm serious about building an open source community around it. If you work in IT security, Linux infrastructure, or open source — and this resonates with you — I'd love to hear from you.
