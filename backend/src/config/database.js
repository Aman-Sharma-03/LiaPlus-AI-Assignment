const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }
  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = { connectDB };
