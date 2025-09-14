import logger from '../utils/logger.js';

const globalErrorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err.message.startsWith('AppError: ')) {
    err.statusCode = 400;
    err.status = 'fail';
    err.message = err.message.slice(10);
  } else {
    err.statusCode = 500;
    err.status = 'error';
  }

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default globalErrorHandler;
