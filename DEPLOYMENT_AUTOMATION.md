# 🚀 Automated Deployment Guide

This folder contains automated scripts to deploy your Justix application end-to-end. Instead of manual configuration in dashboards, you can run a single command to deploy everything.

## Available Scripts

### 1. `verify-setup.js` - Pre-deployment Verification
**Purpose**: Check that all files and dependencies are ready

```bash
node verify-setup.js
```

**Output**: 
- ✅ Checks all required files exist
- ✅ Verifies monorepo structure
- ✅ Confirms Node.js version compatibility
- ✅ Lists next steps if everything is ready

**Run this first** before attempting deployment.

---

### 2. `deploy.js` - Full Stack Deployment Automation
**Purpose**: Automates backend deployment to Render and Vercel API configuration

```bash
node deploy.js \
  --mongodb-uri "mongodb+srv://username:password@cluster.mongodb.net/justix" \
  --render-token "rnd_XXXXXXXXXXXX" \
  --vercel-token "XXXXXXXXXXXXXXXX" \
  --vercel-project-id "prj_XXXXXXXXXXXX"
```

**What it does**:
1. 🔌 Configures MongoDB connection in Render
2. 🌐 Sets up environment variables in Render backend
3. 🔄 Triggers Render redeployment
4. 📝 Configures VITE_API_URL in Vercel
5. ♻️  Triggers Vercel frontend redeploy

