let redis = require('redis')
const RDS_PORT = 6379
const RDS_HOST = '127.0.0.1'
const RDS_OPTS = {}

let client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS)

let redisReady = false
client.on('end', function(err) {
  console.log('end')
})

client.on('connect', function () {
  redisReady = true
})

module.export = {
  setHistory: function () {
    client.set('historyChat')
  },
  getHistory: function () {
    client.get('historyChat')
  }
}