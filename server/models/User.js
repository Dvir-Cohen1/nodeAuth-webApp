import { Schema, model } from "mongoose";
import validateEmail from "../utils/validateEmail.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";

const MINIMUM_AGE = 5;
const MAXIMUM_AGE = 120;

const addressSchema = new Schema({
     country: { type: String, default: "Israel" },
     city: { type: String, default: "Tel Aviv" },
     street: { type: String, default: "-------" },
     zipCode: { type: Number, default: '00000000' },
});

const socialSchema = new Schema({
     website: { type: String, default: 'google.com' },
     google: { type: String, default: 'google.com' },
     github: { type: String, default: 'github.com' },
     linkedin: { type: String, default: 'linkedin.com' },
});

const userSchema = new Schema({
     username: {
          type: String,
          required: [true, "Please provide an Username"],
          unique: [true, "Username is already exist"],
     },
     email: {
          type: String,
          required: [true, "Please provide an Email"],
          unique: [true, "Email is already exist"],
          validate: {
               validator: validateEmail,
               message: "Email is invalid",
          },
     },
     firstName: { type: String },
     lastName: { type: String },
     age: {
          type: Number,
          min: [MINIMUM_AGE, `Minimum age must be at least ${MINIMUM_AGE}`],
          max: [MAXIMUM_AGE, `Maximum age can't be more then ${MAXIMUM_AGE}`],
     },
     heading: {
          type: String,
     },
     info: {
          type: String,
     },
     avatar: {
          type: String,
     },
     password: { type: String, required: [true, "Please provide a password"] },
     address: addressSchema,
     social: socialSchema,
     pet: {
          required: false,
          type: Schema.Types.ObjectId,
          ref: "Pet",
          unique: false,
     },
     favorites: [
          {
               type: Schema.Types.ObjectId,
               ref: "Pet"
          }
     ],
     createAt: { type: Date, default: Date.now, immutable: true },
});

userSchema.pre('save', async function (next) {
     if (!this.isModified('password')) return next();
     this.password = await bcrypt.hash(this.password, 12);
     next()
})

userSchema.methods.passwordCorrect = async function (userPassword) {
     return await bcrypt.compare(userPassword, this.password);
}

userSchema.methods.uploadProfileImage = async function (imagePath) {
     try {
          this.avatar = imagePath;
          this.save();
          return true;
          console.log(imagePath)
          return;
     } catch (error) {
          return new AppError(error.message);
     }
}

userSchema.methods.addToFavorites = async function (dataId) {
     try {
          const favorites = this.favorites;

          let isAlreadyFavorite = false;
          let dataIndex;

          // Set variable to Check if data is already in favorites
          favorites.forEach((favorite, index) => {
               if (favorite.id === dataId) isAlreadyFavorite = true, dataIndex = index;
          })

          // If true add it to list, else remove it. 
          if (!isAlreadyFavorite) {
               favorites.push({ _id: dataId });
               this.save();
               return favorites
          } else {
               this.removeFromFavorites(dataIndex);
               return false;
          }
     } catch (error) {
          new AppError(error.message);
     }
}

userSchema.methods.removeFromFavorites = async function (dataIndex) {
     const favorites = this.favorites;
     favorites.splice(dataIndex, 1);

     this.save();
     return favorites;
}

export default model("User", userSchema);