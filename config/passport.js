const GoogleStrategy = require('passport-google-oauth20').Strategy
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
        const image = profile.photos[0].value.substring(
          0,
          profile.photos[0].value.indexOf('?')
        )

        const newUser = {
          socialID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image: image
        }

        console.log(newUser)
        User.findOne({
          socialID: profile.id
        }).then(user => {
          if (user) done(null, user)
          else new User(newUser).save().then(user => done(null, user))
        })
      }
    )
  )
}
