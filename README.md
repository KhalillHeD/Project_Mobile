# 📱 Project Mobile

Project Mobile is a full-stack mobile application combining a **Django REST API** backend with an **Expo (React Native)** frontend.  
The project is fully **Dockerized** using Docker Compose for fast and consistent local development.

---

## 📚 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start (Docker)](#quick-start-docker)
- [Common Docker Commands](#common-docker-commands)
- [Common Tasks (Inside Containers)](#common-tasks-inside-containers)
- [Frontend (Expo)](#frontend-expo)
- [Local (Non-Docker) Development](#local-non-docker-development)
- [Environment Variables](#environment--envexample)
- [Database & Migrations](#database--migrations)
- [Testing](#testing)
- [Building & Release (EAS)](#building--release-eas)
- [Troubleshooting](#troubleshooting--tips)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## 📖 About

Project Mobile pairs:
- a **Django REST Framework API** for backend services
- an **Expo-managed React Native app** for mobile clients

The repository is configured to run entirely with **Docker Compose**, making onboarding and local development simple and consistent across environments.

---

## 🛠 Tech Stack

**Backend**
- Python
- Django
- Django REST Framework

**Frontend**
- Expo
- React Native (TypeScript)

**Database**
- PostgreSQL (Dockerized)

**DevOps**
- Docker
- Docker Compose
- Expo EAS (build & release)

---

## ✅ Prerequisites

Make sure you have the following installed:

- **Docker & Docker Compose**  
  https://docs.docker.com
- **Node.js** + npm or yarn (for local frontend work)
- *(Optional)* **Python 3.10+** and `virtualenv` for running the backend without Docker

---

## 🚀 Quick Start (Docker)


Start the project:
   ```bash
   docker-compose up --build
```

Or run in the background:
   ```bash
   docker-compose up -d --build
```


🌐 Services

Django API → http://localhost:8000

Expo Dev Server → http://localhost:8081

