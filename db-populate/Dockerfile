FROM node:7.1.0-slim
ENV MONGO_HOST=mongo \
    MONGO_PORT=27017 \
    MONGO_COLLECTION=ipsum \
    IPSUM_DATA_FILE=data.txt
WORKDIR /usr/app/db-populate
ADD insert.js data.txt package.json /usr/app/db-populate/
RUN npm install
CMD ["node", "insert.js"]