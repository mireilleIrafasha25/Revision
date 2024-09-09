import {body} from "express-validator"

export const SignupValidation=[
    body("Firstname","Firstname is required").not().isEmpty(),
    body("Lastname","Lastname is required").not().isEmpty(),
    body("email","Please enter a valid email").isEmail(),
    body("password","Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character").isStrongPassword(),
    body("confirmPassword","Confirm password is required").not().isEmpty(),
];
export const signInValidation=[
    body("email","Please enter a valid email").isEmail(),
    body("password","Password is required").not().isEmpty(),

]
 export const resetPasswordValidation=[
    body("password","Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character").isStrongPassword(),
    body("confirmPassword","Confirm password is required").not().isEmpty(),
]
export const ForgotPasswordValidation=[
    body("email","please enter your email address").not().isEmpty(),
    body("email","Please enter a valid email").isEmail(),
]
export const ValidateOtpValidation=[
    body("otp","please enter your otp address").not().isEmpty(),
]
