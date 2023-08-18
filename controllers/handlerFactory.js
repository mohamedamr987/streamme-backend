const catchSync = require("../utils/catchSync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchSync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError("Couldn't find doc", 404));
    res.status(204).json({
      isError: false,
      message: "Doc deleted successfully",
    });
  });

exports.updateOne = (Model) =>
  catchSync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError("Couldn't find doc", 404));
    res.status(200).json({
      isError: false,
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchSync(async (req, res, next) => {
    if (req.file)
      // eslint-disable-next-line no-multi-assign
      req.body.photo = req.body.icon = `${req.protocol}://${req.get("host")}/${
        req.file.path
      }`;
    if (req.user) req.body.user = req.user.id;
    const doc = await Model.create(req.body);
    res.status(201).json({
      isError: false,
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchSync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;
    if (!doc) return next(new AppError("Couldn't find doc", 404));
    res.status(200).json({
      isError: false,
      data: doc,
    });
  });

exports.getAll = (Model, filterFunc = () => {}) =>
  catchSync(async (req, res, next) => {
    const apiFeatures = new APIFeatures(
      Model.find(filterFunc(req, res)),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const [docs, totalDocs] = await Promise.all([
      apiFeatures.query,
      apiFeatures.getTotalCount(),
    ]);

    const totalPages = Math.ceil(totalDocs / apiFeatures.queryParams.limit);

    res.status(200).json({
      isError: false,
      results: docs.length,
      status: "success",
      data: docs,
      pagination: {
        lastPage: totalPages,
      },
    });
  });
