FROM node:14.16.1

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max_old_space_size=2048

RUN mkdir -p /eedited
WORKDIR /eedited
ADD . /eedited
RUN npm install
RUN npx prisma generate
RUN npm run build

EXPOSE 9712 3000 3001

CMD [ "npm", "run", "docker" ]