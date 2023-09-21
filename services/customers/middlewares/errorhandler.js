function errorHandler (err, req, res, next) {
  let status = 500
  let message = "Internal Server Error"

  console.log(err, "<< Error handler Customers");

  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    status = 400
    message = err.errors[0].message
  }

  res.status(status).json({message})
}
module.exports = errorHandler