var http = require('http');
var map = require('./src/map.js');
var database = require('./src/database.js');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});

    var url = require('url');
    
    var url_parts = url.parse(req.url, true);
    var query = url_parts;


    routes = {
        "/api/map": map
    }

    url = req.url.split('?')[0];

    console.log(url);


    if(req.url.startsWith("/api/map")){
        maps = new map(req, res);
        maps.resolve();
    }

    if(req.url.startsWith("/api/database")){
        databases = new database();
        //databases.resolve();
    }

    res.end();
}).listen(8080);