const { promisify } = require("util");
const crypto = require("crypto");
const fs = require("fs");
const translate = require("translatte");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchSync = require("../utils/catchSync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

function createToken(id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
  return token;
}

exports.signUp = catchSync(async (req, res, next) => {
  const message =
    "User created successfully, check the sent email for the verification code";
  const user = await User.create({
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const token = createToken(user._id);

  res.status(201).json({
    isError: false,
    message: message,
    data: {
      user,
    },
    messageAr: (await translate(message, { to: "ar" })).text,
  });
});

exports.login = catchSync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = createToken(user._id);

  res.status(201).json({
    isError: false,
    token,
    data: {
      user,
    },
  });
});

exports.protectWithToken = async function (req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(
      new AppError("You are not authorized to access this page", 401)
    );
  }
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(err);
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("User not found, please authenticate", 401));
  }
  req.user = user;
  next();
};

exports.restrictTo = (...roles) =>
  function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not authorized to this resource", 403));
    }
    next();
  };
