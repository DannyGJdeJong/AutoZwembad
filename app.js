var http = require('http');
var map = require('./src/map.js');
var database = require('./src/database.js');

http.createServer(function (req, res) {

    var url = require('url');
    res.writeHead(200, {'Content-Type': 'application/json'});
    var url_parts = url.parse(req.url, true);
    var query = url_parts;

    routes = {
        "/api/map/route": "route"
    }

    url = req.url.split('?')[0];
    params = req.url.split('?')[1];
    console.log(url, params)
    if (!params) {
        res.writeHead(400, {})
        res.end();
        return;
    }

    console.log(url);


    if(req.url.startsWith("/api/map")){
        map = new Map(req, res);
        console.log(routes)
        map[routes[url]](parseParams(params))
    }

    function parseParams(params) {
        returnObj = {}
        params.split('&').forEach(element => {
            returnObj[element.split('=')[0]] = element.split('=')[1];
        });
        return returnObj;
    }

    

    if(url.startsWith("/api/database")){
        databases = new database(req, res);
        databases.GetUser(parseParams(params));
        //databases.resolve();
    }

    
    
}).listen(8080);
console.log("Server listening on port 8080")