const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) =>
    res.status(429).send({
      message: "Too many requests from this IP, please try again later.",
    }),
});

module.exports = apiLimiter;
