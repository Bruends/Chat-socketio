const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// serving statics
app.use(express.static(path.join(__dirname, 'public')));
// serving client for socket.io
app.use(express.static(path.join(__dirname, 'node_modules/socket.io-client')));

// users list
let users = [];

const rooms = [
  { name: 'javascript', users: 0 },
  { name: 'Nodejs', users: 0 },
  { name: 'Socket.io', users: 0 },
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  users[socket.id] = {}

  // send the avaiable rooms 
  socket.emit('update rooms', rooms);
  
  // select nickname handler
  socket.on('join', (nickname) => {
    users[socket.id].nickname = nickname;
  });

  // join in a chat room handler
  socket.on('select room', (room) => {
    const userNickname = users[socket.id].nickname; 

    // joining room
    socket.join(room);
    users[socket.id].room = room;

    socket.to(room).broadcast.emit('info', ` ${userNickname} connected`);

    // update room users count
    rooms[rooms.findIndex(r => r.name === room)].users++;
    socket.broadcast.emit('update rooms', rooms);
  });

  // message handler
  socket.on('message', (msg) => {
    const msgData = {
      owner: users[socket.id].nickname, 
      msg
    }
    socket.to(users[socket.id].room).broadcast.emit('message', msgData);
  });
  
  // disconnect room handler
  socket.on('disconnect room', () => {
    const userNickname = users[socket.id].nickname;
    const userCurrentRoom = users[socket.id].room; 
    // disconnect message
    socket.to(userCurrentRoom).broadcast.emit('info', `${userNickname} left`);

    // removing room from user
    users[socket.id].room = '';

    // updating room users count 
    rooms[rooms.findIndex(r => r.name === userCurrentRoom)].users--;
    io.emit('update rooms', rooms);

    socket.leave(userCurrentRoom);
  });

  // disconnect app handler
  socket.on('disconnect', () => {
    const userNickname = users[socket.id].nickname;
    const userCurrentRoom = users[socket.id].room; 
    
    // if user is connected to a room
    if(userCurrentRoom){
      socket.to(userCurrentRoom).broadcast.emit('info', `${userNickname} left`);
      
      // updating room users count 
      rooms[rooms.findIndex(r => r.name === userCurrentRoom)].users--;
      io.emit('update rooms', rooms);
    }
    delete users[socket.id];    
  });
});

http.listen(3000, () => {
  console.log('listening on localhost:3000');
});