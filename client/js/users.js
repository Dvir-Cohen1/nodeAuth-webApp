const cardsContainers = document.querySelectorAll('[data-cards-container]');
const layoutBtn = document.querySelector('[data-list]');
const deleteUserBtn = document.querySelectorAll('[data-delete-user-action]');
const END_POINT = 'http://localhost:2070/users/';

// Delete user
deleteUserBtn.forEach(el => {
     el.addEventListener("click", async (e) => {
          if (!confirm('Are you sure you want to delete this user?')) return;
          try {
               const res = fetch(END_POINT + `user/delete/${e.target.id}`, {
                    method: "DELETE",
               }).then(window.location.href = '/users');

               const data = await res;
               const { sameUser } = await data.json();
               // If user deleted is same user logged in then logout!
               if (sameUser) return window.location.href = 'auth/logout';

          } catch (error) {
               return console.log(`Error While fetching ${END_POINT}: ${error.message}`);
          }
     });
})

// Change cards layout
if (layoutBtn) {
     layoutBtn.addEventListener('click', function (e) {
          const layoutIcon = document.querySelector('[data-layout-icon]').firstElementChild;
          cardsContainers.forEach(element => {
               if (element.classList.contains('col-sm-4')) {
                    element.classList.replace('col-sm-4', 'col-sm-12');
                    layoutIcon.classList.replace('fa-list-ul', 'fa-border-all');
               } else {
                    element.classList.replace('col-sm-12', 'col-sm-4');
                    layoutIcon.classList.replace('fa-border-all', 'fa-list-ul');
               }
          })
     });
}


// Search User
document.querySelector('[data-search-user]').addEventListener('change', searchUser);
async function searchUser(event) {
     const searchValue = event.target.value;
     const response = await fetch(`http://localhost:2070/users/user/search?value=${searchValue}`);
     const filteredUsers = await response.json();

     const userCardRow = document.querySelector('[user-cards-container]');

     if (filteredUsers.length > 0) {
          filteredUsers.forEach(user => {
               return userCardRow.innerHTML =
                    `<div data-cards-container class="col-sm-4 mb-3">
                                        <div class="card">
                                             <div class="card-body">
                                                  <div class="float-end action-buttons">
                                                       <div class="dropdown">
                                                            <button
                                                                 class="btn btn-default text-dark btn-sm dropdown-toggle"
                                                                 type="button" data-bs-toggle="dropdown"
                                                                 aria-expanded="false">
                                                                 <i class="fas fa-ellipsis-h"></i>
                                                            </button>
                                                            <ul class="dropdown-menu">
                                                                 <li>

                                                                      <a class="dropdown-item" type="button"
                                                                           href="users/user/${user.username}">
                                                                           <!-- <i class="fas fa-eye" aria-hidden="true"></i> -->
                                                                           View
                                                                      </a>

                                                                 </li>
                                                                 <li>

                                                                      <a class="dropdown-item" type="button"
                                                                           href="users/user/edit/${user.username}">
                                                                           <!-- <i class="fas fa-pencil" aria-hidden="true"></i> -->
                                                                           Edit
                                                                      </a>
                                                                 </li>
                                                                 <li>
                                                                      <button data-delete-user-action
                                                                           class="dropdown-item btn-sm text-danger"
                                                                           type="button" id="${user._id}">
                                                                           <!-- <i class="far fa-trash-alt" aria-hidden="true"></i>  -->
                                                                           Delete
                                                                      </button>
                                                                 </li>
                                                            </ul>
                                                       </div>
                                                  </div>
                                                  <div class="mb-2"><span class="badge text-bg-default fw-normal">#
                                                            ${user.username}
                                                       </span>
                                                  </div>
                                                  <div class="d-flex align-items-center m-0">

                                                       <div class="profile-image-cards me-3"><img
                                                                 src="/uploads/${user._id}/${user.avatar}" alt="">
                                                       </div>

                                                       <div>
                                                            ${user.firstName}
                                                                 ${user.lastName}
                                                                      <span class="fw-light">
                                                                           ${user.age}
                                                                                <br>
                                                                                ${user.email}
                                                                      </span>
                                                       </div>
                                                  </div>
                                                  <span class="fw-light m-0">
                                                       <br>
                                                       <code>${user.createAt}</code>
                                                  </span>
                                                  <div class="float-end"><span
                                                            class="badge text-bg-default">Admin</span></div>
                                             </div>
                                        </div>

                    </div>`
          });
     } else {
          return userCardRow.innerHTML = '<div class="text-danger">Not Found! Can search by: <strong class="border-bottom border-danger">username</strong>, <strong class="border-bottom border-danger">first Name</strong>, <strong class="border-bottom border-danger">email</strong><div>';
     }
}

// Pass data to send-email modal
$('#send-mail-modal').on('show.bs.modal', (e) => {
     // get information to update quickly to modal view as loading begins
     let opener = e.relatedTarget;//this holds the element who called the modal

     // get details from attributes
     let id = $(opener).attr('user-id');
     let username = $(opener).attr('user-username');
     let userEmail = $(opener).attr('user-email');

     // document.querySelector('#toUsername').value = username;
     document.querySelector('#userEmail').value = userEmail;

});

// send email 
document.querySelector('[send-email-form]').onsubmit = async (e) => {
     e.preventDefault();

     const emailInput = document.querySelector('[email-input]');
     const subjectInput = document.querySelector('[subject-input]');
     const contentInput = document.querySelector('[content-input]');
     const messageContainer = document.querySelector('[message-container]');

     const body = {
          email: emailInput.value,
          subject: subjectInput.value,
          content: contentInput.value,
     };

     const response = await fetch(`${END_POINT}user/sendmail`, {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
     })
     const data = await response.json();

     if (data.error) {
          messageContainer.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                         ${data.error.name}
                    </div>`;
          return setTimeout(() => { messageContainer.textContent = '' }, 4000);
     }

     return data
}