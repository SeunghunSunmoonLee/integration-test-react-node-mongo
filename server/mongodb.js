'use strict'

const mongoose = require('mongoose')
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

module.exports = function (app) {
  // const app = this

  mongoose.connect(process.env.NODE_ENV === 'production' ? app.get('mongodb') : app.get('mongodbLocalDev'), options)
  mongoose.Promise = global.Promise
  // Connect to your MongoDB instance(s)
  // mongoose.connect('mongodb://localhost:27017/feathers');

  app.set('mongooseClient', mongoose)
}
