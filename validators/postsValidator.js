const { check } = require('express-validator');
const validateResults = require('../utils/handleValidators');

const postsValidator = [
    // Validación para userId
    check('userId')
        .exists().withMessage('El campo userId es requerido')
        .isNumeric().withMessage('El campo userId debe ser un número'),

    // Validación para mood
    check('mood')
        .optional() 
        .isIn(["Miserable", "Sad", "Neutral", "Happy", "Ecstatic"])
        .withMessage('El campo mood debe ser uno de: "Miserable", "Sad", "Neutral", "Happy", "Ecstatic"'),

    // Validación para emotions
    check('emotions')
        .optional()
        .isArray().withMessage('El campo emotions debe ser un array'),

    // Validación para sleep
    check('sleep')
        .optional()
        .isString().withMessage('El campo sleep debe ser un String'),

    // Validación para health
    check('health')
        .optional()
        .isArray().withMessage('El campo health debe ser un array'),

    // Validación para hobbies
    check('hobbies')
        .optional()
        .isArray().withMessage('El campo hobbies debe ser un array'),

    // Validación para food
    check('food')
        .optional()
        .isArray().withMessage('El campo food debe ser un array'),

    // Validación para social
    check('social')
        .optional()
        .isArray().withMessage('El campo social debe ser un array'),

    // Validación para productivity
    check('productivity')
        .optional()
        .isArray().withMessage('El campo productivity debe ser un array'),

    // Validación para chores
    check('chores')
        .optional()
        .isArray().withMessage('El campo chores debe ser un array'),

    // Validación para weather
    check('weather')
        .optional()
        .isArray().withMessage('El campo weather debe ser un array'),

    // Validación para beauty
    check('beauty')
        .optional()
        .isArray().withMessage('El campo beauty debe ser un array'),

    // Validación para text
    check('text')
        .optional()
        .isString().withMessage('El campo text debe ser un String'),

    // Validación para images
    check('images')
        .optional()
        .isArray().withMessage('El campo images debe ser un array'),

    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

module.exports = postsValidator;
