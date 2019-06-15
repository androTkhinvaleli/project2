document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    var messages = document.querySelector('#messages');
    var myMessage = document.querySelector("#myMessage");
    var sendbutton = document.querySelector("#sendbutton");
    var username = document.querySelector("#username");
    var unlis = document.querySelector(".list-group");
    var addChanel = document.querySelector("#addChanel");
    var newChanelName = document.querySelector("#newChanelName");

    function activateChanel(e) {
        var elems = document.querySelectorAll("button");
        elems.forEach(function(el) {
            el.classList.remove("active");
        });
        e.target.classList.add("active");
    }

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

    unlis.addEventListener("click", activateChanel);

    addChanel.addEventListener("click", () =>{
        if(newChanelName.value==""){
            alert("Type name of new chanel")
        }else{
            socket.emit('new_chanel', newChanelName.value);
            newChanelName.value="";  
        }
    });

    socket.on('add_new_chanel', data=>{
        var newChanel = document.createElement("button");
        newChanel.innerHTML = data;
        newChanel.classList.add("list-group-item");
        newChanel.classList.add("list-group-item-action");
        newChanel.setAttribute("type", "button");
        unlis.appendChild(newChanel);
        
    });


});