window.onload = function () {
  var nickname = '';  

  var socket = io();
  // socket handle events
  socket.on('update rooms', function (rooms) {
    loadRooms(rooms, socket);
  });  

  socket.on('info', function(data) {
    insertMessage(data, 'info');
  });

  socket.on('message', function(msg) {
    insertMessage(msg.msg, null, msg.owner);
  });

  // event listeners
  joinForm.addEventListener('submit', function(e){
    e.preventDefault();
    socket.emit('join', joinInput.value);    
    nickname = joinInput.value;
    changeView(joinContainer, roomsContainer);
  });

  chatForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(chatInput.value === '') {
      return;
    }
    socket.emit('message', chatInput.value);
    insertMessage(chatInput.value, 'self' ,nickname); 
    chatInput.value = '';  
  });

  returnButton.addEventListener('click', function() {
    socket.emit('disconnect room');
    chatList.innerHTML = '';
    changeView(chatContainer, roomsContainer);
  }); 

}