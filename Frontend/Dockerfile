FROM node:20

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

COPY . .

# Set environment variable to avoid the "EXPO_NO_TELEMETRY" error on Windows
ENV EXPO_NO_TELEMETRY=1

EXPOSE 8081

# This version is more stable for Docker
CMD ["npx", "expo", "start", "--host", "lan", "--web"]