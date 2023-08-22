const dotenv = require("dotenv");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
dotenv.config({ path: "./config.env" });
const app = require(".");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"));

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log("Example app listening on port 3000!");
});

const io = socketIo(server);

exports.io = io;

// process.on('unhandledRejection', (err) => {
//   console.log('Unhandled rejection');
//   console.log(err);
// });
