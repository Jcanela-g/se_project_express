const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_MESSAGE } = require("../utils/errors");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE));
  }

  req.user = payload;
  return next();
};
