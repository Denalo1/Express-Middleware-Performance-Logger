import { Request, Response, NextFunction,ErrorRequestHandler } from "express";
 const errorLogger: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
console.error(
`*EML* ERROR:
  Method: ${req.method}
  URL: ${req.originalUrl}
  Status: ${res.statusCode}
  Message: ${err.message}
  Stack: ${err.stack}
`);

  next(err);
};

export default errorLogger