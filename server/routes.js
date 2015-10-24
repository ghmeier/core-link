var secrets = require("./config/secrets");
var Firebase = require("firebase");
var path = require("path");

module.exports = function(app,passport){
	var fb_root = new Firebase("https://core-link.firebaseio.com");

    app.get("/ping",function(req,res){

		res.send("pong");
	});

    app.get("*",function(req,res){
        res.sendFile(path.resolve(__dirname+"/../public/index.html"));
    });

};
