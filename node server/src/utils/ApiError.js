class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    error = [],
    stack = "",
  ) {
    super(message);
    ((this.statusCode = statusCode),
      (this.message = message),
      (this.error = error));
    this.success = false;

    if (stack.length > 0) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
