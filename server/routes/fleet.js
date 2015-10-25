module.exports = function(app, FleetHelper, fb_root){
	//Class with methods to help take the load off the endpoints
	var fleetHelper = new FleetHelper(fb_root);
    var path = "/fleet/";
    var ship_path = path+":id/ships/";
    app.get(path+"new",function(req,res){
        fleetHelper.new_fleet(req,res);
    });
    app.get(path+":id/add_ship",function(req,res){
        fleetHelper.add_ship(req,res);
    });
    app.post(path+":id/update",function(req,res){
        fleetHelper.update_fleet(req,res);
    });
    app.get(path+":id/add_resource",function(req,res){
        fleetHelper.add_resource(req,res);
    });
    app.get(path+":id/upgrade",function(req,res){
        fleetHelper.upgrade(req,res);
    });
    app.get(ship_path,function(req,res){
        fleetHelper.get_ships(req,res);
    });
    app.get(ship_path+":position",function(req,res){
        fleetHelper.get_ship(req,res);
    });
    app.get(ship_path+":position/upgrade",function(req,res){
        fleetHelper.upgrade_ship(req,res);
    });
    app.get(ship_path+":position/add_harvester",function(req,res){
        fleetHelper.add_harvester(req,res);
    })
    app.get(path+":id",function(req,res){
        fleetHelper.get_fleet(req,res);
    });
    app.get(path,function(req,res){
        fleetHelper.get_fleet_by_id(req,res);
    });
}