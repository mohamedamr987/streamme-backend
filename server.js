const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const app = require(".");

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("connected to database"));

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log("Example app listening on port 3000!");
});

// process.on('unhandledRejection', (err) => {
//   console.log('Unhandled rejection');
//   console.log(err);
// });
