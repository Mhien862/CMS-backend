import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://hientran:Minhhien2305%4002@cluster0.uv23e.mongodb.net/CMS?retryWrites=true&w=majority"
    );
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("Error: ${error.message}");
    process.exit(1);
  }
};

export default connectDB;
