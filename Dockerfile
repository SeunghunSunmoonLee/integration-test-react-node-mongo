FROM containership/alpine-node-yarn

COPY internals/scripts integration-test-react-node-mongo/internals/scripts
COPY package.json integration-test-react-node-mongo/package.json
COPY yarn.lock integration-test-react-node-mongo/yarn.lock
COPY build integration-test-react-node-mongo/build
COPY server integration-test-react-node-mongo/server

WORKDIR integration-test-react-node-mongo/

ENV NODE_ENV production

RUN yarn install --production

EXPOSE 3000

ENTRYPOINT ["yarn", "run", "start:prod"]
