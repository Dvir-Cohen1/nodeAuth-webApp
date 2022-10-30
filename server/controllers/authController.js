import * as usersServices from '../services/usersServices.js'
import * as tokenMiddleware from '../middlewares/tokenMiddleware.js'
import AppError from "../utils/AppError.js";

export function getRegisterPage(req, res, next) {
     const flash = req.flash();
     res.render('./pages/authentication/register', { flash })
}

export function getLoginPage(req, res, next) {
     const flash = req.flash();
     res.render('./pages/authentication/login', { flash })
}

export async function register(req, res, next) {
     if (!req.body) return next(new Api400Error("Check your request"));

     try {
          await usersServices.registerUser(req.body);
          // const token = tokenMiddleware.generateToken(user);
          req.flash('success', `Successfully registered!`);
          return res.redirect('/auth/login');
     } catch (error) {
          req.flash('error', `Username/email already in use!`);
          res.redirect('back');
     }
}

export async function login(req, res, next) {

     const user = await usersServices.oneUser(next, req.body.userName, false);
     // if (!user) return next(new AppError('User not found'));

     try {
          if (!await user.passwordCorrect(req.body.password)) throw error
     } catch (error) {
          return next(new AppError('Username or password incorrect!'));
     }
     // user.password = undefined;
     const accessToken = tokenMiddleware.generateToken(user)

     req.flash('info', `Logged in as ${user.username}!`);
     res.cookie('authorization-token', accessToken).redirect('/');
}

export function logout(req, res) {
     req.flash('info', `You've been successfully logged out!`)
     res.clearCookie('authorization-token').redirect('/');
}
