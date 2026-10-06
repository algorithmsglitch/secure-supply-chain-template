# Fork Guide: Using Secure Supply Chain Template

This guide walks you through forking this template repository and setting up secure CI/CD for your own application.

---

## Step 1: Fork the Repository

1. Click **"Use this template"** button on GitHub (top of repo)
2. Name your new repository (e.g., `my-secure-app`)
3. Set to **Public** (so you can use GitHub Actions freely)
4. Click **"Create repository from template"**

---

## Step 2: Replace Demo App with Your Code

### Option A: Keep the Demo App
Skip to **Step 3** — the workflows already work.

### Option B: Add Your Own Application

1. Replace `src/index.js` with your application
2. Update `package.json` with your dependencies
3. Ensure your app listens on port 3000 (or update workflows)

```bash
npm install
npm start
```

---

## Step 3: Configure GitHub Container Registry

The workflows push signed images to GitHub Container Registry (ghcr.io). No setup needed — they use `GITHUB_TOKEN` automatically.

---

## Step 4: Enable GitHub Actions

1. Go to **repo → Actions**
2. Click **"I understand my workflows, go ahead and enable them"**
3. Push code to `main` branch

---

## Step 5: Verify Workflows Run

Push a commit to `main`:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Go to **Actions** tab → See workflows running:
- `Security Scan - Dependency Check`
- `Build & Sign Artifacts`

✅ When all pass, your pipeline is working!

---

## Step 6: View Security Reports

### Dependency Scan Results
- **Actions → Security Scan workflow → Artifacts**
- Download `audit-report.json` and `dependency-check-report.json`

### Built Image & Signatures
- **Actions → Build & Sign workflow → Artifacts**
- Download `attestation.json` and `sbom/sbom.cyclonedx.json`

---

## Troubleshooting

### Workflow Fails: "npm ci --frozen-lockfile"
```bash
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Regenerate lockfile"
git push
```

### Image Push Fails
- Check GitHub Container Registry authentication
- Repo should be public
- Token has `write:packages` scope

---

## Next Steps

1. Integrate with your CI/CD
2. Enable branch protection rules
3. Monitor dependencies for vulnerabilities

---

Built by **Anurag Achanta** — MIT License