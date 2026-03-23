import { RequestHandler } from "express";
type LogMode = "minimal" | "standard" | "verbose";
type PerfOptions = {
    mode?: LogMode;
    logger?: (output: string) => void;
};
declare function performanceLogger(options?: PerfOptions): RequestHandler;
export default performanceLogger;
