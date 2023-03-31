const User = require("../models/User");
const asyncWrapper = require('../utils/asyncManager')

const cookieTokenResponse = ( user, statusCode, res) => {
  const token = user.signJwtToken();

  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *24 *60 *60 *1000),
    httpOnly:true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOption.secure = true
  }
  user.password = undefined;

  res.status(statusCode).cookie('facade', token, cookieOption).json({
    message: "successfull",
    token,
    data: {
      user,
    },
  });
};

// Register user

exports.registerUser = asyncWrapper( async ( req, res, next ) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  cookieTokenResponse(newUser, 201, res);
})