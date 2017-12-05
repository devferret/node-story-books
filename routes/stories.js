const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { ensureAuthenticated } = require('../helper/auth')

const Story = mongoose.model('story')
const User = mongoose.model('story')

router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('owner')
    .then(stories => {
      res.render('stories/index', { stories: stories })
    })
})

router.get('/show/:id', (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate('owner')
    .then(story => {
      Story.find({ owner: story.owner.id }).then(stories => {
        res.render('stories/story', { story: story, ownerStories: stories })
      })
    })
    .catch(err => console.log(err))
})

router.get('/add', ensureAuthenticated, (req, res) => res.render('stories/add'))

router.get('/edit/:id', ensureAuthenticated, (req, res) =>
  Story.findOne({ _id: req.params.id }).then(story => {
    res.render('stories/edit', { story: story })
  })
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

router.put('/:id', (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    const allowComments = req.body.allowComments ? true : false

    // Updating
    story.title = req.body.title
    story.body = req.body.body
    story.status = req.body.status
    story.allowComments = allowComments

    story.save().then(story => res.redirect('/dashboard'))
  })
})

router.delete('/:id', (req, res) => {
  Story.remove({ _id: req.params.id }).then(() => res.redirect('/dashboard'))
})

module.exports = router
