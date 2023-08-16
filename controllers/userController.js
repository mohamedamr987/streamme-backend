const User = require('../models/userModel');
const appError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.getAll(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    isError: true,
    message: 'Not implemented',
  });
};

exports.getUserById = factory.getOne(User);

exports.deleteUser = factory.deleteOne(User);
// exports.updateCurrentUser = catchSync(async (req, res, next) => {
//   if (req.body.password || req.body.confirmPassword) {
//     return next(new AppError('Password not allowed in this route', 400));
//   }

//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     filterObj(req.body, 'name', 'email'),
//     { new: true, runValidators: true }
//   );

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updatedUser,
//     },
//   });
// });

// exports.deleteCurrentUser = catchSync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(req.user.id, {
//     active: false,
//   });

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
