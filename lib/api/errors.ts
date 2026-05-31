type ApiErrorOptions = {
  status?: number;
  details?: unknown;
};

export class ApiError extends Error {
  readonly status?: number;
  readonly details?: unknown;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.details = options.details;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", options: ApiErrorOptions = {}) {
    super(message, options);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden", options: ApiErrorOptions = {}) {
    super(message, options);
    this.name = "ForbiddenError";
  }
}

export class SessionExpiredError extends ApiError {
  constructor(message = "Session expired", options: ApiErrorOptions = {}) {
    super(message, options);
    this.name = "SessionExpiredError";
  }
}
