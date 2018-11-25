// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// We need this to create the MD5 hash
const crypto = require('crypto');

// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar';
// The size query. Our chat needs 60px images
const query = 's=60';

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // let email;
    // if (context.data.google) {
    //   console.log("===inside context.data.google", context.data.google, context.data.email)
    //   // google authentication
    //   email = context.data.google.profile.emails
    //    .find(email => email.type==='account').value
    // } else {
    //   console.log("===inside context.data", context.data, context.data.email)
    //
    //   // email password only authentication
    //   const { email } = context.data;
    // }
    // Gravatar uses MD5 hashes from an email address (all lowercase) to get the image
    const hash = crypto.createHash('md5').update(context.data.email.toLowerCase()).digest('hex');

    context.data.avatar = `${gravatarUrl}/${hash}?${query}`;

    // Best practise, hooks should always return the context
    return context;
  };
};
