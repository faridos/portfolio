FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy scripts first and set permissions
COPY wait-for-it.sh /wait-for-it.sh
COPY start.sh /app/start.sh
RUN chmod +x /wait-for-it.sh /app/start.sh

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p app/static/uploads

# Set environment
ENV ENVIRONMENT=development

# Run the startup script using shell
CMD ["/bin/bash", "/app/start.sh"] 