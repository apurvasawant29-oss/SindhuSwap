const ERROR_MESSAGES = {
  SERVER_ERROR: "Internal server error",
  ROUTE_NOT_FOUND: "Route not found",
  VALIDATION_FAILED: "Validation failed",
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Access denied",
  INVALID_CREDENTIALS: "Invalid email or password",
  INVALID_ADMIN_CREDENTIALS: "Invalid admin credentials",
  EMAIL_EXISTS: "Email is already registered",
  USER_NOT_FOUND: "User not found",
  INVALID_TOKEN: "Invalid token",
  TOKEN_EXPIRED: "Token expired",
  ACCOUNT_INACTIVE: "Account is not active",
  RESOURCE_NOT_FOUND: "Resource not found",
  NOT_OWNER: "You are not allowed to modify this resource",
};

module.exports = {
  ERROR_MESSAGES,
};
