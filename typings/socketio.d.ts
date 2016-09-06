interface Socket {

}

declare var io: {
    (url: string): Socket;
}