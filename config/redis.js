const Redis = require("ioredis")

const uri = "redis://default:SKwhx5bL7OMzWvKLNbi2BKOVby687Wz4@redis-12243.c252.ap-southeast-1-1.ec2.cloud.redislabs.com:12243"
const redis = new Redis (uri)

module.exports = redis