import User from '../models/User.js';
import AppError from "../utils/AppError.js";

export async function allUsers(hidePasswords = true) {
     try {
          const users = await User.find().populate("pet").populate("favorites");
          if (hidePasswords) users.forEach(user => user.password = undefined);

          return users

     } catch (error) {
          next(new AppError("Users Not Found!", 404))
     }
}

export async function oneUser(next, name, hidePasswords = true) {

     try {
          const user = await User.findOne({ username: name }).populate("pet").populate("favorites");

          if (hidePasswords) user.password = undefined;
          if (!user.address) user.address = {};
          if (!user.social) user.social = {};

          return user

     } catch (error) {
          next(new AppError("User Not Found!", 404))
     }
}

export async function search(next, value) {

     try {
          return await User.find({ $or: [{ username: value }, { firstName: value }, { email: value }] }).populate("pet").populate("favorites");

     } catch (error) {
          next(new AppError("User Not Found!", 404))
     }
}

export async function oneUserById(id, hidePasswords = true) {
     try {
          const user = await User.findOne({ _id: id }).populate("favorites");
          if (hidePasswords) user.password = undefined;
          return user

     } catch (error) {
          new AppError(`${error.message}`, 404)
     }
}

export async function editOneUser(next, id, data) {

     try {
          // address data
          const address = (({ country, city, street, zipCode }) => ({ country, city, street, zipCode }))(data);
          // social data
          const social = (({ website, google, github, linkedin }) => ({ website, google, github, linkedin }))(data);
          const user = await User.findOneAndUpdate({ _id: id }, { $set: { ...data, address, social } }, {
               new: true
          });

          return user

     } catch (error) {
          next(new AppError("User Not Found!", 404))
     }
}

export async function deleteOneUser(id) {
     try {
          await User.findOneAndRemove({ _id: id });
          return true
     } catch (error) {
          return false;
     }
}

export async function registerUser(data, next) {
     try {
          const newUser = await User.create(data);
          return newUser;
     } catch (error) {
          next(new AppError("failed schema validation", 400))
     }
}

export async function addToFavoritesService(userId, dataId) {
     try {
          const user = await oneUserById(userId, false);
          await user.addToFavorites(dataId);

          return true
     } catch (error) {
          console.log(error);
     }

}

