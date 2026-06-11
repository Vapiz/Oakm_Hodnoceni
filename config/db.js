const mongoose = require('mongoose');
const { setServers } = require('node:dns/promises');

setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB připojeno');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;