# Deployment Guide

This guide will help you deploy the Feedback Dashboard to production.

## Backend Deployment (Render/Railway)

### Option 1: Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command**: `cd backend && pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `cd backend && gunicorn feedback_project.wsgi:application`
   - **Environment**: Python 3
4. **Set Environment Variables:**
   - `SECRET_KEY`: Generate a new Django secret key
   - `DEBUG`: `False` (for production)
   - `ALLOWED_HOSTS`: Your Render domain (e.g., `your-app.onrender.com`)
5. **Deploy**

### Option 2: Railway

1. **Create a new project** on Railway
2. **Connect your GitHub repository**
3. **Add a new service** and select your repository
4. **Configure:**
   - **Root Directory**: `backend`
   - **Start Command**: `gunicorn feedback_project.wsgi:application`
5. **Set Environment Variables** (same as Render)
6. **Deploy**

### Important Notes for Backend:

- Update `ALLOWED_HOSTS` in `settings.py` to include your production domain
- Set `DEBUG = False` in production
- Generate a new `SECRET_KEY` for production
- The SQLite database will be created automatically
- For production, consider using PostgreSQL instead of SQLite

## Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel

1. **Install Vercel CLI** (optional): `npm i -g vercel`
2. **Deploy via CLI:**
   ```bash
   cd frontend
   vercel
   ```
3. **Or deploy via Vercel Dashboard:**
   - Import your GitHub repository
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Set Environment Variables:**
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)
5. **Deploy**

### Option 2: Netlify

1. **Install Netlify CLI** (optional): `npm i -g netlify-cli`
2. **Deploy via CLI:**
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```
3. **Or deploy via Netlify Dashboard:**
   - Import your GitHub repository
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. **Set Environment Variables:**
   - `VITE_API_URL`: Your backend URL
5. **Deploy**

## CORS Configuration

Make sure to update `CORS_ALLOWED_ORIGINS` in `backend/feedback_project/settings.py` to include your frontend domain:

```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend.vercel.app",
    "https://your-frontend.netlify.app",
    # Add your production frontend URL here
]
```

## Database Migration

The SQLite database will be created automatically on first run. For production with multiple instances, consider:

1. **Using PostgreSQL** (recommended for production)
2. **Using a shared volume** for SQLite (not recommended)
3. **Using an external database service**

To switch to PostgreSQL:

1. Update `requirements.txt` to include `psycopg2-binary`
2. Update `DATABASES` in `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
```

## Testing Deployment

After deployment, test the following:

1. ✅ User registration
2. ✅ User login
3. ✅ Submit feedback (should work without auth)
4. ✅ View feedbacks (requires auth)
5. ✅ View analytics (requires auth)
6. ✅ Filter by rating
7. ✅ Export to CSV

## Troubleshooting

### Backend Issues

- **500 Error**: Check logs for database migration issues
- **CORS Error**: Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
- **Static files**: For production, consider using WhiteNoise or a CDN

### Frontend Issues

- **API Connection Error**: Verify `VITE_API_URL` is set correctly
- **Build Errors**: Check Node.js version (should be 16+)
- **Blank Page**: Check browser console for errors

## Security Checklist

- [ ] Set `DEBUG = False` in production
- [ ] Generate a new `SECRET_KEY`
- [ ] Update `ALLOWED_HOSTS`
- [ ] Configure CORS properly
- [ ] Use HTTPS (automatically handled by Vercel/Netlify/Render)
- [ ] Consider rate limiting for API endpoints
- [ ] Use environment variables for sensitive data

