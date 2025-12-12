FROM node:24

WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 3001
CMD ["yarn", "start:dev"]