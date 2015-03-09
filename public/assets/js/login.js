
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

  $('.login-user #email').blur( function(){
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var $email = $('.login-user #email').val();
    if(filter.test($email)){
      $('.login-user .help-block-email').fadeOut('fast');
    } else if ($email === ''){
      $('.login-user .help-block-email').fadeOut('fast');
    }
  })


 	function login(){
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	 	var $email = $('.login-user #email').val();
		var $password = $('.login-user #password').val();
		if($email === '' || $password === ''){
      $('.login-user .btn-login').prop('disabled', false).html('Login');
      $('.login-user .warning').html('<div class="alert alert-danger alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> Invalid email or password!</div>');
			$('.login-user input').val("");
			$('.login-user #email').focus();
		}else if(!filter.test($email)){
      $('.login-user .btn-login').prop('disabled', false).html('Login');
      $('.login-user .warning').html('<div class="alert alert-danger alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> Invalid email or password!</div>');
			$('.login-user input').val("");
			$('.login-user #email').focus();
    }else if($password === ''){
      $('.login-user .btn-login').prop('disabled', false).html('Login');
      $('.login-user .warning').html('<div class="alert alert-danger alert-dismissible error-process" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> Invalid email or password!</div>');
			$('.login-user input').val("");
			$('.login-user #password').focus();
    }else{
			$.ajax({
		 		url: "https://hau-rappler.herokuapp.com/api/userLogin",
		 		method:"POST",
		 		data:{email:$email, password:$password}

		 	}).success( function(response){
         console.log(response);
           if(response.user.verified === 'false'){
             $('.login-user .btn-login').prop('disabled', false).html('Login');
           	$('.login-user .warning').html('<div class="alert alert-warning alert-dismissible error-process verify" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Warning!</strong> Please verify your email!</div>');
             $('.login-user #email').val('');
          		$('.login-user #password').val('');
           }else{
             $('.login-user .btn-login').prop('disabled', false).html('Login');
    		 		 localStorage.setItem('rappler',response.token);
              $('.login-user #email').focus();
              $('.login-user #email').val('');
           		$('.login-user #password').val('');


      		 		if(response.user.department === 'CICT' || response.user.department === 'CEA' || response.user.department === 'CBA' || response.user.department === 'CHM' || response.user.department === 'CNAMS' || response.user.department === 'CASED' || response.user.department === 'HIGHSCHOOL' ){
      		 			window.location = '/'+response.user.department;
      		 		} else{
      		 			window.location = "/";
      		 		}
           }

		 	}).error( function(response){
        $('.login-user .btn-login').prop('disabled', false).html('Login');
        $('.login-user .warning').html('<div class="alert alert-danger alert-dismissible error-process verify" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> Invalid email or password!</div>');
        $('.login-user #email').focus();
        $('.login-user #email').val('');
     		$('.login-user #password').val('');
		 	});
		}
	}

	$('.login-user .btn-login').on('click', function(){
    $('.warning').html('');
    $(this).prop('disabled', true).html('loading...');
		login();
	});


	$('.login-user #email, .login-user #password').keypress( function(e){
		if(e.keyCode === 13 ){
      $('.warning').html('');
      $('.login-user .btn-login').prop('disabled', true).html('loading...');
			login();
		}
	});



 });
