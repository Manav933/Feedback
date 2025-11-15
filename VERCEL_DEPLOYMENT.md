# Vercel Deployment Guide

This guide will help you deploy the Feedback Management Dashboard frontend to Vercel.

## Prerequisites

1. A GitHub account with your repository pushed (already done ✅)
2. A Vercel account (sign up at https://vercel.com if you don't have one)
3. Your Django backend deployed separately (on Render, Railway, or similar)

## Step 1: Deploy Backend First (Required)

Before deploying the frontend, you need to deploy your Django backend. The frontend needs the backend URL to function.

### Recommended Backend Deployment Options:

1. **Render** (Free tier available)
   - Go to https://render.com
   - Connect your GitHub repository
   - Create a new Web Service
   - Set root directory to `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn feedback_project.wsgi:application`
   - Add environment variables as needed

2. **Railway** (Free tier available)
   - Go to https://railway.app
   - Connect your GitHub repository
   - Deploy from the `backend` directory
   - Railway will auto-detect Django

3. **PythonAnywhere** (Free tier available)
   - Good for Django deployments

**Important:** After deploying the backend, note down the backend URL (e.g., `https://your-backend.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository: `Manav933/Feedback`
   - Vercel will auto-detect the project

3. **Configure Project Settings**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (IMPORTANT!)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.com` (your deployed backend URL)
   - Make sure to add it for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at a URL like `https://your-app.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Set Environment Variable**
   ```bash
   vercel env add VITE_API_URL
   # Enter your backend URL when prompted
   ```

6. **Redeploy with environment variable**
   ```bash
   vercel --prod
   ```

## Step 3: Update CORS Settings

Make sure your Django backend allows requests from your Vercel domain:

1. In your Django `settings.py`, update `CORS_ALLOWED_ORIGINS`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://your-app.vercel.app",
       "http://localhost:3000",  # Keep for local development
   ]
   ```

2. Or use:
   ```python
   CORS_ALLOW_ALL_ORIGINS = True  # Only for development/testing
   ```

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the application:
   - Register a new user
   - Login
   - Submit feedback
   - View analytics

## Troubleshooting

### Build Fails
- Check that `Root Directory` is set to `frontend`
- Verify `package.json` exists in the frontend directory
- Check build logs in Vercel dashboard

### API Connection Issues
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend CORS settings
- Ensure backend is deployed and accessible

### 404 Errors on Refresh
- The `vercel.json` rewrite rules should handle this
- If issues persist, check Vercel routing configuration

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Rebuild when you update environment variables

## Next Steps

- Set up a custom domain (optional)
- Configure analytics (optional)
- Set up preview deployments for branches (optional)

