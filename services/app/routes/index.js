const router = express().Router

module.exports = router

router.get('/', (req, res) => {
  res.send('Hello from App-services!')
})