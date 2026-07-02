class ApiError extends Error {
  constructor(
    successCode,
    message = "Something went wrong",
    error = [],
    stack = "",
  ) {
    super(message);
    ((this.successCode = successCode),
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
