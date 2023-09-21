function errorHandler (err, req, res, next) {
  let status = 500
  let message = "Internal Server Error"

  console.log(err, "<< Error handler App");

  res.status(status).json({message})
}
module.exports = errorHandler