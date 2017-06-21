function getRentCar(type){
$("#rentWindow").html("");
firebase.database().ref('RentService/').on('child_added',function(getRent){
firebase.database().ref('Car/'+getRent.val().carId).on('value',function(snapshot){
  var carId=snapshot.val();

  function getRentCard(){
      console.log(getRent.val().carId);
        firebase.storage().ref('Car/'+getRent.val().carId).getDownloadURL().then(function(url) {
        $("#rentWindow").append(
            '<div class="row" id="'+snapshot.key+'RentCard">'+
                        '<div class="col s12 m12 l12">'+
                        '<div class="card horizontal blue-grey darken-1 small">'+
                        '<div class="card-image">'+
                                '<img src="'+url+'">'+
                                '<span class="card-title">'+carId.carName+'</span>'+
                        '</div>'+
                        '<div class="card-stacked">'+
                        
                        '<div class="card-content white-text">'+
                            '<span class="card-title">'+carId.carName+'</span>'+
                            '<p>Car Type : '+carId.carType+'<br/>'+
                            'No of Seats : '+carId.noOfSeats+'<br/>'+
                            'Fare : '+getRent.val().fare+'</p>'+
                        '</div>'+
                        '<div class="card-action">'+
                        '<a href="#'+snapshot.key+'Book" class="modal-trigger waves-effect waves-blue btn-flat ">Book</a>'+
                        '<div id="'+snapshot.key+'Book" class="modal modal-fixed-footer">'+
                            '<div class="modal-content">'+
                            '<h4>Book car</h4>'+
                            '<p>A bunch of text</p>'+
                            '</div>'+
                            '<div class="modal-footer">'+
                            '<a id="'+snapshot.key+'BookConfirm" class="modal-action modal-close waves-effect waves-green btn-flat ">Agree</a>'+
                            '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
            '</div>'); 
         
        $('#'+snapshot.key+'Book').modal();
    
    $('#'+snapshot.key+'BookConfirm').click(function(){
        if(getRent.val().isAvailable === true){
        try{
            
            setROrder(getRent.key,snapshot.key,carId.carName,carId.carType,carId.noOfSeats,getRent.val().fare,"RentService");
            firebase.database().ref('RentService/' + getRent.key+'/isAvailable').set(false);
            
        }
        catch(e)
        {
         console.log(e);
         Materialize.toast("Error.Try again or refresh the page", 4000);
        }
        finally{
        $('#'+snapshot.key+'Book').modal('close');
        $("#"+snapshot.key+"RentCard").remove();       
        Materialize.toast("Success.Check your order in 'My Order'.", 4000);
        }};
     });
     }); 
    };
    
    
    if(type){
    if(getRent.val().isAvailable === true && $('#'+snapshot.key+'RentCard').length === 0 && carId.carType===type){  
      
    getRentCard();    
    
    };
    }
    else{
    if(getRent.val().isAvailable === true && $('#'+snapshot.key+'RentCard').length === 0){  
      
    getRentCard();    
    
    } 
    }
    });
    });
};

