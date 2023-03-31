const User = require("../models/User");
const asyncWrapper = require('../utils/asyncManager');
const TwoFactorError = require("../utils/twoFactorError");
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
require('dotenv').config();
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
  user.twoFactorAuthCode = undefined

  res.status(statusCode).cookie('facade', token, cookieOption).json({
    message: "successfull",
    token,
    data: {
      user,
    },
  });
};

const generateSpeakeEasySecretCode = () => {
  const secretCode = speakeasy.generateSecret({
      name: process.env.TWO_FACTOR_APP_NAME,
  });
  return {
    otpauthUrl: secretCode.otpauth_url,
    base32: secretCode.base32
  }
};

const returnQRCode = (data, res) => {
  QRCode.toFileStream(res, data);
}

exports.generate2FACode = asyncWrapper( async (req, res, next) => {
  const token = req.cookies.facade;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
  const { otpauthUrl, base32 } = generateSpeakeEasySecretCode();
  await User.findOneAndUpdate(decoded.id, {
    twoFactorAuthCode: base32,
  });

  returnQRCode(otpauthUrl, res);

})

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

// Logout

exports.logOutUser = asyncWrapper( async (req, res, next) => {
    res.cookie('facade', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ message : "Logout Success" });
});