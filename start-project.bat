@echo off
setlocal

REM Start backend (Django + Postgres) with Docker Compose
cd /d "%~dp0"
docker compose up -d --build

pause
