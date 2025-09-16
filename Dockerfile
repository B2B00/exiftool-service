FROM node:18-slim

# Instalar ExifTool
RUN apt-get update && apt-get install -y libimage-exiftool-perl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY . .

RUN mkdir -p uploads

EXPOSE 3000
CMD ["node", "server.js"]
