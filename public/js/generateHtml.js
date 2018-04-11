function roomItemHtml(roomName, roomQttUsers){
  var html = '';
  html = '<li id="' + roomName + '" class="room-item" role="button">'
    +  '<span class="room-name">'
    +    roomName
    +  '</span>'
    +  '<span class="room-users">'
    +    '<i class="fa fa-users"></i> '
    +     roomQttUsers
    +  '</span>'
  +'</li>';

  return html;
}

function infoMessageHtml(msg){
  return '<li class="message-info">'+ msg +'</li>';
}


function chatMessageHtml(msg, nickname, self){
  var messageClass = self ? 'message message-self' : 'message';

  var html = '';  
  html = '<li class="'+ messageClass +'">'
  +  '<span class="message-username">'
  +    '<span class="message-username">'
  +      '<i class="fa fa-user"></i> ' + nickname
  +    '</span>'
  +  '</span>'
  +  '<span class="message-text">' + msg + '</span>'   
  +'</li>'

  return html;
}