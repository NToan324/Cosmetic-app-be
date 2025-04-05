import express from 'express'
import cors from 'cors'
import connectDB from '@/config/mongodb'
import router from '@/routers/index'
import errorHandler from '@/middleware/errorHandler'
import bodyParser from 'body-parser'
import dotEnv from 'dotenv'
import 'module-alias/register'

dotEnv.config()

const app = express()
app.use(
  cors({
    origin: '*',
    credentials: true
  })
)
const port = process.env.NODE_ENV === 'development' ? process.env.DEV_PORT || 3000 : process.env.PROD_PORT || 8080

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  console.log(`http://localhost:${port}`)
})
