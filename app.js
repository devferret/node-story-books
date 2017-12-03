const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

// Passport config
require('./config/passport')(passport)

// Load routes
const auth = require('./routes/auth')

// Load keys
const keys = require('./config/keys')

// Map global promise
mongoose.Promise = global.Promise

// MongoDB connect
mongoose
  .connect(keys.mongoURI, { useMongoClient: true })
  .then(() => console.log('...MongoDB connected'))
  .catch(err => console.log(err))

const app = express()
app.get('/', (req, res) => res.send('Work!'))
app.use('/auth', auth)

const PORT = process.env.PORT || 5555
app.listen(PORT, () => console.log(`...App listening on ${PORT}`))
