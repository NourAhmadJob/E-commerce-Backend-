const globalError = (err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.status = err.status || "Error");

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  } else {
    return sendErrorProd(err, res);
  }
};
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
