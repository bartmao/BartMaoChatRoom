var audioContext = new (window.AudioContext || window.webkitAudioContext);
var oscillator;
var processor;

var stopBtn = document.querySelector('#stop');
stopBtn.addEventListener('click', function(){
    oscillator.stop();
});

var startBtn = document.querySelector('#start');
startBtn.addEventListener('click', function () {
    // navigator.getUserMedia = (navigator.getUserMedia ||
    //     navigator.webkitGetUserMedia ||
    //     navigator.mozGetUserMedia ||
    //     navigator.msGetUserMedia);

    // navigator.getUserMedia({ audio: true },
    //     function (stream) {
    //         var streamNode = audioContext.createMediaStreamSource(stream);
    //         streamNode.connect(audioContext.destination);
    //     },
    //     function () {

    //     }
    // );

    oscillator = audioContext.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = 3;
    oscillator.start();


    processor = audioContext.createScriptProcessor(1024, 1, 1);
    processor.onaudioprocess = function (audioProcessingEvent) {
        for (var channel = 0; channel < processor.numberOfInputs; ++channel) {
            var inputData = audioProcessingEvent.inputBuffer.getChannelData(channel);
            var outputData = audioProcessingEvent.outputBuffer.getChannelData(channel);
            for (var sample = 0; sample < outputData.length; ++sample) {
                outputData[sample] = inputData[sample] + (Math.random() * 2 - 1) * 0.2;
            }

            var arrayToTrans = float32Array2IntArray(outputData);
            var restoredArray = intArray2Float32Array(arrayToTrans);

        }
    }

    oscillator.connect(processor);
    processor.connect(audioContext.destination);
});

function float32Array2IntArray(float32array) {
    var arr = new Array(float32array.length);

    for (var i = 0; i < float32array.length; i++) {
        var s = Math.max(-1, Math.min(1, float32array[i]));
        arr[i] = s < 0 ? s * 0x80000000 : s * 0x7FFFFFFF;
    }

    return arr;
}

function intArray2Float32Array(intArray) {
    intArray.forEach(function(element, index) {
        intArray[index] = intArray[index] > 0? intArray[index]/0x80000000:intArray[index]/0x7FFFFFFFF;
    }, this);
    return Float32Array.from(intArray);
}