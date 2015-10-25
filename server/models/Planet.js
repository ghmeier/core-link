var Planet;

function Planet(fb_root,id,callback){
    this.id = id;
    this.data = {};
    this.fb_root = fb_root;
    var self = this;

    var planet = this.getFirebaseLocation(this.fb_root,this.id);

    planet.on("value",function(snap){
        self.data = snap.val();
    });

    planet.once("value",function(snap){
        self.data = snap.val();

        callback(self);
    });
}

Planet.prototype.getFirebaseLocation = function(){
    return this.fb_root.child("planets").child(this.id);
}

Planet.prototype.set = function(key,val){
    this.data[key] = val;

    this.getFirebaseLocation().update(this.data);
}

Planet.prototype.update = function(data,callback){
    this.getFirebaseLocation().set(data,callback(data));
}

Planet.prototype.get = function(key){
    return this.data[key];
}

module.exports = Planet;
