const mongoose = require('mongoose');

// const URI = 'mongodb://localhost:27017/fashion-closet'; //compassURI
// const URI = 'mongodb+srv://fashion-closet:fashion-closet@cluster0.2kmzsps.mongodb.net/fashion-closet' //atlasURI
const URI = `mongodb+srv://hamdanraza309:AaOUY8RWUNV9FpQo@fashion-closet.na4w4.mongodb.net/fashion-closet`
const connectToMongoDb = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || URI;
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
    }
};

module.exports = connectToMongoDb;