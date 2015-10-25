module.exports = function(app, FleetHelper, fb_root){
	//Class with methods to help take the load off the endpoints
	var fleetHelper = new FleetHelper(fb_root);
    var path = "/fleet/";
    app.get(path+"new",function(req,res){
        fleetHelper.new_fleet(req,res);
    });
    app.get(path+":id/add",function(req,res){
        fleetHelper.add_ship(req,res);
    });
    app.get(path+":id",function(req,res){
        fleetHelper.get_fleet(req,res);
    });
    app.get(path,function(req,res){
        fleetHelper.get_fleet_id(req,res);
    });
}