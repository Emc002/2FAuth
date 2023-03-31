const User = require("../models/User");
const asyncWrapper = require('../utils/asyncManager');
const TwoFactorError = require("../utils/twoFactorError");

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

// Login User

exports.loginUser = asyncWrapper( async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new TwoFactorError('Please provide an email and password', 400)
    )
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !( await user.correctPassword(password, user.password))) {
      return next(
        new TwoFactorError ("Incorect email or password", 401)
      )
  }

  cookieTokenResponse(user, 200, res)
})