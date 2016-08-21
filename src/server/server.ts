
import http = require('http');
import socketio = require('socket.io');
import fs = require('fs');

export interface BartMaoChatRoomServer {
    start(): void;
    stop(): void;
}

export class BartMaoChatRoomServerImpl implements BartMaoChatRoomServer {
    private srv: http.Server;
    private io: SocketIO.Server;

    constructor(public port = 8899) {
    }

    start() {
        this.srv = http.createServer(this.httpHanlder);
        this.srv.listen(this.port);

        this.io = socketio(this.srv);
        this.io.on('connection', this.socketHandler);
    }

    stop() {
        this.srv.close();
    }

    private httpHanlder(req: http.ServerRequest, res: http.ServerResponse) {
        var fname = '/index.html';
        if (req.url != '/') {
            fname = req.url;
        }
        console.log(`Requesting ${fname}`);

        var filename = __dirname + fname;
        fs.readFile(filename,
            function (err, data) {
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
    }

    private socketHandler(socket: SocketIO.Socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    }
}


