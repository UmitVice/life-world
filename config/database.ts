import mongoose from 'mongoose';

let connected = false;

const mongoDB_URI = process?.env?.MONGODB_URI as string;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (connected) {
        console.log('Database is already connected');
        return;
    }

    try {
        await mongoose.connect(mongoDB_URI);
        connected = true;
    } catch (error) {
        console.error(error);
    }
};

export default connectDB;