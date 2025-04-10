FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run tsc:build
RUN npm run build
RUN ls -lah
RUN cp .env-template .env
# Start the backend
CMD ["npm", "run", "start-backend"]
