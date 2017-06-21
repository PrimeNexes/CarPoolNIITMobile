function userState(){
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      if(user.email==="billmanager@tyw.org")
      {}
      else{
      window.location.href ="./home.html";
     }
    // User is signed in.
  } else {
      window.location.href ="./home.html";
    // No user is signed in.
  }
});
};
function getOrder(){   
firebase.database().ref('Order').on('child_added',function(snapshot) {
    if($('#'+snapshot.key).length === 0 && snapshot.val().status !== "Cancelation requested" && snapshot.val().hasInvoice === false){if( snapshot.val().status !== "Cancelled"){
    $('#getOrder').append(
                '<div class="row" id="'+snapshot.key+'">'+
                '<div class="col s12 m5">'+
                '<div class="card blue-grey darken-1">'+
                '<div class="card-content white-text">'+
                '<p>'+
                'Type : '+snapshot.val().orderType+'</br></br>'+
                'Fare : Rs. '+snapshot.val().fare+'</br></br>'+
                'Status : '+snapshot.val().status+'</br>'+
                'Date of booking : '+snapshot.val().date+'</br>'+
                '<form id="'+snapshot.key+'orderbill">'+
                    '<div class="file-field input-field">'+
                        '<div class="btn">'+
                        '<span>File</span>'+
                        '<input type="file" name="'+snapshot.key+'File" id="'+snapshot.key+'File" required>'+
                        '</div>'+
                        '<div class="file-path-wrapper">'+
                        '<input class="file-path validate" type="text">'+
                        '</div>'+
                    '</div>'+
                    '<button class="btn waves-effect waves-light blue darken-3" type="submit">Add Invoice</button>'+
                '</form>'+
                '</p>'+
                '</div>'+
                '</div>'+
                '</div>'+
            '</div>'           
            );    
            $('#'+snapshot.key+'orderbill').submit(function(event){
                event.preventDefault();
                var file=document.getElementById(snapshot.key+"File").files[0];
                firebase.storage().ref('CustomerBill/'+snapshot.val().userId+'/'+snapshot.key).put(file).then(function(){
                    firebase.database().ref('Order/'+snapshot.key+'/hasInvoice').set(true);
                    Materialize.toast("File Uploaded", 4000);
                });
                //
            });
  };
  };
    var date = getDate();
    if($('#'+snapshot.key+'Today').length === 0 && snapshot.val().status !== "Cancelation requested" && date===snapshot.val().date){
        if( snapshot.val().status !== "Cancelled"){
            
    $('#getTodayOrder').append(
                '<div class="row" id="'+snapshot.key+'Today">'+
                '<div class="col s12 m5">'+
                '<div class="card blue-grey darken-1">'+
                '<div class="card-content white-text">'+
                '<p>'+
                'Type : '+snapshot.val().orderType+'</br></br>'+
                'Fare : Rs. '+snapshot.val().fare+'</br></br>'+
                'Status : '+snapshot.val().status+'</br>'+
                'Date of booking : '+snapshot.val().date+'</br>'+
                '</p>'+
                '</div>'+
                '</div>'+
                '</div>'+
            '</div>'           
            );    
  };};
});
}
$(document).ready(function(){
 userState();
 getOrder();
 var date = getDate();
 $('#todayForm').submit(function(event){
                event.preventDefault();
                var file=document.getElementById("todayFile").files[0];
                firebase.storage().ref('DailyBill/'+date).put(file).then(function(){
                    Materialize.toast("File Uploaded", 4000);
                });

 });
});
