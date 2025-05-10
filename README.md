# Portfolio Website

A modern portfolio website built with FastAPI (backend) and React (frontend).

## Features

- Personal information management
- Project showcase
- Experience timeline
- Contact form
- Admin dashboard
- Image upload
- Responsive design

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Python 3.10+

### Frontend
- React
- TypeScript
- Material-UI
- Axios
- React Router

## Setup

### Backend

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run migrations:
```bash
alembic upgrade head
```

5. Start the server:
```bash
uvicorn app.main:app --reload
```

### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the development server:
```bash
npm start
```

## Development

- Backend API runs on http://localhost:8000
- Frontend development server runs on http://localhost:3000
- Admin dashboard is available at http://localhost:8000/admin

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

MIT 