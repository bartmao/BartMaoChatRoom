import {BMMediaSource}  from './bmmediasource'

export interface BMMediaProcessor {
    handleType: string;
    processNode: ScriptProcessorNode;
    manager: BMMediaProcessorManager;
    context: AudioContext;
}

export class BMMediaProcessorManager {
    private processors: Array<BMMediaProcessor> = [];
    private mediaSources: BMMediaSource[] = [];
    public socket: Socket;
    public context: AudioContext;
    constructor(private socketUrl: string, ...mediaSources: BMMediaSource[]) {
        this.mediaSources = mediaSources.slice();
        if (mediaSources.length > 0) this.context = mediaSources[0].sourceNode.context;

        this.socket = io(socketUrl);
    }

    add(...newProcessors: BMMediaProcessor[]) {
        newProcessors.forEach((v, i) => {
            v.context = this.context;
            v.manager = this;
            this.processors.push(v);
            if (i > 0)
                this.processors[i - 1].processNode.connect(v.processNode);
        });
    }

    start() {
        if (this.processors.length > 0)
            this.mediaSources.forEach(src => {
                src.sourceNode.connect(this.processors[0].processNode);
            });
    }

    pause() {
        this.mediaSources.forEach(s => s.sourceNode.disconnect());
    }
}

export class DefaultBMMedsiaProcessor implements BMMediaProcessor {
    handleType: string = 'Audio';
    manager: BMMediaProcessorManager;
    context: AudioContext;

    private _processNode: ScriptProcessorNode;

    public get processNode(): ScriptProcessorNode {
        return this._processNode || (function () {
            let processor = this.context.createScriptProcessor(1024, 1, 1);
            processor.onaudioprocess = function (audioProcessingEvent) {
                for (let channel = 0; channel < processor.numberOfInputs; ++channel) {
                    let inputData = audioProcessingEvent.inputBuffer.getChannelData(channel);
                    let outputData = audioProcessingEvent.outputBuffer.getChannelData(channel);
                    let orignArr = new Float32Array(outputData.length);
                    for (let sample = 0; sample < outputData.length; ++sample) {
                        outputData[sample] = 0;
                        orignArr[sample] = inputData[sample];//+ (Math.random() * 2 - 1) * 0.2;
                    }

                    this.manager.socket.emit('sound', { my: DefaultBMMedsiaProcessor.float32Array2IntArray(orignArr) });
                }
            }

            this._processNode = processor;
            return this._processNode;
        })();
    }

    static float32Array2IntArray(f32arr: Float32Array) {
        let arr = new Array(f32arr.length);
        for (let i = 0; i < f32arr.length; i++) {
            let s = Math.max(-1, Math.min(1, f32arr[i]));
            arr[i] = Math.floor(s > 0 ? s * 0x80000000 : s * 0x7FFFFFFF);
        }
        return arr;
    }

    static intArray2Float32Array(intarr) {
        let arr = new Array(intarr.length);
        intarr.forEach(function (element, index) {
            arr[index] = intarr[index] > 0 ? intarr[index] / 0x80000000 : intarr[index] / 0x7FFFFFFFF;
        }, this);
        return arr;
    }
}

