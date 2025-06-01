const { JWT_SECRET = "dev‐fallback‐secret" } = process.env;

if (!process.env.JWT_SECRET) {
  console.warn(
    "Warning: JWT_SECRET is not defined in the environment. Using fallback."
  );
}

module.exports = {
  JWT_SECRET,
};
