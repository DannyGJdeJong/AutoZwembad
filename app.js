var http = require('http');
var map = require('./src/map.js');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});

    routes = {
        "/api/map": map
    }

    url = req.url.split('?')[0];

    console.log(url);


    if(req.url.startsWith("/api/map")){
        maps = new map(req, res);
        maps.resolve();
    }

    res.end();
}).listen(8080);