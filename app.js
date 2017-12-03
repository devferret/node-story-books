const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()

// Load user model
require('./models/User')

// Load passport config
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

app.use(cookieParser())
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Declare local variable
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// Config routes
app.get('/', (req, res) => res.send('Work!'))
app.use('/auth', auth)

// Config port
const PORT = process.env.PORT || 5555
app.listen(PORT, () => console.log(`...App listening on ${PORT}`))
