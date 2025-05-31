const sanitize = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitize(obj[key]);
        } else {
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key];
            }
        }
    }
};

const sanitizeInput = (req, res, next) => {
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);

    next();
};

module.exports = sanitizeInput;
