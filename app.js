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


    if(req.url.startsWith("/api/map?")){
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

    if(url.startsWith("/api/datainsert")){ //http://localhost:8080/api/datainsert?userName=Henk&companyName=HEMA&homeLatitude=0&homeLongitude=0&companyLatitude=2&companyLongitude=2
        databases = new database(req, res);
        databases.InsertUser(parseParams(params));
    }
    

    if(url.startsWith("/api/database")){
        databases = new database(req, res);
        databases.GetUser(parseParams(params));
    }
    

    
    
}).listen(8080);
console.log("Server listening on port 8080")