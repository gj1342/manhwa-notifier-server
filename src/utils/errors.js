class ApplicationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApplicationError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class ConflictError extends ApplicationError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

export {
  ApplicationError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
}; 