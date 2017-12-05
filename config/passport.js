const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const mongoose = require('mongoose')
const keys = require('./keys')

const User = mongoose.model('user')

module.exports = passport => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        createOrFindUser(profile, 'google', done)
      }
    )
  )

  passport.use(
    new FacebookStrategy(
      {
        clientID: '150997585660257',
        clientSecret: '921fdfed69924f835f29ac1b0347943a',
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      (accessToken, refreshToken, profile, done) => {
        createOrFindUser(profile, 'facebook', done)
      }
    )
  )

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((userId, done) =>
    User.findById(userId).then(user => done(null, user))
  )
}

const createOrFindUser = (profile, social, done) => {
  const image =
    social == 'google'
      ? profile.photos[0].value.substring(
          0,
          profile.photos[0].value.indexOf('?')
        )
      : profile.photos[0].value

  const newUser = {
    socialID: profile.id,
    firstName: profile.name.givenName || profile.displayName,
    lastName: profile.name.familyName || '',
    email:
      social == 'google' ? profile.emails[0].value : 'No valid email address',
    image: image
  }

  User.findOne({
    socialID: newUser.socialID
  }).then(user => {
    if (!user) new User(newUser).save().then(user => done(null, user))
    else {
      user.firstName = newUser.firstName
      user.lastName = newUser.lastName
      user.email = newUser.email
      user.image = newUser.image

      user.save().then(user => done(null, user))
    }
  })
}
