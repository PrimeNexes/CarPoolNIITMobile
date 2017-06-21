function getEmail(){
  
firebase.auth().onAuthStateChanged(function(user) {     
        $("#employeeProfileEmail").html(user.email);      
});    
}

function getFullname(){   
firebase.auth().onAuthStateChanged(function(user) {   
    firebase.database().ref('Users/' + user.uid +'/fullname').once('value').then(function(snapshot) {
        
    $("#employeeProfileName").html(snapshot.val());
    // ...
    });
});
}
$(document).ready(function(){ 
    getEmail();
    getFullname();
    userState();

});

