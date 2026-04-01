# Justix Backend & Database Integration Guide

## Current Status Check ✓
- ✅ Frontend deployed to Vercel (needs API URL config)
- ✅ Backend code ready with render.yaml
- ❌ MongoDB not connected (needs connection string)
- ❌ Backend not deployed to Render (needs setup)
- ❌ API communication not configured

---

## Step 1: Get MongoDB Connection String

### Option A: MongoDB Atlas (Recommended - Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account or login
3. Create a new cluster (free tier available)
4. Go to **Database** > **Databases**
5. Click **Connect** on your cluster
6. Choose **Drivers** (Node.js)
7. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/justix?retryWrites=true&w=majority`
8. Replace `username`, `password`, and `justix` with your values

### What You Need:
```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/justix?retryWrites=true&w=majority
```

---

## Step 2: Update Backend Environment Variables

Once you have MONGODB_URI, update `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/justix
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-vercel-app.vercel.app
ADMIN_EMAIL=admin@justix.com
ADMIN_PASSWORD=Admin@12345
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=Justix <noreply@justix.com>
```

---

## Step 3: Deploy Backend to Render

### Prerequisites:
- Render.com account (free tier)
- GitHub repo pushed (✓ already done)

### Deployment Steps:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"Web Service"**
3. **Connect GitHub Repository**:
   - Search for `justix`
   - Click **Connect** next to `FiREdeviL04/justix`
   - Grant Render permission to access repo

4. **Configure Deployment**:
   - **Name**: `justix-backend` (or any name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `master` (or main)
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (sufficient for testing)

5. **Add Environment Variables**:
   Click **"Advanced"** or find Environment section, add:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/justix
   JWT_SECRET = your_super_secret_jwt_key_here
   JWT_EXPIRES_IN = 7d
   FRONTEND_URL = https://your-vercel-app.vercel.app
   ADMIN_EMAIL = admin@justix.com
   ADMIN_PASSWORD = Admin@12345
   ```

6. **Create Web Service**
   - Wait for deployment to complete (2-5 minutes)
   - Once deployed, you'll get a URL like: `https://justix-backend.onrender.com`

---

## Step 4: Configure Frontend to Use Backend

### In Vercel Dashboard:

1. **Go to Your Vercel Project** (Justix)
2. **Settings** → **Environment Variables**
3. **Add Variable**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://justix-backend.onrender.com/api` (replace with your Render URL)
   - **Environments**: Production, Preview, Development
   - Click **Save**

4. **Trigger Redeploy**:
   - Go to **Deployments**
   - Click **Redeploy** on latest commit
   - Wait for build to complete

---

## Step 5: Test the Integration

### Test Backend API Health:
```bash
# Replace with your actual Render backend URL
curl https://justix-backend.onrender.com/api/health
# Expected response: {"status":"ok","service":"Justix API"}
```

### Test Frontend to Backend Communication:
1. Go to your Vercel app: `https://your-app.vercel.app`
2. Try logging in or creating account
3. Check browser Console (F12) for any API errors
4. If errors, check:
   - Vercel environment variable is set correctly
   - Render backend is running (check Render logs)
   - MongoDB connection string is valid

---

## Common Issues & Solutions

### ❌ "Failed to fetch from API"
**Cause**: VITE_API_URL not set in Vercel or wrong URL
**Fix**: Double-check Vercel env var settings and redeploy

### ❌ "MongoDB connection timeout"
**Cause**: Invalid connection string or IP whitelist issue
**Fix**: 
1. In MongoDB Atlas, go to **Network Access**
2. Add IP: `0.0.0.0/0` (allows all IPs - not secure, use for testing only)
3. Or add Render's IP if known

### ❌ "CORS error in browser console"
**Cause**: FRONTEND_URL in backend env doesn't match Vercel URL
**Fix**: Update FRONTEND_URL in Render dashboard to exact Vercel URL

### ❌ "Render service in sleeping state"
**Cause**: Free tier Render services sleep after 15 min inactivity
**Solution**: 
- Upgrade to Starter plan ($7/mo to keep always on)
- Or use Railway.app instead (better free tier support)

---

## Files Involved

- `backend/.env` - Database and API configuration
- `backend/render.yaml` - Render deployment config (already set up ✓)
- `backend/src/server.js` - Express API server
- `backend/src/config/db.js` - MongoDB connection logic
- `frontend/src/api/client.js` - Axios client (uses VITE_API_URL env var)

---

## Monitoring & Debugging

### Check Render Logs:
1. Go to Render dashboard
2. Click on your `justix-backend` service
3. Click **Logs** to see real-time errors

### Check Vercel Logs:
1. Go to Vercel project
2. Click **Deployments**
3. Click latest deployment
4. Click **Building** or **Functions** tabs

### Test API Endpoints:
```bash
# Health check
curl https://justix-backend.onrender.com/api/health

# Auth endpoints
curl https://justix-backend.onrender.com/api/auth/check

# With authentication
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" https://justix-backend.onrender.com/api/lawyers
```

---

## What's Next

Once backend is deployed:
1. ✅ Verify MongoDB is connected
2. ✅ Set VITE_API_URL in Vercel
3. ✅ Test login/signup functionality
4. ✅ Monitor for errors in logs
5. 🔐 Set stronger JWT_SECRET for production
6. 🔒 Configure MongoDB Atlas IP whitelist properly
7. 📧 Set up SMTP for email notifications

