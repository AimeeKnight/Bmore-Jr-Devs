var express = require('express');
var app = express();
var pg = require('pg');

//app.set('port', (process.env.PORT || 5000));
var port = process.env.PORT || 5000;

var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.set('views', __dirname + '/public');
app.set('view engine', 'jade');

app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

app.route('/')
  .get(function(request, response) {
    response.render('index2');
    //response.send('Hello World!');
  });

app.route('/db')
  .get(function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT * FROM test_table', function(err, result) {
        done();
        if (err) {
          console.error(err); response.send("Error " + err);
        } else {
          response.send(result.rows);
        }
      });
    });
  });

app.listen(port, function() {
  console.log("Node app is running at localhost:" + port);
});

module.exports = app;

