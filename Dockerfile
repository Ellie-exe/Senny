FROM node

WORKDIR /usr/src/senny

COPY package.json .

RUN npm install

COPY src ./src

CMD ["node", "src/index.js"]
