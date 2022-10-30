import express from 'express';
import * as petsController from '../controllers/petsController.js';

const router = express.Router();

router
     // All pets
     .get('/', petsController.index)
     // Filter pets by type
     .get('/filter/:type', (req, res, next) => {
          petsController.index(req, res, next, false, true)
     })
     // One pet
     .get('/pet/:id', petsController.getOnePet)
     // Edit page
     .get('/pet/edit/:id', petsController.getEditPage)
     // Edit action
     .put('/pet/edit/:id', petsController.editPet)
     // Create page
     .get('/create', petsController.getCreatePage)
     // Create action
     .post('/create', petsController.createPet)
     // Add to Favorite
     .delete('/pet/delete/:id', petsController.deletePet)

export default router;