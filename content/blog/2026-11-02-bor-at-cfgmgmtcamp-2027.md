---
title: "Bor at CfgMgmtCamp 2027 in Ghent"
author: "Blagovest Petrov"
author_url: "https://vute.tech"
date: 2026-11-02T05:00:00+02:00
tags: ["event", "cfgmgmtcamp", "talk", "community"]
heropill: false
---

<p class="has-text-centered">
  <a href="https://cfgmgmtcamp.org/ghent2027/" title="CfgMgmtCamp 2027, Ghent">
    <img src="/images/events/cfgmgmtcamp.png" alt="Config Management Camp" width="355" height="129">
  </a>
</p>

From 1 to 3 February 2027, Bor goes to [CfgMgmtCamp](https://cfgmgmtcamp.org/ghent2027/) in Ghent, Belgium, and I will give a talk there: **Bor: Centralized Policy Management for Linux Desktops**.

CfgMgmtCamp is the conference of the infrastructure automation community. It started around configuration management and has grown to cover provisioning, orchestration and everything else that keeps infrastructure in a known state. It takes place at HoGent's Campus Schoonmeersen, a short walk from Gent-Sint-Pieters station, in the days right after FOSDEM, so a lot of people make the two a single trip.

## The talk

The people in that room manage servers with Ansible, Puppet, Salt and their successors, and many of them have been asked the same question I was asked: fine, and what about the desktops?

Server tooling assumes a machine that is always on, always reachable and rebuilt rather than repaired. A laptop is none of those things. It sleeps, it travels, it belongs to a person who changes settings, and the policy on it has to survive all of that. The talk is about what a policy system for desktops has to do differently, and how Bor does it:

- A server that holds the policies and agents that keep a persistent stream open, so a change reaches a desktop the moment it is released, and a desktop that was offline picks up exactly what it missed when it comes back.
- Policy types that speak the desktop's own language: browser policies, KDE and GNOME settings, Flatpak, polkit, firewalld, systemd units, SELinux and AppArmor, software updates, disk encryption, and when a session may be used at all.
- Enforcement that holds: files the agent writes are watched and restored, a setting a user changed is corrected within seconds, and every node reports per setting whether it matches the released policy.
- Policies as YAML bundles you can review, version and import on another server, so the workflow fits a team that already keeps its infrastructure in git.
- What it took to make the trust model boring: an internal CA, mTLS for every agent, one-time enrollment tokens or Kerberos, and an audit log that records who changed what.

There will be a live demo. The talk is in English. The exact day and time will appear on the [talks page](/talks/) and here as soon as the schedule is published.

## Come and talk

If you look after Linux desktops anywhere, or you are weighing a migration and the management question is what holds it back, come and find me. I want to hear what your fleet looks like, which tools you already run next to it, and what Bor would have to do for you to use it. Those conversations have shaped most of what shipped this year.

Until then: the [v0.10.0 release](/blog/2026-11-02-bor-v0100-release/) is out, the [demo instance](/demo/) is open, and the [community channels](/community/) are the place for questions.
