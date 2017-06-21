//Check current user
function userState(){
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      if(user.email==="admin@tyw.org")
      {window.location.href ="./employee.html";}
      else if(user.email==="billmanager@tyw.org")
      {window.location.href ="./billmanager.html";}
      else{
      window.location.href ="./home.html";
      Materialize.toast("Logged in", 4000);}
    // User is signed in.
  } else {
      
    // No user is signed in.
  }
});
};

$(document).ready(function(){
 
  //userState();  
    
$("#loginform").submit(function(event){
event.preventDefault();
var email = document.getElementById('emailL').value;   
var password =   document.getElementById('passwordL').value; 
firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  Materialize.toast(errorMessage, 4000);
  
});
userState();  
}); 
       
$("#signupform").submit(function(){
 event.preventDefault();
var email = document.getElementById('emailR').value;   
var password =   document.getElementById('passwordR').value;
var fullnameR =   document.getElementById('fullnameR').value; 
var addressR =   document.getElementById('addressR').value; 
if(email && password && fullnameR && addressR)
{
firebase.auth().createUserWithEmailAndPassword(email, password).then(function(userId) {
try{
var updates = {};
updates['Users/' + userId.uid+'/fullname']=fullnameR;
updates['Users/' + userId.uid+'/address']=addressR;
firebase.database().ref().update(updates).then(function(){
    Materialize.toast("Done ! Now you will be logged in.", 4000);  
}).catch(function(error) {
    console.log(error);
}); 
}
catch(e){
    console.log(e);
}
finally{
    
}
}).catch(function(error) {
  // Handle Errors here.
 Materialize.toast(error.message, 4000);
  // ...
});
};
});

$("#fogotPassBtn").click(function(){
    var email = document.getElementById('emailL').value;
    if(email)
    {
        firebase.auth().sendPasswordResetEmail(email).then(function() {
            Materialize.toast("Check you mail then comeback here.", 4000);
            }, function(error) {
             Materialize.toast(error.message, 4000);
        });
        
        
    }
    else{ 
       $( "#emailL" ).focus();
       Materialize.toast("Type your email of the forgotten account above", 4000); 
    }
    
});

});

