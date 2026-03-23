const divider = "─".repeat(50);
function formatMinimal(req, res, durationMs) {
    return (`\n[EML] ${req.method} ${req.originalUrl} ` +
        `→ ${res.statusCode} (${durationMs}ms)`);
}
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
function performanceLogger(options = {}) {
    const { mode = "minimal", logger = console.log } = options;
    return (req, res, next) => {
        const startTime = process.hrtime.bigint();
        res.on("finish", () => {
            const endTime = process.hrtime.bigint();
            const durationMs = (Number(endTime - startTime) / 1000000).toFixed(2);
            let output;
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
            logger(output);
        });
        next();
    };
}
export default performanceLogger;
