@echo off
setlocal

REM Start backend (Django + Postgres) with Docker Compose
cd /d "%~dp0"
docker compose up -d --build

REM Start frontend (Expo) in a new terminal
start "Expo Frontend" cmd /k "cd /d Frontend && npx expo start"

echo Backend is starting in Docker, and Expo is running in a new window.
pause
