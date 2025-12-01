import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoute from './routes/userRoutes.js'
dotenv.config()
const app = express()

const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use('/user', userRoute)


app.listen(port, ()=>{
    connectDB()
    console.log(`server running port : ${port}`)
})