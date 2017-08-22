let redis = require('redis')
const RDS_PORT = 6379
const RDS_HOST = '127.0.0.1'
const RDS_OPTS = {}

let client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS)
let historyArray = []

let redisReady = false
client.on('end', function(err) {
  console.log('end')
})

client.on('connect', function () {
  redisReady = true
})

let getHistory = function (callback) {
  client.get('historyChat', callback)
}

let setHistory = function (data) {
  historyArray.push(data)
  if (historyArray.length > 10) {
    historyArray.shift()
  }
  client.set('historyChat', JSON.stringify(historyArray), redis.print)
}

getHistory((err, reply) => {
  if (err) {
    console.log(err)
    return false
  }
  if (reply) {
    historyArray = JSON.parse(reply)
  }
})

module.exports = {
  setHistory,
  getHistory
}
