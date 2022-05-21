const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/AuthController') 

const {handleValidation, Validation,LoginValidation,handleLogin}  = require('../Middleware/Validation')


router.get('/resend/:id/:num', AuthController.ResendOtp)
router.post('/register',[Validation,handleValidation],AuthController.Register)
router.post('/login',[LoginValidation, handleLogin] ,AuthController.Login)
router.post('/verify',AuthController.VerifyOtp)
router.post('/verifyMOtp',AuthController.forgotPasswordsendOTP)
router.put('/verifyMOtp',AuthController.UpdateForgotPassword)
router.get('/checking', AuthController.Checking)

module.exports = router