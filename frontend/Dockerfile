FROM node:18-alpine

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy your source code
COPY . .

# Set environment variable for Next.js
ENV CHOKIDAR_USEPOLLING=true
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Run Next.js development server
CMD ["npm", "run", "dev"]
