# Secure Supply Chain Template

A production-ready GitHub Actions CI/CD pipeline template for secure software delivery.

**What this template gives you:**
- 🔍 Automated dependency scanning (Software Composition Analysis)
- 📋 SBOM generation (Software Bill of Materials)
- ✍️ Artifact signing & verification (cosign)
- 🔒 SLSA compliance tracking (artifact provenance)
- 🚀 Secure, gated deployments
- 📊 Immutable audit trails

**For clients:** Fork this repo, connect your own source code, and get security gates in your CI/CD pipeline — no configuration needed.

---

## Quick Start (For Clients)

1. **Click "Use this template"** on GitHub
2. Connect your source repository (or add code to `src/`)
3. Push to `main` branch
4. GitHub Actions automatically:
   - Scans dependencies for vulnerabilities
   - Generates SBOM
   - Signs build artifacts
   - Creates deployment attestation
   - Blocks unsafe deployments

---

## Architecture Overview

Push to main
↓
[Dependency Scan] → OWASP Dependency-Check + Dependabot
↓
[Build & Sign] → Docker build + cosign signature
↓
[Generate SBOM] → cyclonedx-bom + SPDX
↓
[SLSA Verify] → in-toto attestation + provenance
↓
[Deploy (Gated)] → Only if all checks pass


---

## What Each Workflow Does

### `security-scan.yml`
- Runs Dependabot check for known vulnerabilities
- Generates dependency tree report
- Fails build if critical/high vulns found
- Exceptions: `.dependabot-allow.json` (documented rationale)

### `build-and-sign.yml`
- Builds Docker image deterministically
- Signs image with cosign (cryptographic verification)
- Pushes signed image to registry
- Creates artifact attestation

---

## For Security Teams

See [`docs/SECURITY.md`](docs/SECURITY.md) for:
- Threat model
- Security assumptions
- Configuration options
- Compliance mappings (NIST, CIS)

---

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Technical deep dive
- [`docs/FORK_GUIDE.md`](docs/FORK_GUIDE.md) — Step-by-step client fork guide

---

## Support & Feedback

Issues & PRs welcome. This is a learning template — it's meant to show best practices.

---

## Author & License

Built by **Anurag Achanta** (GitHub: [@Algorithmsglitch](https://github.com/Algorithmsglitch))

MIT License — Use, modify, fork freely.