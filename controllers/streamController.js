const agoraController = require("./agoraController");
const catchSync = require("../utils/catchSync");
const AppError = require("../utils/appError");
const Stream = require("../models/streamModel");
const handlerFactory = require("./handlerFactory");
const { RtcRole } = require("agora-access-token");
const socketIoController = require("./socketIoController");

exports.getAllStreams = handlerFactory.getAll(Stream);

exports.createStream = catchSync(async (req, res, next) => {
  const user = req.user._id;
  let stream = await Stream.findOne({ channelName: user });
  if (!stream) stream = await Stream.create({ channelName: user, user });

  const token = agoraController.generateToken(user, RtcRole.PUBLISHER);
  stream.user = req.user;
  socketIoController.startSocketForStream(user);
  res.status(201).json({
    isError: false,
    message: "Stream created successfully",
    data: {
      stream,
      token,
    },
  });
});

exports.joinStream = catchSync(async (req, res, next) => {
  const { channelName } = req.body;
  const stream = await Stream.findOne({ channelName });
  if (!stream) return next(new AppError("Stream not found", 404));

  stream.viewers.push(req.user._id);
  await stream.save();

  const token = agoraController.generateToken(channelName, RtcRole.SUBSCRIBER);
  res.status(200).json({
    isError: false,
    message: "Stream joined successfully",
    data: {
      stream,
      token,
    },
  });
});

exports.deleteStream = (req, res, next) => {
  const { channelName } = req.body;
  handlerFactory.deleteOne(Stream)(req, res, next);
};

exports.userJoinedStream = async (channelName, user) => {
  const stream = await Stream.findOne({ channelName });
  if (!stream) return next(new AppError("Stream not found", 404));

  stream.viewers.push(user._id);
  await stream.save();
};

exports.userLeftStream = async (channelName, user) => {
  const stream = await Stream.findOne({ channelName });
  if (!stream) return next(new AppError("Stream not found", 404));
  const index = stream.viewers.indexOf(req.user._id);
  stream.viewers.splice(index, 1);
  await stream.save();
};
