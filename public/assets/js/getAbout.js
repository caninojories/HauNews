$(document).ready( function(){
  $.ajax({
    url:'https://hau-rappler.herokuapp.com/api/aboutUs',
    method: 'GET'
  }).success( function(response){
    if(response){
      $('#aboutTag').html(response.tag);
      $('#aboutTitle').html(response.title);
      $('#aboutContent').html(response.content);
    }
  });
});
