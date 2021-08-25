FROM node:16.7.0

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build
CMD ["node", "dist/app.js"]
