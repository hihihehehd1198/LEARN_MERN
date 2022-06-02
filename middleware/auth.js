const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  //check if not token
  if (!token) {
    res.status(401).json({ msg: "no token auth ! " });
  }
  try {
    //verify : giai ma code lay ra user
    const encoded = jwt.verify(token, config.get("jwtToken"));
    req.user = encoded.user;
    
    next();
  } catch (err) {
    res.status(401).json({ msg: "token is not valid " });
  }
};
