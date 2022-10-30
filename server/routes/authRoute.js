import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router
     .get('/login', authController.getLoginPage)
     .post('/login', authController.login)
     .get('/register', authController.getRegisterPage)
     .post('/register', authController.register)
     .get('/logout', authController.logout)
     
export default router;