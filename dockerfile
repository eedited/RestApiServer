FROM node:14.16.1

RUN mkdir -p /eedited
WORKDIR /eedited
ADD . /eedited
RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 9712 3000 3001

CMD [ "npm", "run", "docker" ]