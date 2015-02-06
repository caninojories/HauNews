$(document).ready(function(){
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
            $('.dropdown-menu', this).stop( true, true ).slideDown("fast");
            $(this).toggleClass('open');        
        },function() {
            $('.dropdown-menu', this).stop( true, true ).slideUp("fast");
            $(this).toggleClass('open');       
    });
	
	$('[data-toggle="tooltip"]').hover(function(){
		$(this).tooltip('toggle');
	});

	$('[data-toggle="tooltip"]').hover(function(){
		$(this).tooltip('toggle');
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

	$('.view-img').on('click',function(){
		var $src = $(this).parent('.overlay-img').siblings('img').attr('src');
		var $title = $(this).parent('.overlay-img').parent('.news-image').parent('.col-sm-12').parent('.row').siblings('.news-title').html();
		$("#myModal img").attr('src', $src);
		$("#myModal .modal-title").html($title);
		$("#myModal").modal('show');
	});


    $('.panel-body-info').each(function() {
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


	 //NEWS POST
	 $.ajax({
	 	url: 'http://hau-rappler.herokuapp.com/api/post',
        method: "GET",
        data: {limit:20, skip:0}
	 }).success(function(response){
	 	console.log(response);

	 	var news = '<div class="row">';
	 			for(var newslist in response){
				news += '<div class="col-xs-12 col-sm-12 col-md-6"><br>';
				news += '<div class="panel panel-default angelite-panel">';
				news += '<div class="panel-body"><input type="hidden" class="id-post" value="'+ response[newslist]._id +'"/>';
				news +=  	'<div id="indicatorBox">';
				news +=  		'<p class="text-center">'+ response[newslist].department +'</p>';
				news +=  	'</div>';
				news +=  	'<h3 class="news-title">'+ response[newslist].title +'</h3>';
				news +=			'<div class="row">';
				news +=				'<div class="col-sm-12 col-md-12 col-lg-12">';
				news +=					'<div class="news-image">';
				news +=						'<div class="overlay-img clearfix">';
				news +=							'<div class="share-news">';
				news +=								'<a href=""><i class="fa fa-facebook-square fa-2x"></i></a>';
				news +=								'<a href=""><i class="fa fa-twitter-square fa-2x"></i></a>';
				news +=								'<a href=""><i class="fa fa-google-plus-square fa-2x"></i></a>';
				news +=							'</div>';
				news +=							'<button type="button" class="btn btn-sm view-img">';
				news +=								'<i class="fa fa-search-plus"></i>';
				news +=							'</button>';
				news +=						'</div>';
				news +=					'<img class="'+ response[newslist].imagePath +'" alt="">';
				news +=				'</div>';
				news +=			'</div>';
				news +=			'<div class="col-sm-12 col-md-12 col-lg-12"><br>';
				news +=				'<p class="panel-body-info">'+ response[newslist].content +'</p>';
				news +=				'<a role="button" class="btn btn-readmore" href="read.html">Read more</a>';
				news +=			'</div>';
				news +=		'</div>';
				news +=	'</div>';
				news +=	'<div class="panel-footer">';
				news +=  	'<span class="author"><small>Posted by : '+ response[newslist].displaName +' </small></span>';
				news +=  	'<span class="pull-right"><small>Publish : '+ response[newslist].date +'</small></span>';
				news +=	'</div>';
				news +='</div>';
				news +='</div>';
				}
				news +='</div>';
				$('.news-lists').append(news);

	 }).error( function(){
	 	console.log("Error");
	 });

	 //Readmore
	 // $(document).on('click', '.btn-readmore')
	 // var $id = $(this).parent(div).parent();
	 // $.ajax({
	 // 	url: 'http://hau-rappler.herokuapp.com/api/post/id',
	 // 	method: 'GET',
	 // 	data: {id: $id}
	 // }).success(function(response){
	 // 	console.log(response);
	 // }).error( function(response){
	 // 	console.log('Error!');
	 // });


});

// $(window).scroll(function (){
// 	var main = $('#bis-wrapper').offset();
//     var scrll = $(this).scrollTop();
//     if(scrll > main)
//     {
//         $("nav").addClass('navbar-fixed-top');
//         $("nav").addClass('fadeInDown animated');
//     }
//     else 
//     {
//         $("nav").removeClass('navbar-fixed-top');
//         $("nav").removeClass('fadeInDown animated');
//     }
// });