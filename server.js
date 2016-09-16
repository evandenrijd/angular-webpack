var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');

var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//FIXME: jwtSecret should be somewhere securely
var jwtSecret = 'aalskfasd;lkfj;kljoiurqwelrk1,m34r1;should be stored securely.';

var proxy = httpProxy.createProxyServer();
var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));
app.use(bodyParser.json());
// app.use(expressJwt({ secret: jwtSecret }).unless({ path: [ '/login' ]}));

// We only want to run the workflow when not in production
if (!isProduction) {
  var bundle = require('./bundle.js');
  bundle();
  // Any requests to localhost:3000/dist is proxied
  // to webpack-dev-server
  app.all('/dist/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://localhost:8080'
    });
  });
}

//FIXME: access the user db
var user = {
  username: 'eduv',
  password: 'p'
};

app.post('/login', authenticate, function (req, res) {
  var token = jwt.sign({
    username: user.username
  }, jwtSecret);
  res.send({
    token: token,
    user: user
  });
});

app.get('/me', function (req, res) {
  res.send(req.user);
});

function authenticate(req, res, next) {
  var body = req.body;
  if (!body.username || !body.password) {
    res.status(400).end('Must provide username or password');
  } else if (body.username !== user.username || body.password !== user.password) {
    res.status(401).end('Username or password incorrect');
  } else {
    next();
  }
}

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

//Following is better seen from google chrome devtools|network
// proxy.on('proxyRes', function (proxyRes, req, res) {
//   console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
// });

app.listen(port, function () {
  console.log('Server running on port ', port);
});
