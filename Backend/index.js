import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoute from './routes/userRoutes.js'
dotenv.config()
const app = express()

const port = process.env.PORT || 5000
app.use(express.json())

// ! cors set
const allowedOrigins = [
  "http://localhost:5173",                  // Local dev
  "https://authorazation-jbh6.vercel.app", // Production frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
// }))



app.get('/',(req,res)=>{
    res.send("server run...")
})
app.use('/user', userRoute)


app.listen(port, ()=>{
    connectDB()
    console.log(`server running port : ${port}`)
})