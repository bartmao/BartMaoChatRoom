// var socket = io('http://localhost:80');

// socket.on('news', function (data) {
//     console.log(data);
// });

// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator and gain node
var oscillator = audioCtx.createOscillator();
var gainNode = audioCtx.createGain();

// connect oscillator to gain node to speakers

oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

// create initial theremin frequency and volumn values

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var maxFreq = 6000;
var maxVol = 0.02;

var initialFreq = 5;
var initialVol = 0.009;

// set options for the oscillator

oscillator.type = 'square';
oscillator.frequency.value = initialFreq; // value in hertz
oscillator.detune.value = 100; // value in cents
oscillator.start(0);

$('#start').click(function () {

    myrecorder.on('myrecorder.gotBuffer', function (e, data) {
        console.log('data received');
    });

    myrecorder.start();
});


$('#stop').click(function () {
    myrecorder.stop();
});
