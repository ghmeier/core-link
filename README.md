# Core Link!

A Procedural Clicker Game at MINNEHACKS

Get fleet id by name - GET /fleet?name=<fleet_name>
    - returns the fleet id {data:{id:<id>}}

Create a fleet and user - GET /fleet/new?name=<fleet_name>
    - returns the fleet

Add a ship - GET /fleet/:id/add_ship?type=<type>
    - returns the fleet

Create a planet - GET /planet/new?size=<size_number>
    - returns the planet