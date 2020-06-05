const recipesList = document.querySelector(".recipes");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");

const setupUI = (user) => {
  if (user) {
    //acc info
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (user.displayName) {
          const html = `
      <img src="${user.photoURL}" alt="pic" style="width: 40px; height:40px;">
      <div> Logged in as: ${user.displayName}</div>
      <div> Email: ${user.email}</div>
      `;
          accountDetails.innerHTML = html;
        } else if (doc.data().bio) {
          const html = `
          <div> Email: ${user.email}</div>
          <div> Bio: ${doc.data().bio}</div>
          `;
          accountDetails.innerHTML = html;
        } else {
          const html = `
          <div> Logged in as ${user.email}</div>
          `;
          accountDetails.innerHTML = html;
        }
      });

    //toggle UI elements
    loggedInLinks.forEach((item) => (item.style.display = "block"));
    loggedOutLinks.forEach((item) => (item.style.display = "none"));
  } else {
    //hide acc info
    accountDetails.innerHTML = "";

    loggedInLinks.forEach((item) => (item.style.display = "none"));
    loggedOutLinks.forEach((item) => (item.style.display = "block"));
  }
};

// setup recipes

const setupRecipes = (data) => {
  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const recipe = doc.data();

      const li = `
      <div class="card">
      <div class="card-header" id="headingOne"> 
            <p class="h2">${recipe.title}</p>
          
      </div>
      <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
        <div class="card-body">
        <div class="row-fluid">
        <div class="span12 text-center">
        ${recipe.steps}
        </div>
    
    </div>
        </div>
        <div class="text-center">
        <img src="${recipe.url}" class="img-fluid" alt="Responsive image">
</div>
      </div>
    </div>
      `;
      html += li;
    });

    recipesList.innerHTML = html;
  } else {
    recipesList.innerHTML =
      '<h5 class="text-center"> You need to be both logged in and have internet connection to see other recipes </h5>';
  }
};

// document.addEventListener("DOMContentLoaded", function () {
//   var modals = document.querySelectorAll(".modal");
//   M.Modal.init(modals);

//   var items = document.querySelectorAll(".collapsible");
//   M.Collapsible.init(items);
// });
