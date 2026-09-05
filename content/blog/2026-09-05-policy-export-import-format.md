---
title: "Policies as YAML: the export/import format coming in Bor v0.9.0"
author: "Blagovest Petrov"
author_url: "https://vute.tech"
date: 2026-09-05T00:00:00+03:00
tags: ["release", "export", "import", "gitops", "yaml"]
---

Policy **export and import** will be published in the upcoming Bor v0.9.0 release. Any policy - or any set of policies, with their bindings - can be downloaded as a YAML bundle, kept in git, reviewed in a pull request, and imported into another Bor instance. The feature is already merged on `master`, and you can try it today on the [demo instance](/demo/).

This post is about the file format itself: what it looks like, why it is shaped the way it is, what was rejected along the way, and what happens at the import boundary.

## What a bundle looks like

Here is a Firefox policy and one binding, exactly as Bor exports them:

```yaml
apiVersion: bor.dev/v1
kind: Policy
metadata:
  name: firefox-corporate-baseline
  displayName: Firefox - Corporate Baseline
  description: Telemetry off, locked intranet homepage, DoH enforced.
spec:
  type: Firefox
  content:
    DNSOverHTTPS:
      Enabled: true
      Locked: true
      ProviderURL: https://doh.example.com/dns-query
    DisablePocket: true
    DisableTelemetry: true
    Homepage:
      Locked: true
      StartPage: homepage
      URL: https://intranet.example.com
---
apiVersion: bor.dev/v1
kind: PolicyBinding
metadata:
  name: firefox-corporate-baseline-engineering-workstations
spec:
  policy: firefox-corporate-baseline
  group: Engineering Workstations
  priority: 10
```

If you have ever written a Kubernetes manifest, an Ansible play, or a Fleet GitOps file, nothing here needs explaining. That is the point.

A bundle is a multi-document YAML stream, one resource per document, separated by `---`. There are two kinds of resource:

- **`Policy`** - `spec.type` names one of Bor's policy types (`Firefox`, `Thunderbird`, `Chrome`, `Edge`, `Kconfig`, `Dconf`, `Polkit`, `Package`, `Firewalld`, `SessionAccess`, `Flatpak`), and `spec.content` is the policy document itself.
- **`PolicyBinding`** - attaches a policy to a node group with a priority. `spec.policy` refers to the `metadata.name` of a `Policy` in the same file (or to the display name of a policy already on the target server), and `spec.group` refers to a node group **by name, never by UUID**.

`metadata.name` is a DNS-1123-style slug generated from the policy name on export. It only has to be unique within the file; it is what bindings point at. `metadata.displayName` carries the real policy name and wins on import, so an exported slug like `firefox-corporate-baseline` never leaks into the target's policy list as a name.

Just as important is what is **not** in the file. Exports carry no UUIDs, no timestamps, no `created_by`, and no lifecycle state. None of these mean anything on another instance, and leaving the user field out keeps personal data out of files that get committed to repositories and shared between organisations. Secrets never leave either: policy content in Bor does not contain credentials or private keys today, and the format does not change that.

JSON works too. A JSON object is valid YAML, so a `.json` document imports through the same path, and `?format=json` on the export endpoint returns the documents as a JSON array for tooling such as `jq`.

## Why this shape

Before picking a format we wrote down what export/import actually has to do for Bor, in priority order:

1. **Instance-to-instance transfer** - author on staging, import to production.
2. **GitOps** - keep the policy set in a repository, review changes as pull requests, apply from CI.
3. **Backup and recovery** - dump and restore the full policy set.
4. **Sharing baselines** - publish a hardening baseline that others can import.
5. **Compliance evidence** - a policy snapshot you can hand to an auditor.

Those turn into a short list of hard requirements. The format must round-trip losslessly through Bor's protobuf schemas, which are the single source of truth for every policy type. It must be readable and diffable by people, and allow comments for annotated baselines. It must be strictly validated at the import boundary. It needs a version so it can evolve. It must express bundles of many resources in one file. And it must not drag in heavyweight dependencies.

That list rules out most of the alternatives quickly.

**OPA / Rego** came up first because "policy" is in the name, and it was rejected first. Open Policy Agent is a *decision engine*: you write logic in Rego and it answers allow/deny questions. Bor policies are not logic. They are declarative desired state - "Firefox homepage is X, locked" - and the agent enforces state rather than answering queries. Importing an executable language at the import boundary would expand the attack surface for no benefit, and there is no reliable way to regenerate the structured editors in the web UI from arbitrary Rego. Where OPA might fit Bor later is as a *complement*: a Conftest gate in CI that says "no imported policy may disable the firewall", run against exactly these YAML files.

