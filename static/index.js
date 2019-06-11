document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    var messages = document.querySelector('#messages');
    var myMessage = document.querySelector("#myMessage");
    var sendbutton = document.querySelector("#sendbutton");
    
    socket.on('connect', function() {
		socket.emit('message', msg = 'User has connected!');
	});

	socket.on('Message', function(msg) {
        var newMessage = document.createElement("li");
        newMessage.innerHTML = msg;
        newMessage.classList.add("list-group-item");
        messages.appendChild(newMessage);
		
		console.log('Received message');
	});

    sendbutton.addEventListener("click", function(){
        socket.emit('message', msg = myMessage.value);
        myMessage.value = "";
    });

	
});