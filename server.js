require("dotenv").config();
const express = require('express');
const connectToDB = require('./database/db')

const app = express();

connectToDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({
    message:`Welocme to 2FA`
  })
});


app.listen(PORT, console.log(`Server listening on PORT : ${PORT}....`))