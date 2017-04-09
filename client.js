var semesters = [];

$(document).ready(function() {
    var socket = io.connect("http://localhost:8080");
    socket.emit('get_schedule', {});
    socket.on('semesters', function(data) {
        console.log(data);
    });
});