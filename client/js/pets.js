
const markAsFavoriteBtn = document.querySelectorAll('[data-mark-as-favorite]');
const deletePetBtn = document.querySelectorAll('.delete-pet-action');
const END_POINT = 'http://localhost:2070/';


// Delete Pet
deletePetBtn.forEach(el => {
     el.addEventListener("click", (e) => {
          if (!confirm('Are you sure you want to delete this pet?')) return;
          try {
               fetch(END_POINT + `pets/pet/delete/${e.target.id}`, {
                    method: "DELETE",
               }).then(window.location.href = '/pets');
          } catch (error) {
               return console.log(`Error While fetching ${END_POINT}: ${error.message}`);
          }
     });
})

markAsFavoriteBtn.forEach(element => {
     element.addEventListener('click', async (e) => {
          await favoriteRequest(e.target.id);
          updateUserFavoritesDetails()
          indicateIsFavorites()


          if (element.classList.contains('is-favorite')) {
               element.classList.remove('is-favorite');
          }
          return
     })
})

async function favoriteRequest(id) {
     try {
          const response = await fetch(END_POINT + `users/user/addToFavorite/${id}`, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               }
          });

          return data = await response.json();

     } catch (error) {
          return console.log(`Error While fetching ${END_POINT}: ${error.message}`);
     }
}
