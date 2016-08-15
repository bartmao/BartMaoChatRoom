"use strict";
var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');
var BartMaoChatRoomServerImpl = (function () {
    function BartMaoChatRoomServerImpl(port) {
        if (port === void 0) { port = 8899; }
        this.port = port;
    }
    BartMaoChatRoomServerImpl.prototype.start = function () {
        this.srv = http.createServer(this.httpHanlder);
        this.srv.listen(this.port);
        this.io = socketio(this.srv);
        this.io.on('connection', this.socketHandler);
    };
    BartMaoChatRoomServerImpl.prototype.stop = function () {
        this.srv.close();
    };
    BartMaoChatRoomServerImpl.prototype.httpHanlder = function (req, res) {
        var fname = '/index.html';
        if (req.url != '/') {
            fname = req.url;
        }
        console.log("Requesting " + fname);
        var filename = __dirname + fname;
        fs.readFile(filename, function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading');
            }
            if (fname.indexOf('.js') > 0) {
                res.setHeader('Content-Type', 'application/javascript');
            }
            res.writeHead(200);
            res.end(data);
        });
    };
    BartMaoChatRoomServerImpl.prototype.socketHandler = function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    };
    return BartMaoChatRoomServerImpl;
}());
exports.BartMaoChatRoomServerImpl = BartMaoChatRoomServerImpl;
