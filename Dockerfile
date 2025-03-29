FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Start the backend
CMD ["npm", "run", "start-backend"]
