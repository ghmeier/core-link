var Planet = require("../../models/Planet.js");

module.exports = function PlanetHelper(fb_root)
{
    var helper = this;
    var resources = {
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
    var res_min = [1,2,4,6,8];

    this.fb_root = fb_root;

    this.new_planet = function(req,res){
        var refId = fb_root.child("planets").push().key();
        var size = Math.floor(Math.random()*5);

        var planet = {
            "id" : refId,
            "connections": [],
            "colonies": [],
            "size":size,
            "resources":this.getResources(),

        };

        fb_root.child("planets").child(refId).set(planet);

        res.json({success:true,message:"success",data:planet});

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

    this.getResources = function(size){
        var resName = Object.keys(resources);

        var resNum = res_min[size];
        var resNew = [];

        for (i=0;i<resNum;i++){
            var current = {};

            current.type = resName[Math.floor(Math.random()*resName.length)];
            current.abundance = resources[resName].mod + Math.random();
            resNew.push(current);

        }

        return resNew;
    }

}