//requiring modules
var express = require('express');
var app = express();
var bodyparse = require('body-parser');


//middlewares
app.use(bodyparse.urlencoded({extended:true}));
app.use(bodyparse.json());
app.use(bodyparse.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

//template - ejs
app.set('view engine', 'ejs');

//GET req
app.get('/',(req, res) => {
    res.render('home');
});

app.get('/pad/:name', (req, res) => {

  var name = req.path.substring(5);
  res.render('editor', { padname: name });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

//POST req


//Setting up redistogo
var redisClient;
if(process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
  redisClient = require("redis").createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(":")[1]);
}
else {
  redisClient = require("redis").createClient();
}

//setting up sharejs for REALTIME COMMUNICATION
var sharejs = require('share');
var opts = {
  db: {type: 'redis', client: redisClient}
};

sharejs.server.attach(app, opts);

//Starting server
var port = process.env.PORT || 4000;
app.listen(port);
