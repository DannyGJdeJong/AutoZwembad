const https = require('https');

class Map {

    constructor(req, res){
        this.req = req;
        this.res = res;
        this.routingKey = "AIzaSyCzvtohlpHJlWnAS_1nuyCLk-W57pqL2Sw"
    }

    route(params){
        var orig = params["orig"]
        var dest = params["dest"]
        var waypoints = params["waypoints"]
        var endpoint = `https://maps.googleapis.com/maps/api/directions/json?origin=${orig}&destination=${dest}&key=${this.routingKey}`
        console.log(endpoint)
        https.get(endpoint, (response) => {
            var data = ''

            response.on('data', (chunk) => {
                data += chunk;
            })

            response.on('end', () => {
                console.log(data)
            })
        })  
    }
}
module.exports = Map;
