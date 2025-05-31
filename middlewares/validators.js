const { body, validationResult } = require("express-validator");

exports.validateRegister = [
    body("username")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Username is required"),

    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("A valid email is required"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }
        next();
    }
];
