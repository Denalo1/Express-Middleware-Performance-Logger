console.log("USING MY LOCAL MIDDLEWARE");
const performanceLogger = (req, res, next) => {
    const startTime = process.hrtime.bigint();
    res.on("finish", () => {
        const endTime = process.hrtime.bigint();
        const durationNs = endTime - startTime;
        const durationMs = Number(durationNs) / 1000000;
        console.log(`*EML* Server received a request:
  =============
  Request IP: ${req.ip}
  Request Protocol: ${req.protocol}
  Method: ${req.method}
  Original URL: ${req.originalUrl}
  Base URL: ${req.baseUrl}
  Path: ${req.path}
  Route: ${req.route ? req.route.path : 'N/A'}
  Query Params: ${JSON.stringify(req.query)}
  Route Params: ${JSON.stringify(req.params)}
  Headers: ${JSON.stringify(req.headers)}
  Signed Cookies: ${JSON.stringify(req.signedCookies)}
  SubDomains: ${req.subdomains.join(', ')}
  Fresh: ${req.fresh}
  Stale: ${req.stale}
  XHR: ${req.xhr}
  ================
  Response data:
  Status Code: ${res.statusCode}
  Status Message: ${res.statusMessage}
  Response Headers: ${JSON.stringify(res.getHeaders())}
  Response Time: ${durationMs.toFixed(2)} ms
      `);
    });
    next();
};
export default performanceLogger;
