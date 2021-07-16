const jwt = require("jsonwebtoken");

exports.tokenVerify = async (req, res, next) => {
  // Get Token From Header
  const token = req.header("token");
  // Check IF Not Token
  if (!token) return res.status(401).send("Access Deined");
  // If It Is Token
  // Check If Token Expierd
  try {
    const verifed = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = verifed;
    next();
  } catch (error) {
    // If Token Not Expierd User Login Again
    res.status(400).send("Invild Token");
  }
};
