document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    var messages = document.querySelector('#General');
    var myMessage = document.querySelector("#myMessage");
    var sendbutton = document.querySelector("#sendbutton");
    var logoutbtn = document.querySelector("#logout");
    var unlis = document.querySelector(".list-group");
    var addChannel = document.querySelector("#addChannel");
    var newChannelName = document.querySelector("#newChannelName");
    var activeChannel = document.querySelector(".active").innerText;
    var parentDiv = document.querySelector("#parentDiv")

    function addNewChannel(x){
        var newChanel = document.createElement("button");
        newChanel.innerHTML = x;
        newChanel.classList.add("list-group-item");
        newChanel.classList.add("list-group-item-action");
        newChanel.setAttribute("type", "button");
        unlis.appendChild(newChanel);

        var newDiv = document.createElement("div");
        newDiv.classList.add("hidden");
        newDiv.classList.add("messages");
        newDiv.setAttribute("id", x);
        parentDiv.append(newDiv);
    }

    function showMessage(data){
        var idForDiv = data.channel;
        var divForMessages = document.getElementById(idForDiv);
        var newMessage = document.createElement("p");
        newMessage.innerHTML = ("<strong>"+data.usr+": </strong>"+data.msg +"("+data.channel+")");
        divForMessages.appendChild(newMessage);
        divForMessages.scrollTop = messages.scrollHeight;
        console.log('Received message');
    }
    
    function loadMessages(data) {
      
        for (let index = 0; index < data.activeChannel.length; index++) {
            let x = data.activeChannel[index];
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
        activeChannel = e.target.innerText;
        var elemDivs = document.querySelectorAll(".messages")
        elemDivs.forEach(function(k){
            if (k.id != e.target.innerText) { 
                k.classList.add("hidden");
            }else{
                k.classList.remove("hidden")
            }
            
        });
        socket.emit('active_channel_messages',{msg : 'Joined!', usr: username, channel: activeChannel});
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

    

    socket.on('connect', function() {
		socket.emit('message', {msg : 'Joined!', usr: username, channel: activeChannel});
    });
    
    socket.on('displayMessage', loadMessages);
	

    sendbutton.addEventListener("click", function(){
        socket.emit('onemessage', {msg : myMessage.value, usr: username, channel: activeChannel});
        myMessage.value = "";
    });

    socket.on('showOneMessage', showMessage);
    
    socket.on('showChannelMessages',data=>{
        for (let index = 0; index < data.length; index++) {
            let z = data[index]
            showMessage(z);
        }
    });
    

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
