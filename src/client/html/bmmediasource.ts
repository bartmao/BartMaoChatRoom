import {BMEvent, IBMEvent} from './bmevent'

export interface BMMediaSource extends IBMEvent<void> {
    type: string;
    sourceNode: MediaElementAudioSourceNode;
    isReady:Boolean;
}

export class DefaultAudioMediaSource extends BMEvent<void> implements BMMediaSource {
    static classLoaded: Boolean = false;
    type: string = 'Audio';
    sourceNode: MediaElementAudioSourceNode;
    isReady: Boolean;

    constructor(public audioContext: AudioContext) {
        super();
        if (!DefaultAudioMediaSource.classLoaded) {
            navigator.getUserMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);
            navigator.getUserMedia({ audio: true },
                function (stream) {
                    this.sourceNode = audioContext.createMediaStreamSource(stream);
                    this.isReady = true;
                    this.trigger('ready');
                    console.log('successfully get the microphone');
                },
                function () {
                    console.log('failed to connect the microphone');
                }
            );
        }
    }
}

