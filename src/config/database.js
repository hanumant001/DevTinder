const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://hanumantgh007_db_user:xA5%212BXYBNWv8Bz@dummycluster.tahh4jx.mongodb.net/devTinder",
  );
};


module.exports = connectDB
