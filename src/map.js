

class map {

    constructor(req, res){
        this.req = req;
        this.res = res;
    }

    resolve(){
        this.res.write("You are trying to access the map api")
        "https://<baseURL>/map/1/tile/<layer>/<style>/<zoom>/<X>/<Y>.<format>?key=<apiKey>[&tileSize=<tileSize>][&view=<geopoliticalView>][&language=<language>]"

    }
    //oQVKdPrOArjvoyvqAvFehUBYFFKG5SpP

}
module.exports = map;
