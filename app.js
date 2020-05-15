const app = require('http').createServer(handler);
const io = require('socket.io')(app, { origins: '*:*' });
app.listen(3000);

function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello online draw</h1>');
}

io.sockets.on('connection', function (socket) {
  socket.on('clear send', function (msg) {
    socket.broadcast.emit('clear user');
    console.log('disconnect:' + msg.user);
  });

  socket.on('server send', function (msg) {
    socket.broadcast.emit('send user', msg);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
    console.log('disconnect');
  });
});
