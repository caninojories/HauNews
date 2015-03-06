$(document).ready(function(){

	$(document).ajaxStart(function() {
  	NProgress.start();
  });
	$(document).ajaxStop(function() {
	  NProgress.done();
	});

	//login identifier
	  var $token = localStorage.getItem('rappler');
			if(!$token){
			  	$('.logout').hide();
			  	$('.displayed-username').hide();
			  	$('.admin-link').hide();
			  	$('.contact-us-form').show();
			  }else{
			  	$('.login').hide();
			  	$('.logout').css('display', 'block');
			  	$('.display-panel').show();
			  }



// ========================Carousel===========================
	var $slider = $('#bis-wrapper #myCarousel');
	$slider.carousel({
		interval: 10000,
		cycle: true,
		pause: "false"
	});
	$slider.on('click', '.paly-pause-button', function(){
		if($('.paly-pause-button span').hasClass('glyphicon-pause')){
			$('.paly-pause-button span').removeClass('glyphicon-pause');
			$('.paly-pause-button span').addClass('glyphicon-play');
			$slider.carousel('pause');
		} else {
			$('.paly-pause-button span').removeClass('glyphicon-play');
			$('.paly-pause-button span').addClass('glyphicon-pause');
			$slider.carousel('cycle');
		}
	});

	$(".dropdown").hover(            
        function() {
            $('.dropdown-menu', this).slideDown("fast");
            $(this).toggleClass('open');        
        },function() {
            $('.dropdown-menu', this).slideUp("fast");
            $(this).toggleClass('open');       
    });

	$(window).scroll(function (){
		var main = $('#beast-nav').offset().top;
	    var scrll = $(this).scrollTop();
	    if(scrll > main)
	    {
	        $("nav").addClass('navbar-fixed-top');
	        $("nav").addClass('fadeInDown animated');
	    }
	    else 
	    {
	        $("nav").removeClass('navbar-fixed-top');
	        $("nav").removeClass('fadeInDown animated');
	    }
	});

	$(document).on('click', '.view-img',function(){
		var $src = $(this).parent('.overlay-img').siblings('img').attr('src');
		var $title = $(this).parent('.overlay-img').parent('.news-image').parent('.col-sm-12').parent('.row').siblings('.news-title').html();
		$("#myModal img").attr('src', $src);
		$("#myModal .modal-title").html($title);
		$("#myModal").modal('show');
	});

	//hover mood meter
	$(document).on('hover', '[data-toggle="tooltip"]', function(){
		$(this).tooltip('toggle');
	});

	var $p = $('.panel-body-info');
    $p.each(function() {
	    var currentText = $(this).text();
	    $(this).text(ellipseThis(currentText));
	 });
	  
	  function ellipseThis (currentText) {
	    if(currentText.length > 300) {
	      //logic for ellipses
	      
	      return currentText.substring(0,300) + '...';
	    } else {
	      return currentText;
	    }
	  }

	  	//logout
	  	$('.logout').on('click', function(){
	  		localStorage.removeItem('rappler');
	  		window.location = "/";
	  	});
	
	// Username
	if($token){
		$.ajax({
			url: 'https://hau-rappler.herokuapp.com/api/userInfo',
			method: 'GET',
			data:{token:$token}
		}).success( function(response){
			$('.display-username').html(response.data.displayName);
			if(response.data.accessType === 'student'){
				$('.admin-link').hide();
				$('.contact-us-form').show();
			}

		}); //end of userInfo ajax
	}



	 //NEWS POST
	 function newsPost(){
	 $.ajax({
	 	url: 'https://hau-rappler.herokuapp.com/api/post',
        method: "GET",
        data: {limit:1000, skip:0}
	 }).success(function(response){
	 	
				var $status = 'approved';

				$.ajax({
					url: 'https://hau-rappler.herokuapp.com/api/post/approved',
					method: 'GET',
					data: {skip:0, limit:20, status:$status}
				}).success(function(response){

					var $postList = response;
				 	var news = '<div class="row">';
				 			for(var newslist in $postList){
							news += '<div class="col-xs-12 col-sm-6 col-md-4"><br>';
							news += '<div class="panel panel-default angelite-panel">';
							news += '<div class="panel-body n"><input type="hidden" class="id-post" value="'+ $postList[newslist]._id +'"/>';
							news +=  	'<div id="indicatorBox">';
							news +=  		'<p class="text-center">'+ $postList[newslist].department +'</p>';
							news +=  	'</div>';
							news +=  	'<h4 class="news-title"><p><a href="/post/'+ $postList[newslist]._id +'">'+ $postList[newslist].title +'</a></p></h4>';
							news +=			'<div class="row">';
							news +=				'<div class="col-sm-12 col-md-12 col-lg-12 t">';
							news +=					'<a href="/post/'+ $postList[newslist]._id +'">';
							news +=					'<div class="news-image t">';
							news +=					  '<img src="'+ $postList[newslist].imagePath +'" class="img-center img-responsive" alt="">';
							news +=					'</div>';
							news +=					'</a>';
							news +=				'</div>';
							news +=				'<div class="col-sm-12 col-md-12 col-lg-12 r"><br>';
						var content = $postList[newslist].content;
						if(content.length > 150){
							news +=				'<p class="panel-body-info">'+ content.substr(0, 150) +'...</p>';
						} else {
							news +=				'<p class="panel-body-info">'+ content +'</p>';
						}
							news +=			'</div>';
							news +=			'<div class="col-sm-12"><a class="btn btn-btn" href="/post/'+ $postList[newslist]._id +'"/post/">read more...</a></div>';
							news +=		'</div>';
							news +=	'</div>';
							news +=	'<div class="panel-footer">';
							news +=  	'<span class="author"><small>Posted by : '+ $postList[newslist].displayName +' </small></span>';
							news +=	'</div>';
							news +='</div>';
							news +='</div>';
							}
							news +='</div>';
					$('.news-lists').html(news);
				});

	 }).error( function(response){
	 });
	} //end of newsPost();

	newsPost();

	setInterval( function(){
		newsPost();
	}, 20000);

var $department = 'null';
//============= headine news ================
  $.ajax({
    url: 'https://hau-rappler.herokuapp.com/api/post/headline',
    method: 'GET',
    data: {department: $department}
  }).success( function(response){
    if(response){
    	$('.heading-news.home-headline').addClass('animated bounceInRight').show();
      booleanHeadline = true;
      $('.headline-title').html(response.title);
      if(response.content.length > 300){
      	$('.headline-content').html(response.content.substr(0, 300)+'...');
      }else{
      	$('.headline-content').html(response.content);
      }
      $('.headline-readmore').attr('href', '/post/'+response.postId);
    } else {
    	$('.heading-news').remove();
    }

  });

  //============= Top 10 news ================
  $.ajax({
    url: 'https://hau-rappler.herokuapp.com/api/post/toptennews',
    method: 'GET',
    data: {department: $department}
  }).success( function(response){
    var i = 1;
    if(response[0]){
      var topTenArray = '<ul class"list-group">';
      for(var topNews in response[0].postTopTen){
          topTenArray += '<li class="list-group-item">'+ i++ +'<a href="/post/'+response[0].postTopTen[topNews].postId+'"> '+response[0].postTopTen[topNews].title+'</a></li>';
      }
          topTenArray += '</ul>';
      $('.top-ten-news').html(topTenArray);
    }else {
    	$('.top-10-news').hide();
    }

  });

  //============= Carousel news ================
  $.ajax({
    url: 'https://hau-rappler.herokuapp.com/api/post/carousel',
    method: 'GET',
    data: {department: $department}
  }).success( function(response){
    if(response[0]){
    	$('#myCarousel').fadeIn().addClass('animated fadeIn');
    	var i = 0;
    	var e = 0;
      var $slideCarousel;
      		$slideCarousel = '<div class="carousel-inner">';
      for(var carousel in response[0].carousel){

      	if(i++ === 0){
      		$slideCarousel += '<div class="item active">';
      	}else{
      		$slideCarousel += '<div class="item">';
      	}
      		$slideCarousel += '<img class="img-responsive" src="' +response[0].carousel[carousel].imagePath+ '" alt="">';
      		$slideCarousel += '<div class="container-fluid">';
      		$slideCarousel += '<div class="carousel-caption">';
      		$slideCarousel += '<h3 class="carousel-title">' +response[0].carousel[carousel].title+ ' </h3>';
      		$slideCarousel += '<hr>';
      		$slideCarousel += '<a class="btn btn-large btn-btn" href="/post/'+response[0].carousel[carousel].postId+'">Read more</a>';
      		$slideCarousel += '</div>';
      		$slideCarousel += '</div>';
      		$slideCarousel += '</div>';
      }
      		$slideCarousel += '</div>';


      var counter = '<ol class="carousel-indicators">';

     	for(var icounter in response[0].carousel){
     		if(i++ === 0){
     			counter +='<li data-target="#myCarousel" data-slide-to="'+ e++ +'" class="active"></li>';
     		}else{
     			counter +='<li data-target="#myCarousel" data-slide-to="'+ e++ +'" class=""></li>';
     		}
     	}
     			counter +='</ol>';

      $('.carousel-inner').append($slideCarousel);
      $('#myCarousel').append(counter);
    } else{
    	$('#myCarousel').removeClass('carousel slide').hide();
    }

  });
	
	var subscribeClick = false;
	
	$('.subscribe-email').keyup( function(){
		var subscribe = $('.subscribe-email').val();
  	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  	if(!filter.test(subscribe)){
			  $('.invalid-email').removeClass('hidden');
			  $(this).css('borderColor', '#a94442');
  	} else{
  		$('.invalid-email').addClass('hidden');
  		$(this).css('borderColor', '#66afe9');
  	}
	});

	$('.subscribe-email').blur( function(){
		$('.invalid-email').addClass('hidden');
  	$(this).css('borderColor', '#ccc');
	});



  $('.btn-subscribe').click( function(){
  	$('.btn-subscribe').prop('disabled', true).html('sending...');
  	$('.loading-email').removeClass('hidden');
  	var subscribe = $('.subscribe-email').val();
  	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  	if(subscribe === '' || !filter.test(subscribe)){
  		$('.btn-subscribe').prop('disabled', false).html('submit');
  		$('.invalid-email').removeClass('hidden');
  		$('.loading-email').removeClass('hidden').delay(3000).addClass('hidden');
  		NProgress.done();
  	}else{
	  	if(subscribeClick === false && filter.test(subscribe)){
	  		subscribeClick = true;
	  		NProgress.start();
				$.ajax({
						url: 'https://hau-rappler.herokuapp.com/api/post/subscribe',
						method: 'POST',
						data: {email: subscribe}
					}).success(function(response){
						NProgress.done();
						$('.btn-subscribe').prop('disabled', false).html('submit');
						$('.loading-email').addClass('hidden');
						$('.subscribe-email').val('');
						$('.email-sent').removeClass('hidden');
					}).error( function(response){
						NProgress.done();
						$('.btn-subscribe').prop('disabled', false).html('submit');
						$('.loading-email').addClass('hidden');
						$('.subscribe-email').val('');
					});
			}
		}
	});

	$('.subscribe-email').keypress( function(e){
		if(e.keyCode === 13){
	  	$('.btn-subscribe').prop('disabled', true).html('sending...');
	  	$('.loading-email').removeClass('hidden');
	  	var subscribe = $('.subscribe-email').val();
	  	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  	if(subscribe === '' || !filter.test(subscribe)){
	  		$('.btn-subscribe').prop('disabled', false).html('submit');
	  		$('.invalid-email').removeClass('hidden');
	  		$('.loading-email').removeClass('hidden').delay(3000).addClass('hidden');
	  		NProgress.done();
	  	}else{
		  	if(subscribeClick === false && filter.test(subscribe)){
		  		subscribeClick = true;
		  		NProgress.start();
					$.ajax({
							url: 'https://hau-rappler.herokuapp.com/api/post/subscribe',
							method: 'POST',
							data: {email: subscribe}
						}).success(function(response){
							NProgress.done();
							$('.btn-subscribe').prop('disabled', false).html('submit');
							$('.loading-email').addClass('hidden');
							$('.subscribe-email').val('');
							$('.email-sent').removeClass('hidden');
						}).error( function(response){
							NProgress.done();
							$('.btn-subscribe').prop('disabled', false).html('submit');
							$('.loading-email').addClass('hidden');
							$('.subscribe-email').val('');
						});
				}
			}
		}
	});


    $.ajax({
        url: "https://hau-rappler.herokuapp.com/api/aboutUs",
        method: "GET"
    }).success( function(response){
      console.log(response);
    }).error( function(response){
      console.log(response);
    });


});