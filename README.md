# Feedback Management Dashboard

A full-stack Feedback Management Dashboard built with Django (backend) and React (frontend) that allows users to submit feedback, view feedbacks, and analyze insights.

## Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Feedback Form (Name, Email, Message, Rating 1-5)
- ✅ Feedback Table with all submissions
- ✅ Analytics Dashboard:
  - Total feedbacks count
  - Average rating
  - Positive feedbacks (rating 4+)
  - Negative feedbacks (rating <3)
- ✅ Search/Filter by rating
- ✅ Export feedbacks to CSV
- ✅ Responsive and modern UI

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Django + Django REST Framework
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
.
├── backend/              # Django backend
│   ├── feedback/        # Feedback app
│   ├── feedback_project/ # Django project settings
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create a superuser (optional, for admin panel):
```bash
python manage.py createsuperuser
```

7. Run the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:8000):
```env
VITE_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login user

### Feedback
- `POST /api/feedback/` - Create a new feedback (public)
- `GET /api/feedback/` - Get all feedbacks (authenticated)
- `GET /api/feedback/stats/` - Get analytics statistics (authenticated)
- `GET /api/feedback/export_csv/` - Export feedbacks to CSV (authenticated)
- `GET /api/feedback/export_csv/?rating=X` - Export filtered feedbacks (authenticated)

## Deployment

### Backend Deployment (Render/Railway)

1. Create a `Procfile` in the backend directory:
```
web: gunicorn feedback_project.wsgi:application
```

2. Add `gunicorn` to requirements.txt:
```
gunicorn==21.2.0
```

3. Update `ALLOWED_HOSTS` in settings.py for production

4. Deploy to Render/Railway and set environment variables

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Set environment variable `VITE_API_URL` to your backend URL

3. Deploy the `dist` folder to Vercel/Netlify

## Database

The project uses SQLite by default. The database file (`db.sqlite3`) will be created automatically in the backend directory after running migrations.

For production, you can switch to PostgreSQL or MySQL by updating the `DATABASES` setting in `settings.py`.

## License

This project is created for Upteky Solution Pvt. Ltd. SDE Intern Task.

