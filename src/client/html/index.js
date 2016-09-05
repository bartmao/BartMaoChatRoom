var audioContext = new (window.AudioContext || window.webkitAudioContext);

var audioSource = new DefaultAudioMediaSource(audioContext);
var processManager = new BMMediaProcessorManager('');