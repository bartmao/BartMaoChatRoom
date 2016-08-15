import {BartMaoChatRoomServerImpl} from './server';

let srv = new BartMaoChatRoomServerImpl();
srv.start();    
console.log('server started!');