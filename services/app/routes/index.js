const { authentication } = require('../middlewares/authentication')

const router = require('express').Router()

module.exports = router

router.get('/', (req, res) => {
  res.send('Hello from App-services!')
})

router.use(authentication)
