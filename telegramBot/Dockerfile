FROM node:latest
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 8081
CMD [ "node", "stateMachine.js" ]