# Architecture: Secure Supply Chain Pipeline

This document explains the security model and technical architecture.

---

## Overview: End-to-End Secure Delivery
Source Code → Scan → Build → Sign → Verify → Deploy
[SCA] [Docker][Cosign][SLSA] [Gated]

---

## Threat Model

### Attacks We Defend Against

| Threat | Attack Vector | Defense |
|--------|---------------|---------|
| **Dependency Poisoning** | Malicious package in npm | Dependency scanning, SBOM |
| **Build Artifact Tampering** | Attacker modifies Docker image | Cryptographic signing (cosign) |
| **Unauthorized Deployment** | Attacker pushes unreviewed code | Branch protection, workflow guards |
| **Supply Chain Breach** | Compromised CI/CD runner | OIDC token (time-bound), audit logs |
| **Provenance Fraud** | Attacker claims they built artifact | SLSA attestation, immutable logs |
| **Runtime Exploit** | Vulnerable base image or app code | Trivy scan, vulnerability database |

---

## Component Architecture

### 1. Security Scan Workflow

**Purpose:** Detect vulnerable dependencies before production.

**Tools:**
- `npm audit` — Node.js built-in vulnerability scanner
- `OWASP Dependency-Check` — Industry standard SCA
- `license-report` — License compliance

**Output:**
- `audit-report.json` — Vulnerability report
- `sbom.cyclonedx.json` — Software Bill of Materials

---

### 2. Build & Sign Workflow

**Purpose:** Reproducibly build artifacts and cryptographically sign them.

**Process:**

Docker build (deterministic)
↓
Push image to ghcr.io
↓
Sign image with cosign (keyless OIDC)
↓
Scan image for vulnerabilities (Trivy)
↓
Create deployment attestation


**Keyless Signing (OIDC):**
- No private keys stored
- Signature bound to: GitHub repository + workflow + commit
- Verifiable by public key

---

## SLSA Compliance

This pipeline implements **SLSA Level 3** controls:

| Control | Implementation |
|---------|-----------------|
| **Build as code** | GitHub Actions workflows in repo |
| **Build isolation** | GitHub-hosted runners (isolated VMs) |
| **Artifact signing** | cosign (cryptographic signatures) |
| **Provenance** | SLSA provenance attestation |
| **Audit trail** | GitHub Actions logs (immutable) |

---

## Security Assumptions

This pipeline assumes:

1. ✅ **GitHub account is secure** — 2FA enabled
2. ✅ **Repository is locked** — Only maintainers can push
3. ✅ **GitHub Actions runners are ephemeral** — Fresh VM per workflow
4. ❌ **Source code is not compromised** — Out of scope
5. ❌ **Production infrastructure is secure** — Out of scope

---

## References

- [SLSA Framework](https://slsa.dev)
- [Sigstore](https://www.sigstore.dev)
- [CycloneDX SBOM](https://cyclonedx.org)

---

Built by **Anurag Achanta** — MIT License