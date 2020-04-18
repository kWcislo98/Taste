// listen for auth changes
auth.onAuthStateChanged((user) => {
  if (user) {
    //get data
    db.collection("recipes").onSnapshot((snapshot) => {
      setupRecipes(snapshot.docs);
      setupUI(user);
    });
  } else {
    setupUI();
    setupRecipes([]);
  }
});

// create new recipe
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("recipes")
    .add({
      title: createForm["title"].value,
      steps: createForm["content"].value,
    })
    .then(() => {
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch((err) => {
      window.alert(err.message);
    });
});
//sgnup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  //sign up user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
        bio: signupForm["signup-bio"].value,
      });
    })
    .then(() => {
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    });
});

//logout

const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
});

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    const modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});
