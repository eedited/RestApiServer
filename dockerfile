FROM node:14.16.1

RUN mkdir -p /eedited
WORKDIR /eedited
ADD . /eedited
RUN npm install

EXPOSE 9712 3000 3001

CMD [ "npm", "run", "dev:docker" ]