function getOrder(){
    
firebase.database().ref('Order').on('child_added',function(snapshot) {
    if($('#'+snapshot.key).length === 0){
    $('#getOrder').append(
                '<div class="row" id="'+snapshot.key+'">'+
                '<div class="col s12 m12">'+
                '<div class="card blue-grey darken-1">'+
                '<div class="card-content white-text">'+
                '<p>'+
                'Type : '+snapshot.val().orderType+'</br></br>'+
                'Fare : Rs. '+snapshot.val().fare+'</br></br>'+
                'Status : '+snapshot.val().status+'</br>'+
                'Date : '+snapshot.val().date+'</br></p>'+
                '</div>'+
                '<div class="card-action">'+
                '<a id="'+snapshot.key+'DownloadBtn" class="modal-trigger waves-effect waves-blue btn-flat" download>Download Invoice</a>'+
                '<a href="#'+snapshot.key+'OrderCancel" id="'+snapshot.key+'OrderCancelBtn" class="modal-trigger waves-effect waves-blue btn-flat">Cancel Order</a>'+
                            '<div id="'+snapshot.key+'OrderCancel" class="modal">'+
                            '<div class="modal-content">'+
                            '<h4>Cancel Order</h4>'+
                            '<p>Are you sure ? This action cannot be undone</p>'+                                  
                                '<div class="modal-footer">'+
                                    '<button class="modal-action modal-close waves-effect waves-green btn" id="'+snapshot.key+'OrderCancelSubmit">Cancel Order</button>'+
                                '</div>'+              
                            '</div>'+   
                '</div>'+
                '</div>'+
                '</div>'+
            '</div>'           
            );
        if(snapshot.val().status === "Cancelation requested" || snapshot.val().status === "Canceled"){
            $('#'+snapshot.key+'OrderCancelBtn').remove(); 
        }    
        $('#'+snapshot.key+'OrderCancel').modal({
        ready: function() { // Callback for Modal open. Modal and trigger parameters available.
            $('#'+snapshot.key+'OrderCancelSubmit').click(function(){
                var updates={};
                updates['Order/'+snapshot.key+'/isCanceled']=true;
                updates['Order/'+snapshot.key+'/status']="Cancelation requested";
                firebase.database().ref().update(updates).then(function(){location.reload();});

            });
      }
      });
      if(snapshot.val().hasInvoice===true){
      
         firebase.storage().ref('CustomerBill/'+snapshot.val().userId+'/'+snapshot.key).getDownloadURL().then(function(url) {
               $('#'+snapshot.key+'DownloadBtn').attr("href",url);               
          });
          $('#'+snapshot.key+'DownloadBtn').click(function(){ Materialize.toast("Downloading",7000);});}
    else{$('#'+snapshot.key+'DownloadBtn').remove();}
  }
});

}

$(document).ready(function(){
    userState();
    getOrder();
 
});


