---
title: "Bor Enterprise"
layout: "enterprise"
description: "The community server plus single sign-on, delegated administration, compliance reports, a signed and documented supply chain, and support"
---

Bor Enterprise is the Bor server you already know, with the features that
mostly matter to large organizations and with support from the people who
build Bor. It is built from the same code and released in step with the
community edition: Bor Enterprise 0.10 is built on community v0.10.0, and
every Enterprise release states the community version it contains.

Nothing changes on the desktops. The agents, the policy types and the
console are the open source ones; Bor Enterprise replaces the server and
switches its features on with a license.

## What Bor Enterprise adds

### Single sign-on and provisioning

- **OpenID Connect and SAML 2.0** sign-in, with single logout and the
  identity provider's own MFA counted as the second factor.
- **Account linking by email** for existing users. Linking an administrator
  account needs a prior, expiring approval by another administrator, so a
  claim at the identity provider can never take over an admin account on
  its own.
- **SCIM 2.0 provisioning** of users and groups from the identity provider.
  Bor keeps deciding which roles a provisioned group carries.
- Entra ID group overage is handled; a user with hundreds of groups still
  signs in correctly.

### Delegated administration

- A role can be assigned for **a single node group**: a site, a department
  or a school manages only its own machines, policies, bindings and
  compliance results, and sees nothing else.
- Users, roles, settings, audit logs and disk encryption always need a
  global assignment, so delegation never widens into tenant-wide control.

### Compliance reports

- **Point-in-time snapshots** of the fleet: every node's posture, the
  policies in force, the agent's last result per setting with benchmark
  control labels, stale and unreachable markers, and a compliance score.
- **Framework mappings** to ISO/IEC 27001:2022 Annex A, NIS2 Article 21(2)
  and the CIS benchmarks for RHEL 9 and Ubuntu 24.04, with a Controls tab
  that shows the evidence behind each control.
- **Evidence that holds up.** A report never changes after it is generated.
  It is stored as a canonical bundle whose hash is written to the audit log
  and re-checked on every open.
- **Schedules and delivery** by signed webhook or email, comparison with
  an earlier report, sign-off by a second person, legal hold and accepted
  waivers with an expiry.
- **Documents for auditors**: signed PDF/A-2b with optional RFC 3161 time
  stamps, OCSF 1.3.0 findings for a SIEM, and CSV. The `bor-verify` tool
  lets an auditor check a report without access to a Bor server.

### A license that works offline

- A license is a small signed file with an end date per feature. The server
  verifies it against public keys built into the binary and never contacts
  anyone to do so: no phone-home, no license server, no telemetry.
- Install it in the console under **Settings, License**, or mount it as a
  file for Helm and GitOps deployments, where the file wins over anything
  installed through the UI.
- A renewal that fails verification keeps the previous license in force and
  shows a warning, so a typo never switches a fleet's features off.

## Supply chain and the Cyber Resilience Act

The EU Cyber Resilience Act makes manufacturers responsible for the security
of their products over their whole lifetime: vulnerability handling and
reporting (in force since September 2026), a software bill of materials,
security updates and documentation. Organizations under NIS2 pass the same
expectations on to their suppliers. Bor Enterprise delivers that material
with every release, so the evidence is ready when procurement or an auditor
asks for it:

- **Software bill of materials** for the server, the agent and the container
  image, in CycloneDX and SPDX, per release.
- **VEX statements and vulnerability scan reports** per release, so a CVE in
  a dependency comes with a verdict on whether Bor is affected, not just a
  scanner finding.
- **Signed artifacts end to end**: packages, package repositories, container
  images and release checksums, verifiable offline with published keys.
- **Reproducible builds**, so a package can be rebuilt from the tagged source
  and compared byte for byte.
- **Coordinated vulnerability disclosure**: reports to <bor@vute.tech> are
  acknowledged within 48 hours, fixes target 90 days, and disclosure is
  coordinated with the reporter. Security fixes always land in the community
  edition first, and an Enterprise release follows the same day.
- **Security advisories** for every fix, with early notice for Enterprise Plus
  customers, and a long-term-support branch that receives security backports.
- **Documentation pack** for procurement and audits: security whitepaper,
  data processing agreement (GDPR Article 28), sub-processor list, SBOM
  samples, accessibility statement (WCAG 2.2 AA) and the vulnerability
  handling policy.

## Offerings

Bor Enterprise is sold per managed device per year. A managed device is an
enrolled agent that checked in during the last 30 days, so retired machines
stop counting on their own. There is no per-user pricing.

### Bor Enterprise

On-premises. The enterprise features, the supply-chain material above and
business-hours support, on your own servers with your own CA and database,
including air-gapped sites.

### Bor Enterprise Plus

Everything in Bor Enterprise, plus the long-term-support branch with security
backports, FIPS 140-3 and PKCS#11 / HSM builds, an offline mirror kit for
air-gapped sites, 24/7 response for severity-1 incidents, early security
advisories and a named technical contact.

### Bor Cloud

A managed Bor instance per customer, not a shared multi-tenant service: your
own server, your own CA, your own database, operated by Vute Tech and hosted
only with EU-owned providers, in Germany or Finland at your choice. Everything
can be exported, so moving to on-premises later is always possible. Cloud
Sovereign adds dedicated hardware, customer-managed keys and the stricter
support level.

### Support levels

| | Bor Enterprise, Cloud Standard | Bor Enterprise Plus, Cloud Sovereign |
|---|---|---|
| Hours | Business hours, CET | 24/7 for severity 1 |
| Severity-1 response | 8 business hours | 1 hour |
| Severity-2 response | 2 business days | 4 hours |
| Channels | Email, portal | Email, portal, phone, named contact |
| Security advisories | At public release | 7 days early notice |
| Supported releases | Current release | 3 years per LTS release |

### Services

- **Pilot**: four weeks, up to 50 devices, success criteria agreed up front,
  credited against the first year.
- **Onboarding**: installation, PKI or HSM integration, LDAP, Active
  Directory or FreeIPA, and the first policy set.
- **Group Policy migration workshop**: map existing Windows GPOs to Bor
  policies.
- **Administrator training** with certification.
- **Sovereign operations**: Vute Tech operates your on-premises instance.

### Programmes and procurement

- Volume bands for larger fleets, and a shared-service license for regional
  IT centres that run Bor for many municipalities.
- Reduced rates for education, including a per-school flat rate, and for
  non-profits, with a grant programme for small organizations.
- Invoice-only purchasing, a fixed-price pilot that fits below direct-award
  thresholds, and contracts and documentation in English plus the customer's
  language where possible.

Ask for a quote with your device count and segment; list prices and the
discount programmes are confirmed in the offer.

## What stays open source

The community edition is free and open source, forever: no time limits, no
node limits, no registration, no license key. Features that are already in
it stay in it, and everything that matters to everyone, from policy types to
security fixes, is developed in the open. These are commitments, written down
in [the announcement of the license change](/blog/2026-10-16-bor-moves-to-agpl/#our-promises-to-the-community)
and in the Contributor License Agreement.

## Who it is for

- **Public sector and regulated organizations** that need audit-ready
  evidence of desktop compliance mapped to ISO 27001, NIS2 or CIS.
- **Organizations with an identity provider** that want sign-in and user
  provisioning to follow the directory, not a separate user list.
- **Distributed fleets**, from school districts to companies with many
  sites, where each location should manage its own machines and nothing
  more.
- **Small and medium businesses and their managed service providers**, who
  want the managed instance or a small on-premises pack without a
  procurement project.
