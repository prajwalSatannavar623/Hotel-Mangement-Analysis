class ApiResponse {
  constructor(successCode = 200, data, message = "success") {
    ((this.successCode = successCode),
      (this.data = data),
      (this.message = message),
      (this.success = successCode < 400));
  }
}

export { ApiResponse };
