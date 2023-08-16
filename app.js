const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const expressMongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const userRoute = require('./routes/userRoute');
const habitsTypeRoute = require('./routes/habitsTypeRoute');
const habitRoute = require('./routes/habitRoute');
const errorController = require('./controllers/errorController');

const app = express();

app.use(helmet());
app.use(expressMongoSanitize());
app.use(xss());
app.use(hpp());
app.use(express.static('public'));
app.use('/images', express.static('images'));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json());

const baseV1ApiRoute = '/api/v1/';
const limiter = rateLimiter({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Rate limit exceeded',
});

app.use(`${baseV1ApiRoute}`, limiter);

app.use(`${baseV1ApiRoute}users`, userRoute);
app.use(`${baseV1ApiRoute}habitsType`, habitsTypeRoute);
app.use(`${baseV1ApiRoute}habits`, habitRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
