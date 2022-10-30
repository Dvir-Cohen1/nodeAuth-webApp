import express from 'express';
import * as usersController from '../controllers/usersController.js';

const router = express.Router();

router
     // All users
     .get('/', usersController.index)
     // User's pets
     .get('/user/myPets', usersController.getUserPets)
     // Search user
     .get('/user/search', usersController.searchUser)
     // Upload Profile image
     .post('/user/uploadProfileImage', usersController.uploadProfileImage)
     // One user
     .get('/user/:name', usersController.getUser)
     // Delete user
     .delete('/user/delete/:id', usersController.deleteUser)
     // Edit page
     .get('/user/edit/:name', usersController.getUserEditPage)
     // Edit action
     .post('/user/edit/:id', usersController.editUser)
     // Get logged in user
     .post('/authenticate', usersController.getLoggedInUser)
     // Add to favorites
     .post('/user/addToFavorite/:id', usersController.addToFavorite)
     // Add to favorites
     .post('/user/sendmail', usersController.sendEmail)

export default router;