FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
# Start the backend
CMD ["npm", "run", "start-backend"]
