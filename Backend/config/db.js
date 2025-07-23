import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://neelam3103:Neelam3103@cluster0.0zrdj2f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.error(error);
  }
};

export default connectDb;
