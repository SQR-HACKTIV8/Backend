function errorHandler (err, req, res, next) {
  let status = 500
  let message = "Internal Server Error"

  console.log(err, "<< Error handler App");

  if (err.name === "SequelizeValidationError") {
    status = 400
    message = err.errors[0].message
  } else if (err.name === "unauthenticated" || err.name === "JsonWebTokenError") {
    status = 401
    message = "Invalid token"
  }

  res.status(status).json({message})
}
module.exports = errorHandler