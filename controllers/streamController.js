const generateToken = require("./agoraController");
const catchSync = require("../utils/catchSync");
const AppError = require("../utils/appError");
const Stream = require("../models/streamModel");
const handlerFactory = require("./handlerFactory");
const { RtcRole } = require("agora-access-token");

exports.getAllStreams = handlerFactory.getAll(Stream);

exports.createStream = catchSync(async (req, res, next) => {
  const user = req.user._id;
  const stream = await Stream.create({ channelName: user, user });
  const token = generateToken(channelName, RtcRole.PUBLISHER);
  res.status(201).json({
    isError: false,
    message: "Stream created successfully",
    data: {
      ...stream,
      token,
    },
  });
});

exports.joinStream = catchSync(async (req, res, next) => {
  const { channelName } = req.params;
  const stream = await Stream.findOne({ channelName });
  if (!stream) return next(new AppError("Stream not found", 404));

  stream.viewers.push(req.user._id);
  await stream.save();

  const token = generateToken(channelName, RtcRole.SUBSCRIBER);
  res.status(200).json({
    isError: false,
    message: "Stream joined successfully",
    data: {
      ...stream,
      token,
    },
  });
});

exports.deleteStream = handlerFactory.deleteOne(Stream);