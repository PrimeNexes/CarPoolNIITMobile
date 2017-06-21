$(".signout").click(function(){   
    
    firebase.auth().signOut().then(function() {
    }).catch(function(error) {
    Materialize.toast("Error : "+error, 4000);
    });  
    
});
$(".button-collapse").sideNav();