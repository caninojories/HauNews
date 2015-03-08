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

	$('.register #displayName').keyup( function(){
		var $userName = $('.register #displayName').val();
	if($userName.length < 2){
			$('.register .help-block-username').fadeIn('fast');
		} else{
			$('.register .help-block-username').fadeOut('fast');
		}
	});

	function validatePassword(){
		var $password = $('.register #password').val();
		var $confirm = $('.register #cpassword').val();
		if($password !== ''){
			if($password !== $confirm) {
				$('.register .passmatch').html('<span class="text-danger">Password not match</span>');
			} else {
				$('.register .passmatch').html('<span class="text-success">Password match</span>');
			}
		}
	}

	function passwordLength(){
		var $password = $('.register #password').val();
		if($password !== ''){
			if($password.length < 6){
				$('.help-block-pass').html('Minimum of 6 characters');
			}else{
				$('.help-block-pass').html('');
			}
		}
	}

	$('.register #password').keyup(passwordLength);

	$('.register #cpassword').keyup(validatePassword);


	$('.register .btn-register').on('click', function(){
		$('.register .passmatch').html('');
		$(this).html('Registering...');
		$(this).prop('disabled', true);
		var $displayName = $('.register #displayName').val();
	 	var $email = $('.register #email').val();
	 	var $password = $('.register #password').val();
	 	var $cpassword = $('.register #cpassword').val();
	 	var $department = $('.register #department').val();
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

	 	if($('.register input').val() === "" ){
			$('.alert-register').remove();
	 		$('.register hr').append('<p class="animated bounceInRight alert-register text-danger">Please fill-up all the fields!</p>');
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
	 	}else if(!filter.test($email)){
			$('.alert-register').remove();
			$('.register hr').append('<p class="animated bounceInRight alert-register text-danger">Invalid email address!</p>');
			$('.register #email').focus();
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
		}else if($displayName.length < 2){
			$('.alert-register').remove();
			$('.register hr').append('<p class="animated bounceInRight alert-register text-danger">Minimum of 2 characters!</p>');
			$('.register #displayName').focus();
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
		}else if($password.length < 6){
			$('.alert-register').remove();
			$('.register hr').append('<p class="animated bounceInRight alert-register text-danger">Minimum of 6 characters!</p>');
			$('.register #password').focus();
			$('.register #password').val('');
			$('.register #cpassword').val('');
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
		}else if($password !== $cpassword){
			$('.alert-register').remove();
			$('.register hr').append('<p class="animated bounceInRight alert-register text-danger">Password do not match!</p>');
			$('.register #password').focus();
			$('.register #password').val('');
			$('.register #cpassword').val('');
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
		}else{
		 	$.ajax({
		 		url: "https://hau-rappler.herokuapp.com/api/registration",
		 		method:"POST",
		 		data:{displayName:$displayName, email:$email, password:$password, department:$department}

		 	}).success( function(response){
		 		$('.register .success-process').fadeIn('fast');
				$('.register input').val('');
				$('.register .btn-register').html('Submit');
				$('.register .btn-register').prop('disabled', false);
		 	}).error( function(response){
		 		$('register .error-process').fadeIn('fast');
				$('.register .btn-register').html('Submit');
				$('.register .btn-register').prop('disabled', false);
		 	});
	 	}
	}); //end ajax registration
 });
