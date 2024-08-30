FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20 as production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/build ./build
COPY --from=build /app/prisma ./prisma
CMD ["npm", "start"]


