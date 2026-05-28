import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error('MONGODB_URI not defined');

    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB error: ${err}`);
    });

  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error}`);
    process.exit(1);
  }
};

export default connectDB;