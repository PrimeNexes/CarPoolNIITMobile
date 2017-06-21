function userState(){
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      if(user.email==="admin@tyw.org")
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
function setCar(carName, carType, noOfSeats,file) {
  var carId=firebase.database().ref('Car/').push().key;
  firebase.database().ref('Car/' + carId).set({
    carName: carName,
    carType: carType,
    noOfSeats: noOfSeats,
    isAvailable:true
  });
  firebase.storage().ref('Car/'+carId).put(file).then(function(){
                    Materialize.toast("File Uploaded", 4000);
  });
}
function getCar(refresh){
 $("#getCarToDelete").html("");   
 firebase.database().ref('Car/').on('child_added',function(snapshot){
  var carId=snapshot.val();
  if(carId.isAvailable === true && $('#'+snapshot.key).length === 0){
  $("#getCarToDelete").append(
            '<div class="row" id="'+snapshot.key+'">'+
                        '<div class="col s12 m12 l12">'+
                        '<div class="card blue-grey darken-1">'+
                        '<div class="card-content white-text">'+
                            '<span class="card-title">'+carId.carName+'</span>'+
                            '<p>Car Type : '+carId.carType+'<br/>'+
                            'No of Seats : '+carId.noOfSeats+'</p>'+
                        '</div>'+
                        '<div class="card-action">'+
                            '<a id="'+snapshot.key+'Delete" class="btn-flat">Delete</a>'+                         
                        '</div>'+
                       '</div>'+
                        '</div>'+
            '</div>'
  );
  
  $("#"+snapshot.key+"Delete").click(function(){
      try{
        firebase.database().ref('Car/'+snapshot.key).remove();
        $("#"+snapshot.key).remove();
                window.location.href ="./employee.html#Car";
        }
        catch(e){
        Materialize.toast("Error !", 4000);
        Materialize.toast(e, 4000);
        }
  });

  
  if(refresh===false){
  $("#carIdRent").append('<option value="'+snapshot.key+'">'+carId.carName+' : '+snapshot.key+'</option>');
  $('select').material_select();
  $("#carIdCarPool").append('<option class="carIdCarPool" value="'+snapshot.key+'">'+carId.carName+' : '+snapshot.key+'</option>');
  $('select').material_select();}
  else{
  $("#AddCarCarPoolDropDown").append('<option id="carAddVal" value="'+snapshot.key+'">'+carId.carName+' : '+snapshot.key+'</option>');
  $('select').material_select();}
  
  }
  });    
};

function setCarpool(routeName,routeDistance,startLocation,endLocation,startDate,endDate,fare,noOfPassengers,cars,noOfCars,file){
    var carpoolId=firebase.database().ref('CarpoolService/').push().key;
    firebase.database().ref('CarpoolService/'+carpoolId).set({
        routeName:routeName,
        routeDistance:routeDistance,
        startLocation:startLocation,
        endLocation:endLocation,
        startDate:startDate,
        endDate:endDate,
        fare:fare,
        noOfPassengers:noOfPassengers,
        cars:cars,
        noOfCars:noOfCars,
        isAvailable:true
    });
    cars.forEach(function(carId){    
      firebase.database().ref('Car/'+carId+'/isAvailable').set(false);     
  });
  firebase.storage().ref('Location/'+carpoolId).put(file).then(function(){
                    Materialize.toast("File Uploaded", 4000);
  });
};
function getCarpoolData(){
 $("#getCarpoolToDelete").html("");
 firebase.database().ref('CarpoolService/').on('child_added',function(snapshot){
   var car = snapshot.val().cars;
    var carpoolId=snapshot.val();
  if(carpoolId.isAvailable === true && $('#'+snapshot.key).length === 0){
  $("#getCarpoolToDelete").append(
            '<div class="row" id="'+snapshot.key+'">'+
                        '<div class="col s12 m12 l12">'+
                        '<div class="card blue-grey darken-1">'+
                        '<div class="card-content white-text">'+
                          '  <p>Route Name   :' +carpoolId.routeName+'<br/>'+
                            'Route Distance  :'+carpoolId.routeDistance+'<br/>'+
                            'Start Location  :'+carpoolId.startLocation+'<br/>'+
                            'End Location    :'+carpoolId.endLocation+'<br/>'+
                            'Start Date      :'+carpoolId.startDate+'<br/>'+
                            'End Date        :'+carpoolId.endDate+'<br/>'+
                            'Fare            :'+carpoolId.fare+'<br/>'+
                            'No of Passengers :'+carpoolId.noOfPassengers+'<br/>'+
                            'No of cars:'+carpoolId.noOfCars+
                               '<table>'+
                                '<thead>'+
                                '<tr>'+
                                '<th>Cars</th>'+
                                '</tr>'+
                                '</thead>'+

                                '<tbody id="'+snapshot.key+'carsTable"'+
                                '</tbody>'+
                            '</table>'+
                            '</p>'+
                            
                            
                        '</div>'+
                        '<div class="card-action">'+
                            '<a id="'+snapshot.key+'CarpoolDelete" class="btn-flat">Delete Service</a>'+
                            '<a href="#'+snapshot.key+'CarpoolAdd" class="modal-trigger waves-effect waves-blue btn-flat">Add car</a>'+
                            '<div id="'+snapshot.key+'CarpoolAdd" class="modal">'+
                            '<div class="modal-content">'+
                            '<h4>Add Car</h4>'+
                            '<div class="row">'+
                            '<form class="col s12">'+
                                '<div class="row">'+
                                '<div class="input-field col s12">'+
                                    '<select id="AddCarCarPoolDropDown">'+
                                    '<option value="" disabled selected>Choose your option</option>'+
                                    '</select>'+
                                    '<label>Select Car</label>'+
                                '</div>'+
                                '</div>'+
                                '</div>'+
                                '</form>'+
                                '</div>'+
                                
                                '<div class="modal-footer">'+
                                    '<button class="modal-action modal-close waves-effect waves-green btn-flat" id="'+snapshot.key+'CarpoolAddBtn" type="submit">Confirm Booking</button>'+
                                '</div>'+
                             
                            '</div>'+      
                            '</div>'+
                            '</div>'+
                        '</div>'+
            '</div>'
  );

var onlyonce=true;
$('#'+snapshot.key+'CarpoolAdd').modal({
        ready: function() { // Callback for Modal open. Modal and trigger parameters available.
          if(onlyonce===true){ 
        getCar(true);}
        onlyonce=false;
      }
      });

$("#"+snapshot.key+"CarpoolDelete").click(function(){
      try{
        car.forEach(function(carId){ 
        var updates = {};
        updates['CarpoolService/'+snapshot.key]=null;
        updates['Car/'+carId+'/isAvailable']=true;

        firebase.database().ref().update(updates);
        $("#"+snapshot.key).remove();
        window.location.href ="./employee.html#Carpool";
        Materialize.toast("Service deleted", 4000);
        });
        }
        catch(e){
        Materialize.toast("Error !", 4000);
        Materialize.toast(e, 4000);
        }
  });
$("#"+snapshot.key+"CarpoolAddBtn").click(function(){
      try{
        var updates = {};
        var newIndex;
        car.forEach(function(carId,index){ newIndex=index+1;});      
        updates['CarpoolService/'+snapshot.key+'/cars/'+newIndex]=document.getElementById('carAddVal').value;
        updates['Car/'+snapshot.val().carId+'/isAvailable']=false;
        firebase.database().ref().update(updates);
        $('#'+snapshot.key+'CarpoolAdd').modal('close');
        Materialize.toast("Car added to the service", 4000);
        window.location.href ="./employee.html#Carpool";
        }
        catch(e){
        Materialize.toast("Error !", 4000);
        console.log(e);
        }
  });
  car.forEach(function(carId,index){ 
        firebase.database().ref('Car/'+carId+'/carName').once('value',function(carName){$("#"+snapshot.key+"carsTable").append(               
                  '<tr id="'+carId+'carOnService"><td>'+carName.val()+'</td><td class="right"><button class="btn-flat" id="'+carId+'carDeleteOnService"><i class="material-icons">delete</i></button></td></tr>'
                  ); 
        $("#"+carId+"carDeleteOnService").click(function(){
        if(carpoolId.noOfCars!==1){ 
            try{
                var updates = {};
                updates['CarpoolService/'+snapshot.key+'/cars/'+index]=null;
                updates['Car/'+carId+'/isAvailable']=true;
                updates['CarpoolService/'+snapshot.key+'/noOfCars']=(carpoolId.noOfCars-1);
                firebase.database().ref().update(updates);
                $("#"+carId+"carOnService").remove();
                Materialize.toast("Car deleted", 4000);
                window.location.href ="./employee.html#Carpool";
               }
            catch(e){
                Materialize.toast("Error !", 4000);
                Materialize.toast(e, 4000);
                }
        }
        else{
           Materialize.toast("Can't delete the last car", 4000); 
        }
  });
  });
  });
      };
  });
};

function setRent(carId,fare){
    var rentId=firebase.database().ref('RentService/').push().key;
    firebase.database().ref('RentService/'+rentId).set({
        carId:carId,
        fare:fare,
        isAvailable:true
    });
    firebase.database().ref('Car/' + carId+'/isAvailable').set(false);
};
function getRent(){   
    $("#getRentService").html("");
    firebase.database().ref('RentService/').on('child_added',function(snapshot){
    firebase.database().ref('Car/'+snapshot.val().carId).once('value',function(carName){ 
    
    var rentId=snapshot.val();
    if(rentId.isAvailable === true && $('#'+snapshot.key).length === 0){
    $("#getRentService").append(
            '<div class="row" id="'+snapshot.key+'">'+
                        '<div class="col s12 m12 l12">'+
                        '<div class="card blue-grey darken-1">'+
                        '<div class="card-content white-text">'+
                          '<p>'+
                            'Service Id : ' +snapshot.key+'<br/><br/>'+
                            'Car Name : ' +carName.val().carName+'<br/>'+
                            'Car Type : ' +carName.val().carType+'<br/>'+
                            'Fare : '+rentId.fare+'</p>'+
                        '</div>'+
                        '<div class="card-action">'+
                            '<a id="'+snapshot.key+'RentServiceDelete" class="btn-flat">Delete</a>'+                         
                        '</div>'+
                       '</div>'+
                        '</div>'+
            '</div>'
    );
    $("#"+snapshot.key+"RentServiceDelete").click(function(){
        try{
        var updates = {};
        updates['RentService/'+snapshot.key]=null;
        updates['Car/'+snapshot.val().carId+'/isAvailable']=true;
        firebase.database().ref().update(updates);
        Materialize.toast("Service deleted", 4000);
        $("#"+snapshot.key).remove();
        window.location.href ="./employee.html#Rent";
        }
        catch(e){
        Materialize.toast("Error !", 4000);
        Materialize.toast(e, 4000);
        }
  });}
  
    }); 
});
};

function getBooking(){   
    $("#getBooking").html("");
    firebase.database().ref('Order/').on('child_added',function(snapshot){  
    var orderId=snapshot.val();
    if(orderId.isCanceled === true && $('#'+snapshot.key).length === 0 && orderId.status!=="Canceled"){
    $("#getBooking").append(
            '<div class="row" id="'+snapshot.key+'">'+
                        '<div class="col s12 m12 l12">'+
                        '<div class="card blue-grey darken-1">'+
                        '<div class="card-content white-text">'+
                          '<p>Order Id : ' +snapshot.key+'<br/>'+                         
                            'Status : ' +orderId.status+'<br/>'+
                            'Fare : '+orderId.fare+'</p>'+
                            'Date of booking : '+orderId.date+'</p>'+
                        '</div>'+
                        '<div class="card-action">'+
                            '<a id="'+snapshot.key+'OrderDelete" class="btn-flat">Cancel Order</a>'+                         
                        '</div>'+
                       '</div>'+
                        '</div>'+
            '</div>'
    );
    $("#"+snapshot.key+"OrderDelete").click(function(){
        try{
        var updates = {};
        updates['Order/'+snapshot.key+'/isCanceled']=true;
        updates['Order/'+snapshot.key+'/status']="Canceled";
        updates[orderId.orderType+'/'+orderId.serviceId+'/isAvailable']=true;
        firebase.database().ref().update(updates);
        $("#"+snapshot.key).remove();
        window.location.href ="./employee.html#Booking";
        Materialize.toast("Service deleted", 4000);
        }
        catch(e){
        Materialize.toast("Error !"+e, 4000);
        }
  });}
 
});
};

function getCompletedOrders(){   
    $("#getCompleted").html("");
    firebase.database().ref('Order/').on('child_added',function(snapshot){  
    var orderId=snapshot.val();
    if(orderId.isCanceled === false && $('#'+snapshot.key).length === 0 && orderId.status !=="Completed"){
    $("#getCompleted").append(
            '<div class="row" id="'+snapshot.key+'">'+
                        '<div class="col s12 m12 l12">'+
                        '<div class="card blue-grey darken-1">'+
                        '<div class="card-content white-text">'+
                        '<h6>Order Id : ' +snapshot.key+'</h6><br/>'+
                          '<p>'+
                            'Status : ' +orderId.status+'<br/>'+
                            'Fare : '+orderId.fare+'</p>'+
                            'Date of booking : '+orderId.date+'</p>'+
                        '</div>'+
                        '<div class="card-action">'+
                            '<a id="'+snapshot.key+'OrderCompleted" class="btn-flat">Complete Order</a>'+                         
                        '</div>'+
                       '</div>'+
                        '</div>'+
            '</div>'
    );
    $("#"+snapshot.key+"OrderCompleted").click(function(){
        try{
        var updates = {};
        updates['Order/'+snapshot.key+'/status']="Completed";
        updates[orderId.orderType+'/'+orderId.serviceId+'/isAvailable']=true;
        firebase.database().ref().update(updates);
        $("#"+snapshot.key).remove();
        window.location.href ="./employee.html#Completed";
        Materialize.toast("Service deleted", 4000);
        }
        catch(e){
        Materialize.toast("Error !"+e, 4000);
        }
  });}
 
});
};

$(document).ready(function(){ 
userState();
getCar(false);
getCarpoolData();
getRent();
getBooking();
getCompletedOrders();
$("#carForm").submit(function(event){
event.preventDefault();
var carName = document.getElementById('carname').value;   
var carType = document.getElementById('carType').value;
var noOfSeats = document.getElementById('noOfSeats').value;
var file=document.getElementById("carImg").files[0];
console.log(file);
try { 
    if(carName && carType && noOfSeats && file)
    {
        setCar(carName, carType, noOfSeats,file);
        Materialize.toast("Car Added", 4000);
        $('#carForm').trigger("reset");
        window.location.href ="./employee.html#Car";

    }
else{
    Materialize.toast("Enter all fields", 4000);
}
}
catch(e){
    console.log(e);
}

});

$("#carpoolForm").submit(function(event){
event.preventDefault();
var routeName = document.getElementById('routeName').value;   
var routeDistance = document.getElementById('routeDistance').value;
var startLocation=document.getElementById('startLocation').value;
var endLocation=document.getElementById('endLocation').value;
var startDate=document.getElementById('startDate').value;
var endDate=document.getElementById('endDate').value;
var fare=document.getElementById('fareCarPool').value;
var noOfPassengers = document.getElementById('noOfPassengers').value;
var file=document.getElementById("LocationImg").files[0];
var cars = $('.carIdCarPool:selected').map(function() {
  return this.value;
}).get();
cars.forEach(function(items){console.log(items);});
try { 
    if(routeName && routeDistance && startLocation && endLocation && startDate && endDate && fare && noOfPassengers && cars && file)
    {
    setCarpool(routeName,routeDistance,startLocation,endLocation,startDate,endDate,fare,noOfPassengers,cars,cars.length,file);
    window.location.href ="./employee.html#Carpool";
    $('#carpoolForm').trigger("reset");
    Materialize.toast("Service Added", 4000);
   
   
    }
    else{
    Materialize.toast("Enter all fields", 4000);
    }
}
catch(e){
    console.log(e);
}

});

$("#rentServiceForm").submit(function(event){
    event.preventDefault();
    var carId = document.getElementById('carIdRent').value;
    var fare=document.getElementById('fareRental').value;
    try { 
        
    if(carId && fare)
    {   console.log(carId);
        setRent(carId,fare);
        window.location.href ="./employee.html#Rent";
        $('#rentServiceForm').trigger("reset");    
        Materialize.toast("Service Added", 4000);
    }
    else
        Materialize.toast("Enter all fields", 4000);
    }
    catch(e){
    console.log(e);
    }  
});
    //Init or Update select
    $('select').material_select();

    $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
    });



});