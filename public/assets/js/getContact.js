$(document).ready( function(){
  $.ajax({
    url: 'https://hau-rappler.herokuapp.com/api/contact',
    method: 'GET'
  }).success( function(response){
    console.log(response);
    $('.get-street').html(response.street);
    $('.get-brgy').html(response.barangay);
    $('.get-city').html(response.city);
    $('.get-prov').html(response.province);
    $('.get-contact').html(response.contact);
    $('.get-content').html(response.content);
  });
});
