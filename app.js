const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const bodyParser = require('body-parser')

// Load models
require('./models/User')
require('./models/Story')

// Load passport config
require('./config/passport')(passport)

// Load routes
const index = require('./routes/index')
const auth = require('./routes/auth')
const stories = require('./routes/stories')

// Load keys
const keys = require('./config/keys')

// Load Filter
const { truncate, stripTags } = require('./helper/filters')

const app = express()

// Map global promise
mongoose.Promise = global.Promise

// MongoDB connect
mongoose
  .connect(keys.mongoURI, { useMongoClient: true })
  .then(() => console.log('...MongoDB connected'))
  .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('views', './views')
app.set('view engine', 'pug')

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
  res.locals.truncate = truncate
  res.locals.stripTags = stripTags
  next()
})

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Config routes
app.use('/', index)
app.use('/auth', auth)
app.use('/stories', stories)

// Config port
const PORT = process.env.PORT || 5555
app.listen(PORT, () => console.log(`...App listening on ${PORT}`))
