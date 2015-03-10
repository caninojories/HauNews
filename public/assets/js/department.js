$(document).ready(function(){
	var $c = window.location.pathname.split('/')[1];
	var $department = $c.toUpperCase();

$.ajax({
		url: "https://hau-rappler.herokuapp.com/api/post/department",
		method:"GET",
		data:{department: $department}
	}).success( function(response){
		var dNews = '<div class="row">';
			dNews += '<div class="col-xs-12">';
			dNews += '<hr>';
			dNews += '<h4 class="text-danger">Recent News</h4>';
			dNews += '<hr>';
			dNews += '</div>';
	 			for(var departmentNews in response){
 			if(response[departmentNews].status != 'pending'){
			dNews += '<div class="col-xs-12 col-sm-6 col-md-4"><br>';
			dNews += '<div class="panel panel-default angelite-panel">';
			dNews += '<div class="panel-body n"><input type="hidden" class="id-post" value="'+ response[departmentNews]._id +'"/>';
			dNews +=  	'<div id="indicatorBox">';
			dNews +=  		'<p class="text-center">'+ response[departmentNews].department +'</p>';
			dNews +=  	'</div>';
			dNews +=  	'<h3 class="news-title">'+ response[departmentNews].title +'</h3>';
			dNews +=			'<div class="row">';
			dNews +=				'<div class="col-sm-12 col-md-12 col-lg-12 t">';
			dNews +=					'<a href="/post/'+ response[departmentNews]._id +'">';
			dNews +=					'<div class="news-image t">';
			dNews +=					  '<img src="'+ response[departmentNews].imagePath[0] +'" class="img-center img-responsive" alt="">';
			dNews +=					'</div>';
			dNews +=					'</a>';
			dNews +=				'</div>';
			dNews +=			'<div class="col-sm-12 col-md-12 col-lg-12 r"><br>';
		var content = response[departmentNews].content;
		if(content.length > 150){
			dNews +=				'<p class="panel-body-info">'+ content.substr(0, 150) +'...</p>';
		} else {
			dNews +=				'<p class="panel-body-info">'+ content +'</p>';
		}
			dNews +=			'</div>';
			dNews +=			'<div class="col-sm-12 col-md-12 col-lg-12">';
			dNews +=				'<a role="button" class="btn btn-btn btn-readmore" href="/post/'+ response[departmentNews]._id +'">Read more</a>';
			dNews +=			'</div>';
			dNews +=		'</div>';
			dNews +=	'</div>';
			dNews +=	'<div class="panel-footer">';
			dNews +=  	'<span class="author"><small>Posted by : '+ response[departmentNews].displayName +' </small></span>';
			dNews +=	'</div>';
			dNews +='</div>';
			dNews +='</div>';
			}
			}
			dNews +='</div>';
	$('.department-news-lists').append(dNews);

  //============= headine news ================
  $.ajax({
    url: 'https://hau-rappler.herokuapp.com/api/post/headline',
    method: 'GET',
    data: {department: $department}
  }).success( function(response){
    if(response){
			$('.dep-headline').removeClass('hidden');
      $('.headline-title').html(response.title);
      if(response.content.length > 300){
      	$('.headline-content').html(response.content.substr(0, 300)+'...');
      }
      $('.headline-readmore').attr('href', '/post/'+response.postId);
    }

  });

  //============= Top 10 news ================
  $.ajax({
    url: 'https://hau-rappler.herokuapp.com/api/post/toptennews',
    method: 'GET',
    data: {department: $department}
  }).success( function(response){
		if(response.length === 0){
			$('.top-10-news').addClass('hidden');
		}else{
			$('.top-10-news').removeClass('hidden');
		}
    if(response){
      var topTenArray = '<ul class"list-group">';
      for(var topNews in response){
          topTenArray += '<li class="list-group-item"><a href="/post/'+response[topNews].postId+'"> '+response[topNews].title+'</a></li>';
      }
          topTenArray += '</ul>';
      $('.top-ten-news').html(topTenArray);
    }

  });

  //============= Carousel news ================
  $.ajax({
    url: 'https://hau-rappler.herokuapp.com/api/post/carousel',
    method: 'GET',
    data: {department: $department}
  }).success( function(response){
		console.log(response);
		if(response.length === 0){
			$('#myCarousel').addClass('hidden');
		} else{
			$('#myCarousel').removeClass('hidden');
		}
    if(response){
      var i = 0;
    	var e = 0;
      var $slideCarousel;
      		$slideCarousel = '<div class="carousel-inner">';
      for(var carousel in response){

      	if(i++ === 0){
      		$slideCarousel += '<div class="item active">';
      	}else{
      		$slideCarousel += '<div class="item">';
      	}
      		$slideCarousel += '<img class="img-responsive" src="' +response[carousel].imagePath[0]+ '" alt="">';
      		$slideCarousel += '<div class="container-fluid">';
      		$slideCarousel += '<div class="carousel-caption">';
      		$slideCarousel += '<h3 class="carousel-title">' +response[carousel].title+ ' </h3>';
      		$slideCarousel += '<hr>';
      		$slideCarousel += '<a class="btn btn-large btn-btn" href="/post/'+response[carousel].postId+'">Read more</a>';
      		$slideCarousel += '</div>';
      		$slideCarousel += '</div>';
      		$slideCarousel += '</div>';
      }
      		$slideCarousel += '</div>';

      var counter = '<ol class="carousel-indicators">';
      for(var icounter in response){
        if(i++ === 0){
          counter +='<li data-target="#myCarousel" data-slide-to="'+ e++ +'" class="active"></li>';
        }else{
          counter +='<li data-target="#myCarousel" data-slide-to="'+ e++ +'" class=""></li>';
        }
      }

      $('#myCarousel').append($slideCarousel);
      $('#myCarousel').append(counter);
    }

  });


	}); //end of department ajax
});
