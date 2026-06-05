import mongoose from 'mongoose';

const mongoDB_URI = process?.env?.MONGODB_URI as string;

let connected = false;

mongoose.set('strictQuery', true);

const connectDB = async () => {
  if (connected) {
    return;
  }

  try {
    await mongoose.connect(mongoDB_URI);
    connected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; // Re-throw the error so the application knows it failed
  }
};
 
export default connectDB;
