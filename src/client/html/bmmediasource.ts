import {BMEvent, IBMEvent} from './bmevent'
import {BMMediaProcessor} from './bmmediaprocessor'

export interface BMMediaSource<T> {
    type: string;
    sourceNode: MediaElementAudioSourceNode;
    isReady: Boolean;
    on(event: string, listener: Function): void;
    on(event: 'ondata', listener: (data: T) => void): void;
    on(event: 'onready', listener: () => void): void;
}

export class MicrophoneMediaSource extends BMEvent<AudioBuffer> implements BMMediaSource<AudioBuffer> {
    type: string = 'Audio';
    sourceNode: MediaElementAudioSourceNode;
    isReady: Boolean;

    constructor(public audioContext: AudioContext) {
        super();

        let microphoneNode: AudioNode;

        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getUserMedia({ audio: true },
            function (stream) {
                microphoneNode = audioContext.createMediaStreamSource(stream);
                this.isReady = true;
                this.trigger('ready');
                console.log('successfully get the microphone');
            },
            function () {
                console.log('failed to connect the microphone');
            }
        );

        let processor = audioContext.createScriptProcessor(1024, microphoneNode.numberOfInputs, microphoneNode.numberOfOutputs);
        processor.onaudioprocess = function (audioProcessingEvent) {
            let i: MicrophoneMediaSource = this;
            i.trigger('ondata', audioProcessingEvent.inputBuffer);
        }

    }
}

