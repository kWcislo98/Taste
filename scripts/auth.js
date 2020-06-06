db.enablePersistence().catch((err) => {
  if (err.code == "failed-precondition") {
    console.log("presistence failed");
  } else if ((err.code = -"unimplemented")) {
    console.log("systtem is not available");
  }
});

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
//google sign in

googleSignIn = () => {
  base_provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(base_provider)
    .then(function (result) {
      console.log(result);
      console.log("Success");
      console.log(result.user.email);
    })
    .then(() => {
      $("#modal-login").modal("hide");
    })
    .catch(function (error) {
      console.log(error);
    });
};

//upload img
var fileButton = document.getElementById("fileButton");

fileButton.addEventListener("change", (e) => {
  var file = e.target.files[0];

  var storageRef = firebase
    .storage()
    .ref("images/" + file.name)
    .put(file);

  storageRef.on(
    "state_changed",
    function (snapshot) {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    function (error) {
      // Handle unsuccessful uploads
    },
    function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      storageRef.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        URL = downloadURL;
        console.log("File available at", downloadURL);
      });
    }
  );
});

// create new recipe
// function addComment() {
//   const text = document.getElementById("commentText");
//   db.collection("comments").add({
//     comment: text,
//   });
//   console.log(text);
// }
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  db.collection("recipes")
    .add({
      title: createForm["title"].value,
      steps: createForm["content"].value,
      url: URL,
    })
    .then(() => {
      $("#modal-recipe").modal("hide");
      createForm.reset();
    })
    .catch((err) => {
      window.alert(err.message);
    });
});

// // add comment
// const commentForm = document.querySelector("#comment-form");
// const commentForm = document.getElementById("comment-form");
// commentForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   db.collection("comments").add({
//     comment: commentForm["commentText"].value,
//     uID: cred.user.uid,
//   });
// });

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
      $("#modal-signup").modal("hide");
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
    $("#modal-login").modal("hide");
    loginForm.reset();
  }).catch((err)=>{
    window.alert('Invalid username or password!');
  });
});
