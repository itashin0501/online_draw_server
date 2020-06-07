'use strict';

const SocketDraw = require('./socket/draw');
const SocketChat = require('./socket/chat');

function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Hello teleport</h1>');
}

const app = require('http').createServer(handler);
const io = require('socket.io')(app, { origins: '*:*' });
const SocketRoot = require('./socket/index');
app.listen(3000);

const socketRoot = new SocketRoot();
new SocketDraw(io, socketRoot);
new SocketChat(io, socketRoot);
