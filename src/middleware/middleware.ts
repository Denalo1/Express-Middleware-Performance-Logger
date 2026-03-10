import { Request, Response, NextFunction } from "express";


const performanceLogger = function(req:Request, res:Response, next:NextFunction){
    console.log(
        req.method,
        req.ip,
        req.protocol,
        req.signedCookies,
        req.route,
        req.subdomains,
        req.originalUrl
    )
    next()
} 

export default performanceLogger;