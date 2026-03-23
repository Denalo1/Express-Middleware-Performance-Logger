const errorLogger = (err, req, res, next) => {
    console.error(`*EML* ERROR:
  Method: ${req.method}
  URL: ${req.originalUrl}
  Status: ${res.statusCode}
  Message: ${err.message}
  Stack: ${err.stack}
`);
    next(err);
};
export default errorLogger;
