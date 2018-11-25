// const app = require('../../../app');
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const memory = require('feathers-memory');
// const usersService = require('server/services/users/users.service.js');
const configuration = require('@feathersjs/configuration');

const auth = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');

describe('\'users\' service', () => {
  const options = {
    paginate: {
      default: 10,
      max: 25
    }
  };
  const app = express(feathers());
  app.configure(express.rest())
   .configure(socketio())
   .use(express.json())
   .use(express.urlencoded({ extended: true }))
   .configure(auth({ secret: 'supersecret' }))
   .configure(local())
   .configure(jwt())
   .use('/users', memory(options))

   app.service('users').hooks({
     // Make sure `password` never gets sent to the client
     after: local.hooks.protect('password')
   });

   app.service('authentication').hooks({
    before: {
     create: [
      // You can chain multiple strategies
      auth.hooks.authenticate(['jwt', 'local'])
     ],
     remove: [
      auth.hooks.authenticate('jwt')
     ]
    }
   });

   app.service('users').hooks({
    before: {
     find: [
      auth.hooks.authenticate('jwt')
     ],
     create: [
      local.hooks.hashPassword({ passwordField: 'password' })
     ]
    }
   });
  beforeEach(async () => {
    // Database adapter pagination options

    // app = express(feathers());
    // const config = app.get('authentication');
    // app.configure(configuration());
    //
    // app.configure(express.rest());
    // app.use(express.json())
    // app.use(express.urlencoded({ extended: true }))
    // Register `users` service in-memory
    // app.configure(usersService)
    // console.log("===config", config)
    // const handler = makeHandler(app);

    // Set up authentication with the secret
    // app.configure(authentication(config));
    // app.configure(jwt());
    // app.configure(local());
    // app.use('/users', memory(options));

    // app.service('users').hooks({
    //   // Make sure `password` never gets sent to the client
    //   after: local.hooks.protect('password')
    // });
    //
    // app.service('authentication').hooks({
    //   before: {
    //     create: [
    //       authentication.hooks.authenticate(config.strategies)
    //     ],
    //     remove: [
    //       authentication.hooks.authenticate('jwt')
    //     ]
    //   }
    // });
    // app.service('users').hooks({
    //  before: {
    //   find: [
    //    authentication.hooks.authenticate('jwt')
    //   ],
    //   create: [
    //    local.hooks.hashPassword({ passwordField: 'password' })
    //   ]
    //  }
    // });
    // Create a new user we can use to test with
    // user = await app.service('users').create({
    //   email: 'test@user.com'
    // });
  });
  it('registered the service', () => {
    const service = app.service('users');
    expect(service).toBeTruthy()
  });

  it('creates a user, encrypts password ', async () => {
    const user = await app.service('users').create({
      username: 'test-student',
      email: 'test-student@gmail.com',
      password: 'secret',
      roles: ['student']
    });

    // Verify email has been set to what we'd expect
    expect(user.username).toEqual('test-student');
    expect(user.email).toEqual('test-student@gmail.com');
    expect(user.roles).toEqual(['student'])
    // Makes sure the password got encrypted
    expect(user.password).not.toEqual('secret');
  });

  it('removes password for external requests', async () => {
    // Setting `provider` indicates an external request
    const params = { provider: 'rest' };

    const user = await app.service('users').create({
      username: 'test-student',
      email: 'test-student@gmail.com',
      password: 'secret'
    }, params);

    // Make sure password has been remove
    expect(user.password).toBeUndefined()
  });
});
