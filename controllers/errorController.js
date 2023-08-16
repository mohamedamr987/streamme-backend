const translate = require('translatte');
const AppError = require('../utils/appError');

async function translateFunc(msg) {
  try {
    return (await translate(msg, { to: 'ar' })).text;
  } catch (err) {
    console.log(err);
    return msg;
  }
}

function handleCastError(error) {
  return new AppError(`Invaild ${error.path} : ${error.value}`, 400);
}

function handleDuplicateError(error) {
  return new AppError(
    `Duplicate value ${
      Object.values(error.keyValue)[0]
    }, please try another one`,
    400
  );
}

function handleValidationError(error) {
  const errorMessages = Object.values(error.errors).map((val) => val.message);
  return new AppError(`invalid value ${errorMessages.join('. \n')}`, 400);
}

function handleJsonWebTokenError(error) {
  return new AppError('Not authenticated, please login and try again', 401);
}

async function sendDev(err, req, res, next) {
  res.status(err.statusCode).json({
    isError: true,
    status: err.status,
    message: err.message,
    messageAr: await translateFunc(err.message),
    error: err,
    stack: err.stack,
  });
}

async function sendProd(err, req, res, next) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      isError: true,
      status: err.status,
      message: err.message,
      messageAr: await translateFunc(err.message),
      stack: err.stack,
    });
  } else {
    res.status(500).json({
      isError: false,
      status: err.status,
      stack: err.stack,
      message: 'Something went wrong',
      messageAr: await translateFunc('Something went wrong'),
    });
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Not Found';
  if (process.env.NODE_ENV === 'production') {
    let error;
    if (err.name === 'CastError') {
      error = handleCastError(err);
    }
    if (err.code === 11000) {
      error = handleDuplicateError(err);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationError(err);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenError(err);
    }
    error = error || err;
    sendProd(error, req, res, next);
  } else sendDev(err, req, res, next);
};
