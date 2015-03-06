 
 $(document).ready(function(){

 	var $token = localStorage.getItem('rappler');
 	if($token){
 		$('.news-wrapper').css('opacity', 0);
 	}

	$('.login-user #email').keyup( function(){
		var $email = $('.login-user #email').val();
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(!filter.test($email)){
			$('.login-user .help-block-email').fadeIn('fast');
		} else{
			$('.login-user .help-block-email').fadeOut('fast');
		}
	});
 	

 	function login(){

	 	var $email = $('.login-user #email').val();
		var $password = $('.login-user #password').val();
		if($email === "" || $password === ""){
			$('.error-process').fadeIn('fast').delay(3000).fadeOut('slow');
			$('.login-user input').val("");
			$('.login-user #email').focus();
		}else{
			$.ajax({
		 		url: "https://hau-rappler.herokuapp.com/api/userLogin",
		 		method:"POST",
		 		data:{email:$email, password:$password}

		 	}).success( function(response){
		 		localStorage.setItem('rappler',response.token);
		 		$department = [{d: 'CICT'},{d: 'CEA'},{d: 'CHM'},{d: 'CNAMS'},{d: 'CASED'},{d: 'HIGHSCHOOL'},{d: 'CBA'}];
		 		
		 		if(response.user.department === $department[0].d){
		 			window.location = '/'+response.user.department;
		 		} else{
		 			window.location = "/";
		 		}
		 	}).error( function(response){
      	$('.login-user .error-process').fadeIn('fast').delay(3000).fadeOut('slow');
		 	});
		}
	}

	$('.login-user .btn-login').on('click', function(){
		login();
	});


	$('.login-user #email, .login-user #password').keypress( function(e){
		if(e.keyCode === 13 ){
			login();
		}
	});



 });