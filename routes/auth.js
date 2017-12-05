const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard')
)

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))
router.get(
  '/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

router.get(
  '/twitter',
  passport.authenticate('twitter', { scope: ['include_email=true'] })
)
router.get(
  '/twitter/callback',
  passport.authenticate('twitter'),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

router.get('/user', (req, res) => {
  if (req.user) res.send(req.user)
  else res.send({})
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
