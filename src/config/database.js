const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in .env file');
      process.exit(1);
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('\n💡 Whitelist your IP in MongoDB Atlas:');
      console.error('   https://cloud.mongodb.com/v2#/security/network/whitelist');
    } else if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.error('\n💡 Check your MongoDB username and password:');
      console.error('   1. Go to: https://cloud.mongodb.com/v2#/security/database/users');
      console.error('   2. Verify credentials in MONGODB_URI');
      console.error('   3. Special characters in password need URL-encoding');
      console.error('   See FIX_AUTH.md for detailed instructions');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;

