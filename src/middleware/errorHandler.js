// Handle different types of errors
const HandleCastError = (err) => ({
  success: false,
  message: `Invalid ${err.path}: ${err.value}`,
  error: "INVALID_ID",
});

const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return {
    success: false,
    message: `${field} already exists`,
    error: "DUPLICATE_FIELD",
  };
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  return {
    success: false,
    message: "Validation failed",
    errors,
    error: "VALIDATION_ERROR",
  };
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.error("Error:", err); //log error for debugging

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = HandleCastError(err);
    return res.status(400).json(error);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = handleDuplicateFields(err);
    return res.status(400).json(error);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    error = handleValidationError(err);
    return res.status(400).json(error);
  }

  //Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    error: err.error || "SERVER_ERROR",
  });
};

export default errorHandler;