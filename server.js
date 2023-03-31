require('dotenv').config();
const express = require('express');
const connectToDB = require('./database/db')
const ErrorMiddleware = require('./middleware/mongooseErrorHandler')
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception..... stopping the server ....");
  console.log(error.name, error.message);
  process.exit(1);
})

const app = express();

connectToDB();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({
    message:`Welocme to 2FA`
  })
});

app.use("/api/v1", authRoutes)

// Error Middleware
app.use(ErrorMiddleware);


const server  = app.listen(PORT, console.log(`Server listening on PORT : ${PORT}....`))

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection..... stopping the server ....");
  console.log(error.name, error.message);
  server.close( () => {
    process.exit(1);
  });
});