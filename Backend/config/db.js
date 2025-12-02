// import mongoose from "mongoose";

// const connectDB = async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGO_URL}/notes`)
//         console.log("DB connect successfully.")
//     } catch (error) {
//         console.log("Mongodb connection Error", error)
//     }
// }

// export default connectDB

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;
    await mongoose.connect(mongoURL, {
      dbName: "notes"
    });

    console.log("MongoDB connected successfully 🚀");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDB;


