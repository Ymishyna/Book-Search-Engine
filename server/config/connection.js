const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MyDB');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://yanamishina92:Password@cluster0.1l3qfmp.mongodb.net/MyDB?retryWrites=true&w=majority&appName=Cluster0');

module.exports = mongoose.connection;
