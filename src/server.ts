import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb'
import router from './routers/index'
import errorHandler from './middleware/errorHandler'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import SocketService from './services/socket.service'
import SocketInstance from './services/socket.instance'
import bodyParser from 'body-parser'
import dotEnv from 'dotenv'
dotEnv.config()

const app = express()
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
})

const port = process.env.NODE_ENV === 'development' ? process.env.DEV_PORT || 5000 : process.env.PROD_PORT || 8080

//Socket
const socketService = new SocketService(io)
SocketInstance.init(io)
socketService.init()

//Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

//connect database
connectDB()

//import routes
app.use(router)

//handler error
app.use(errorHandler.notFoundError)
app.use(errorHandler.globalError)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  console.log(`http://localhost:${port}`)
})
