import { Schema, model } from "mongoose";

const animalTypes = ["dog", "cat", "lion", "parrot", "fish", "rabbit", "snake"];
const animalGender = ["male", "female", "m", "f"];
const MINIMUM_AGE = 1
const MAXIMUM_AGE = 120

const petSchema = new Schema({
     type: {
          type: String,
          required: [true, "Please provide a type for the pet"],
          enum: animalTypes,
     },
     name: {
          type: String,
          required: [true, "Please provide a name"],
          unique: false,
     },
     gender: {
          type: String,
          required: false,
          unique: false,
          enum: animalGender,
     },
     age: {
          type: Number,
          required: false,
          unique: false,
          min: [MINIMUM_AGE, `Minimum age must be at least ${MINIMUM_AGE}`],
          max: [MAXIMUM_AGE, `Maximum age can't be more then ${MAXIMUM_AGE}`],
     },
     color: {
          type: String,
          required: false,
          unique: false,
     },
     isVegetarian: {
          type: Boolean,
          required: false,
          unique: false,
     },
     owner: {
          required: false,
          type: Schema.Types.ObjectId,
          ref: "User",
          unique: false,
     },
     createAt: {
          type: Date,
          default: Date.now,
          immutable: true
     },
});


export default model("Pet", petSchema);
