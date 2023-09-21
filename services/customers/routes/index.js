const Controller = require('../controllers/controller')

const router = require('express').Router()

module.exports = router

router.get('/', (req, res) => {
  res.send('Hello from Customers-services!')
})

router.post('/register', Controller.register)
router.post('/login', Controller.login)