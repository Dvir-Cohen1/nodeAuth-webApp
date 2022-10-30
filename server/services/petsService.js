import Pet from '../models/Pet.js';

export async function allPets() {
     try {
          const pets = Pet.find().populate("owner");
          return pets;
     } catch (error) {
          return console.log({ status: "failed", error: error.message });
     }
}

export async function getPet(id) {
     try {
          const pet = await Pet.findOne({ _id: id }).populate("owner");
          return pet

     } catch (error) {
          return false;
     }
}

export async function deleteOnePet(id) {
     try {
          const pet = await Pet.findOneAndRemove({ _id: id });
          return pet
     } catch (error) {
          return false;
     }
}
export async function createPetDb(data) {
     try {
          await Pet.create(data);
          return true;

     } catch (error) {
          return false;
     }
}

export async function editOnePet(next, id, requestBody) {
     try {
          const pet = await Pet.findOneAndUpdate({ _id: id }, requestBody, {
               new: true
          });
          return pet

     } catch (error) {
          next(new AppError("User Not Found!", 404))

     }
}