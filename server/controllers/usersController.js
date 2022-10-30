import * as usersServices from '../services/usersServices.js';
import * as petsController from '../controllers/petsController.js';
import * as mailer from '../utils/mailer.js';
import fs from 'fs'

import AppError from "../utils/AppError.js";

// All users 
export async function index(req, res, next) {
     const users = await usersServices.allUsers()
     const flash = req.flash();

     res.render('./pages/users/users', { users, flash });
}

// Edit page
export async function getUserEditPage(req, res, next) {
     const user = await usersServices.oneUser(next, req.params.name);
     const flash = req.flash();
     res.render('./pages/users/editUser', { user, flash });
}

// Get user
export async function getUser(req, res, next) {
     if (!req.params) return next(new AppError('Invalid Request!', 400));
     const user = await usersServices.oneUser(next, req.params.name, false);
     const flash = req.flash();
     const loggedInUser = req.userId

     // if (!user.address) user.address = {};
     res.render('./pages/users/user', { user, flash, loggedInUser });
}

// Edit user
export async function editUser(req, res, next) {
     if (!req.params.id || !req.body) return next(new AppError("Bad Request", 400))

     await usersServices.editOneUser(next, req.params.id, req.body);
     req.flash('success', `User Edited!`)
     res.redirect('/users');

}

// Delete user
export async function deleteUser(req, res) {
     try {
          const user = await usersServices.deleteOneUser(req.params.id);
          if (!user) throw Error;

          if (req.userId === req.params.id) {
               return res.json({ sameUser: true });
          }
          return;
     } catch (error) {
          return req.flash('error', `Something went Wrong!`), res.redirect('/users');
     }
}

// User's pets 
export async function getUserPets(req, res, next) {
     // Pass true to filter pets by logged in user
     return petsController.index(req, res, next, true);
}

// Logged in user 
export async function getLoggedInUser(req, res, next) {
     try {
          const user = await usersServices.oneUserById(req.userId);
          return res.json(user);

     } catch (error) {
          return next(new AppError('Please Login!', 401));
     }
}

// Profile Image 
export async function uploadProfileImage(req, res, next) {
     if (!req.files) return next(new AppError('Please select Image to upload!', 401));

     const user = await usersServices.oneUserById(req.userId, false);

     const file = req.files.ProfileImage
     const fileType = file.name.split(".")[1];


     // Creates uploads folder if not exist
     const uploadsFolder = `../client/uploads`
     if (!fs.existsSync(uploadsFolder)) fs.mkdirSync(uploadsFolder);

     // Create folder based on user id to store profile image
     const userDir = `../client/uploads/${req.userId}`
     const uploadPath = `${userDir}/avatar.${fileType}`;

     if (!fs.existsSync(userDir)) fs.mkdirSync(userDir);

     file.mv(uploadPath, (error) => {
          if (error) return next(new AppError(error.message, 401));
     })

     return await user.uploadProfileImage(`avatar.${fileType}`), res.redirect('back')

}

// Favorite 
export async function addToFavorite(req, res, next) {
     if (!req.userId && req.params) return next(new Error("bad request"));
     const data = await usersServices.addToFavoritesService(req.userId, req.params.id);
     res.json(data);
}

// searchUser 
export async function searchUser(req, res, next) {
     const value = req.query.value
     if (!value) return;
     const user = await usersServices.search(next, value);
     res.json(user);
}
// send email to user 
export async function sendEmail(req, res, next) {

     if (!req.body.email || !req.body.subject | !req.body.content) {
          return res.json({ error: new AppError('Missing information', 400) });
     }
     const { email, subject, content } = req.body;
     const data = await mailer.sendEmail(email, subject, content);

     res.json(data).end();
}
