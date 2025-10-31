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

## Development Setup

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

in docker compose : docker compose exec backend alembic upgrade head

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

## Docker Deployment

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Access the applications:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Dashboard: http://localhost:8000/admin

## Production Deployment

### Backend (FastAPI)

1. Set up a production server (e.g., DigitalOcean, AWS, etc.)
2. Install Docker and Docker Compose
3. Copy the project files to the server
4. Set up environment variables
5. Run with Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Frontend (React)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the build folder to a static hosting service (e.g., Netlify, Vercel, etc.)

## CI/CD

The project uses GitHub Actions for continuous integration and deployment:

- Runs tests on every push and pull request
- Builds the application
- Deploys to production when merging to main

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 