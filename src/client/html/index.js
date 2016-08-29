var startBtn = document.querySelector('#start');
startBtn.addEventListener('click', function () {
    var audioContext = new (window.AudioContext || window.webkitAudioContext);
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getUserMedia({ audio: true },
        function (stream) {
            var streamNode = audioContext.createMediaStreamSource(stream);
            streamNode.connect(audioContext.destination);
        },
        function () {

        }
    );
});