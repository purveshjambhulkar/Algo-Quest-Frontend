
import mongoose from 'mongoose';
import { toast } from 'sonner';

let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (isConnected) {
    return true;
  }

  try {
    // Use MONGO_URI environment variable if available, otherwise fall back to the hardcoded value
    const mongoURI = "mongodb+srv://purveshjambhulkar16:wzynTleSmEoZPr54@cluster0.7daen0o.mongodb.net/";
    
    if (!mongoURI) {
      console.error('MongoDB URI is not defined');
      toast.error('MongoDB URI is not defined');
      return false;
    }
    
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    isConnected = true;
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    toast.error("Failed to connect to database");
    return false;
  }
};

export default connectDB;
