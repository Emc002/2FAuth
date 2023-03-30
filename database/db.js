const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected : ${ connect.connection.host }`)
  } catch (e) {
    console.log(e)
  }
}

module.exports = connectToDB