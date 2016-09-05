var audioContext = new (window.AudioContext || window.webkitAudioContext);
var oscillator;
var processor;
var otherAudioProcessor;
var socket = io('http://localhost:8000');

socket.on('othersound', function (pak) {
    var data = pak.sound.my;
    var buffer = audioContext.createBuffer(1, 1024, audioContext.sampleRate);
    var bufferData = buffer.getChannelData(0);

    for (var frame = 0; frame < data.length; ++frame) {
        bufferData[frame] = data[frame] > 0 ? data[frame] / 0x80000000 : data[frame] / 0x7FFFFFFFF;
    }

    otherAudioProcessor = audioContext.createBufferSource();
    otherAudioProcessor.buffer = buffer;
    otherAudioProcessor.connect(audioContext.destination);
    otherAudioProcessor.start();
});

(function initAudioGraph() {
    oscillator = audioContext.createOscillator();
    processor = audioContext.createScriptProcessor(1024, 1, 1);
    //oscillator.connect(processor);
    //oscillator.type = 'square';
    //oscillator.frequency.value = 3;
    //oscillator.start();

    processor.onaudioprocess = function (audioProcessingEvent) {
        for (var channel = 0; channel < processor.numberOfInputs; ++channel) {
            var inputData = audioProcessingEvent.inputBuffer.getChannelData(channel);
            var outputData = audioProcessingEvent.outputBuffer.getChannelData(channel);
            var orignArr = new Array(outputData.length);
            for (var sample = 0; sample < outputData.length; ++sample) {
                outputData[sample] = 0;
                orignArr[sample] = inputData[sample];//+ (Math.random() * 2 - 1) * 0.2;
            }

            pushStream(float32Array2IntArray(orignArr));
            //var restoredArray = float32Array2IntArray(toTransferArray);
            console.log(orignArr[0]);
        }
    }

    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getUserMedia({ audio: true },
        function (stream) {
            var streamNode = audioContext.createMediaStreamSource(stream);
            streamNode.connect(processor);
            console.log('get audio');
        },
        function () {
            console.log('failed to open microphone');
        }
    );
})();

var stopBtn = document.querySelector('#stop');
stopBtn.addEventListener('click', function () {
    processor.disconnect();
});

var startBtn = document.querySelector('#start');
startBtn.addEventListener('click', function () {
    processor.connect(audioContext.destination);
});

function float32Array2IntArray(float32array) {
    var arr = new Array(float32array.length);
    for (var i = 0; i < float32array.length; i++) {
        var s = Math.max(-1, Math.min(1, float32array[i]));
        arr[i] = Math.floor(s > 0 ? s * 0x80000000 : s * 0x7FFFFFFF);
    }
    return arr;
}

function intArray2Float32Array(intArray) {
    var arr = new Array(intArray.length);
    intArray.forEach(function (element, index) {
        arr[index] = intArray[index] > 0 ? intArray[index] / 0x80000000 : intArray[index] / 0x7FFFFFFFF;
    }, this);
    return arr;
}

function pushStream(data) {
    socket.emit('sound', { my: data });
}