FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
# or for prod
# RUN npm ci --only=production

COPY . .

CMD [ "node", "index.js" ]