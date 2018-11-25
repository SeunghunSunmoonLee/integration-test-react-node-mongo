import io from 'socket.io-client';
// import feathers from '@feathersjs/client';
const feathers = require('@feathersjs/feathers');
const auth = require('@feathersjs/authentication-client');
const socketio = require('@feathersjs/socketio-client');

const socket = io(window.location.origin, {
  transports: ['websocket']
});
const client = feathers();
client.configure(socketio(socket, {
  timeout: 60000,
}));
client.configure(auth({
    storage: window.localStorage,
    cookie: 'feathers-jwt',
  }),);
export default client;