**Protobuf text format** (prototext) is tempting because Bor's schemas are protos, so export would be nearly free. But nobody's editor highlights it, there is no `yq`-class tooling for it, comments are legal but lost on every round-trip, and the Go implementation explicitly warns that its output is not stable across library versions. That last one is fatal for git diffs. Binary protobuf is worse on every human-facing axis and only makes sense as a signing payload.

**Plain JSON** was the serious runner-up. It needs zero new code paths, it is exactly what the API already stores, and it is diffable once you canonicalise it. Its two real weaknesses are no comments and no native multi-document streams. **TOML** turns nested repeated structures like polkit rules into `[[table.array]]` noise. **HCL** and **CUE** each add a second schema layer that would duplicate validation protobuf already provides, for an audience that mostly does not write them.

Which leaves **YAML with a Kubernetes-style envelope**. YAML 1.2 is a superset of JSON, so the mapping from Bor's stored protojson document to `spec.content` is mechanical and one-to-one. Comments survive in hand-written files. Multi-document streams give bundles for free. And, decisively, it is the format the target audience already writes every day.

## One schema, two syntaxes

The envelope is not a hand-rolled struct. It is a protobuf message in a new package, `bor.export.v1`, defined in [`proto/export/export.proto`](https://github.com/VuteTech/bor/blob/master/proto/export/export.proto):

```proto
message Resource {
  string api_version = 1;        // must be "bor.dev/v1"
  string kind = 2;               // "Policy" or "PolicyBinding"
  ResourceMetadata metadata = 3;
  PolicySpec policy = 4;         // set when kind == "Policy"
  BindingSpec binding = 5;       // set when kind == "PolicyBinding"
}

message PolicySpec {
  string type = 1;
  google.protobuf.Struct content = 2;   // the policy document, verbatim
}

message BindingSpec {
  string policy = 1;   // in-file slug, or display name on the server
  string group = 2;    // node group name
  int32 priority = 3;
}
```

`spec.content` is a `google.protobuf.Struct`, which holds the per-type document without the envelope needing to know anything about Firefox or firewalld. On import, the YAML is converted to JSON, the envelope is decoded with `protojson`, and the content is decoded into the concrete message for its type - `FirefoxPolicy`, `PolkitPolicy`, and so on - and then run through the **same per-type validators the REST API uses** when you save a policy in the web UI. There is no second schema to keep in sync, and a future policy type gets export/import by adding one line to a `switch`.

YAML and JSON are therefore just two syntaxes for one protobuf schema. `make proto` keeps the server and the format definition in step, and `bor.dev/v1` leaves room for a `v2` without breaking old files.

## Canonical output

Export is deterministic on purpose. A policy exported twice yields byte-identical files, and two policies that differ in one setting differ in one line. That is what makes `git diff` and pull-request review useful, and it took a few deliberate steps:

- **Content is round-tripped through its proto message** before serialisation. This normalises field-name casing to what the web UI editors store (the Polkit and dconf editors use `snake_case`; every other type uses the protojson defaults), and drops any unknown fields.
- **Keys are emitted in a fixed order** - the envelope keys always come out as `apiVersion`, `kind`, `metadata`, `spec`, and content keys are sorted. `protojson` deliberately randomises its whitespace to stop consumers depending on byte layout, so output is re-indented with two spaces.
- **YAML is block style with ambiguous scalars quoted**, so a description that happens to be `no` or `1.10` stays a string on the way back in.

Canonicalisation also runs on import, which quietly closes a bug class we had already met: a polkit document with camelCase field names is perfectly valid protojson, but the editor expected snake_case and choked on it. Anything that comes through the import pipeline is stored in the same shape the UI would have produced.

One honest trade-off: comments you add to a hand-written bundle survive in git, but not through Bor. Export is generated from the database, so a re-export will not contain them.

## The import boundary is strict

Import is where an untrusted file becomes live configuration, so it is treated as a security boundary rather than a convenience. Every rule below is enforced server-side, before anything is written:

- The request body is capped at **1 MiB**, a bundle at **200 documents**, and nesting at **64 levels**.
- YAML **anchors and aliases are rejected** outright. This closes the "billion laughs" expansion attack and also removes the one YAML feature with no JSON equivalent.
- Every document must be a mapping with string keys; YAML-specific types are not consumed.
- **Unknown envelope fields are errors**, as are unknown `kind` and `apiVersion` values. (Stored policy content is parsed leniently inside the server; the file boundary is not.)
- An unknown `spec.type` is an error - a policy this build cannot round-trip through its schema could not be edited or enforced either.
- Content is validated by the per-type validators, and bindings must resolve to an existing node group and a policy that is either in the file or on the server.

Validation is **all-or-nothing**: the whole bundle is checked first, and if any document fails, nothing is written. The response is a structured report with one row per document, so a failing import tells you which document, which resource, and why.

Three more rules shape how imports behave:

- **Imported policies always arrive as drafts.** Releasing to the fleet stays a deliberate human action on the target instance, and the server never has to trust lifecycle state from a file.
- **Name conflicts are explicit.** `on_conflict=error` (the default) rejects the bundle if a policy with the same name exists; `skip` leaves the existing policy alone and still lets bindings in the file attach to it; `new-version` updates an existing *draft* in place, and refuses unless the existing policy is still a draft.
- **Dry run is first-class.** `dry_run=true` returns the same report as a real import without touching the database. The web UI always runs one before letting you confirm.

Export requires the `policy:view` permission and import requires `policy:create`, so the two can be delegated separately in Bor's per-action RBAC model. Both are written to the audit log as `policy.export` and `policy.import` events, so they flow into CEF/OCSF syslog forwarding like any other policy change.

## In the web UI

On the Policies page, **Import…** opens a file picker. The bundle is dry-run immediately and the preview modal shows what would happen - created, updated, skipped, or error - with the conflict mode selectable right there. Changing the mode re-runs the dry run, so the preview always matches what the confirm button will do.

![Import preview - a three-policy bundle validated against a running instance, with one existing policy set to be skipped](/images/screenshots/policy-import-preview.png)

Each row's kebab menu gains **Export policy**, and selecting rows in the list reveals **Export selected**. Exports from the UI include bindings.

## From the command line

Everything the UI does is two endpoints, which is what makes the GitOps loop possible from CI:

```bash
# Log in once; the session and CSRF cookies land in the jar
curl -s -c jar -o /dev/null https://bor.example.com/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"…"}'
CSRF=$(awk '$6 == "bor_csrf" { print $7 }' jar)

# Export every policy, bindings included
curl -s -b jar \
  'https://bor.example.com/api/v1/policies/export?include_bindings=true' \
  -o policies.yaml

# Preview an import (nothing is written)
curl -s -b jar -H "X-CSRF-Token: $CSRF" -H 'Content-Type: application/yaml' \
  --data-binary @policies.yaml \
  'https://bor.example.com/api/v1/policies/import?dry_run=true'

# Apply it, skipping policies whose names already exist
curl -s -b jar -H "X-CSRF-Token: $CSRF" -H 'Content-Type: application/yaml' \
  --data-binary @policies.yaml \
  'https://bor.example.com/api/v1/policies/import?on_conflict=skip'
```

State-changing calls carry the double-submit CSRF token alongside the session cookie, the same way the web UI does. Point the import calls at the target instance's jar to move policies between servers.

Select specific policies with `?ids=a,b,c`. A single-policy export is named after its slug (`corporate-firefox-baseline.yaml`); a bundle is `bor-policies.yaml`.

One practical note for cross-instance transfers: bindings reference node groups by name, and a binding whose group does not exist on the target fails validation. Either create the groups first or export without `include_bindings`.

## What comes next

The format was designed with a few follow-ups in mind that are not part of the upcoming v0.9.0 release:

- **Signed bundles** - a detached signature over the canonical JSON bytes (ES256, in line with the FIPS 140-3 and BSI TR-02102 targets), with an optional server setting that refuses unsigned imports. This is the piece that turns an exported snapshot into tamper-evident compliance evidence.
- **Git sync** - connecting a server to a repository, either mirroring selected policies out on every change or tracking a branch and importing from it. The bundle format is already the on-disk representation this would use.
- **Node group export** and a small CLI for Fleet-style `generate-gitops` dumps.

None of these need the format to change. That was the other reason to get the envelope right first.

## Try it

Export/import is merged on `master` and running on the [demo instance](/demo/) today. It will be published in the upcoming v0.9.0 release, with distribution packages on the [Download](/download/) page. The implementation lives in [`server/internal/export`](https://github.com/VuteTech/bor/tree/master/server/internal/export), and its round-trip tests double as format documentation.
