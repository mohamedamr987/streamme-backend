const socketIo = require("socket.io");
const server = require("../server");

exports.startSocketForStream = function (channelName) {
  const io = server.io.of(`/${channelName}`);
  io.on("connection", (socket) => {
    console.log("New connection");
    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
      setTimeout(() => socket.disconnect(true), 5000);
    });
  });
};

exports.closeSocketForStream = function (channelName) {
  server.io.of(`/${channelName}`).local.disconnectSockets();
  server.io._nsps.delete(`/${channelName}`);
};
