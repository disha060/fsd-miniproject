const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res.status(statusCode).json({
    success: true,
    token,
  });
};

// Checks if token exists in request header
const isTokenIncluded = (req) => {
  return (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  );
};

// Extracts token from Authorization header
const getAccessTokenFromHeader = (req) => {
  const authorization = req.headers.authorization;
  const access_token = authorization.split(" ")[1];
  return access_token;
};

module.exports = { sendToken, isTokenIncluded, getAccessTokenFromHeader };
