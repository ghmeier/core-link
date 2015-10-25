var Fleet = require("../../models/Fleet.js");
var PlanetHelper = require("./planet_helper.js");

module.exports = function FleetHelper(fb_root)
{
	var helper = this;
    this.fb_root = fb_root;

    this.get_fleet_by_id = function(req,res){
        var name = req.query.name;

        if (name == undefined || name == "" || !/[0-9a-zA-Z]/.test(name)){
            res.json({success:false,message:"Invalid fleet name."});
            return;
        }

        fb_root.child("names").child(name).once("value",function(snap){
            if (!snap || !snap.val()){
                res.json({success:false,message:"Fleet named "+name+" does not exist."})
                return;
            }

            fb_root.child("fleets").child(snap.val()).once("value",function(snapshot){

                res.json({success:true,data:snapshot.val()});
            });

        });

    }

    this.get_fleet = function(req,res){
        var id = req.params.id;

        if (id == undefined || id == ""){
            res.json({success:false,message:"Must provide a valid id."});
        }

        fb_root.child("fleets").child(id).once("value",function(snap){
            if (!snap || !snap.val()){
                res.json({success:false,message:"Fleet with id "+id+" does not exist."});
                return;
            }

            res.json({success:true,data:snap.val()});
        });
    }

    this.add_resource = function(req,res){
        var id = req.params.id;
        var type = req.query.type;
        var amount = parseInt(req.query.amount);

        var planetHelper = new PlanetHelper(fb_root);

        if (!id || id == ""){
            res.json({success:false,message:"Must provide id."});
            return;
        }

        if (!type || !planetHelper.res_data[type]){
            res.json({success:false,message:"type must be "+Object.keys(planetHelper.res_data).join(",")});
        }

        var fleet = new Fleet(fb_root,id,function(fleet){
            fleet.data.resources[type] += amount;
            fleet.set("resources",fleet.data.resources);

            res.json({success:true,data:fleet.data});
        });
    }

    this.new_fleet = function(req,res){
        var name = req.query.name;

        if (name == undefined || name == "" || !/[0-9a-zA-Z]/.test(name)){
            res.json({success:false,message:"Creating a fleet requires a name that is alphanumeric and _."});
            return;
        }

        var planetHelper = new PlanetHelper(fb_root);
        planetHelper.makePlanet(name+"'s home world",0,false,function(planet){
            var planetId = planet.id;
           fb_root.child("names").child(name).once("value",function(snap){

                if(snap.val() != null){
                    res.json({success:false,message:"Name "+name+" already exists."});
                    return;
                }

                var refId = fb_root.child("fleets").push().key();

                var fleet = {
                    "id" : refId,
                    "current_planet":planetId,
                    "fuel" : 0,
                    "ships": [Fleet.makeShip("basic")],
                    "search_bonus":0,
                    "tech_level":0,
                    "colonies": [],
                    "resources":{
                        "copper":0,
                        "steel":0,
                        "aluminium":0,
                        "oil":0,
                        "coal":0,
                        "uranium":0,
                        "water":0,
                        "protein":0,
                        "dna":0,
                        "rare":0
                    },
                    "name":name
                };

                fb_root.child("names").child(name).set(refId);
                fb_root.child("fleets").child(refId).set(fleet);

                res.json({success:true,message:"success",data:fleet});
            });
        });
    }

    this.add_ship = function(req,res){
        var id = req.params.id;

        if (!id){
            res.json({success:false,message:"Must provide fleet id."});
            return;
        }

        var fleet = new Fleet(fb_root,id,function(fleet){
            var ships = fleet.get("ships") || [];
            ships.push(Fleet.makeShip("basic"));
            fleet.set("ships",ships);

            res.json({success:true,data:fleet.data});

        });
    }

    this.update_fleet = function(req,res){
        var id = req.params.id;

        if (!id){
            res.json({success:false,message:"Must provide a fleet id."});
        }

        var fleet = new Fleet(fb_root,id,function(fleet){
            fleet.update(fleet.data);
            res.json({success:true,data:fleet.data});
        })
    }

    this.upgrade = function(req,res){

    }

    this.upgrade_ship = function(req,res){

    }

    this.get_ship = function(req,res){
        var id = req.params.id;

        if (!id){
            res.json({success:false,message:"Must provide a fleet id."});
        }

        var position = parseInt(req.params.position);

        if (!position){
            res.json({success:false,message:"Must provide a ship position."});
        }

        var fleet = new Fleet(fb_root,id,function(fleet){
            if (position < 0 || position >= fleet.data.ships.length){
                res.json({success:false,message:"Invalid position. You don't have that many ships."});
            }

            res.json({success:true,data:fleet.data.ships[position]});
        });
    }

    this.get_ships = function(req,res){
        var id = req.params.id;

        if (!id){
            res.json({success:false,message:"Must provide a fleet id."});
        }

        var fleet = new Fleet(fb_root,id,function(fleet){
            res.json({success:true,data:fleet.data.ships});
        });
    }

    this.add_harvester = function(req,res){

    }

}