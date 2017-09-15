const express = require('express')
const bodyParser = require('body-parser')
const LoginApp = require('./index')
const opts = require('./src/opts')(process.argv, process.env)
const tokenSecret = process.env.LW_JWT_SECRET
const cookie = require('cookie')
const jsonwebtoken = require('jsonwebtoken')
const url = require('url')

let app = express()
app.use(bodyParser.json())

// use the LoginApp at '/'
app.use('/', LoginApp)

app.post('/verify', ( req, res ) => {
  const jwtCookie = req.body.token || cookie.parse(req.headers.cookie).jwt

  if (req.headers.referer) {
    const {protocol, hostname} = url.parse(req.headers.referer)
    const origin = `${protocol}//${hostname}`
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  }

  try {
    const decrypted = jsonwebtoken.verify(jwtCookie, tokenSecret)
    res.json(decrypted)
  } catch(error) {
    res.json({error: error.message })
  }
})

// start the server
app.listen(opts.port)
