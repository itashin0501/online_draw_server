'use strict';

class SocketRoot {
  constructor() {
    this.userHash = {}; // ユーザ管理ハッシュ
  }

  getUserHash() {
    return this.userHash;
  }
  getUser(socketId) {
    return this.userHash[socketId];
  }
  addUser(socketId, data) {
    this.userHash[socketId] = data.user;
  }
}

module.exports = SocketRoot;
