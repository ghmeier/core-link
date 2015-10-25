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

Get all upgrades - GET /upgrades
    - returns full json of all upgrades

