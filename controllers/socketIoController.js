const socketIo = require("socket.io");
const server = require("../server");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const streamController = require("./streamController");

async function protect(socket, next) {
  let token;
  if (
    socket.handshake.query &&
    socket.handshake.query.authorization &&
    socket.handshake.query.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(
      new AppError("You are not authorized to access this page", 401)
    );
  }
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(err);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("User not found, please authenticate", 401));
  }
  socket.user = user;
  next();
}

exports.startSocketForStream = function (channelName) {
  const io = server.io.of(`/${channelName}`);
  io.use(protect);
  io.on("connection", (socket) => {
    socket.on("chat", (msg) => {
      if (!msg.message) return;
      io.emit("chat", {
        user: socket.user,
        ...msg,
      });
    });
    streamController.userJoinedStream(channelName, socket.user);
    io.emit("joined_viewers", { user: socket.user });
    socket.on("disconnect", () => {
      io.emit("left_viewers", { user: socket.user });
      streamController.userLeftStream(channelName, socket.user);
    });
  });
};
