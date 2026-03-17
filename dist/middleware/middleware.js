const performanceLogger = (req, res, next) => {
    const start = Date.now();
    console.log(`*EML* Server recieved a request:
        Request IP: ${req.ip}
        Request Protocol: ${req.protocol}
        Signes Cookies: ${req.signedCookies}
        Route: ${req.route}
        SubDomains: ${req.subdomains}
        OriginalURL: ${req.originalUrl}

        Response time: ${start - Date.now()}
        `);
    next();
};
export default performanceLogger;
