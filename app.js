const app = require('http').createServer(handler);
const io = require('socket.io')(app, { origins: '*:*' });
app.listen(3000);

function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello online draw</h1>');
}

// ユーザ管理ハッシュ
const userHash = {};

const nsp_draw = io.of('/nsp_draw');

const drawSocket = nsp_draw.on('connection', function (socket) {
  socket.on('join room', function (roomName) {
    console.log('join room: ' + roomName);
    socket.join(roomName);
  });

  socket.on('add user', function (data) {
    userHash[socket.id] = data.user;
    // socket.broadcast.emit('add user', user);
    socket.broadcast.to(data.room).emit('add user', data.user);
  });

  socket.on('server send', function (msg) {
    // socket.broadcast.emit('send user', msg);
    socket.broadcast.to(msg.room).emit('send user', msg.data);
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('user disconnected', userHash[socket.id]);
    // drawSocket.to(data.room).emit('user disconnected', userHash[socket.id]);
  });
});

const nsp_chat = io.of('/nsp_chat');

const chatSocket = nsp_chat.on('connection', function (socket) {
  socket.on('join room', function (roomName) {
    // console.log('join room: ' + roomName);
    socket.join(roomName);
  });

  socket.on('get room users', function (roomName) {
    nsp_chat.in(roomName).clients((error, clients) => {
      const users = [];
      clients.forEach((c) => {
        users.push(userHash[c]);
      });
      chatSocket.to(socket.id).emit('get room users', users);
    });
  });

  socket.on('add user', function (data) {
    userHash[socket.id] = data.user;
    socket.broadcast.to(data.room).emit('add user', data.user);
  });

  socket.on('direct message', function (data) {
    for (const key in userHash) {
      if (userHash[key].id == data.toUserId) {
        chatSocket.to(key).emit('direct message', { message: data.message, from: userHash[socket.id] });
        return;
      }
    }
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('user disconnected', userHash[socket.id]);
  });
});
