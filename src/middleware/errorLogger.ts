import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const divider = "─".repeat(50);

const errorLogger: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status ?? err.statusCode ?? 500;
  const timestamp = new Date().toISOString();

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

  next(err);
};

export default errorLogger;