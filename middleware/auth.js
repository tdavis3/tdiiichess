const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;  // Get the user's unique mongo id or "_id"
    // res.json(req.user);  // Return the user's unique mongo id or "_id"
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
