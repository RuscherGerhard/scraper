#Build Stage
FROM node:16-alpine AS build

WORKDIR /app
COPY ./package*.json ./
COPY ./tsconfig.json ./
RUN npm i
COPY ./ ./
RUN ls ./api-docs
RUN npm run build

# Production Stage
FROM node:16-alpine AS production

WORKDIR /app
COPY ./package*.json ./
RUN npm ci --only=production
COPY --from=build /app/application ./application
COPY --from=build /app/api-docs ./api-docs
CMD ["node","./application/main.js"]