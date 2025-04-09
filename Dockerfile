FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run tsc:build
RUN npm run build
RUN ls -lah
# Start the backend
CMD ["npm", "run", "start-backend"]
