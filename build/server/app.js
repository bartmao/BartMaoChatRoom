"use strict";
var server_1 = require('./server');
var srv = new server_1.BartMaoChatRoomServerImpl();
srv.start();
console.log('server started!');
