var Fleet;

function Fleet(fb_root,id,callback){
    this.id = id;
    this.data = {};
    this.fb_root = fb_root;

    var fleet = this.getFirebaseLocation();

    fleet.on("once",function(snap){
        this.data = snap.val();
        callback(this);
    });
}

Fleet.prototype.getFirebaseLocation = function(){
    return this.fb_root.child("fleets").child(this.id);
}

Fleet.prototype.get = function(key){
    return this.data[key];
}

Fleet.prototype.save = function(data){
    var fleet = this.getFirebaseLocation();

}

Fleet.prototype.set = function(key,val){

    this.getFirebaseLocation().child(key).update(val);
}

Fleet.makeShip = function(type){
    return ship = {
        "type":type
    };
}

module.exports = Fleet;