

class map {

    constructor(req, res){
        this.req = req;
        this.res = res;
    }

    resolve(){
        this.res.write("You are trying to access the map api")
    }

}
module.exports = map;
