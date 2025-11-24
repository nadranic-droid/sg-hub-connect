# GitHub Actions Setup Guide

## Overview
This repository now includes comprehensive GitHub Actions workflows and repository templates. Due to GitHub's security restrictions, workflow files need to be pushed manually with proper authentication.

## Files Created

### GitHub Actions Workflows
1. **`.github/workflows/ci.yml`** - Continuous Integration
   - Runs on push/PR to main/develop branches
   - Lints code with ESLint
   - Type checks with TypeScript
   - Builds the project
   - Uploads build artifacts

2. **`.github/workflows/deploy.yml`** - Deployment
   - Deploys to production on main branch pushes
   - Supports Vercel and Netlify deployments
   - Requires secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`

3. **`.github/workflows/codeql.yml`** - CodeQL Security Analysis
   - Runs security analysis on JavaScript/TypeScript
   - Scheduled weekly and on push/PR

4. **`.github/workflows/security.yml`** - Security Scanning
   - Runs npm audit for dependency vulnerabilities
   - Dependency review on pull requests
   - Scheduled weekly

### Repository Configuration
5. **`.github/dependabot.yml`** - Automated Dependency Updates
   - Weekly updates for npm packages
   - Weekly updates for GitHub Actions

6. **`.github/ISSUE_TEMPLATE/bug_report.md`** - Bug Report Template
7. **`.github/ISSUE_TEMPLATE/feature_request.md`** - Feature Request Template
8. **`.github/PULL_REQUEST_TEMPLATE.md`** - Pull Request Template
9. **`.github/FUNDING.yml`** - Funding Configuration

### Documentation
10. **`CONTRIBUTING.md`** - Contribution Guidelines

## Manual Push Instructions

Due to GitHub's OAuth scope restrictions, you need to push workflow files manually:

### Option 1: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh
# Then authenticate: gh auth login

# Push the workflow files
cd sg-hub-connect
git add .github/ CONTRIBUTING.md .gitignore
git commit -m "Add GitHub Actions workflows and repository templates"
git push origin main
```

### Option 2: Using Personal Access Token
1. Create a Personal Access Token (PAT) with `workflow` scope:
   - Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Generate new token with `workflow` scope
   - Copy the token

2. Push using the token:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/nadranic-droid/sg-hub-connect.git
git push origin main
```

### Option 3: Push via GitHub Web Interface
1. Go to your repository on GitHub
2. Click "Add file" > "Create new file"
3. Create each workflow file manually by copying the content
4. Or use GitHub Desktop with proper authentication

## Required GitHub Secrets

For the workflows to function properly, add these secrets in GitHub:
- Repository Settings > Secrets and variables > Actions

### CI/CD Secrets
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon key
- `VITE_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET` - Cloudinary upload preset
- `VITE_MAPBOX_TOKEN` - Mapbox access token (optional)
- `VITE_SITE_URL` - Your production site URL

### Deployment Secrets (if using)
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `NETLIFY_AUTH_TOKEN` - Netlify authentication token
- `NETLIFY_SITE_ID` - Netlify site ID

## Workflow Features

### CI Pipeline
- ✅ Automatic linting on every push/PR
- ✅ TypeScript type checking
- ✅ Build verification
- ✅ Artifact storage

### Security
- ✅ CodeQL analysis for vulnerabilities
- ✅ npm audit for dependency issues
- ✅ Dependency review on PRs
- ✅ Automated security scanning

### Automation
- ✅ Dependabot for dependency updates
- ✅ Automated deployments
- ✅ Issue and PR templates

## Next Steps

1. Push the workflow files using one of the methods above
2. Add required secrets to GitHub repository settings
3. Test the CI pipeline by creating a test PR
4. Configure deployment secrets if using automated deployment
5. Enable Dependabot alerts in repository settings

## Troubleshooting

### Workflow Not Running
- Ensure workflow files are in `.github/workflows/` directory
- Check that files have `.yml` or `.yaml` extension
- Verify GitHub Actions are enabled in repository settings

### Authentication Issues
- Use Personal Access Token with `workflow` scope
- Or use GitHub CLI with proper authentication
- Ensure you have write access to the repository

### Build Failures
- Check that all required secrets are set
- Verify environment variables in workflow files
- Review build logs in Actions tab

## Support

For issues or questions about the workflows, please open an issue in the repository.

