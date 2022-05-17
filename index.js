const express = require('express')
const app = express()
const port = 8000
const db = require('./Helper/Connect')

const Auth = require('./Routes/Authentication')
db.DbConection()
app.use(express.json())
app.use('/api', Auth)

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})