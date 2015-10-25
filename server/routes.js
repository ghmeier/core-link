var secrets = require("./config/secrets");
var path = require("path");

module.exports = function(app,passport){


    app.get("/ping",function(req,res){

		res.send("pong");
	});

    app.get("*",function(req,res){
        res.sendFile(path.resolve(__dirname+"/../public/index.html"));
    });

};
