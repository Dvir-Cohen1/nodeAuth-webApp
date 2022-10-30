const END_POINT_AUTH = 'http://localhost:2070/users/authenticate';

if (!window.location.href.includes('/login')) isLoggedInNavbar();
updateUserLoggedInDetails();
indicateIsFavorites()

/**
 * Get logged in user
 */
async function initialUser() {
     try {
          const res = await fetch(END_POINT_AUTH, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               }
          });
          return await res.json();
     } catch (error) {
          return false;
     }
}
/**
 * Indicate/Mark user favorites items
 */
async function indicateIsFavorites() {
     const { favorites } = await initialUser();
     if (!favorites) return;

     const favoriteMainIcon = document.querySelector("[favorite-icon]");
     if (favorites.length > 0) {
          favoriteMainIcon.firstElementChild.style.color = 'yellow';
     } else {
          favoriteMainIcon.firstElementChild.style.color = 'white';
     }

     // Get nodeList of dom elements and convert to array
     let nodeList = document.querySelectorAll(`[data-favorite]`);
     let favoritesElement = Array.apply(null, nodeList);

     // Check if id of DOM Element is in user favorites for indication!  
     if (!favoritesElement) return;
     favorites.forEach(favorite => {
          favoritesElement.forEach(element => {
               if (element.id.includes(favorite._id)) {
                    element.classList.add('is-favorite');
               }
          });
     })
}
/**
 * Update logged in user details
 */
async function updateUserLoggedInDetails() {
     const user = await initialUser();
     if (!user) return;

     const userNameEl = document.querySelector('[data-user-name]');
     const userEmailEl = document.querySelector('[data-user-email]');
     const myProfileLink = document.querySelector('[data-my-profile]');
     const profileImage = document.querySelector('[data-profile-img]');

     userNameEl.textContent = `${user.firstName} ${user.lastName}`;
     userEmailEl.textContent = user.email;
     myProfileLink.href = `/users/user/${user.username}`;

     if (user.avatar) {
          profileImage.setAttribute('src', `/uploads/${user._id}/${user.avatar}`);
          profileImage.setAttribute('width', '40px')
          profileImage.setAttribute('height', '40px')
          profileImage.classList.add('ms-2')
     }

     updateUserFavoritesDetails()

}
/**
 * Update user favorites
 */
async function updateUserFavoritesDetails() {
     const user = await initialUser();
     const myFavoritesNav = document.querySelector('[data-my-favorites]');
     if (user.favorites.length > 0) {
          myFavoritesNav.innerHTML = user.favorites.map((favorite) => {

               return `
          <li>
          <a class="dropdown-item text-dark" href="/pets/pet/${favorite._id}">${favorite.name}<span class="badge text-bg-secondary fw-normal ms-2">${favorite.type}</span></a>
          
          </li>
          `
          }).join("");
     } else {
          myFavoritesNav.innerHTML = `
          <li class="mx-3 small">
          Nothing to display!
          
          </li>
          `
     }
}
/**
 * Initiate bootstrap tooltips
 */
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
     return new bootstrap.Tooltip(tooltipTriggerEl)
})

/**
 * initiate new browser notification
 */
function notify(description, bodyContent, tag = 'New-Notification') {
     if (!("Notification" in window)) return;
     Notification.requestPermission().then(perm => {
          if (perm !== 'granted') return;
          new Notification(description, {
               body: bodyContent,
               tag: tag
          });
     })
}

/**
 * if user logged in hide relevant navbar items 
 */
function isLoggedInNavbar() {
     const isLoggedIn = document.cookie.includes('authorization-token');

     const loggedOutNav = document.querySelector('[data-logged-out-navItem]');
     const loggedInNav = document.querySelector('[data-logged-in-navItem]');

     const vipContent = document.querySelectorAll('[data-vip-content]');

     if (isLoggedIn) {
          loggedOutNav.classList.add('d-none');
          // navBrand.style.color = '#8cb1f3';
     } else {
          loggedInNav.classList.add('d-none');
          vipContent.forEach(el => el.title = 'VIP Content');
          // navBrand.style.color = '#E53BCA';
     }
}

/**
 * Change app Theme
 */
const themeBtn = document.querySelector('[change-theme-mode]');
const body = document.querySelector('body');
themeBtn.addEventListener('change', () => {
     if (!body.classList.contains("light-mode")) {
          localStorage.setItem("light-mode", true);
          body.classList.add("light-mode");
     } else {
          body.classList.remove("light-mode");
          localStorage.removeItem("light-mode");
     }
})

// When DOM loaded get app theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
     const isLightTheme = localStorage.getItem('light-mode');
     if (isLightTheme) {
          body.classList.add("light-mode");
          themeBtn.setAttribute('checked', true)
     }
})

// Change cards layout 
const cardsContainers = document.querySelectorAll('[data-cards-container]');
const layoutIconElement = document.querySelector('[data-layout-icon]').firstElementChild;
const layoutBtn = document.querySelector('[data-list]');

layoutBtn.addEventListener('click', function (e) {
     cardsContainers.forEach(el => {
          console.log(el)
          if (el.classList.contains('col-sm-4')) {
               el.classList.replace('col-sm-4', 'col-sm-12');
               layoutIconElement.classList.replace('fa-list-ul', 'fa-border-all');
          } else {
               el.classList.replace('col-sm-12', 'col-sm-4');
               layoutIconElement.classList.replace('fa-border-all', 'fa-list-ul');
          }
     })
});


// const showPasswordBtn = document.querySelector('[show-password]');
// const passwordInput = document.getElementById('userPassword');
// showPasswordBtn.addEventListener('click', () => {

//      if (showPasswordBtn.firstChild.classList.contains('fa-eye')) {
//           showPasswordBtn.firstChild.classList.remove('fa-eye');
//           showPasswordBtn.firstChild.classList.add('fa-eye-slash');
//      } else if (showPasswordBtn.firstChild.classList.contains('fa-eye-slash')) {
//           showPasswordBtn.firstChild.classList.remove('fa-eye-slash');
//           showPasswordBtn.firstChild.classList.add('fa-eye');

//      }

//      if (passwordInput.type === 'password') {

//           passwordInput.type = 'text';
//      } else {
//           passwordInput.type = 'password'
//      }
// }); //  

