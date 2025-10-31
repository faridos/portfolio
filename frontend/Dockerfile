FROM node:18-alpine

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy your source code
COPY . .

# Set environment variable for React
ENV CHOKIDAR_USEPOLLING=true

# Expose port
EXPOSE 3000

# Run React development server
CMD ["npm", "start"]
