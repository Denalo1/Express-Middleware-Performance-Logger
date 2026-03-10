import { Request, Response, NextFunction } from "express";
declare const performanceLogger: (req: Request, res: Response, next: NextFunction) => void;
export default performanceLogger;
