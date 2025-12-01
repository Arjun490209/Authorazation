import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/notes`)
        console.log("DB connect successfully.")
    } catch (error) {
        console.log("Mongodb connection Error", error)
    }
}

export default connectDB
