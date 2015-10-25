var Fleet;

function Fleet(fb_root,id,callback){
    this.id = id;
    this.data = {};
    this.fb_root = fb_root;
    var self = this;

    var fleet = this.getFirebaseLocation();
    fleet.on("value",function(snap){
        self.data = snap.val();
    });

    fleet.once("value",function(snap){
        self.data = snap.val();

        self.data.harvester_cost = Fleet.harvesterost;
        callback(self);

    });
}


Fleet.harvesterCost = function(num){
    return num * num + 100;
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
    this.getFirebaseLocation().child(key).set(val);
}

Fleet.prototype.update = function(data,callback){
    this.getFirebaseLocation().set(data,callback(data));
}

Fleet.makeShip = function(type){
    return ship = {
        "type":type,
        "capacity":100,
        "food":0,
        "population":1,
        "population_max":10,
        "durability":100,
        "durability_max":100,
        "harvesters":[]
    };
}

Fleet.makeHarvester = function(){
    return harvester = {
        "level":0,
        "speed":1,
        "multiplier":1
    };
}

module.exports = Fleet;