const {generateResponse} = require("../views/response-entity");

class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = 'BadRequestError';
  }
}

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = 'ConflictError';
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  errorHandler: (err, req, res, next) => {
    if (err instanceof BadRequestError || err.name === "SequelizeValidationError") {
      if (err.name === "SequelizeValidationError") {
        const errorList = {};
        err.errors.forEach(e => {
          errorList[e.path] = e.message;
        });
        return generateResponse(res, null, 400, errorList);
      }
      return generateResponse(res, null, 400, err.message);
    }
    if (err instanceof UnauthorizedError || err.name === "JsonWebTokenError") {
      return generateResponse(res, null, 401, err.message);
    }
    if (err instanceof ForbiddenError) {
      return generateResponse(res, null, 403, err.message);
    }
    if (err instanceof NotFoundError) {
      return generateResponse(res, null, 404, err.message);
    }
    if (err instanceof ConflictError || err.name === "SequelizeUniqueConstraintError") {
      if (err.name === "SequelizeUniqueConstraintError") {
        const errorList = {};
        err.errors.forEach(e => {
          errorList[e.path] = e.message;
        });
        return generateResponse(res, null, 409, errorList);
      }
      return generateResponse(res, null, 409, err.message);
    }
    console.error(err);
    return generateResponse(res, null, 500, err.message);
  }
}
