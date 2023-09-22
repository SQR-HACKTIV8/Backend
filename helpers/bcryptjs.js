const bcryptjs = require ("bcryptjs")

const hashPassword = (password) => bcryptjs.hashSync(password, 8)
const comparePassword = (password, passwordDb) => bcryptjs.compareSync(password, passwordDb)

module.exports = {
  hashPassword,
  comparePassword
}