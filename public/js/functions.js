// dom elements
var joinContainer = getElement('#join-container');
var joinForm = getElement('#join-form');
var joinInput = getElement('#join-nickname');
var roomsContainer = getElement('#rooms-container');
var chatContainer = getElement('#chat-container');
var chatList = getElement('#chat-list');
var chatForm = getElement('#chat-form');
var chatInput = getElement('#chat-input');
var returnButton = getElement('#return-button');


// insert message to dom 
function insertMessage(msg, type, nickname){
  if(type === 'info'){
    var messageHtml = infoMessageHtml(msg);
  } else if(type === 'self'){
    var messageHtml = chatMessageHtml(msg, nickname,true);
  }else {
    var messageHtml = chatMessageHtml(msg, nickname, false);
  }

  chatList.insertAdjacentHTML('beforeend', messageHtml);
}

// click listener for rooms cards in rooms page 
function roomsClickListener(socket){
  var rooms = getElement('.room-item');  
  for(var i = 0; rooms.length > i; i++){
    rooms[i].addEventListener('click', function(){
      var roomName = this.id;
      console.log(this.id);
      socket.emit('select room', roomName);
      changeView(roomsContainer, chatContainer);
    })
  }
}

// insert rooms cards in dom
function loadRooms(rooms, socket){
  var roomsList = getElement('#rooms-list');
  var roomsItems = '';
  for (var i = 0; rooms.length > i; i++){
    roomsItems += roomItemHtml(rooms[i].name, rooms[i].users);
  }

  roomsList.innerHTML = roomsItems;
  roomsClickListener(socket);
}


function getElement(element){
  if(element.charAt(0) === '.'){
    return document.querySelectorAll(element);
  }
  return document.querySelector(element);
}

function changeView(fadeOutElement, fadeInElement){
  fadeOutElement.style.display = 'none';
  fadeInElement.style.display = 'flex';
}