import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        console.log('MONGO_URI:', process.env.MONGO_URI); // ← این خط اضافه شد
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error:${error.message}`)
        process.exit(1);
    }
};

export default connectDB;