$(document).ready( function(){
  var $token = window.location.pathname.split('/')[3];
  console.log($token);
  if($token){
    $.ajax({
      url:'https://hau-rappler.herokuapp.com/api/user/verify',
      method:'PUT',
      data: {token: $token}
    }).success( function(response){
      if(response){
        window.location ='/login';
      }
    }).error( function(response){
      console.log(response);
    });
  }
});
