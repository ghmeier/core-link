curl -X POST http://localhost:3000/upgrades/planet -d '{"cost":{"copper":110,"steel":100},"cost_multiplier":14,"desc":"Increase abundance of protein on this planet!","name":"Search For Hunting","result":{"protein":0.1},"result_multiplier":1.1}' -H "Content-Type: application/json"
curl -X POST http://localhost:3000/upgrades/planet -d '{"cost":{"copper":110,"steel":100},"cost_multiplier":14,"desc":"Increase abundance of water on this planet!","name":"Search for water","result":{"water":0.1},"result_multiplier":1.1}' -H "Content-Type: application/json"
