const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../helper/auth')

router.get('/', (req, res) => res.render('stories/index'))

router.get('/add', ensureAuthenticated, (req, res) => res.render('stories/add'))

router.get('/edit', ensureAuthenticated, (req, res) =>
  res.render('stories/edit')
)

module.exports = router
