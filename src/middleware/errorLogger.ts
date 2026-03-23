//import express types with error handling
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
//divider for console output
const divider = "─".repeat(50);

//error handling middleware
const errorLogger: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //retrieve status code
  const status = err.status ?? err.statusCode ?? 500;
  //get timestamp
  const timestamp = new Date().toISOString();
//error log output
  console.error(`
[EML] ERROR
${divider}
  Timestamp: ${timestamp}
  Method:    ${req.method}
  URL:       ${req.originalUrl}
  Status:    ${status}
  Message:   ${err.message}
  Stack:     ${err.stack}
${divider}`);

//calls next middleware  next(err);
};

export default errorLogger;