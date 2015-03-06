$(document).ready(function(){
	var $c = window.location.pathname.split('/')[1];
	var $department = $c.toUpperCase();

$.ajax({
		url: "https://hau-rappler.herokuapp.com/api/post/department",
		method:"GET",
		data:{department: $department}	
	}).success( function(response){
		var dNews = '<div class="row">';
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
			dNews +=					  '<img src="'+ response[departmentNews].imagePath +'" class="img-center img-responsive" alt="">';
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
	$('.department-news-lists').html(dNews);

  //============= headine news ================
  $.ajax({
    url: 'https://hau-rappler.herokuapp.com/api/post/headline',
    method: 'GET',
    data: {department: $department}
  }).success( function(response){
    if(response){
      ('.heading-news.department-headline').addClass('animated bounceInRight').show();
      booleanHeadline = true;
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
    if(response[0]){
      // booleanHeadline = true;
      var topTenArray = '<ul class"list-group">';
      for(var topNews in response[0].postTopTen){
          topTenArray += '<li class="list-group-item"><a href="/post/'+response[0].postTopTen[topNews].postId+'"> '+response[0].postTopTen[topNews].title+'</a></li>';
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
      		$slideCarousel += '<img class="img-responsive" src="https://hau-rappler.herokuapp.com/uploads/' +response[0].carousel[carousel].imagePath+ '" alt="">';
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

      $('.carousel-inner').html($slideCarousel);
      $('#myCarousel').append(counter);
    }else{
      $('#myCarousel').remove();
    }

  });


	}); //end of department ajax
});