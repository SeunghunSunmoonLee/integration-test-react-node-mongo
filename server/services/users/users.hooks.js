const { authenticate } = require('@feathersjs/authentication').hooks;

const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;

const gravatar = require('../../hooks/gravatar');



function customizeGithubProfile() {
  return function(context) {
    // console.log('Customizing Github Profile');
    // If there is a github field they signed up or
    // signed in with github so let's pull the primary account email.
    if (context.data.github) {
      context.data.email = context.data.github.profile.emails.find(email => email.primary).value;
    }

    // If you want to do something whenever any OAuth
    // provider authentication occurs you can do this.
    if (context.params.oauth) {
      // do something for all OAuth providers
    }

    if (context.params.oauth.provider === 'github') {
      // do something specific to the github provider
    }

    return Promise.resolve(context);
  };
}
function customizeUserProfile() {
  return async context => {
    const { app, data } = context;
    if(!data) {
      throw new Error('A data can not be empty');
    }

    // data = Object.assign(data, {
    //
    // })
  }
}
function customizeSocialProfile(){
 return function(hook){
   // console.log('===Hook', hook);
   // console.log("===hook.data", hook.data)
   if (hook.data.facebook) {
     // console.log('===Customizing Facebook Profile', hook.data.facebook.profile.emails, hook.data.facebook.profile.photos, hook.data.facebook.profile.emails[0], hook.data.facebook.profile.photos[0]);

    hook.data.email = hook.data.facebook.profile.emails[0].value
     // .find(email => email.type==='account').value
    hook.data.photos = hook.data.facebook.profile.photos.map(photo => ({
      url: photo.value,
      isDefault: false,
    }))
    hook.data.avatar = hook.data.facebook.profile.photos[0].value
    hook.data.fullname = hook.data.facebook.profile.displayName
    hook.data.username = hook.data.facebook.profile.displayName.replace(/\s+/g,'').toLowerCase()
   }
  if (hook.data.google) {
    // console.log('===Customizing Google Profile', hook.data.google);
    hook.data.username = hook.data.google.profile.displayName
    hook.data.email = hook.data.google.profile.emails
    .find(email => email.type==='account').value
    hook.data.photos = hook.data.google.profile.photos.map(photo => ({
      url: photo.value,
      isDefault: false,
    }))
   hook.data.avatar = hook.data.google.profile.photos[0].value
   hook.data.fullname = hook.data.google.profile.displayName
   hook.data.username = hook.data.google.profile.displayName.replace(/\s+/g,'').toLowerCase()

  }

  return Promise.resolve(hook);
 }
}

module.exports = {
  before: {
    all: [],
    find: [ ],
    get: [ ],
    create: [ customizeUserProfile(), customizeSocialProfile(), hashPassword() ],
    update: [ customizeSocialProfile(), hashPassword(), authenticate('jwt') ],
    patch: [ hashPassword(), authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
