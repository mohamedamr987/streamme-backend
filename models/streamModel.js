const mongoose = require("mongoose");

const streamSchema = mongoose.Schema({
  channelName: {
    type: String,
    required: [true, "Please enter a channel name"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please enter a user"],
  },
  viewers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

streamSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
  }).populate({
    path: "viewers",
  });
  next();
});

const Stream = mongoose.model("Stream", streamSchema);

module.exports = Stream;
