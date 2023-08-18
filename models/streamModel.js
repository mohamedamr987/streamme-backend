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

const Stream = mongoose.model("Stream", streamSchema);

module.exports = Stream;
