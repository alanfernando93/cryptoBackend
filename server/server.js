'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var sockets = require('socket.io');

var app = module.exports = loopback();

var cookieParser = require('cookie-parser');
var session = require('express-session');

// Passport configurators..
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

var bodyParser = require('body-parser');
var flash = require('express-flash');

// attempt to build the providers/passport config
var config = {};
try {
  config = require('../providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal
}

app.start = () => {
  // start the web server
  return app.listen(() => {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
  if (err) throw err;
});

// start the server if `$ node server.js`

if (require.main === module) {
  // app.start();
  app.io = sockets(app.start());
  app.io.on('connection', (socket) => {
    console.log('a user connected');
    console.log('id : ' + socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('message', (message) => {
      console.log('Message received: ' + message);
      app.io.emit('message', { type: 'news-message', text: message });
    });
  });
}

// The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.AccessToken,
}));

app.middleware('session:before', cookieParser(app.get('cookieSecret')));
app.middleware('session', session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
}));
passportConfigurator.init();

// We need flash messages to see passport errors
app.use(flash());

passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential,
});
for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}
