FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run tsc:build
RUN npm run build
RUN ls -lah
# The default command is to start the backend
# The command can be overridden by passing a different command to `docker run`
CMD ["npm", "run", "start-backend"]
