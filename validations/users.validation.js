import {body} from 'express-validator';
import User from '../models/user.model.js';
import { createError } from '../utils/helper.js';

async function isDuplicate (email) {
    const user = await User.findOne({email});
    if(user){
        throw createError('This email already in use!', 401)
    }
}

export const registerValidation = [
    body('firstName')
        .escape()
        .trim()
        .notEmpty().withMessage('Full name is required')
        .matches(/^[a-zA-Z]+$/).withMessage('Invalid first name')
        .isLength({min: 3, max: 100}).withMessage('Full name is too short or too long'),
    body('lastName')
        .escape()
        .trim()
        .notEmpty().withMessage('Full name is required')
        .matches(/^[a-zA-Z]+$/).withMessage('Invalid last name')
        .isLength({min: 3, max: 100}).withMessage('Full name is too short or too long'),
    body('email')
        .escape()
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .custom(isDuplicate),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({min: 5})
];

export const loginValidation = [
    body('email')
        .escape()
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({min: 5})

]