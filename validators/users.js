const { check } = require("express-validator");
const  validateResults  = require("../utils/handleValidators");

const userRegisterValidator = [
    check("name")
        .exists().withMessage("Username is required")
        .notEmpty().withMessage("Username cannot be empty")
        .isString().withMessage("Username must be a string"),
    check("surname")
        .isString().withMessage("Surname must be a string")
        .notEmpty().withMessage("Surname cannot be empty"),
    check("email")
        .exists().withMessage("Email is required")
        .notEmpty().withMessage("Email cannot be empty")  
        .isEmail().withMessage("Email must be a valid email address"),
    check("password")
        .exists().withMessage("Password is required")
        .notEmpty().withMessage("Password cannot be empty")
        .isString().withMessage("Password must be a string")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .isLength({ max: 20 }).withMessage("Password must be at most 20 characters long"),
    (req, res, next) => validateResults(req, res, next) 
];

const userLoginValidator = [
    check("email")
    .exists().withMessage("Email is required")
    .notEmpty().withMessage("Email cannot be empty")
    .isEmail().withMessage("Email must be a valid email address"),
    check("password")
    .exists().withMessage("Password is required")
    .notEmpty().withMessage("Password cannot be empty") 
    .isString().withMessage("Password must be a string"),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { userRegisterValidator, userLoginValidator };
