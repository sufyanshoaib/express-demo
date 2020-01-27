
function log(req, res, next) {
    console.log("Request received to url:" + req.url);
    next();
}

module.exports = log;