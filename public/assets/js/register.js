$(document).ready(function(){

	$('.register #email').keyup( function(){
		var $email = $('.register #email').val();
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(!filter.test($email)){
			$('.register .help-block-email').fadeIn('fast');
		} else{
			$('.register .help-block-email').fadeOut('fast');
		}
	});

	$('.register #username').keyup( function(){
		var $userName = $('.register #displayName').val();
	if($userName.length < 2){
			$('.register .help-block-username').fadeIn('fast');
		} else{
			$('.register .help-block-username').fadeOut('fast');
		}
	});


	$('.register .btn-register').on('click', function(){
		var $displayName = $('.register #displayName').val();
	 	var $email = $('.register #email').val();
	 	var $password = $('.register #password').val();
	 	var $cpassword = $('.register #cpassword').val();
	 	var $department = $('.register #department').val();

	 	if($('.register input').val() === "" ){
	 		$('.register hr').append('<p class="text-danger">Please fill-up all the fields</p>');

	 	} else{
		 	$.ajax({
		 		url: "https://hau-rappler.herokuapp.com/api/registration",
		 		method:"POST",
		 		data:{displayName:$displayName, email:$email, password:$password, department:$department}

		 	}).success( function(response){
		 		$('.regiter .success-process').fadeIn('fast').delay(3000).fadeOut('slow');
		 		
		 	}).error( function(response){
		 		$('register .error-process').fadeIn('fast').delay(3000).fadeOut('slow');
		 	});
	 	}
	}); //end ajax registration
 });