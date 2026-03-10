"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const performanceLogger = function (req, res, next) {
    console.log(req.method, req.ip, req.protocol, req.signedCookies, req.route, req.subdomains, req.originalUrl);
    next();
};
exports.default = performanceLogger;
