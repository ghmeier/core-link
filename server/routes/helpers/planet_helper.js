var Planet = require("../../models/Planet.js");
var Upgrade = require("../../models/Upgrade.js");
var Fleet = require("../../models/Fleet.js");

module.exports = function PlanetHelper(fb_root)
{
    var helper = this;
    this.res_data = {
        "steel":{
            mod:0.1
        },
        "copper":{
            mod:0.1
        },
        "aluminium":{
            mod:0.1
        },
        "water":{
            mod:0.1
        },
        "protein":{
            mod:0.1
        },
        "oil":{
            mod:0.1
        },
        "coal":{
            mod:0.1
        },
        "uranium":{
            mod:0.1
        }
    };
    var res_min = [1,2,3,5,7];

    this.fb_root = fb_root;

    this.new_planet = function(req,res){
        var size = this.getSize(parseInt(req.query.size_mod));

        if (!size){
            res.json({success:false,message:"Must provide a size for a planet."});
            return;
        }

        this.makePlanet(size,res.query.connect,res.query.discoverer,res.query.parentId,function(planet){
            res.json({success:true,message:"success",data:planet});
        });

    }

    this.upgrade = function(req,res){
        var id = req.params.id;
        var upgrade_id = req.params.upgrade_id;
        var fleet_id = req.query.fleet_id;

        if (!fleet_id){
            res.json({success:false,message:"Must provide a fleet id."});
            return;
        }

        if (!id){
            res.json({success:false,message:"Must provide a planet id."});
            return;
        }

        if (!upgrade_id){
            res.json({success:false,message:"Must provide an upgrade id."});
            return;
        }

        var upgrade = new Upgrade(fb_root,upgrade_id,"planet",function(upgrade){
            if (!upgrade.data){
                res.json({success:false,message:"Upgrade does not exist."});
                return;
            }

            var upgrade_id = upgrade.data.id;
            var up_data = upgrade.data;
            var planet = new Planet(fb_root,id,function(planet){
                if (!planet.data){
                    res.json({success:false,message:"Planet with id "+id+" does not exist."});
                    return;
                }

                if (!planet.data.upgrades){
                    planet.data.upgrades = {};
                }

                var fleet = new Fleet(fb_root,fleet_id,function(fleet){
                    if (!fleet.data){
                        res.json({success:false,message:"Fleet with id "+fleet_id+" does not exist."});
                        return;
                    }

                    var to_up = planet.data.upgrades[upgrade_id] || {level:0};

                    var cost_mult = parseInt(up_data.cost_multiplier);
                    var calc_cost = {};
                    for (id in up_data.cost){
                        var cost = Upgrade.calcMod(parseInt(up_data.cost[id]),cost_mult,to_up.level);

                        if (cost > fleet.data.resources[id]){
                            res.json({success:true,message:"Not enough "+id+" to purchase."});
                            return;
                        }

                        calc_cost[id] = cost;

                    }

                    for (id in calc_cost){
                        fleet.data.resources[id] -= calc_cost[id];
                    }

                    var result_multiplier = up_data.result_multiplier;
                    for (id in up_data.result){

                        var calc_reward = Upgrade.calcMod(parseInt(up_data.result[id]),
                                parseInt(result_multiplier),to_up.level);

                        if (helper.res_data[id]){
                            for (i=0;i<planet.data.resources.length;i++){
                                if (planet.data.resources[i].type === id){
                                    planet.data.resources[i].mod += calc_reward;
                                    break;
                                }
                            }
                        }else{
                            planet.data[id] += calc_reward;
                        }

                    }

                    planet.data.upgrades[upgrade_id] = {level:to_up.level+1};
                    planet.update(planet.data,function(p_err){
                        if (!p_err){
                            res.json({success:false,message:"unable to update",data:p_err});
                            return;
                        }

                        fleet.update(fleet.data,function(err){
                            if (!err){
                                res.json({success:false,message:"unable to update",data:err});
                                return;
                            }

                            res.json({success:true,data:planet.data});
                        });
                    });

                });

            });

        });

    }

    this.makePlanet = function(name,size,connect,discoverer,parentId,callback){
        var refId = fb_root.child("planets").push().key();
        var resources = this.getResources(size);
        var connections = [];
        if (connect){
            connections = this.getConnections(parentId);
        }

        var planet = {
            "id" : refId,
            "connections": connections,
            "colonies": [],
            "size":size,
            "resources":resources,
            "name":name,
            "discoverer":discoverer
        };

        fb_root.child("planets").child(refId).set(planet);

        callback(planet);
    }

    this.get_planet = function(req,res){
        var id = req.params.id;

        if (id == undefined || id == ""){
            res.json({success:true,message:"Must provide planet id."});
            return;
        }

        fb_root.child("planets").child(id).once("value",function(snap){
            if (!snap || !snap.val()){
                res.json({success:false,message:"Planet does not exist."});
                return;
            }

            res.json({success:true,data:snap.val()});
        });
    }

    this.getSize = function(size_mod){
        if (!size_mod){
            size_mod = 1;
        }

        var chance = Math.floor(Math.random() * 1000) + size_mod;

        if (chance < 500){
            return 0;
        }else if(chance < 800){
            return 1;
        }else if(chance < 900){
            return 2;
        }else if (chance < 980){
            return 3;
        }else{
            return 4;
        }
    }

    this.getResources = function(size){
        var resName = Object.keys(this.res_data);

        var resNum = res_min[size];
        var resNew = [];

        for (i=0;i<resNum;i++){
            var current = {};
            current.type = resName[Math.floor(Math.random()*resName.length)];
            current.abundance = this.res_data[current.type].mod + Math.random();
            current.mod = 1;
            resNew.push(current);
        }

        return resNew;
    }

    this.getConnections = function(parentId){
        var connections = [parentId];

        return connections;
    }

}