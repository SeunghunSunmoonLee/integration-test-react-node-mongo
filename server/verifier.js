const Debug = require('debug');
const Verifier = require('@feathersjs/authentication-oauth2').Verifier;

const debug = Debug('feathers-authentication-emailfirstoauth2:verify');

class EmailFirstOAuth2Verifier extends Verifier {

  constructor (app, options = {}) {
    options.emailField = options.emailField || 'email';
    super(app, options);
  }

  verify (req, accessToken, refreshToken, profile, done) {
    debug('Checking credentials');
    const options = this.options;
    const query = {
      $or: [
        { [options.idField]: profile.id },
        { [options.emailField]: {$in: profile.emails.map(emailObj => emailObj.value)} }
      ],
      $limit: 1
    };
    const data = { profile, accessToken, refreshToken };
    let existing;

    // Check request object for an existing entity
    if (req && req[options.entity]) {
      existing = req[options.entity];
    }

    // Check the request that came from a hook for an existing entity
    if (!existing && req && req.params && req.params[options.entity]) {
      existing = req.params[options.entity];
    }

    // If there is already an entity on the request object (ie. they are
    // already authenticated) attach the profile to the existing entity
    // because they are likely "linking" social accounts/profiles.
    if (existing) {
      return this._updateEntity(existing, data)
        .then(entity => done(null, entity))
        .catch(error => error ? done(error) : done(null, error));
    }

    // Find or create the user since they could have signed up via facebook.
    this.service
      .find({ query })
      .then(this._normalizeResult)
      .then(entity => entity ? this._updateEntity(entity, data) : this._createEntity(data))
      .then(entity => {
        const id = entity[this.service.id];
        const payload = { [`${this.options.entity}Id`]: id };
        done(null, entity, payload);
      })
      .catch(error => error ? done(error) : done(null, error));
  }
}
module.exports = EmailFirstOAuth2Verifier;

// How to use:
//
// import EmailFirstOAuth2Verifier from './verifiers/verifier';
//
// app.configure(oauth2(Object.assign({
//     name: 'google',
//     Strategy: GoogleStrategy,
//     Verifier: EmailFirstOAuth2Verifier,
//     emailField: 'email'
// }, config.google)));
