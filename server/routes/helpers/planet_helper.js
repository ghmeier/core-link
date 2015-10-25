var Planet = require("../../models/Planet.js");

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

        this.makePlanet(size,res.query.connect,function(planet){
            res.json({success:true,message:"success",data:planet});
        });

    }

    this.makePlanet = function(name,size,connect,callback){
        var refId = fb_root.child("planets").push().key();
        var resources = this.getResources(size);
        var connections = [];
        if (connect){
            connections = this.getConnections();
        }

        var planet = {
            "id" : refId,
            "connections": connections,
            "colonies": [],
            "size":size,
            "resources":resources,
            "name":name
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

    this.getConnections = function(){

    }

}