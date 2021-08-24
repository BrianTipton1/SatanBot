FROM node:16.7.0

WORKDIR /app
COPY . .
RUN yarn install
CMD["node", "dist/app.js"]