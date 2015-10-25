var Fleet = require("../../models/Fleet.js");

module.exports = function FleetHelper(fb_root)
{
	var helper = this;
    this.fb_root = fb_root;

    this.new_fleet = function(req,res){
        var refId = fb_root.child("fleets").push().key();

        var name = req.query.name;

        if (name == undefined || name == ""){
            res.json({success:false,message:"Creating a fleet requires a name."});
            return;
        }

        var fleet = {
            "id" : refId,
            "fuel" : 0,
            "ships": [Fleet.makeShip("basic")],
            "colonies": [],
            "resources":{
                "copper":0,
                "steel":0,
                "aluminum":0,
                "oil":0,
                "coal":0,
                "uranium":0,
                "water":0,
                "protein":0
            },
            dna:0,
            name:name
        };

        fb_root.child("fleets").child(refId).set(fleet);

        res.json({success:true,message:"success",data:fleet});
    }

    this.add_ship = function(req,res){
        var id = req.params.id;

        if (!id){
            res.json({success:false,message:"Must Provide ship id."});
            return;
        }

        var fleet = new Fleet(fb_root,id,function(fleet){
            var ships = fleet.get("ships") || [];
            ships.push(Fleet.makeShip("basic"));
            fleet.set("ships",ships);

            res.json({success:true,data:fleet.data});

        });
    }
}