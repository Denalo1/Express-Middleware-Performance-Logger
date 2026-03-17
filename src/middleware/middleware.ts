import { Request, Response, NextFunction, RequestHandler } from "express";

const performanceLogger: RequestHandler = (req:Request, res:Response, next:NextFunction) => {
   const startTime = process.hrtime.bigint();

    res.on("finish", () => {
        const endTime = process.hrtime.bigint();
        const durationNs = endTime - startTime; // nanoseconds
        const durationMs = Number(durationNs) / 1_000_000; // convert to milliseconds

    console.log(
       `*EML* Server recieved a request:
        Request IP: ${req.ip}
        Request Protocol: ${req.protocol}
        Signed Cookies: ${req.signedCookies}
        Route: ${req.route}
        SubDomains: ${req.subdomains}
        OriginalURL: ${req.originalUrl}
        Response time: ${durationMs}
        `
    )
    })
    
    next()
};


export const PerformanceLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();
  res.on("finish", () => {
    const endTime = process.hrtime.bigint();
    const durationNs = endTime - startTime;
    const durationMs = Number(durationNs) / 1_000_000;
    console.log(`${req.method} ${req.originalUrl} - ${durationMs.toFixed(2)} ms`);
  });


  next();
};

export default performanceLogger;