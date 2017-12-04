const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { ensureAuthenticated } = require('../helper/auth')

const Story = mongoose.model('story')

router.get('/', (req, res) => res.render('stories/index'))

router.get('/add', ensureAuthenticated, (req, res) => res.render('stories/add'))

router.get('/edit', ensureAuthenticated, (req, res) =>
  res.render('stories/edit')
)

router.post('/', (req, res) => {
  const allowComments = req.body.allowComments ? true : false

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    owner: req.user.id
  }

  new Story(newStory)
    .save()
    .then(story => res.redirect(`/stories/show/${story.id}`))
})

module.exports = router
