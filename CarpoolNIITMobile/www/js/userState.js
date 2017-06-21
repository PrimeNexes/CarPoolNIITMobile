//Check current user
function userState(){
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
      window.location.href ="./index.html";
    // No user is signed in.
  }
});
};

