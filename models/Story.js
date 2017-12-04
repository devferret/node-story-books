const mongoose = require('mongoose')

const StorySchema = {
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
      commentBody: {
        type: String,
        required: true
      },
      commentUser: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      createdDate: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now()
  }
}

module.exports = mongoose.model('story', StorySchema, 'stories')
