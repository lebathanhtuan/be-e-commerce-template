require('dotenv').config()

const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

const authRoutes = require('./routes/auth.route')
const productRoutes = require('./routes/product.route')
const categoryRoutes = require('./routes/category.route')

const errorHandler = require('./middlewares/error.middleware.js')

const app = express()
const server = http.createServer(app)

const ADMIN_ROOM = 'admin_room'
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('Người dùng đã kết nối:', socket.id)

  socket.on('client_join_chat', (data) => {
    const roomName = data.userId
      ? `user_${data.userId}`
      : `guest_${data.guestId}`
    socket.join(roomName)
    io.to(ADMIN_ROOM).emit('new_chat_session', {
      roomName: roomName,
      clientId: socket.id,
    })
  })

  socket.on('admin_join_dashboard', (data) => {
    socket.join(ADMIN_ROOM)
  })

  socket.on('client_send_message', (data) => {
    io.to(data.roomName).to(ADMIN_ROOM).emit('receive_message', {
      roomName: data.roomName,
      sender: socket.id,
      message: data.message,
    })
  })

  socket.on('admin_send_message', (data) => {
    io.to(data.roomName).to(ADMIN_ROOM).emit('receive_message', {
      roomName: data.roomName,
      sender: 'Shop',
      message: data.message,
    })
  })

  socket.on('disconnect', () => {
    console.log('Người dùng đã ngắt kết nối:', socket.id)
  })
})

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

app.use(errorHandler)

server.listen(3000, () => {
  console.log('Đã chạy ok')
})
