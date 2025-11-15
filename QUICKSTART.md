# Quick Start Guide

Get the Feedback Dashboard running locally in 5 minutes!

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed

## Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Create virtual environment (Linux/Mac)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# (Optional) Create superuser for admin panel
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

## Frontend Setup (2 minutes)

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: `http://localhost:3000`

## Test the Application

1. **Open** `http://localhost:3000` in your browser
2. **Register** a new account
3. **Login** with your credentials
4. **Submit** a feedback (you can also submit without logging in)
5. **View** all feedbacks in the dashboard
6. **Check** analytics cards
7. **Filter** by rating
8. **Export** to CSV

## Default Test Account

After creating a superuser, you can also access the Django admin at:
`http://localhost:8000/admin`

## API Endpoints

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/feedback/` - Create feedback (public)
- `GET /api/feedback/` - List all feedbacks (auth required)
- `GET /api/feedback/stats/` - Get analytics (auth required)
- `GET /api/feedback/export_csv/` - Export CSV (auth required)

## Troubleshooting

### Backend won't start
- Make sure virtual environment is activated
- Check if port 8000 is available
- Verify all dependencies are installed

### Frontend won't start
- Make sure Node.js 16+ is installed
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is available

### CORS errors
- Make sure backend is running on port 8000
- Check `CORS_ALLOWED_ORIGINS` in `settings.py`

### Database errors
- Run `python manage.py migrate` again
- Delete `db.sqlite3` and run migrations fresh

## Next Steps

- Deploy to production (see `DEPLOYMENT.md`)
- Customize the UI
- Add more features
- Switch to PostgreSQL for production

