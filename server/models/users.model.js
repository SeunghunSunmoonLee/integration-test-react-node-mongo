// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const user = new mongooseClient.Schema({
    email: {type: String, unique: true},
    username: String,
    fullname: String,
    roles: [String],
    avatar: String,
    photos: [{url: String, isDefault: Boolean}],
    password: { type: String },
    avatar: String,
    facebookId: { type: String },
    facebook: { type: mongooseClient.Schema.Types.Mixed },
    googleId: { type: String },
    google: { type: mongooseClient.Schema.Types.Mixed },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now },
    posts: [{ type: mongooseClient.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongooseClient.Schema.Types.ObjectId, ref: 'Comment' }]
  }, {
    timestamps: true
  });

  return mongooseClient.model('User', user);
};



// const NeDB = require('nedb');
// const path = require('path');
//
// module.exports = function (app) {
//   const dbPath = app.get('nedb');
//   const Model = new NeDB({
//     filename: path.join(dbPath, 'users.db'),
//     autoload: true
//   });
//
//   Model.ensureIndex({ fieldName: 'email', unique: true });
//
//   return Model;
// };
