Table of Contents
About
Tech stack
Prerequisites
Quick start (Docker)
Common Docker commands
Common tasks (inside containers)
Frontend (Expo)
Local (non-Docker) dev notes
Environment & .env.example
Database & migrations
Testing
Building / Release (EAS)
Troubleshooting
Contributing
License & Contact
About
Project Mobile pairs a Django REST API (backend) with an Expo-managed React Native app (frontend). The repository is set up to run using Docker Compose for easy local development.

Tech stack
Backend: Python, Django, Django REST Framework
Frontend: Expo, React Native (TypeScript)
Database: PostgreSQL (Docker)
Containerization: Docker, Docker Compose
Prerequisites
Docker & Docker Compose installed (https://docs.docker.com)
Node.js & npm/yarn (for local frontend work)
(Optional) Python 3.10+ & virtualenv if running backend locally
Quick start (Docker) ✅
Copy a working env file (see .env.example) and customize if needed.

From the project root run:
docker-compose up --build

Or to run in background:
docker-compose up -d --build

Services:

Django API: http://localhost:8000
Expo dev server: http://localhost:8081 (or use Expo app / tunnel)
Common Docker commands 🔧
docker-compose down

docker-compose down -v # WARNING: removes volumes (DB data)

docker-compose logs -f web

docker-compose up --build --force-recreate

Common tasks (run inside containers) ✅
docker-compose exec web python manage.py migrate

docker-compose exec web python manage.py makemigrations

docker-compose exec web python manage.py createsuperuser

docker-compose exec web python manage.py shell

docker-compose exec web python manage.py test

docker-compose exec db psql -U myuser -d mydb

Frontend (Expo) 📱
Start the dev server inside the frontend container:
docker-compose exec frontend npx expo start

Start with tunnel so mobile devices can connect:
docker-compose exec frontend npx expo start --tunnel

Install JS deps inside container:
docker-compose exec frontend npm install

Local (non-Docker) development notes
Backend:

python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt
cd backend
python manage.py migrate
python manage.py runserver
Frontend:

cd Frontend
npm install
npx expo start
Environment & .env.example 🔒
docker-compose.yml references an .env file. Do not commit secrets.
Typical variables:
POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
DJANGO_SECRET_KEY, DEBUG, DATABASE_URL
Optional .env.example (copy into .env and edit):

Database & migrations ✅
Default DB for Docker is PostgreSQL (service db). Data persisted in postgres_data volume.
To create and apply migrations:
docker-compose exec web python manage.py makemigrations
docker-compose exec web python manage.py migrate
Testing 🧪
Run backend tests:
docker-compose exec web python manage.py test
Building / Release (EAS) 📦
Expo EAS builds require EAS configuration and credentials:
eas build -p android
Configure eas.json and sign in to EAS before running builds.
Troubleshooting & tips ⚠️
If ports conflict, ensure 8000 (Django) and 8081 (Expo) are free.
If DB connection issues occur, verify POSTGRES_* env vars and that db service is healthy.
If code changes don't reflect, verify that volume mounts are present in docker-compose.yml.
To clear containers and volumes (use carefully):
docker-compose down -v
Tip: Inspect docker-compose.yml and settings.py for project-specific settings and env var usage.

Contributing ✨
Fork, create feature branches, add tests, and open PRs.
Run backend tests locally or via the container before opening PRs.
