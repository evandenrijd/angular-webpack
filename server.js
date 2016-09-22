import fileCtor from './src/common/file_ctor.plain';
import settingsCtor from './src/common/settings_ctor.plain';

let settingsApi = function _settingsCtor() {
  let self = {};
  let file = fileCtor({filename: 'data/settings.json', 
                       enc: 'utf8'});
  console.log('loading: ', file.filename);
  _load().then(data => { //already catching load errors during startup
    settingsCtor(data).check().catch(err => {
      console.error(err);
      process.exit(1);
    });
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });

  //Public API
  self.get = get;
  self.set = set;
  self.hasUserAdminRole = hasUserAdminRole;

  return self;

  function get() {
    return _load();
  }

  function set(data) {
    console.log('data:', data);
    return new Promise((resolve, reject) => {
      settingsCtor(data).check().then(dummy => {
        _store(data).then(dummy => {
          console.log('stored settings');
          resolve(self);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  function hasUserAdminRole(user) {
    return new Promise((resolve, reject) => {
      _load().then(data => {
        resolve(settingsCtor(data).hasUserAdminRole(user));
      }).catch(err => {
        reject(err);
      });
    });
    return
  }

  function _load() {
    return new Promise((resolve, reject) => {
      file.readJSON().then(data => {
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  function _store(data) {
    return file.writeJSON(data);
  }

}();

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
console.log('serving: ', publicPath);

app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(expressJwt({ secret: jwtSecret }).unless({
  path: [
      /\/dist\/.*/,             //Need the app.bundle.js and app.*.hot-fixes.js
                                //before login
      /\/data\/languages\/.*/,  //Need languages before login
    '/login']                   //Need login API before login
}));

// We only want to run the workflow when not in production
if (!isProduction) {
  console.info('Enable proxy to webpack-dev-server');
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
  settingsApi.hasUserAdminRole(user).then(hasAdminRole => {
    if (hasAdminRole) {
      let days = 24*60*60; //one day in seconds
      let token = jwt.sign({
        username: user.username
      }, jwtSecret, {
        expiresIn: 3*days, //expiresIn seconds
      }, (err, token) => {
        if (err) {
          res.status(500).end(err);
        } else {
          res.send({
            token: token,
            user: user
          });
        }
      });
    } else {
      let err = 'User ' + user.username + ' has no admin role'
      console.error(err);
      res.status(500).end(err);
    }
  }).catch(err => {
    console.error(err);
    res.status(500).end(err);
  });
});

app.get('/me', function (req, res) {
  console.log('req: ', req.user);
  res.send(req.user);
});

app.get('/settings', function (req, res) {
  settingsApi.get().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).end(err);
  });
});

app.post('/settings', function (req, res) {
  let body = req.body;
  settingsApi.set(body).then(dummy => {
    settingsApi.get().then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).end(err);
    });
  }).catch(err => {
    res.status(500).end(err);
  });
});

function authenticate(req, res, next) {
  let body = req.body;
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

//Following logging is better seen from google chrome devtools|network
// proxy.on('proxyRes', function (proxyRes, req, res) {
//   console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
// });

app.listen(port, function () {
  console.log('Server running on port:', port);
});
