const Controller = require('../controllers/controller')
const { authentication } = require('../middlewares/authentication')

const router = require('express').Router()

module.exports = router

router.get('/', (req, res) => {
  res.send('Hello from App-services!')
})

router.post('/notifications', Controller.createNotification) // admin

router.use(authentication)
