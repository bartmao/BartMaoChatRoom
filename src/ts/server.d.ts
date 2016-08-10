export interface BartMaoChatRoomServer {
    start(): void;
    stop(): void;
}
export declare class BartMaoChatRoomServerImpl implements BartMaoChatRoomServer {
    port: number;
    private srv;
    private io;
    constructor(port?: number);
    start(): void;
    stop(): void;
    private httpHanlder(req, res);
    private socketHandler(socket);
}
