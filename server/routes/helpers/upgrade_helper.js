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
        var refId = fb_root.child("fleet_upgrades").push().key();

        console.log(req.body);
        var data = JSON.parse(req.body);

        fb_root.child("fleet_upgrades").child(refId).set(data);

        res.json({success:true,data:data});
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
        var refId = fb_root.child("ship_upgrades").push().key();

        var data = req.body;

        fb_root.child("ship_upgrades").child(refId).set(data);

        res.json({success:true,data:data});
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
        var refId = fb_root.child("planet_upgrades").push().key();

        var data = req.body;

        fb_root.child("planet_upgrades").child(refId).set(data);

        res.json({success:true,data:data});
    }
}