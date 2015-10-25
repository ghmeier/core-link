# Core Link!

A Procedural Clicker Game at MINNEHACKS

Get fleet by name - GET /fleet?name=<fleet_name>
    - returns the fleet data

Get fleet - GET /fleet/:id

Create a fleet and user - GET /fleet/new?name=<fleet_name>
    - returns the fleet

Add value to resource - GET /fleet/:id/add_resource?type=<type>&amount=<amount>

Add a ship - GET /fleet/:id/add_ship?type=<type>
    - returns the fleet

Create a planet - GET /planet/new
    - optional params:
        > boolean connect - determines if the planet can connect to others
        > int size_mod - increase chances of bigger planets
    - returns the planet

Get a planet - GET /planet/:id
    -returns the planet

Get fleet upgrades - GET /upgrades/fleet
    - returns full json of fleet upgrades

Get planet upgrades - GET /upgrades/planet
    -json of planet upgrades

Get ship upgrades - GET /upgrades/ship
    -json of ship upgrades

New ship/planet/fleet upgrade - POST /upgrades/<ship/planet/fleet>
    - data:{"name":"Reaserch","cost_multiplier":0,"cost":{"copper":1000,"aluminum":100,"uranium":10},"desc":"Increase your tech level!","result":{"tech":1},"result_multiplier":1}
    - returns json of upgrade with id.
