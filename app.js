let express = require('express');
let app = express()
let path = require('path')
// let bodyParser = require('body-parser')
// let cookieParser = require('cookie-parser')

let server = app.listen(3000, function () {
  console.log('listen port : 3000')
})

let io = require('socket.io').listen(server)

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

// app.use(bodyParser)
// app.use(cookieParser)
app.use('/assets', express.static(path.join(__dirname, '/assets')))

io.on('connection', function (socket) {
  console.log(socket.id)
  let socketId = socket.id
  socket.on('login', function (nickName) {
    socket.nickName = nickName
    socket.emit('loginSuccess')
    io.sockets.emit('system', nickName + '加入了房间')
  })
  socket.on('msg', function (data) {
    console.log(data)
    let sendMsg = {
      name: socket.nickName,
      data: data
    }
    socket.broadcast.emit('msg', sendMsg)
  })
  socket.on('img', function (data) {
    console.log(data)
    let sendMsg = {
      name: socket.nickName,
      img: data.img,
      imgName: data.imgName
    }
    socket.broadcast.emit('img', sendMsg)
  })
  socket.on('disconnect', function () {
    if (!socket.nickName) return
    io.sockets.emit('system', socket.nickName + '离开了房间')
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
