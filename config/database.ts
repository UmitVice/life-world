import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        return;
    }

    const mongoDB_URI = process?.env?.MONGODB_URI;

    if (!mongoDB_URI) {
        throw new Error('Missing MONGODB_URI environment variable');
    }

    try {
        await mongoose.connect(mongoDB_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        } as any);
        isConnected = true;
    } catch (error) {
        isConnected = false;
        throw error;
    }
};

export default connectDB;