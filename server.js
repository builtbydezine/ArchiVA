const path = require("path")
const express = require("express")
const layout = require('express-layout')
const ejs = require("ejs")
const config = require('./config/security')

// middlewares
const helmet = require('helmet')
//const partials = require("express-partials")
const logger = require("morgan")
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')

// Setting up the port
const port = config.server.port;

// import routes
const routes = require("./routes")

const app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// Include partials middleware into the app
const middleware = [
  helmet(),
  layout(),
  
  // adding root path
  express.static(path.join(__dirname, 'public')),

  //partials(),
  
  // adding logs
  logger("dev"),
  
  // Adding body-parser
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  
  // adding express validator
  expressValidator(),
  cookieParser(),
  session({
    secret: config.session.secretKey,
    key: config.session.secretCookie,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }),
  flash()
]
app.use(middleware)

// serving
app.use("/", routes)

// error handlers
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(400).send(failed)
})

var server = app.listen(port, () => {
  console.log("Hey! We are listening on " + server.address().port)
})
