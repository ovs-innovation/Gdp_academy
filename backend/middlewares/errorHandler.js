export const errorHandler = (err, req, res, next) => {
  console.error("Error detected: ", err.message);
  if (err.stack) console.error(err.stack);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? {
      name: err.name,
      message: err.message,
      stack: err.stack
    } : undefined
  });
};
