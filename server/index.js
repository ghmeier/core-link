var express = require("express");
var secrets = require("./config/secrets");
var swig = require("swig");
var lodash = require("lodash");
var path = require("path");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
var session = require("express-session");
var passport = require("passport");
var favicon = require("serve-favicon");
var Firebase = require("firebase");

var cors = require("cors");
var corsOptions = {
	origin : "*"
};


var fb_root = new Firebase("https://core-link.firebaseio.com");
var app = express();

//Helpers
var FleetHelper = require("./routes/helpers/fleet_helper.js");
var PlanetHelper = require("./routes/helpers/planet_helper.js");
var UpgradeHelper = require("./routes/helpers/upgrade_helper.js");

app.engine("html",swig.renderFile);
app.set("views",path.join(__dirname,"views"));
app.set("view engine","html");
app.locals._ = lodash;

//app.use(favicon(path.join(__dirname + " /../public/favicon.ico")));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(session({
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 60 * 1000
	},
	secret: secrets.sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));

var routes = require("./routes.js");

require('./routes/fleet.js')(app, FleetHelper,fb_root);
require('./routes/planet.js')(app, PlanetHelper,fb_root);
require('./routes/upgrade.js')(app, UpgradeHelper,fb_root);
routes(app,passport);

module.exports = app;
