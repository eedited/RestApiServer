FROM node:14.16.1

RUN mkdir -p /eedited
WORKDIR /eedited
ADD . /eedited
RUN npm install

EXPOSE 3000 3001 9712

RUN npm run dev