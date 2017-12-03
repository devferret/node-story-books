const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.get('/', (req, res) => res.send('Work!'))

const PORT = process.env.PORT || 5555
app.listen(PORT, () => console.log(`App listening on ${PORT}...`))
