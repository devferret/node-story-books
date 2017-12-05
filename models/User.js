const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  socialID: {
    type: String,
    required: true
  },
  social: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  image: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('user', UserSchema)