function getCarpoolService(type){
$("#poolWindow").html("");
firebase.database().ref('CarpoolService/').on('child_added',function(getCarpool){
    
if($('#'+getCarpool.val().startLocation).length===0){       
$('#CarpoolTypeDropDown').append('<li><a id="'+getCarpool.val().startLocation+'">'+getCarpool.val().startLocation+'</a></li>');
$('#'+getCarpool.val().startLocation).click(function(){
    $("#poolWindow").html("");
    getCarpoolService(getCarpool.val().startLocation);});
}
function getCarpoolCard(){
            firebase.storage().ref('Location/'+getCarpool.key).getDownloadURL().then(function(url) {
  $("#poolWindow").append(
            '<div class="row" id="'+getCarpool.key+'CarpoolCard">'+
                        '<div class="col s12 m12 l12">'+
                        '<div class="card large blue-grey darken-1">'+
                                                '<div class="card-image">'+
                                '<img src="'+url+'">'+
                                '<span class="card-title">'+getCarpool.val().routeName+'</span>'+
                        '</div>'+
                        '<div class="card-stacked">'+
                        '<div class="card-content white-text">'+
                            'From : '+getCarpool.val().startLocation+'<br/>'+
                            'Destination : '+getCarpool.val().endLocation+'<br/>'+
                            'No of Seats per car : '+getCarpool.val().noOfPassengers+'<br/>'+
                            'Fare : '+getCarpool.val().fare+'</p>'+
                        '</div>'+
                        '<div class="card-action">'+
                        '<a href="#'+getCarpool.key+'BookC" class="modal-trigger waves-effect waves-blue btn-flat">Book</a>'+
                        '<div id="'+getCarpool.key+'BookC" class="modal modal-fixed-footer">'+
                            '<div class="modal-content">'+
                            '<h4>Book car</h4>'+
                            '<p>A bunch of text</p>'+
                            '</div>'+
                            '<div class="modal-footer">'+
                            '<a id="'+getCarpool.key+'BookConfirmC" class="modal-action modal-close waves-effect waves-green btn-flat ">Agree</a>'+
                            '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
            '</div>');    
    
    $('#'+getCarpool.key+'BookC').modal();
    
    $('#'+getCarpool.key+'BookConfirmC').click(function(){
        if(getCarpool.val().isAvailable === true){
        try{            
            setCOrder(getCarpool.key,getCarpool.val().fare,"CarpoolService");           
        }
        catch(e)
        {
         console.log(e);
         Materialize.toast("Error.Try again or refresh the page", 4000);
        }
        finally{
        $('#'+getCarpool.key+'BookC').modal('close');
        $("#"+getCarpool.key+"CarpoolCard").remove();       
        Materialize.toast("Success.Check your order in 'My Order'.", 4000);
        }};
     });
    }); 
    };
    if(type){
    if(getCarpool.val().isAvailable === true && $('#'+getCarpool.key+'RentCard').length === 0 && getCarpool.val().startLocation===type){
    getCarpoolCard();
    }
    }
    else{
    if(getCarpool.val().isAvailable === true && $('#'+getCarpool.key+'RentCard').length === 0 ){
    getCarpoolCard();
    }}
    });
};

function setROrder(serviceId,carId,carName,carType,noOfSeats,fare,orderType){
    firebase.auth().onAuthStateChanged(function(user) {
    // User is signed in.
    if (user) {
        
        var date = getDate();
        var userId=user.uid;
        var orderId=firebase.database().ref('Order/').push().key;
        firebase.database().ref('Order/' + orderId).set({
        serviceId: serviceId,
        car:{
          carId:carId,
          carName:carName,
          carType:carType,
          noOfSeats:noOfSeats
        },
        fare:fare,
        orderType: orderType,
        userId: userId,
        status: 'Processing',
        date:date,
        isCanceled:false,
        hasInvoice:false
        });
        } else {
        window.location.href ="./index.html";
        // No user is signed in.
        }
    });
}
function setCOrder(serviceId,fare,orderType){
    firebase.auth().onAuthStateChanged(function(user) {
    // User is signed in.
    if (user) {
        
        var date = getDate();
        var userId=user.uid;
        var orderId=firebase.database().ref('Order/').push().key;
        firebase.database().ref('Order/' + orderId).set({
        serviceId: serviceId,
        fare:fare,
        orderType: orderType,
        userId: userId,
        status: 'Processing',
        date:date,
        isCanceled:false,
        hasInvoice:false
        });
        } else {
        window.location.href ="./index.html";
        // No user is signed in.
        }
    });
}

$(document).ready(function(){
//Check current user on ready
userState();  
//Get all Car      
getRentCar();
getCarpoolService();
//Search Car
$("#carH").click(function(){
        getRentCar('Hatchback');
});
$("#carS").click(function(){
       getRentCar('Sedan');
});
$("#carMPV").click(function(){
       getRentCar('MPV');
});
$("#carSUV").click(function(){
        getRentCar('SUV');
});
$("#carCross").click(function(){
        getRentCar('Crossover');
});
$("#carCoupe").click(function(){
        getRentCar('Coupe');
});
$("#carConvert").click(function(){
        getRentCar('Convertible');
});
$("#carAll").click(function(){
        $("#rentWindow").html('');
        getRentCar();
});
//Dropdown Init
$(".dropdown-button").dropdown();

});
