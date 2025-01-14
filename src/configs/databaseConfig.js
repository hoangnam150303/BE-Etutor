const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: "etutor",
    });
    console.log("connect database success!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
