
var socket = io('http://localhost:80');

socket.on('news', function (data) {
    console.log(data);
});

$('#send').click(function(){
    socket.emit('my other event', { my: 'data' });
});
