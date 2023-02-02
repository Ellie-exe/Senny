FROM arm64v8/node

WORKDIR /app

COPY . /app

RUN npm install

CMD ["node", "src/index.js"]
