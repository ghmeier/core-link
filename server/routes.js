var secrets = require("./config/secrets");

module.exports = function(app,passport){
	app.get("/ping",function(req,res){

		res.send("pong");
	});

};