**Parameters**:
- `--mongodb-uri` (required): MongoDB Atlas connection string
- `--render-token` (required): Render.com API token
- `--vercel-token` (required): Vercel API token
- `--vercel-project-id` (required): Your Vercel project ID
- `--frontend-url` (optional): Your Vercel app URL (defaults to https://justix.vercel.app)

---

## Getting Required Credentials

### 1️⃣ MongoDB Connection String

**Create free MongoDB:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or login
3. Create a new project
4. Create a free cluster
5. Click **Connect** → **Choose Connection Method** → **Drivers**
6. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/justix
   ```
7. Replace `username` and `password` with your credentials

**Example:**
```
mongodb+srv://john123:abc123xyz@cluster0.mongodb.net/justix?retryWrites=true&w=majority
```

---

### 2️⃣ Render API Token

**Get token:**
1. Go to https://dashboard.render.com
2. Click your **Account** → **Settings**
3. Go to **API Tokens**
4. Click **Create API Token**
5. Copy the token (starts with `rnd_`)

**Important**: Keep this secret! Don't commit to GitHub.

---

### 3️⃣ Vercel API Token

**Get token:**
1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Name it: `justix-deployment`
4. Make sure scope includes your project
5. Click **Create & Copy**

**Important**: This token is sensitive. Use it in automation only.

---

### 4️⃣ Vercel Project ID

**Find project ID:**
1. Go to https://vercel.com/dashboard
2. Select your **Justix** project
3. Go to **Settings** → **General**
4. Find **Project ID** field
5. Copy the entire ID (looks like `prj_xxxxxxxxxx`)

---

## Deployment Workflow

### Option A: Fully Automated (Recommended)

```bash
# 1. Verify setup first
node verify-setup.js

# 2. If all checks pass, deploy everything
node deploy.js \
  --mongodb-uri "your-mongodb-uri" \
  --render-token "your-render-token" \
  --vercel-token "your-vercel-token" \
  --vercel-project-id "your-vercel-project-id"

# 3. Wait 2-3 minutes for services to build
# 4. Visit your Vercel app and test login/signup
```

### Option B: Semi-Automated (If deployment fails)

```bash
# 1. Manually deploy backend to Render:
#    - Go to https://dashboard.render.com
#    - New → Web Service
#    - Connect GitHub repo (FiREdeviL04/justix)
#    - Configure with values from backend/.env.production
#    - Wait for deployment
#    - Copy deployed URL

# 2. Then configure Vercel API:
node configure-vercel-only.js \
  --backend-url "https://your-backend.onrender.com" \
  --vercel-token "your-vercel-token" \
  --vercel-project-id "your-vercel-project-id"
```

### Option C: Manual Setup (No Automation)

Follow the detailed guide in **BACKEND_DEPLOYMENT_GUIDE.md**

---

## Running the Scripts

### On Windows (PowerShell):

```powershell
# Verify setup
node verify-setup.js

# Deploy with automation
node deploy.js `
  --mongodb-uri "mongodb+srv://..." `
  --render-token "rnd_..." `
  --vercel-token "..." `
  --vercel-project-id "..."
```

### On Mac/Linux (Bash):

```bash
# Verify setup
node verify-setup.js

# Deploy with automation
node deploy.js \
  --mongodb-uri "mongodb+srv://..." \
  --render-token "rnd_..." \
  --vercel-token "..." \
  --vercel-project-id "..."
```

---

## Expected Output

### verify-setup.js
```
✅ Frontend package.json exists
✅ Frontend vercel.json exists
✅ API client configured
✅ Backend package.json exists
✅ MongoDB config exists
✅ Render YAML config exists
✅ Root vercel.json exists
✅ Git repository initialized

Setup Status: 8/8 (100%)

✅ Everything is ready for deployment!
```

### deploy.js (Success)
```
✅ Deployment Complete!

🎉 Your application is now fully deployed!

📍 Frontend: https://justix.vercel.app
📍 Backend: https://justix-backend.onrender.com/api
📍 MongoDB: Connected

⏳ Waiting for services to fully initialize (2-3 minutes)...
```

---

## Troubleshooting

### Script won't run
**Problem**: "command not found: node"
**Solution**: Ensure Node.js is installed - run `node --version`

### MongoDB connection string error
**Problem**: "MONGODB_URI contains invalid characters"
**Solution**: Make sure string is properly quoted with double quotes: `"mongodb+srv://..."`

### Render API token rejected
**Problem**: "Unauthorized - Invalid API token"
**Solution**: 
1. Generate a new token at https://dashboard.render.com/account/api-tokens
2. Make sure it's not expired
3. Verify you copied the entire token including prefix (`rnd_`)

### Vercel token doesn't work
**Problem**: "API token validation failed"
**Solution**:
1. Generate new token at https://vercel.com/account/tokens
2. Make sure scope includes your project
3. Ensure token is not expired

### Deployment completes but errors still occurring
**Check logs**:
1. **Render logs**: https://dashboard.render.com → Select service → Logs
2. **Vercel logs**: https://vercel.com/dashboard → Select project → Deployments → Latest → Logs
3. **Browser console**: F12 on your app → Console tab

---

## After Successful Deployment

1. ✅ Go to your Vercel app URL
2. ✅ Try signing up with an account
3. ✅ Try logging in
4. ✅ Check browser console (F12) for API errors
5. ✅ Test core features (viewing lawyers, creating bookings, etc.)
6. ✅ Monitor logs for any runtime errors

---

## Security Notes

⚠️ **Important**: 
- Never commit `.env` files with real tokens
- Don't share your API tokens or MongoDB URI
- Use strong JWT secrets in production
- In Render/Vercel dashboards, tokens are masked by default
- For CI/CD pipelines, use GitHub Secrets or similar

---

## Environment Files

### backend/.env.example
Template showing all required environment variables

### backend/.env.production
Template for production values (fill in before deployment)

### frontend/.env.example (if needed)
Shows VITE_API_URL can be configured

---

## What Each Script Does

```
verify-setup.js
├─ Checks frontend files
├─ Checks backend files
├─ Verifies deployment configs
└─ Confirms everything is ready

deploy.js
├─ Connects to Render API
├─ Updates backend environment variables
├─ Triggers Render redeploy
├─ Connects to Vercel API
├─ Configures VITE_API_URL
└─ Triggers Vercel redeploy
```

---

## Next Steps After Deployment

1. **Monitor services**: Check Render and Vercel logs
2. **Test thoroughly**: Try all authentication flows
3. **Set up monitoring**: Consider adding error tracking (Sentry, etc.)
4. **Configure email**: Set up SMTP in backend/.env for notifications
5. **Optimize performance**: Monitor Core Web Vitals in Vercel Analytics
6. **Plan scaling**: If successful, consider upgrading from free tiers

