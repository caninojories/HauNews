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

	$('.register #email').blur( function(){
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var $email = $('.register #email').val();
    if(filter.test($email)){
      $('.register .help-block-email').fadeOut('fast');
    } else if ($email === ''){
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

	$('.register #cpassword').focus( function(){
		var $confirmpass = $('.register #password').val();
	if($confirmpass.length < 6){
			$('.register .help-block-password').fadeIn('fast');
			$('.register #password').focus();
			$('.register .passmatch').html('');
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
				$('.register .passmatch').html('');
				$('.register #cpassword').val('');
			}else{
				$('.help-block-pass').html('');
			}
		}
	}

	$('.register #password').keyup(passwordLength);

	$('.register #cpassword').keyup(validatePassword);


	$('.register .btn-register').on('click', function(){
		$('.register .reg-warning').html('');
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
			$('.register .reg-warning').html('<div class="alert alert-danger alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Opps!</strong>Please fill-up all the information needed!</div>');
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
	 	}else if(!filter.test($email)){
			$('.register .reg-warning').html('<div class="alert alert-danger alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Opps!</strong> Invalid email address!</div>');
			$('.register #email').focus();
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
		}else if($displayName.length < 2){
			$('.register .reg-warning').html('<div class="alert alert-danger alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Opps!</strong> Minimum of 2 characters!</div>');
			$('.register #displayName').focus();
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
		}else if($password.length < 6){
			$('.register .reg-warning').html('<div class="alert alert-danger alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Opps!</strong> Minimum of 6 characters!</div>');
			$('.register #password').focus();
			$('.register #password').val('');
			$('.register #cpassword').val('');
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
		}else if($password !== $cpassword){
			$('.register .reg-warning').html('<div class="alert alert-danger alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Opps!</strong> Password do not match!</div>');
			$('.register #password').focus();
			$('.register #password').val('');
			$('.register #cpassword').val('');
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
		}else if (!$('.agreeterms').is(':checked')){
			$('.register .reg-warning').html('<div class="alert alert-danger alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Opps!</strong> Please agree to our terms and conditions to continue registration.</div>');
			$('.register .btn-register').html('Submit');
			$('.register .btn-register').prop('disabled', false);
    } else{
				$.ajax({
					url: "https://hau-rappler.herokuapp.com/api/registration",
					method:"POST",
					data:{displayName:$displayName, email:$email, password:$password, department:$department}

				}).success( function(response){
			$('.register .reg-warning').html('<div class="alert alert-success alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Successful!</strong> Thank you for registering. Please confirm your email now.</div>');
				$('.register input').val('');
				$('.register .btn-register').html('Submit');
				$('.register .btn-register').prop('disabled', false);
				}).error( function(response){
				$('.register .reg-warning').html('<div class="alert alert-danger alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong>Server error or maybe your already registered email. Please <a href="/contact-us.html">contact us</a> and leave as your message</div>');
				$('.register .btn-register').html('Submit');
				$('.register .btn-register').prop('disabled', false);
				});
	 	}
	}); //end ajax registration
 });
