import * as petsServices from '../services/petsService.js'
import * as usersServices from '../services/usersServices.js'
import AppError from "../utils/AppError.js";

export async function index(req, res, next, filterByOwner = false, filterByType = false) {
     let pets = await petsServices.allPets();

     // Hide owners passwords
     pets.forEach(p => (p.owner) ? p.owner.password = undefined : p.owner = undefined);
     // filter by owner
     if (filterByOwner) pets = pets.filter(pet => pet.owner.id === req.userId);
     // filter by type
     if (filterByType) pets = pets.filter(pet => pet.type == req.params.type);


     const flash = req.flash();
     const { owner } = pets;

     res.render('./pages/pets/pets', { pets, owner, flash })
}

export async function getCreatePage(req, res) {
     const users = await usersServices.allUsers();
     try {
          res.render('./pages/pets/createPet', { users })
     } catch (error) {
          next(new AppError('page not found', 404))
     }
}

export async function getOnePet(req, res, next) {
     if (!req.params) return res.status(400).send('Invalid Request')
     const pet = await petsServices.getPet(req.params.id);
     if (!pet) return next(new AppError('pet not found!', 404));

     // pet.owner.password = undefined;
     let { owner } = pet;
     if (!owner) owner = {}

     res.render('./pages/pets/pet', { pet, owner });
}

export async function deletePet(req, res) {
     try {
          const pet = await petsServices.deleteOnePet(req.params.id);
          if (!pet) throw Error;

          const { favorites } = await usersServices.oneUserById(req.userId, false);
          const dataIndex = favorites.findIndex(favorite => favorite._id === req.params.id);
          console.log(dataIndex)
          // console.log(favorites)
          // user.addToFavorites(req.params.id);
          // console.log(req.userId)
          // console.log(user)
          // user.removeFromFavorites(req.params.id);


          return req.flash('success', `Pet Deleted!`), res.redirect('/pets');

     } catch (error) {
          return req.flash('error', `Something went Wrong!`), res.redirect('/pets')
     }
}


export async function createPet(req, res) {
     if (!req.body) return next(new AppError('Bad Request!', 400));
     if (req.body.isVegetarian !== 'true') req.body.isVegetarian = false;

     // Convert the value from text to Boolean
     req.body.isVegetarian = !!req.body.isVegetarian
     // Convert the value from text to Number
     req.body.age = +req.body.age

     if (!req.body.owner) req.body.owner = undefined;

     try {
          const pet = await petsServices.createPetDb(req.body);
          req.flash('success', `Pet Created!`);
          if (pet) return res.redirect('/pets');
     } catch (error) {
          console.log(error.message);
     }
}

export async function getEditPage(req, res) {
     const pet = await petsServices.getPet(req.params.id);
     const users = await usersServices.allUsers();
     res.render('./pages/pets/editPet', { pet, users });
}
export async function editPet(req, res, next) {
     if (!req.params.id || !req.body) return next(new AppError("Bad Request", 400))

     const id = req.params.id;

     if (req.body.owner == 'none') req.body.owner = undefined;

     const requestBody = req.body;
     const pet = await petsServices.editOnePet(next, id, requestBody);
     pet.owner.password = undefined;
     req.flash('success', `Pet Edited!`);
     res.redirect('/pets');
}
