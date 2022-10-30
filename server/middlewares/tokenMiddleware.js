import jwt from 'jsonwebtoken';
import AppError from "../utils/AppError.js";
import * as cookieHandler from '../utils/cookieHandler.js';

export function generateToken({ _id }) {
     return jwt.sign({ id: _id }, process.env.JWT_SECRET, { expiresIn: '10d' });
}

export function validateToken(req, res, next) {

     const accessToken = cookieHandler.getCookieValue(req.headers.cookie, 'authorization-token')
     if (!accessToken) return next(new AppError('unauthorized, please sign in!'));

     jwt.verify(accessToken, process.env.JWT_SECRET, function (err, decoded) {
          if (err) {
               res.clearCookie('authorization-token');
               return next(new AppError('Expired, Please login again!'))
          };
          req.userId = decoded.id
          next();
     });
}
