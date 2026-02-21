# Quick Setup Guide

## Step 1: Create GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "GitWrapped"
4. Select these scopes:
   - ✅ `read:user`
   - ✅ `read:email` 
   - ✅ `read:org`
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

## Step 2: Create Environment File

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your token (use `GITHUB_TOKEN` so it stays server-only; `NEXT_PUBLIC_GITHUB_TOKEN` is also supported):
   ```
   GITHUB_TOKEN=ghp_your_actual_token_here
   ```

## Step 3: Run the Application

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### Still getting 401 errors?
- Use `GITHUB_TOKEN` in `.env.local` (not `NEXT_PUBLIC_*`) so the token is never sent to the browser.
- Make sure you copied the entire token (it starts with `ghp_`)
- Check that the token hasn't expired
- Verify the scopes are correct

### User not found?
- Try with a known public GitHub username like "octocat"
- Make sure the username is spelled correctly

### Need help?
Check the main README.md for more detailed instructions.

## Deploy (e.g. Vercel)

1. Push your repo to GitHub and import the project in [Vercel](https://vercel.com).
2. In the project **Settings → Environment Variables**, add:
   - `GITHUB_TOKEN` = your GitHub Personal Access Token (same scopes: read:user, read:email, read:org).
3. Redeploy. The app uses server actions, so the token is only used on the server and never exposed to the client.
4. Optional: use a **server-only** token (no `NEXT_PUBLIC_*`) so it never gets bundled for the browser. 