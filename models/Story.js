const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public'
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  comments: [
    {
      comment: {
        type: String,
        required: true
      },
      commentOwner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      createdDate: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  createdDate: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('story', StorySchema, 'stories')
