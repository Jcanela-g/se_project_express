const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const CONFLICT = 409;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;

const DEFAULT_SERVER_ERROR_MESSAGE = "An error has occurred on the server.";
const BAD_REQUEST_MESSAGE = "Invalid data entered.";
const NOT_FOUND_MESSAGE = "Requested info not found.";
const EMAIL_CONFLICT_MESSAGE = "Duplicate email, email already exist.";
const UNAUTHORIZED_MESSAGE = "Invalid email or password";
const FORBIDDEN_MESSAGE = "You do not have permission to delete this item";

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
  FORBIDDEN,
  DEFAULT_SERVER_ERROR_MESSAGE,
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_MESSAGE,
  EMAIL_CONFLICT_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  FORBIDDEN_MESSAGE,
};
