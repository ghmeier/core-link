var Upgrade;

function Upgrade(fb_root,id,type,callback){
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

Upgrade.prototype.getFirebaseLocation = function(type){
    return this.fb_root.child(type+"_upgrades").child(this.id);
}

Upgrade.calcMod = function(val,modifier,iters){
        if (iters == 0){
            return val;
        }

        return Upgrade.calcMod(val,modifier,iters-1)*modifier;
}

module.exports = Upgrade;