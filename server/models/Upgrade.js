var Upgrade;

function Fleet(fb_root,id,type,callback){
    this.id = id;
    this.data = {};
    this.fb_root = fb_root;
    var self = this;

    var upgrade = this.getFirebaseLocation(type);

    upgrade.on("value",function(snap){
        self.data = snap.val();
    });

    upgrade.once("value",function(snap){
        self.data = snap.val();
        callback(self);

    });
}

Fleet.prototype.getFirebaseLocation = function(){
    return this.fb_root.child(type+"_upgrades").child(this.id);
}