var http = require('http');
var httpProxy = require('http-proxy');

var services = {
    'Site2': 'http://localhost:8005',
    'Site1': 'http://localhost:8006',
    'Site3': 'http://localhost:8007',
    'socketio': 'ws://localhost:8007'
};

var proxy = httpProxy.createProxy();

proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });

    var msg = 'Something went wrong in ' + req.__orch_target + '. :(';
    console.log(msg);

    res.end(msg);
});

var static = require('node-static');
var file = new(static.Server)("./public");

var static_files = ["/PROJECT.IDENTIFICATION.txt","/some_static_data.txt","/robots.txt", "/favicon.ico"];

var PORT = process.env.PORT || 3000;

var server = http.createServer(function(req, res) {
    var target;

    if(static_files.indexOf(req.url) > -1) {
        file.serve(req, res);
        return;
    }

    if(req.url.match(/^\/dashboard/) || req.url.match(/^\/panel/) || req.url.match(/^\/i\//)) {
        target = "Site1";
    } else if(req.url.match(/^\/Site2/)) {
        target = "Site2";
    } else {
        target = "Site3";
    }

    req.__orch_target = target;

    proxy.web(req, res, {
        target: services[target],
        ws: true
    });
});

server.listen(PORT, 'localhost');

server.on('upgrade', function (req, res) {
    proxy.ws(req, res, {
        target: services['socketio'],
        ws: true
    });
});

console.log("Server started on port %d", PORT);

