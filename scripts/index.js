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
        const html = `
      <div> Logged in as ${user.email}</div>
      <div> ${doc.data().bio}</div>
      `;
        accountDetails.innerHTML = html;
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
      <li>
        <div class="collapsible-header grey lighten-4">${recipe.title}</div>
        <div class="collapsible-body white">${recipe.steps}</div>
      </li>
      `;
      html += li;
    });

    recipesList.innerHTML = html;
  } else {
    recipesList.innerHTML =
      '<h5 class="center-align"> Login to view recipes </h5>';
  }
};

document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});
