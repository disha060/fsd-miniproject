const CustomError = require("../../Helpers/error/CustomError");
const User = require("../../Models/user");
const jwt = require("jsonwebtoken");
const asyncErrorWrapper = require("express-async-handler");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../Helpers/auth/tokenHelpers");

const getAccessToRoute = asyncErrorWrapper(async (req, res, next) => {
  if (!isTokenIncluded(req)) {
    return next(new CustomError("You are not authorized to access this route", 401));
  }

  const accessToken = getAccessTokenFromHeader(req);

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new CustomError("User not found or unauthorized", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new CustomError("Jwt malformed or expired", 401));
  }
});

module.exports = { getAccessToRoute };
