---
title: "Bor and Kiwi TCMS share a stand at FOSDEM 2027"
author: "Blagovest Petrov"
author_url: "https://vute.tech"
date: 2026-11-09T05:00:00+02:00
tags: ["event", "fosdem", "kiwi-tcms", "stand", "community"]
heropill: false
---

<p class="has-text-centered">
  <a href="https://kiwitcms.org/" title="Kiwi TCMS, the open source test management system">
    <img src="/images/events/kiwitcms.svg" alt="Kiwi TCMS" width="420" height="52">
  </a>
</p>

Bor is going to [FOSDEM 2027](https://fosdem.org/2027/) in Brussels, and we are not going alone: we will share a stand with our friends from [Kiwi TCMS](https://kiwitcms.org/). FOSDEM has published its [list of accepted stands](https://fosdem.org/2027/news/accepted-stands/), and "Bor & Kiwi TCMS" is on it, for **Sunday, 31 January 2027**.

## What FOSDEM is

FOSDEM is the largest gathering of free and open source software developers in Europe. Every year, on one weekend at the turn of January and February, thousands of people fill the Solbosch campus of the Université libre de Bruxelles for two days of talks, developer rooms and project stands. It is organized by volunteers, entry is free, and there is no registration: you simply walk in.

The stands are where projects meet their users face to face. You can see the software running, ask the people who write it anything you like, and leave with a sticker. For a young project like Bor, that is the best place there is to find out what people actually need.

## Kiwi TCMS

Kiwi TCMS is the leading open source test management system. It keeps test plans, test cases and test runs in one place, for manual and for automated testing: testers get a clear picture of what is still to be done, results from automated suites flow in through plugins for the popular test frameworks, and bugs go straight to the tracker a team already uses. Everything is also reachable through an API, so it fits into a pipeline as easily as into a tester's day.

What we like most is how the project is run. Kiwi TCMS has been open source for many years, it is developed in the open with a steady rhythm of releases, and the team behind it is a regular face at open source conferences around Europe. Like Bor, it is made in Europe, with roots in Bulgaria. It is the kind of project we are glad to stand next to.

## How Bor uses Kiwi TCMS

This is not only a shared table. We are moving the whole QA cycle of a Bor release into Kiwi TCMS.

A policy management system has to be tested on real desktops. A setting has to arrive on Fedora and on Debian, in KDE Plasma and in GNOME, hold when a user tries to change it, and go away cleanly when the policy is unbound. Some of that is automated, and a lot of it still means a person sitting in front of a machine and checking. With every new policy type the list gets longer, and a checklist in a text file no longer does the job.

The goal is one test plan per release: the cases for every policy type on every supported distribution, the manual runs and the automated results side by side, and a clear answer to "is this release ready?" before a tag is pushed. This is work in progress. The test cases are still being written and the release process is still being wired into it. We will write about the setup in detail once a full release has gone through it.

So the stand has a practical side as well: on one half you can see what Bor does on a Linux desktop, and on the other the tool we use to make sure it keeps doing it.

## Where to find us

The stand is on Sunday, 31 January 2027. FOSDEM has not assigned the locations yet, so the building and the exact spot will follow, together with the other details, here and on the [talks page](/talks/) as soon as they are announced.

If you are travelling for the whole week: right after FOSDEM, from 1 to 3 February, I will also give a [talk about Bor at CfgMgmtCamp](/blog/2026-11-02-bor-at-cfgmgmtcamp-2027/) in Ghent, half an hour from Brussels by train.

Come by, say hello, and bring your questions about managing Linux desktops, or about testing the software that does it.
