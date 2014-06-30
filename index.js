var httpProxy = require('http-proxy')

var services = {
  'Site2': 'http://localhost:8005',
  'Site1': 'http://localhost:8006',
  'Site3': 'http://localhost:8007',
}

var proxy = httpProxy.createProxy()
var static = require('node-static')
var file = new(static.Server)("./public")

var static_files = ["/robots.txt", "/favicon.ico"]

require('http').createServer(function(req, res) {
  var target;

  if(static_files.indexOf(req.url) > -1) {
    file.serve(req, res)
    return;
  }

  if(req.url.match(/^\/dashboard/)) {
    target = "Site1"
  } else if(req.url.match(/^\/Site2/)) {
    target = "Site2"
  } else {
    target = "Site3"
  }

  req.__orch_target = target

  proxy.web(req, res, {
    target: services[target],
    ws: true
  })

}).listen(process.env.PORT || 3000)

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  })

  res.end('Something went wrong in ' + req.__orch_target + '. :(')
})
