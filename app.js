var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);

function handler(req, res) {
  var fname = '/index.html';
  if (req.url != '/') {
    fname = req.url;
  }
  console.log(fname);

  var filename = __dirname + fname;
  fs.readFile(filename,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      if (fname.indexOf('.js') > 0) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      res.writeHead(200);
      res.end(data);
    });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});