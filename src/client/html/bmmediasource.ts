export interface BMMediaSource {
    type: string;
    sourceNode: MediaElementAudioSourceNode;
}

export class DefaultAudioMediaSource implements BMMediaSource {
    static classLoad: Boolean = false;
    type: string = 'Audio';
    sourceNode: MediaElementAudioSourceNode;

    constructor(public audioContext: AudioContext) {
        if (!DefaultAudioMediaSource.classLoad) {
            navigator.getUserMedia = (navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia);
            navigator.getUserMedia({ audio: true },
                function (stream) {
                    this.sourceNode = audioContext.createMediaStreamSource(stream);
                    //this.sourceNode.connect(processor);
                    console.log('successfully get the microphone');
                },
                function () {
                    console.log('failed to connect the microphone');
                }
            );
        }
    }
}

