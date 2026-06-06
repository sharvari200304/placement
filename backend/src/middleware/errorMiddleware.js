import { fail } from "../utils/apiResponse.js";

export const notFound = (req, res) => {
  fail(res, `Route not found: ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || res.statusCode || 500;
  const message = err.message || "Internal server error";

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((item) => item.message);
    return fail(res, "Validation failed", 400, errors);
  }

  if (err.name === "CastError") {
    return fail(res, "Invalid resource id", 400);
  }

  fail(res, message, status === 200 ? 500 : status);
};
