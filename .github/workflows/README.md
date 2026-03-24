# GitHub Actions CI/CD Workflows

This directory contains automated workflows for building, testing, and deploying RecoverWell.

## Workflows

### 1. CI (`ci.yml`)
Runs on every push and pull request to `main` and `develop` branches.

**What it does:**
- Tests build on Node.js 18.x and 20.x
- Installs dependencies with `npm ci`
- Builds the application
- Checks bundle sizes
- Uploads build artifacts

**Required Secrets:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_VAPID_PUBLIC_KEY` - VAPID public key for push notifications

### 2. Deploy (`deploy.yml`)
Deploys to Vercel when code is pushed to `main` branch.

**What it does:**
- Builds the production application
- Deploys to Vercel automatically

**Required Secrets:**
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- All environment variables from CI workflow

**Alternative: Netlify**
Uncomment the Netlify section and comment out Vercel to deploy to Netlify instead.

Additional secrets needed:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

### 3. Deploy Functions (`deploy-functions.yml`)
Deploys Supabase Edge Functions when changed.

**What it does:**
- Detects changes to `supabase/functions/**`
- Deploys Edge Functions to Supabase
- Sets required secrets in Supabase

**Required Secrets:**
- `SUPABASE_ACCESS_TOKEN` - Supabase access token (from dashboard)
- `SUPABASE_PROJECT_REF` - Your Supabase project reference ID
- `VAPID_PUBLIC_KEY` - VAPID public key
- `VAPID_PRIVATE_KEY` - VAPID private key
- `VAPID_CONTACT` - Contact email for VAPID (e.g., mailto:you@example.com)

## Setting Up Secrets

### GitHub Repository Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret listed above

### Getting Secret Values

**Supabase:**
- Go to your Supabase project dashboard
- Settings → API → Copy URL and anon key
- Settings → Account → Access Tokens → Create new token

**VAPID Keys:**
```bash
npx web-push generate-vapid-keys
```

**Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login`
3. Run `vercel link` in your project
4. Get tokens from Vercel dashboard → Settings → Tokens

**Netlify:**
1. Go to Netlify dashboard
2. User settings → Applications → New access token
3. Site settings → General → Copy Site ID

## Manual Deployment

You can also trigger deployments manually:

1. Go to **Actions** tab in your repository
2. Select the workflow you want to run
3. Click **Run workflow**

## Monitoring

- View workflow runs in the **Actions** tab
- Check deployment status on Vercel/Netlify dashboard
- Monitor Edge Function logs in Supabase dashboard

## Troubleshooting

### Build fails with "Missing environment variables"
- Ensure all required secrets are set in GitHub
- Check secret names match exactly (case-sensitive)

### Vercel deployment fails
- Verify Vercel tokens are valid
- Check project is linked correctly
- Ensure organization ID and project ID are correct

### Edge Function deployment fails
- Verify Supabase access token has correct permissions
- Check project reference ID is correct
- Ensure function code has no syntax errors

## Best Practices

1. **Never commit secrets** - Always use GitHub Secrets
2. **Test locally first** - Run `npm run build` before pushing
3. **Use feature branches** - Create PRs for review before merging to main
4. **Monitor bundle size** - Check CI output for bundle size warnings
5. **Review deployment logs** - Check Actions tab after each deployment

## Extending Workflows

### Add Testing

Add this step to `ci.yml`:

```yaml
- name: Run tests
  run: npm test
```

### Add Linting

Add this step to `ci.yml`:

```yaml
- name: Lint code
  run: npm run lint
```

### Add Type Checking

Add this step to `ci.yml`:

```yaml
- name: Type check
  run: npm run type-check
```

### Deploy Preview for PRs

Modify `deploy.yml` to also run on pull requests and deploy previews.

## Support

For issues with:
- GitHub Actions: Check [Actions documentation](https://docs.github.com/en/actions)
- Vercel: Check [Vercel docs](https://vercel.com/docs)
- Supabase: Check [Supabase docs](https://supabase.com/docs)
