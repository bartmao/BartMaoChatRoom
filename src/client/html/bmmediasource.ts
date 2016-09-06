import {EventEmitter} from 'events'

export interface BMMediaSource {
    type: string;
    sourceNode: MediaElementAudioSourceNode;
    //(event: 'available', cb: ()=>void): void;
}

export class DefaultAudioMediaSource extends EventEmitter implements BMMediaSource {
    static classLoad: Boolean = false;
    type: string = 'Audio';
    sourceNode: MediaElementAudioSourceNode;

    constructor(public audioContext: AudioContext) {
        super();
        if (!DefaultAudioMediaSource.classLoad) {
            navigator.getUserMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);
            navigator.getUserMedia({ audio: true },
                function (stream) {
                    this.sourceNode = audioContext.createMediaStreamSource(stream);
                    //this.sourceNode.connect(processor);
                    this.emit('sourceloaded');
                    console.log('successfully get the microphone');
                },
                function () {
                    console.log('failed to connect the microphone');
                }
            );
        }
    }
}

