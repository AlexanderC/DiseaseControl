FROM mhart/alpine-node:12
WORKDIR /web
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN mv .docker.env .env
EXPOSE 8000
CMD [ "node", "./web/server.js" ]
