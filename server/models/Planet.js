var Planet;

function Planet(fb_root,id){
    this.id = id;
    this.data = {};
    this.fb_root = fb_root;

    var planet = getFirebaseLocation(this.fb_root,this.id);

    planet.on("value",function(snap){
        this.data = snap.val();
    });
}

Planet.prototype.getFirebaseLocation = function(){
    return this.fb_root.child("planets").child(this.id);
}

Planet.prototype.set = function(key,val){
    this.data[key] = val;

    this.getFirebaseLocation().update(this.data);
}

Planet.prototype.get = function(key){
    return this.data[key];
}
