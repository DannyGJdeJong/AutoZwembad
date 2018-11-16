var http = require('http');
var Map = require('./src/map.js');

http.createServer(function (req, res) {

    var url = require('url');
    
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

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end();
}).listen(8080);
console.log("Server listening on port 8080")