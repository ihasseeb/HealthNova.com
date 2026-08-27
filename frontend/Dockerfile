# Base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of the code
COPY . .

# Build the project (Vite)
# Note: We pass the backend API URL as a build arg for Docker
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Expose port (our serve package uses 4173)
EXPOSE 4173

# Start command (serve -s dist)
CMD ["npm", "start"]