$(document).ready(function(){
  $.ajax({
    url: "../assets/js/sample.json",
    dataType: 'json',
    success: function(data) {
      // for ( var news in data.weather ) {
      //   console.log(data[news].id);
      // }
      var $num = 0; 
      alert("Temperature is: " + data.weather[$num].main);
    },
    error: function() {
      alert("error");
    }
  });        
});