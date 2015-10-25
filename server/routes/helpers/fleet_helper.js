var Fleet = require("../../models/Fleet.js");
var Upgrade = require("../../models/Upgrade.js");
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

            var id = snap.val();

            var fleet = new Fleet(fb_root,id,function(fleet){
                if (!fleet.data){
                    res.json({success:false,message:"Fleet with id "+id+" does not exist."});
                    return;
                }

                res.json({success:true,data:fleet.data});
            });

        });

    }

    this.get_fleet = function(req,res){
        var id = req.params.id;

        if (id == undefined || id == ""){
            res.json({success:false,message:"Must provide a valid id."});
        }

        var fleet = new Fleet(fb_root,id,function(fleet){
            if (!fleet.data){
                res.json({success:false,message:"Fleet with id "+id+" does not exist."});
                return;
            }

            res.json({success:true,data:fleet.data});
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
            if (!fleet.data){
                res.json({success:false,message:"Fleet with id "+id+" does not exist."});
                return;
            }

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
            if (!fleet.data){
                res.json({success:false,message:"Fleet with id "+id+" does not exist."});
                return;
            }

            var ships = fleet.get("ships") || [];
            ships.push(Fleet.makeShip("basic"));
            fleet.set("ships",ships);

            res.json({success:true,data:fleet.data});

        });
    }

    this.update_fleet = function(req,res){
        var id = req.params.id;
        var data = req.body;

        if (!id){
            res.json({success:false,message:"Must provide a fleet id."});
            return;
        }

        if (!data){
            res.json({success:false,message:"No new data."});
            return;
        }

        var fleet = new Fleet(fb_root,id,function(fleet){
            if (!fleet.data){
                res.json({success:false,message:"Fleet with id "+id+" does not exist."});
                return;
            }

            fleet.update(data,function(val){
                if (!val){
                    res.json({success:true,data:data});
                }else{
                    res.json({success:false,message:"Can't update firebase."});
                }
            });
        });
    }

    this.upgrade = function(req,res){
        var id = req.params.id;

        if (!id){
            res.json({success:false,message:"Must provide a fleet id."});
            return;
        }

        var upgrade = new Upgrade(fb_root,id,"fleet",function(upgrade){
            if (!upgrade.data){
                res.json({success:false,message:"Upgrade does not exist."});
                return;
            }

            var upgrade_id = upgrade.data.id;
            var up_data = upgrade.data;
            var fleet = new Fleet(fb_root,id,function(fleet){
                if (!fleet.data){
                    res.json({success:false,message:"Fleet with id "+id+" does not exist."});
                    return;
                }

                if (!fleet.data.upgrades){
                    fleet.data.upgrades = {};
                }

                var to_up = fleet.data.upgrades[upgrade_id] || {level:0};

                var cost_mult = parseInt(up_data.cost_multiplier);
                var calc_cost = {};
                for (id in up_data.cost){
                    var cost = calcMod(parseInt(up_data.cost[id]),cost_mult,to_up.level);

                    if (cost > fleet.data.resources[id]){
                        res.json({success:true,message:"Not enough "+id+" to purchase."});
                        return;
                    }

                    calc_cost[id] = cost;

                }

                for (id in calc_cost){
                    fleet.data.resources[id] - calc_cost[id];
                }

                for (id in up_data.result){
                    var parsed_id = id.split("-");

                    var calc_reward = calcMod(parseInt(up_data.result[id]),
                            parseInt(result_multiplier),to_up.level);

                    if (parsed_id[0] == "resources" && parsed_id.length > 1){
                        fleet.data.resources[parsed_id[1]] += calc_reward;
                    }else{
                        fleet.data[parsed_id[0]] += calc_reward;
                    }

                }

                fleet.data.upgrades[upgrade_id] = {level:to_up.level+1};
                fleet.update(fleet.data);
                res.json({success:true,data:fleet.data});
            });

        });

    }

    this.calcMod = function(val,modifier,iters){
        if (iters == 0){
            return val;
        }

        return calcMod(val,modifier,iters-1)*modifier;
    }

    this.upgrade_ship = function(req,res){

    }

    this.get_ship = function(req,res){
        var id = req.params.id;

        if (!id){
            res.json({success:false,message:"Must provide a fleet id."});
            return;
        }

        if (!req.params.position){
            res.json({success:false,message:"Must provide a ship position."});
            return;
        }

        var position = parseInt(req.params.position);

        var fleet = new Fleet(fb_root,id,function(fleet){
            if (position < 0 || position >= fleet.data.ships.length){
                res.json({success:false,message:"Invalid position. You don't have that many ships."});
                return;
            }

            res.json({success:true,data:fleet.data.ships[position]});
        });
    }

    this.get_ships = function(req,res){
        var id = req.params.id;

        if (!id){
            res.json({success:false,message:"Must provide a fleet id."});
            return;
        }

        var fleet = new Fleet(fb_root,id,function(fleet){
            res.json({success:true,data:fleet.data.ships});
            return;
        });
    }

    this.add_harvester = function(req,res){
        var id = req.params.id;

        if (!id){
            res.json({success:false,message:"Must provide a fleet id."});
            return;
        }

        if (!req.params.position){
            res.json({success:false,message:"Must provide a ship position."});
            return;
        }

        var position = parseInt(req.params.position);


        var fleet = new Fleet(fb_root,id,function(fleet){
            if (position < 0 || position >= fleet.data.ships.length){
                res.json({success:false,message:"Invalid position. You don't have that many ships."});
                return;
            }

            var ship = fleet.data.ships[position];
            if (!ship.harvesters){
                ship.harvesters = [];
            }

            ship.harvesters.push(Fleet.makeHarvester());
            fleet.set("ships",fleet.data.ships);

            res.json({success:true,data:fleet.data});
        });
    }

}