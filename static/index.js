document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    var messages = document.querySelector('#messages');
    var myMessage = document.querySelector("#myMessage");
    var sendbutton = document.querySelector("#sendbutton");
    var logoutbtn = document.querySelector("#logout");
    var unlis = document.querySelector(".list-group");
    var addChannel = document.querySelector("#addChannel");
    var newChannelName = document.querySelector("#newChannelName");
    
    function addNewChannel(x){
        var newChanel = document.createElement("button");
        newChanel.innerHTML = x;
        newChanel.classList.add("list-group-item");
        newChanel.classList.add("list-group-item-action");
        newChanel.setAttribute("type", "button");
        unlis.appendChild(newChanel);
    }

    function showMessage(data){
        var newMessage = document.createElement("p");
        newMessage.innerHTML = ("<strong>"+data.usr+": </strong>"+data.msg);
        messages.appendChild(newMessage);
        messages.scrollTop = messages.scrollHeight;
        console.log('Received message');
    }
    
    function loadMessages(data) {
    
        for (let index = 0; index < data.channels.General.length; index++) {
            let x = data.channels.General[index];
            showMessage(x);
        }
    
        for (let index = 0; index < data.channelsList.length; index++) {
            y = data.channelsList[index];
            addNewChannel(y);
        }
    }

    function activateChannel(e) {
        var elems = document.querySelectorAll("button");
        elems.forEach(function(el) {
            el.classList.remove("active");
        });
        e.target.classList.add("active");
        var activeChannel = document.querySelector(".active").innerText;
        alert(activeChannel +" is active" );
    }
    
    function logout(){
        localStorage.removeItem("username");
        document.location.reload(true)
    }
    

    
    
    var username = localStorage.getItem("username");
    if(!username){
        username = prompt("Please enter username");
        localStorage.setItem("username", username);
    }
    if(username===null){
        username = prompt("Please enter username");
        localStorage.setItem("username", username);
    }
    var activeChannel = document.querySelector(".active").innerText;
    

    socket.on('connect', function() {
		socket.emit('message', {msg : 'Joined!', usr: username});
    });
    
    socket.on('displayMessage', loadMessages);
	

    sendbutton.addEventListener("click", function(){
        socket.emit('onemessage', {msg : myMessage.value, usr: username});
        myMessage.value = "";
    });

    socket.on('showOneMessage', showMessage);
    
    

    unlis.addEventListener("click", activateChannel);

    addChannel.addEventListener("click", () =>{
        if(newChannelName.value==""){
            alert("Type name of new channel")
        }else{
            socket.emit('new_channel', newChannelName.value);
            newChannelName.value="";  
        }
    });

    socket.on('add_new_channel', addNewChannel);

    logoutbtn.addEventListener("click", logout);

});
