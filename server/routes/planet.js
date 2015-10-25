module.exports = function(app, PlanetHelper, fb_root){
    //Class with methods to help take the load off the endpoints
    var planetHelper = new PlanetHelper(fb_root);
    var path = "/planet/";
    app.get(path+"new",function(req,res){
        planetHelper.new_planet(req,res);
    });
    app.get(path+":id",function(req,res){
        planetHelper.get_planet(req,res);
    });
}