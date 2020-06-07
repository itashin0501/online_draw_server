'use strict';

class SocketChat {
  constructor(io, socketRoot) {
    this._init(io.of('/nsp_chat'), socketRoot);
  }
  _init(nsp, socketRoot) {
    const chatSocket = nsp.on('connection', function (socket) {
      socket.on('join room', function (roomName) {
        socket.join(roomName);
      });

      socket.on('get room users', function (roomName) {
        const userHash = socketRoot.getUserHash();
        nsp.in(roomName).clients((error, clients) => {
          const users = [];
          clients.forEach((c) => {
            users.push(userHash[c]);
          });
          chatSocket.to(socket.id).emit('get room users', users);
        });
      });

      socket.on('add user', function (data) {
        socketRoot.addUser(socket.id, data);
        socket.broadcast.to(data.room).emit('add user', data.user);
      });

      socket.on('direct message', function (data) {
        const userHash = socketRoot.getUserHash();
        for (const key in userHash) {
          if (userHash[key].id == data.toUserId) {
            chatSocket.to(key).emit('direct message', { message: data.message, from: userHash[socket.id] });
            return;
          }
        }
      });

      socket.on('disconnect', function () {
        socket.broadcast.emit('user disconnected', socketRoot.getUser(socket.id));
      });
    });
  }
}

module.exports = SocketChat;
