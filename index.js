var httpProxy = require('http-proxy')

var services = {
  'Site2': 'http://localhost:8005',
  'Site1': 'http://localhost:8006',
  'Site3': 'http://localhost:5000',
}

var proxy = httpProxy.createProxy()

require('http').createServer(function(req, res) {
  var target;

  if(req.url.match(/^\/dashboard/)) {
    target = "Site1"
  } else if(req.url.match(/^\/Site2/)) {
    target = "Site2"
  } else {
    target = "Site3"
  }

  proxy.web(req, res, {
    target: services[target],
    ws: true
  })

}).listen(process.env.PORT || 3000)

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  })

  res.end('Something went wrong. :(')
})
