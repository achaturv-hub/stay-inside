FROM node:20-alpine

WORKDIR /

COPY .. .
RUN npm install --production
RUN npm run build
CMD ["npm", "start"]

EXPOSE 3002