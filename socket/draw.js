'use strict';

class SocketDraw {
  constructor(io, socketRoot) {
    this._init(io.of('/nsp_draw'), socketRoot);
  }

  _init(nsp, socketRoot) {
    const drawSocket = nsp.on('connection', function (socket) {
      socket.on('join room', function (roomName) {
        console.log('join room: ' + roomName);
        socket.join(roomName);
      });

      socket.on('get room users', function (roomName) {
        const userHash = socketRoot.getUserHash();
        nsp.in(roomName).clients((error, clients) => {
          const users = [];
          clients.forEach((c) => {
            users.push(userHash[c]);
          });
          drawSocket.to(socket.id).emit('get room users', users);
        });
      });

      socket.on('add user', function (data) {
        socketRoot.addUser(socket.id, data);
        socket.broadcast.to(data.room).emit('add user', data.user);
      });

      socket.on('paste tag', function (msg) {
        socket.broadcast.to(msg.room).emit('paste tag', msg.data);
      });
      socket.on('move tag', function (msg) {
        socket.broadcast.to(msg.room).emit('move tag', msg.data);
      });

      socket.on('server send', function (msg) {
        socket.broadcast.to(msg.room).emit('send user', msg.data);
      });

      socket.on('disconnect', function () {
        socket.broadcast.emit('user disconnected', socketRoot.getUser(socket.id));
      });
    });
  }
}

module.exports = SocketDraw;
