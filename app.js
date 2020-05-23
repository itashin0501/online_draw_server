const app = require('http').createServer(handler);
const io = require('socket.io')(app, { origins: '*:*' });
app.listen(3000);

function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello online draw</h1>');
}

// ユーザ管理ハッシュ
const userHash = {};

io.sockets.on('connection', function (socket) {
  // TODO room
  // socket.join(roomName);
  // socket.broadcast.emit('user connected', socket.id);

  socket.on('add user', function (user) {
    userHash[socket.id] = user;
    socket.broadcast.emit('add user', user);
  });

  socket.on('server send', function (msg) {
    socket.broadcast.emit('send user', msg);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected', userHash[socket.id]);
  });
});
