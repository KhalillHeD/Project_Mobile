FROM python:3.11-slim

# Copy backend code into /app/backend
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install Python deps (requirements.txt is at project root)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy only backend folder into image
COPY backend/ /app/backend

# Set working dir to backend
WORKDIR /app/backend

EXPOSE 8000

CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]