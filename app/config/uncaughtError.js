const { handleError } = require("./error");

process.on("uncaughtException", (err) => {
  err.controller = "uncaughtException";
  handleError(err);
});
