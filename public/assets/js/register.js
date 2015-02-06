 
 $(document).ready(function(){
	 $('.register button').on('click', function(){
	 	if('input, select' === ""){
	 		console.log("Please input fields!");
	 	} else{
	 		var $displayName = $('#displayName').val();
		 	var $email = $('#email').val();
		 	var $password = $('#password').val();
		 	var $department = $('#department').val();

		 	$.ajax({
		 		url: "http://hau-rappler.herokuapp.com/api/registration",
		 		method:"POST",
		 		data:{displayName:$displayName, email:$email, password:$password, department:$department}

		 	}).success( function(response){
		 		localStorage.setItem('angelite',response.token);
		 		window.location = "/login";

		 	}).error( function(response){
		 		
		 	});
	 	}
	 }); //end ajax registration
 });