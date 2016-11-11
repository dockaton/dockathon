FROM node:7.1.0-slim
ENV SERVER_PORT=80 \
    MONGO_HOST=mongo \
    MONGO_PORT=27017 \
    MONGO_COLLECTION=ipsum
EXPOSE 80
ADD server.js package.json /usr/app/ipsum/
ADD public /usr/app/ipsum/public/
WORKDIR /usr/app/ipsum
RUN apt-get update && \
    apt-get install -y git && \
    npm install && \
    cd public && \
    npm install -g bower && \
    npm install && \
    bower install --allow-root && \
    cd .. && \
    apt-get remove -y git
CMD ["node", "server.js"]