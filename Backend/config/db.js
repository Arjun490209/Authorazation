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
    const mongoURL = process.env.MONGO_URL; // should be like mongodb+srv://user:pass@cluster0.mongodb.net/notes
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully 🚀");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;

