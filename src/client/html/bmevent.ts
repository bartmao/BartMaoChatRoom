export interface IBMEvent<T> {
    on(type: string, handler: { (data?: T): void }): void;
    off(type: string, handler: { (data?: T): void }): void;
}

export class BMEvent<T> implements IBMEvent<T>{
    private handlers: [string, { (data?: T): void }][] = [];

    public on(type: string, handler: { (data?: T): void }) {
        this.handlers.push([type, handler]);
    }

    public off(type: string, handler: { (data?: T): void }) {
        this.handlers = this.handlers.filter(h => !(h[0] === type && h[1] === handler));
    }

    public trigger(type: string, data?: T) {
        this.handlers.filter(h => h[0] == type).slice().forEach(h => h[1](data));
    }
}