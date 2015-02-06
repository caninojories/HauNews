 
 $(document).ready(function(){
 	console.log(window.location.pathname);

	 $('.login button').on('click', function(){
	 	var $email = $('#email').val();
		var $password = $('#password').val();
		if($email === "" && $password === ""){
			alert("Invalid Input!");
			$('input').val("");
			$('#email').focus();
		}else{
			$.ajax({
		 		url: "http://hau-rappler.herokuapp.com/api/userLogin",
		 		method:"POST",
		 		data:{email:$email, password:$password}

		 	}).success( function(response){
		 		console.log(response);
		 		localStorage.setItem('rappler',response.token);
		 		if(response.user.accessType === "master" || response.user.accessType === "admin"){
		 			window.location = "/admin";
		 		} else{
		 			window.location = "/";
		 		}
		 	}).error( function(){
		 		console.log("May mali sa code mo!");
		 	});
		}
	}); //end ajax login
 });