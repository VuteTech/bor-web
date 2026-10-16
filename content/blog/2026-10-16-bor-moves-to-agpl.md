---
title: "Bor moves to the AGPL: what changes, and what never will"
author: "Blagovest Petrov"
author_url: "https://vute.tech"
date: 2026-10-16T00:00:00+03:00
tags: ["license", "community", "open source", "announcement"]
---

Starting with the upcoming **v0.10.0** release, Bor will be licensed under the **GNU Affero General Public License, version 3** (AGPL-3.0) instead of the LGPL. At the same time, we're introducing a **Contributor License Agreement** for contributions, and a commercial edition, **Bor Enterprise**, for organizations that need features like single sign-on.

License changes in open source projects often come with bad news, so let me start with the part that matters most:

**Bor stays free and open source. The community edition will always be free to download, use, study, modify and share, and it isn't going anywhere.**

The rest of this post explains what is changing, why we're doing it, and what it means for you.

## Why change anything?

Bor is built by a small team at [Vute Tech](https://vute.tech), a young company. Until now, the project has been funded out of our own pockets and a lot of evenings. That got Bor from an idea to a tool that manages Firefox, Chrome, KDE, GNOME, Flatpak, firewalls, disk encryption and more across whole fleets of Linux desktops.

To keep going, and to keep up the pace you've seen in the last releases, Bor needs a sustainable source of income. Donations and goodwill are wonderful, but they rarely pay for full-time engineers, security reviews and long-term maintenance. The model we've chosen is the one Grafana and Mattermost have used for years:

- The **community edition** is open source under the AGPL, for everyone.
- **Bor Enterprise** adds features that mostly matter to large organizations, and is sold under a commercial license. That revenue pays for the development of Bor, including the community edition.

## Why the AGPL?

The LGPL protected Bor's code when it was copied and redistributed, but not when it was **run as a service**. Anyone could take Bor, modify it, and offer it as a hosted product without ever sharing their changes, and the people who wrote the code would get nothing back, not even the improvements.

The AGPL closes that gap. It works like the GPL, with one addition: if you modify the Bor server and let other people use it over a network, you have to offer them the source code of your modified version. Improvements flow back to everyone, whether Bor is installed from a package or used as a service.

It also lets us offer Bor Enterprise without making Bor less free. Organizations that can't, or don't want to, work under the AGPL can buy a commercial license instead, and that funds the project.

## What it means for you

**You run Bor in your organization without modifying it.** Nothing changes. Install the packages, manage your desktops, and upgrade as usual. You don't need a license key, and you don't owe anyone anything.

**You modify Bor for your own use.** That's still fine. The AGPL asks you to offer the source of your modified server to the people who use it over the network. For an in-house deployment, those are your own administrators, so in practice this rarely means more than keeping your changes in a repository they can reach. We'd love to see your improvements upstream, though.

**You offer Bor as a hosted service to others.** You can, under the AGPL: offer your users the source code of the version you run, including your changes. If you'd rather keep your changes private, talk to us about a commercial license.

**You build a product on top of Bor.** If your product will be distributed or offered under the AGPL, go ahead. If it's proprietary, you need a commercial license. Write to <bor@vute.tech>.

**You already run an earlier release.** Versions up to and including v0.9.0 were released under the LGPL, and they stay under the LGPL. A license can't be taken back from code that has already been published.

## Our promises to the community

A license change asks for your trust, so here's what we commit to:

1. **The community edition stays free and open source, forever.** No time limits, no node limits, no registration and no license key.
2. **What's in the community edition stays in the community edition.** We won't move features that are already open source behind the commercial license.
3. **Security fixes always land in the community edition.** Nobody has to pay to stay safe.
4. **We develop in the open.** The community edition is developed publicly on [GitHub](https://github.com/VuteTech/Bor): issues, pull requests, roadmap discussions and releases.
5. **Your contributions stay open source.** This isn't just a promise in a blog post. It's written into the Contributor License Agreement itself: every contribution we include in Bor will also be available under an open source license.

## What's in Bor Enterprise

Bor Enterprise is the community server plus features that mostly matter to large organizations:

- **Single sign-on** with OpenID Connect and SAML 2.0
- **SCIM 2.0** provisioning of users and groups from your identity provider
- **Delegated administration**: roles scoped to node groups, so a team can manage only its own machines
- **Commercial support** from the people who build Bor

## The Contributor License Agreement

From now on, contributions to Bor need a signed [Contributor License Agreement](https://github.com/VuteTech/Bor/blob/master/CLA.md) (CLA). We know CLAs are sometimes controversial, so we've tried to keep ours fair:

- **You keep your copyright.** It's a license, not an assignment of ownership.
- **It's based on the Apache Individual CLA**, which many companies' legal teams have already reviewed and accepted.
- **It includes our commitment** that your contribution will stay available under an open source license.
- **Signing takes one comment.** On your first pull request, a bot posts a link to the agreement. Reply with the sentence it asks for, and you're done for all future contributions.

The CLA is what makes dual licensing possible: to offer Bor under both the AGPL and a commercial license, Vute Tech needs the right to license all of the code, including contributions, under both. The details are in the [contributing guide](https://docs.getbor.dev/development/contributing/#contributor-license-agreement).

## Questions?

If something about the change worries you, we want to hear it. Open a [discussion or issue on GitHub](https://github.com/VuteTech/Bor/issues), write to <bor@vute.tech>, or come and talk to us in person at our stand at [OpenFest 2026](/blog/2026-10-15-bor-at-openfest-2026/) on 7 and 8 November in Sofia.

Thank you to everyone who has tried Bor, filed issues, sent patches and told others about it. You're the reason we want to make this project last, and this change is how we plan to do it.
