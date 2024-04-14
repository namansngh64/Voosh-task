const crypto = require("crypto");
const User = require("../models/user");
const { generateToken } = require("../utils/auth");
const { loginSchema, signupSchema } = require("../validators/auth");

const googleLogin = async (req, res, next) => {
  try {
    const { _json } = req.user;
    const { email, name, picture, sub } = _json;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      const token = generateToken(userExists);
      // can specify httpOnly and secure flags as well
      res.cookie("access_token", token, { maxAge: 1000 * 60 * 60 * 24 });
      // Returning token as well to add in the auth headers as this is google auth
      // Done only for testing purpose
      return res
        .status(200)
        .json({ message: "Logged in successfully", access_token: token });
    }
    const password = crypto
      .createHash("sha256")
      .update(`${sub}_${Math.random().toString(36)}`)
      .digest("hex");
    const newUser = await User.create({
      email,
      name,
      profile_pic: picture,
      login_type: "google",
      password
    });
    const token = generateToken(newUser);
    // can specify httpOnly and secure flags as well
    res.cookie("access_token", token, { maxAge: 1000 * 60 * 60 * 24 });
    // Returning token as well to add in the auth headers as this is google auth
    // Done only for testing purpose
    return res
      .status(200)
      .json({ message: "Logged in successfully", access_token: token });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
    const { email, password } = req.body;
    const encryptedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    const user = await User.findOne({
      where: { email, password: encryptedPassword }
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    // can specify httpOnly and secure flags as well
    res.cookie("access_token", token, { maxAge: 1000 * 60 * 60 * 24 });
    return res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    await signupSchema.validateAsync(req.body);
    const { name, email, password } = req.body;
    const encryptedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
      login_type: "password"
    });
    const token = generateToken(user);
    // can specify httpOnly and secure flags as well
    res.cookie("access_token", token, { maxAge: 1000 * 60 * 60 * 24 });
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { googleLogin, logout, login, signup };
