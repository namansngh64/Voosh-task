require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const auth = require("./app/config/passport");
const { handleError } = require("./app/config/error");
const { connectDb } = require("./app/config/db");

const app = express();

app.use(cors());
app.use(cookieParser());

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET_KEY_AWDWSADADASD"
  })
);
app.use(passport.initialize());
app.use(passport.session());
auth();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/", require("./app/routes"));

app.use(handleError);
require("./app/config/uncaughtError");

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
