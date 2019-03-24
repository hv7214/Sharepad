//requiring modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

//Passport config
require('./configs/passport')(passport);

//DB config
const db = require('./configs/config').MongoURI;

//Mongo Connection
mongoose.connect(db, {
    useNewUrlParser: true
  })
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err));

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

//template - ejs
app.set('view engine', 'ejs');

//Routes
app.use('/', require('./routes/home.js'));
app.use('/users', require('./routes/users.js'));
app.use('/pad/:name', require('./routes/pad.js'));

//Session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));


//Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//Connect to flash
app.use(flash());

//flash-msg
app.use( function(req, res, next) {
  res.locals.error = req.flash('error');
  next();
});

//Setting up redistogo
var redisClient;
if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
  redisClient = require("redis").createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(":")[1]);
} else {
  redisClient = require("redis").createClient();
}

//setting up sharejs for REALTIME COMMUNICATION
var sharejs = require('share');
var opts = {
  db: {
    type: 'redis',
    client: redisClient
  }
};

sharejs.server.attach(app, opts);

//Starting server
var port = process.env.PORT || 4000;
app.listen(port);
