# Pake base image Python yang ringan
FROM python:3.9-slim

# Set folder kerja di dalam container
WORKDIR /app

# Copy file requirements
COPY requirements.txt .

# Install library Python
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua codingan backend
COPY . .

# Jalankan main.py
CMD ["python", "main.py"]