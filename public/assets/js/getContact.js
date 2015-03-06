$(document).ready( function(){
  $.ajax({
    url: 'https://hau-rappler.herokuapp.com/api/contact',
    method: 'GET'
  }).success( function(response){
    console.log(response);
  });
});
