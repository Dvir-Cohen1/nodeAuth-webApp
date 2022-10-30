
// Show / Hide password
const showPasswordBtn = document.querySelector('[show-password]');
const passwordInput = document.getElementById('userPassword');
showPasswordBtn.addEventListener('click', () => {

     if (showPasswordBtn.firstChild.classList.contains('fa-eye')) {
          showPasswordBtn.firstChild.classList.remove('fa-eye');
          showPasswordBtn.firstChild.classList.add('fa-eye-slash');
     } else if (showPasswordBtn.firstChild.classList.contains('fa-eye-slash')) {
          showPasswordBtn.firstChild.classList.remove('fa-eye-slash');
          showPasswordBtn.firstChild.classList.add('fa-eye');

     }

     if (passwordInput.type === 'password') {

          passwordInput.type = 'text';
     } else {
          passwordInput.type = 'password'
     }
}); // 


const isLoggedIn = document.cookie.includes('authorization-token');
const loginContainer = document.querySelector('#login-card-body');
if (isLoggedIn) {
     loginContainer.textContent = "You are logged in."
}