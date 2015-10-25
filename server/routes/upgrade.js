module.exports = function(app, UpgradeHelper, fb_root){
    //Class with methods to help take the load off the endpoints
    var upgradeHelper = new UpgradeHelper(fb_root);
    var path = "/upgrades/";

    app.get(path+"fleet/:id",function(req,res){
        upgradeHelper.get_fleet_id(req,res);
    });

    app.get(path+"fleet",function(req,res){
        upgradeHelper.get_fleet(req,res);
    });

    app.post(path+"fleet",function(req,res){
        upgradeHelper.new_fleet(req,res);
    });

    app.get(path+"ship/:id",function(req,res){
        upgradeHelper.get_ship_id(req,res);
    });

    app.get(path+"ship",function(req,res){
        upgradeHelper.get_ship(req,res);
    });

    app.post(path+"ship",function(req,res){
        upgradeHelper.new_ship(req,res);
    });

    app.get(path+"planet/:id",function(req,res){
        upgradeHelper.get_ship_id(req,res);
    });

    app.get(path+"planet",function(req,res){
        upgradeHelper.get_planet(req,res);
    });

    app.post(path+"planet",function(req,res){
        upgradeHelper.new_planet(req,res);
    });
}