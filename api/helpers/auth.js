const {UnauthorizedError, ForbiddenError} = require("./error");
const {verifyToken} = require("./jwt");
module.exports = {
  authentication: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedError("Token is required");
    }
    if (!token.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid token format");
    }
    const tokenValue = token.split(" ")[1];
    req.user = verifyToken(tokenValue);
    next();
  },
  adminOrSelfAuth: (req, res, next) => {
    try {
      if (req.user.role !== "admin" && req.user.id !== req.params.id) {
        throw new ForbiddenError("You are not allowed to access this resource");
      }
      next();
    } catch (e) {
      next(e);
    }
  },
  adminOnlyAuth: (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        throw new ForbiddenError("You are not allowed to access this resource");
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}
