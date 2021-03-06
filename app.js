let express = require('express');
let xss = require('xss');
let app = express()
let path = require('path')
let serverMethod = require('./server/history_chat.js')
// let bodyParser = require('body-parser')
// let cookieParser = require('cookie-parser')

let server = app.listen(3000, function () {
  console.log('listen port : 3000')
})

let io = require('socket.io').listen(server)

let userArr = []

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

// app.use(bodyParser)
// app.use(cookieParser)
app.use('/assets', express.static(path.join(__dirname, '/assets')))

io.on('connection', function (socket) {
  console.log(socket.id)
  socket.on('login', function (nickName) {
    socket.nickName = xss(nickName)

    userArr.push(socket.nickName)
    io.sockets.emit('userArr', userArr)

    socket.emit('loginSuccess')
    serverMethod.getHistory((err, reply) => {
      if (err) {
        console.log(err)
      } if (reply) {
        socket.emit('history', JSON.parse(reply))
      }
      io.sockets.emit('system', xss(nickName) + ' 加入了房间')
    })
  })
  socket.on('msg', function (data) {
    console.log(xss(data))
    let sendMsg = {
      name: xss(socket.nickName),
      data: xss(data)
    }
    serverMethod.setHistory({
      type: 'msg',
      name: sendMsg.name,
      data: sendMsg.data
    })
    socket.broadcast.emit('msg', sendMsg)
  })
  socket.on('img', function (data) {
    console.log(data)
    let sendMsg = {
      name: xss(socket.nickName),
      img: xss(data.img),
      imgName: xss(data.imgName)
    }
    serverMethod.setHistory({
      type: 'img',
      name: sendMsg.name,
      img: sendMsg.img,
      imgName: sendMsg.imgName
    })
    socket.broadcast.emit('img', sendMsg)
  })
  socket.on('disconnect', function () {
    if (!socket.nickName) return

    for (let i = 0; i < userArr.length; i++) {
      if (userArr[i] === socket.nickName) userArr.splice(i, 1)
    }
    io.sockets.emit('userArr', userArr)

    io.sockets.emit('system', socket.nickName + ' 离开了房间')
  })
})

app.get('/', function (req, res) {
res.render('chat')
})

app.use(function (req, res, next) {
let err = new Error('Not Found');
err.status = 404
next(err)
})

app.use(function (err, req, res, next) {
res.status(err.status || 500)
res.render('error', {
message: err.message,
error: {}
})
})
