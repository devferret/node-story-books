const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
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
        profileFields: [
          'id',
          'picture.type(large)',
          'emails',
          'first_name',
          'last_name'
        ]
      },
      (accessToken, refreshToken, profile, done) => {
        createOrFindUser(profile, 'facebook', done)
      }
    )
  )

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: 'o1n6o1qmXmmD5STfPwbdkv2qJ',
        consumerSecret: 'jeJEhArhuQO56IdKVzDmY8S4CLQRvV75hr0XZbifRqj5szsHKa',
        callbackURL: '/auth/twitter/callback',
        includeEmail: true
      },
      (accessToken, refreshToken, profile, done) => {
        createOrFindUser(profile, 'twitter', done)
      }
    )
  )

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((userId, done) =>
    User.findById(userId).then(user => done(null, user))
  )
}

const createOrFindUser = (profile, social, done) => {
  let image, email

  switch (social) {
    case 'google':
      image = profile.photos[0].value.substring(
        0,
        profile.photos[0].value.indexOf('?')
      )
      break

    case 'facebook':
      image = profile.photos[0].value
      break

    case 'twitter':
      image = profile.photos[0].value.replace('_normal', '')
      break

    default:
      image = ''
      break
  }

  const newUser = {
    socialID: profile.id,
    firstName: profile.name ? profile.name.givenName : profile.displayName,
    lastName: profile.name ? profile.name.familyName : '',
    email: profile.emails[0].value,
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
