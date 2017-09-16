module.exports = {
  Ctor: require('passport-google-oauth20').Strategy,
  getConfig: (env, callbackURL) => {
    const clientID = env.LW_GOOGLE_CLIENTID
    const clientSecret = env.LW_GOOGLE_CLIENTSECRET
    if (clientID && clientSecret) {
      return {
        clientID,
        clientSecret,
        callbackURL
      }
    }
  },
  preHook: (req, opts) => {
    opts.scope = ['profile', 'email' ]
  },
  toUser: (accessToken, refreshToken, profile, done) => {
    const {id, displayName, photos = [], emails = []} = profile
    done(null, {
      accessToken,
      refreshToken,
      profile: {
        id,
        username: displayName,
        email: emails[0] ? emails[0].value : null,
        name: displayName,
        provider: 'google',
        photo: photos[0] ? photos[0].value : null
      }
    })
  }
}
