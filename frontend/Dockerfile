# Pake Node.js versi 22 (support Vite terbaru)
FROM node:22-alpine

# Set folder kerja
WORKDIR /app

# Copy file package.json
COPY package*.json ./

# Install library JS
RUN npm install

# Copy semua codingan frontend
COPY . .

# Expose port 5173
EXPOSE 5173

# Jalanin npm run dev
CMD ["npm", "run", "dev"]