//createst a divider for the console output
const divider = "─".repeat(50);
//logs minimal output
function formatMinimal(req, res, durationMs) {
    return (`\n[EML] ${req.method} ${req.originalUrl} ` +
        `→ ${res.statusCode} (${durationMs}ms)`);
}
//logs standard output
function formatStandard(req, res, durationMs) {
    return `
[EML] Request / Response
${divider}
  Method:        ${req.method}
  URL:           ${req.originalUrl}
  Path:          ${req.path}
  Query Params:  ${JSON.stringify(req.query)}
  Route Params:  ${JSON.stringify(req.params)}
  Status Code:   ${res.statusCode}
  Response Time: ${durationMs}ms
${divider}`;
}
//logs verbose output
function formatVerbose(req, res, durationMs) {
    return `
[EML] Request / Response — Verbose
${divider}
  REQUEST
    IP:             ${req.ip}
    Protocol:       ${req.protocol}
    Method:         ${req.method}
    Original URL:   ${req.originalUrl}
    Base URL:       ${req.baseUrl}
    Path:           ${req.path}
    Route:          ${req.route ? req.route.path : "N/A"}
    Query Params:   ${JSON.stringify(req.query)}
    Route Params:   ${JSON.stringify(req.params)}
    Headers:        ${JSON.stringify(req.headers, null, 2)}
    Signed Cookies: ${JSON.stringify(req.signedCookies)}
    Subdomains:     ${req.subdomains.join(", ") || "N/A"}
    Fresh:          ${req.fresh}
    Stale:          ${req.stale}
    XHR:            ${req.xhr}
${divider}
  RESPONSE
    Status Code:      ${res.statusCode}
    Status Message:   ${res.statusMessage}
    Response Headers: ${JSON.stringify(res.getHeaders(), null, 2)}
    Response Time:    ${durationMs}ms
${divider}`;
}
//creates performance logger middleware with timer 
function performanceLogger(options = {}) {
    const { mode = "minimal", logger = console.log } = options;
    return (req, res, next) => {
        //start timer
        const startTime = process.hrtime.bigint();
        res.on("finish", () => {
            const endTime = process.hrtime.bigint();
            const durationMs = (Number(endTime - startTime) / 1000000).toFixed(2);
            let output;
            //selects the format based on mode
            switch (mode) {
                case "verbose":
                    output = formatVerbose(req, res, durationMs);
                    break;
                case "standard":
                    output = formatStandard(req, res, durationMs);
                    break;
                case "minimal":
                default:
                    output = formatMinimal(req, res, durationMs);
                    break;
            }
            //logs the output
            logger(output);
        });
        //calls next middleware
        next();
    };
}
export default performanceLogger;
