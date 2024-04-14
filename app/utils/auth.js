const jwt = require("jsonwebtoken");
const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY
} = process.env;
const generateToken = (user, tokenType) => {
  const secret =
    (tokenType === "refresh" ? JWT_REFRESH_SECRET : JWT_ACCESS_SECRET) ||
    "secret";
  const expiry =
    (tokenType === "refresh" ? JWT_REFRESH_EXPIRY : JWT_ACCESS_EXPIRY) || "1d";

  const token = jwt.sign(
    { id: user.id, user_type: user.login_type, role: user.role },
    secret,
    {
      expiresIn: expiry
    }
  );

  if (token) {
    return token;
  }
  return null;
};
const verifyAccessToken = (req, res, next) => {
  try {
    // First check cookies and then headers
    // Done this way so that the google auth token can be added to headers
    // As adding to cookie might be tricky
    // DONE ONLY FOR TESTING PURPOSE
    const token =
      req.cookies["access_token"] || req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { generateToken, verifyAccessToken };
