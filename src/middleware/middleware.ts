function(req, res, next){
    console.log(
        req.method
        req.ip
        req.protocol
        req.signedCookies
        req.route
        req.subdomains
        req.originalURL
    )
    next()
} 