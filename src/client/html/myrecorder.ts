export default class MyRecorder {
    static initialled = false;
    static defaultSampleRate = 0;// default sample rate: chrome/48000

    private isRecording = false;
    private buf = [];
    private totalLen = 0;
    private context: AudioContext;
    private listeners = [];

    constructor(private channelNum = 1, private sampleRate = 16000) {
        MyRecorder.init();
        this.load();
    }

    start() {
        this.isRecording = true;
    }

    stop() {
        this.isRecording = false;
    }

    on(event: string, listener: (Float32Array) => void) {
        this.listeners.push(listener);
    }

    static init() {
        if (MyRecorder.initialled) return;

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        MyRecorder.initialled = true;
    }

    private emit(data: Float32Array) {
        this.listeners.forEach(element => {
            setTimeout(element(data), 0);
        });
    }

    private load() {
        this.context = new AudioContext();


        navigator.getUserMedia({ audio: true }, (stream) => {
            let streamNode: MediaElementAudioSourceNode = this.context.createMediaStreamSource(stream);

            let processNode: ScriptProcessorNode = (this.context.createScriptProcessor || this.context.createJavaScriptNode)
                .call(this.context, 1024 * 4, this.channelNum, this.channelNum);
            processNode.onaudioprocess = function (e) {
                if (this.defaultSampleRate == 0) this.defaultSampleRate = e.inputBuffer.sampleRate;
                this.popluateBuf(e);
            };
            streamNode.connect(processNode);
            processNode.connect(this.context.destination);
        }, function () {
            // error handling
        });
    }

    private popluateBuf(e: AudioProcessingEvent) {
        if (!this.isRecording) return;

        var f = e.inputBuffer;
        var cdata = f.getChannelData(this.channelNum - 1);

        this.emit(cdata);

        // for (var i = 0; i < cdata.length; ++i)
        //     if (cdata[i] != 0) break;
        // if (i == cdata.length) return;

        // var downsampledData = this.downSampleRate(MyRecorder.defaultSampleRate, this.sampleRate, cdata);

        // //myrecorder.trigger('myrecorder.gotBuffer', [downsampledData]);

        // this.buf.push(downsampledData);
        // this.totalLen += downsampledData.length;
    }

    private encodeWAV(samples) {
        var arr = new ArrayBuffer(44 + samples.length * 2);
        var view = new DataView(arr);

        /* RIFF identifier */
        this.writeString(view, 0, 'RIFF');
        /* RIFF chunk length */
        view.setUint32(4, 36 + samples.length * 2, true);
        /* RIFF type */
        this.writeString(view, 8, 'WAVE');
        /* format chunk identifier */
        this.writeString(view, 12, 'fmt ');
        /* format chunk length */
        view.setUint32(16, 16, true);
        /* sample format (raw) */
        view.setUint16(20, 1, true);
        /* channel count */
        view.setUint16(22, this.channelNum, true);
        /* sample rate */
        view.setUint32(24, this.sampleRate, true);
        /* byte rate (sample rate * block align) */
        view.setUint32(28, this.sampleRate * 2, true);
        /* block align (channel count * bytes per sample) */
        view.setUint16(32, this.channelNum * 2, true);
        /* bits per sample */
        view.setUint16(34, 16, true);
        /* data chunk identifier */
        this.writeString(view, 36, 'data');
        /* data chunk length */
        view.setUint32(40, samples.length * 2, true);

        this.floatTo16BitPCM(view, 44, samples);
        return view;
    }

    private floatTo16BitPCM(view, offset, input) {
        for (var i = 0; i < input.length; i++ , offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }

    private writeString(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    private downSampleRate(orginSr, tarSr, buf) {
        if (orginSr == tarSr) return buf.slice();

        var ratio = orginSr / tarSr - (orginSr % tarSr) / tarSr;
        var newBuf = new Float32Array(buf.length / ratio - (buf.length % ratio) / ratio);
        var newBufOffset = 0;
        var bufOffset = 0;

        for (; newBufOffset < newBuf.length && bufOffset < buf.length; newBufOffset++ , bufOffset += ratio) {
            newBuf[newBufOffset] = buf[bufOffset];
        }

        return newBuf;
    }
}