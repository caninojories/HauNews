$(document).ready(function(){

	function contactUs(){
		var $firstName = $('.contact .firstName').val();
		var $lastName = $('.contact .lastName').val();
		var $email = $('.contact .email').val();
		var $subject = $('.contact .subject').val();
		var $message = $('.contact .message').val();
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if($firstName === "" && $lastName === "" && $email === "" && $subject === "" && $message === ""){
			$('.contact').prepend('<div class="alert alert-danger alert-dismissible alert-contact animated bounceInRight" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong> Please fill-up all the information needed correct.</div>');
			$('.btn-contact').prop('disabled', false).html('Submit');
		}else if($firstName.length < 2 ){
			$('.contact').prepend('<div class="alert alert-danger alert-dismissible alert-contact animated bounceInRight" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Oops!</strong> Firstname should be minimum of two characters.</div>');
			$('.btn-contact').prop('disabled', false).html('Submit');
			$('.fnameMin').removeClass('hidden');
			$('.contact .firstName').focus();
		}else if($lastName.length < 2 ){
			$('.contact').prepend('<div class="alert alert-danger alert-dismissible alert-contact animated bounceInRight" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Oops!</strong> Lastname should be minimum of two characters.</div>');
			$('.btn-contact').prop('disabled', false).html('Submit');
			$('.lnameMin').removeClass('hidden');
			$('.contact .lastName').focus();
		}else if(!filter.test($email)){
			$('.contact').prepend('<div class="alert alert-danger alert-dismissible alert-contact animated bounceInRight" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Oops!</strong> Please check your email address.</div>');
			$('.btn-contact').prop('disabled', false).html('Submit');
			$('.email-warning').removeClass('hidden');
			$('.contact .email').focus();
		}else{
			$.ajax({
				url: 'https://hau-rappler.herokuapp.com/api/contactus',
				method: 'POST',
				data: {firstName: $firstName, lastName: $lastName, email: $email, subject: $subject, message: $message}
			}).success( function(response){
				var $response = response.toUpperCase();
				if($response === 'SUCCESS'){
					$('.contact').prepend('<div class="alert alert-success alert-dismissible alert-contact" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>'+$response+'!</strong> Thank you for sending us your message.</div>');
				}else{
					$('.contact').prepend('<div class="alert alert-danger alert-dismissible alert-contact animated bounceInRight" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong> '+$response+'.</div>');
				}
				$('.btn-contact').prop('disabled', false).html('Submit');
				$('.contact input').val('');
				$('.contact textarea').val('');
			});
		}
	}

	$('.contact .firstName').keyup( function(){
		var $firstName = $('.contact .firstName').val();
		if($firstName.length < 2){
			$('.fnameMin').removeClass('hidden');
		} else if($firstName.length >= 2 ) {
			$('.fnameMin').addClass('hidden');
		}
	});

	$('.contact .lastName').keyup( function(){
		var $firstName = $('.contact .lastName').val();
		if($firstName.length < 2){
			$('.lnameMin').removeClass('hidden');
		} else if($firstName.length >= 2 ) {
			$('.lnameMin').addClass('hidden');
		}
	});

	$('.contact .firstName, .contact .lastName, .contact .email').blur( function(){
		$('.fnameMin').addClass('hidden');
		$('.lnameMin').addClass('hidden');
		$('.email-warning').addClass('hidden');
	});

	$('.contact .email').keyup( function(){
		var email = $(this).val();
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(!filter.test(email)){
			$('.email-warning').removeClass('hidden');
		} else{
			$('.email-warning').addClass('hidden');
		}
	});


	$('.btn-contact').on('click', function(){
		$('.alert-contact').remove();
		$(this).prop('disabled', true).html('Sending...');
		contactUs();
	});

});
