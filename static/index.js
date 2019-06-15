document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    var messages = document.querySelector('#messages');
    var myMessage = document.querySelector("#myMessage");
    var sendbutton = document.querySelector("#sendbutton");
    var username = document.querySelector("#username");
    var unlis = document.querySelector(".list-group")

    function activateChanel(e) {
        var elems = document.querySelectorAll("button");
        elems.forEach(function(el) {
            el.classList.remove("active");
        });
        e.target.classList.add("active");
    }

    // function andro(){
    //     socket.emit("typing", {usr : username.value})
    // }

    socket.on('connect', function() {
		socket.emit('message', {msg : 'Joined!', usr: "User"});
	});

	socket.on('displayMessage', function(data) {
        var newMessage = document.createElement("p");
        newMessage.innerHTML =("<strong>" + data.usr + ": </strong>" + data.msg);
        
        messages.appendChild(newMessage);
		messages.scrollTop = messages.scrollHeight;
		console.log('Received message');
	});

    sendbutton.addEventListener("click", function(){
        socket.emit('message', {msg : myMessage.value, usr: username.value});
        myMessage.value = "";

    });

    myMessage.addEventListener("keypress",() => {
        socket.emit('typing', username.value)
    });   
    
    socket.on('displaytyping', function(data){
        var newMessage = document.createElement("p");
        newMessage.innerHTML =("<strong>" + data + "</strong>" + "is typing");
        newMessage.classList.add("list-group-item");
    });

    unlis.addEventListener("click", activateChanel)

});