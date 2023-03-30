const TwoFactorError = require('../utils/twoFactorError');

const mongooseErrorHandler = (err, req, res, next) => {
    let error = { ...err }

    error.message = err.message

    if (err.name === "CastError") {
      const message = `Invalid ${ err.path} : ${err.value}. this resource doesnt exist`;

      error = new TwoFactorError(message, 404)
    }

    else if (err.code === 11000) {
      let message = Object.keys(err.keyValue)[0];
      message += " Already Exist"
      error = new TwoFactorError(message, 400)
    }

    else if (err.name === "ValidationError") {
      const error = Object.values(err.errros).map((val) => val.message);
      const message = `Invalid input data. ${errors.join(". ")}`;
      error = new TwoFactorError(message, 400)
    }

    return res.status(error.statusCode || 500 ).json({
      success: false,
      error,
      message: error.message
    });
};

module.exports = mongooseErrorHandler;