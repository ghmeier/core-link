//var Planet = require("../../models/Upgrade.js");

module.exports = function UpgradeHelper(fb_root)
{
    var helper = this;
    this.fb_root = fb_root;

    this.get_fleet = function(req,res){
        fb_root.child("fleet_upgrades").once("value",function(snap){
            res.json({success:true,data:snap.val()});
        });
    }

    this.new_fleet = function(req,res){
        this.new_upgrade("fleet",req,function(data){
            res.json({success:true,data:data});
        });
    }

    this.new_upgrade = function(type,req,callback){
        var refId = fb_root.child(type+"_upgrades").push().key();

        var data = JSON.parse(Object.keys(req.body));
        data.id = refId;
        fb_root.child(type+"_upgrades").child(refId).set(data);

        callback(data);
    }

    this.get_fleet_id = function(req,res){
        var id = req.query.id;

        if (!id || id == ""){
           res.json({success:false,message:"Id is required."});
        }

        fb_root.child("fleet_upgrades").child(id).once("value",function(snap){
            res.json({success:true,data:snap.val()});
        });
    }

    this.get_ship = function(req,res){
        fb_root.child("ship_upgrades").once("value",function(snap){
            res.json({success:true,data:snap.val()});
        });
    }

    this.new_ship = function(req,res){
        this.new_upgrade("ship",req,function(data){
            res.json({success:true,data:data});
        });
    }

    this.get_ship_id = function(req,res){
        var id = req.query.id;

        if (!id || id == ""){
           res.json({success:false,message:"Id is required."});
        }

        fb_root.child("ship_upgrades").child(id).once("value",function(snap){
            res.json({success:true,data:snap.val()});
        });
    }

    this.get_planet_id = function(req,res){
        var id = req.query.id;

        if (!id || id == ""){
           res.json({success:false,message:"Id is required."});
        }

        fb_root.child("planet_upgrades").child(id).once("value",function(snap){
            res.json({success:true,data:snap.val()});
        });
    }

    this.get_planet = function(req,res){
        fb_root.child("planet_upgrades").once("value",function(snap){
            res.json({success:true,data:snap.val()});
        });
    }

    this.new_planet = function(req,res){
        this.new_upgrade("planet",req,function(data){
            res.json({success:true,data:data});
        });
    }
}