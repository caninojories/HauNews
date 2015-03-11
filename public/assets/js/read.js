$(document).ready(function(){
	var $voteMood;
	var $token = localStorage.getItem('rappler');

	var $clickable = true;

 	$(window).load( function(){
	 	var $url = window.location.pathname;
	 	var $idp = $url.split('/');
	 	var $id = $idp[2];
	 	var $data;

		$(document).ajaxStart(function(){
			NProgress.start();
		});
		$(document).ajaxStop(function(){
			NProgress.done()
		});

	 	function reviewArticle(){
	 		$.ajax({
			 	url: 'https://hau-rappler.herokuapp.com/api/post/id',
			 	method: 'GET',
			 	data: {id:$id}
			 }).success(function(response){
			 });
	 	}

		$.ajax({
		 	url: 'https://hau-rappler.herokuapp.com/api/post/id',
		 	method: 'GET',
		 	data: {id:$id}
		 }).success(function(response){
		 	var $data = response;
			console.log(response);
		 	//Read more data
		 	var $d = new Date($data.date);
			var $days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			var $months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var $day = $days[$d.getDay()];
			var $month = $months[$d.getMonth()];
			var $date = $d.getDate();
			var $year = $d.getFullYear();
			var $min = $d.getMinutes();

			var $hours = $d.getHours();
	    var $hours = ($hours+24-2)%24;
	    var $mid='AM';
	    if($hours==0){ //At 00 hours we need to show 12 am
	    $hours=12;
	    }
	    else if($hours>12){
	    $hours= $hours%12;
	    $mid='PM';
	    }

		 	$('#indicatorBox>p').html($data.department);
		 	$('.title-content').html($data.title);
		 	$('.content').html($data.content);
		 	$('.displayName').html($data.displayName);
		 	$('.imgPath').attr('src',$data.imagePath[0]);
			var img = '<div class="clearfix">';
			for( image in $data.imagePath){
						img += '<div class="col-xs-3">';
						img += '<div class="thumbnail">';
						img += '<a href="#"><img class="img-responsive imgPath center-block" style="width:100%;" src="'+ $data.imagePath[image] +'" alt=""></a>';
						img += '</div>';
						img += '</div>';
			}
						img += '</div>';
			$('.image-thumbnails').html(img);
		 	$('.date').html($day + ', ' + $month + ' ' + $date + ', '+ $year + ' '+ $hours + ':' + $min + ' ' + $mid);

			$(document).on('click', '.image-thumbnails img', function(){
				var srcImg = $(this).attr('src');
				$('.image-post').attr('src', srcImg);
			});

	 		var $postId = response._id;
	 		$.ajax({
	 			url: "https://hau-rappler.herokuapp.com/api/userInfo",
		    method:"GET",
		    data: {token:$token}
	 		}).success(function(response){
 				var $userInfo = response; //userInfo
 				var $mood;

 				//hover mood meter
	 			$('[data-toggle="tooltip"]').hover(function(){
					$(this).tooltip('toggle');
				});

	 			function refreshUserVote(){
	 				var $postId = response._id;
	 				var $userId = $userInfo.data._id;
						$.ajax({
					        url: "https://hau-rappler.herokuapp.com/api/mood",
					        method:"GET",
					        data: {postId:$postId, userId: $userId}
					    	}).success( function(response){
					    	});
	 			}


	 			function moodMeter(){
	 				if(!$token){
	 					$('.progress').bind('click', function(){
	 						alert('Please login to be able to vote mood meter!');
	 					});
	 				}else{

	 					var $userId = $userInfo.data._id;
	 					$.ajax({
			        url: "https://hau-rappler.herokuapp.com/api/mood",
			        method:"GET",
			        data: {postId:$postId, userId: $userId}
			    	}).success( function(response){
			    		var $chkResponse = response;
			    		$('.progress').on('click', function(){
				    		var $mood = $(this).data('mood');
				    		if($chkResponse.state === 'already voted a mood'){
				    			alert('already voted');
				    		}else {
				    			if($clickable === true){
				    				$clickable = false;
					    			$.ajax({
						    			url: 'https://hau-rappler.herokuapp.com/api/mood',
						    			method: 'POST',
						    			data: {userId:$userId, postId:$postId, mood:$mood}
							    	}).success(function(response){
							    		reviewArticle();
							    		moodVotes();

							    		if($token){
								 				var $userId = $userInfo.data._id;
							 					$.ajax({
									        url: "https://hau-rappler.herokuapp.com/api/mood",
									        method:"GET",
									        data: {postId:$postId, userId: $userId}
									    	}).success( function(response){
									    		if(response !== 'Not Yet Voted for a mood for this certain post'){
									    			var $userMood = response.data.mood;
										    		var $emo = 'You are <span>'+ $userMood +'</span>. <button class="btn btn-btn btn-xs btn-danger btn-change pull-right">CHANGE</button>';
							 							$('.changeE').delay(5000).fadeIn('slow').html($emo);

							 							$(document).on('click', '.btn-change', function(){
										 					$.ajax({
										 						url: 'https://hau-rappler.herokuapp.com/api/mood/postId',
										 						method: 'DELETE',
										 						data: {userId: $userId, postId:$postId}
										 					}).success(function(response){
										 						$('.changeE').html("");
										 						$clickable = true;
										 						refreshUserVote();
												    		reviewArticle();
												    		moodVotes();
												    		location.reload();
										 					});
										 				});
									    		}


									    	});
									    }

							    	});
							    } //if clickable
					    	}
				    	}); //end of progress click
			    	});
	 				} //end of checking if user already voted
	 			} //end of moodMeter function

	 			moodMeter();

    		$.ajax({
		 			url: 'https://hau-rappler.herokuapp.com/api/mood/postId',
		 			method: 'GET',
		 			data: {postId:$postId}
		 		}).success( function(response){
		 			if(!response){
		 			}else{

		 				var totalVote = response.happy + response.sad + response.afraid + response.inspired + response.annoyed;
			 			var happy = response.happy / totalVote * 100;
			 			var inspired = response.inspired / totalVote * 100;
			 			var afraid = response.afraid / totalVote * 100;
			 			var sad = response.sad / totalVote * 100;
			 			var annoyed = response.annoyed / totalVote * 100;

			 			if(isNaN(happy) || isNaN(inspired) || isNaN(afraid) || isNaN(sad) || isNaN(annoyed)){
			 				happy = 0;
			 				inspired = 0;
			 				afraid = 0;
			 				sad = 0;
			 				annoyed = 0;
			 			}

			 			$('div[data-mood="happy"]').children('div').html(happy.toFixed(2)+'%');
			 			$('div[data-mood="inspired"]').children('div').html(inspired.toFixed(2)+'%');
			 			$('div[data-mood="afraid"]').children('div').html(afraid.toFixed(2)+'%');
			 			$('div[data-mood="sad"]').children('div').html(sad.toFixed(2)+'%');
			 			$('div[data-mood="annoyed"]').children('div').html(annoyed.toFixed(2)+'%');

			 			$('div[data-mood="happy"]').children('div').attr('aria-valuenow', happy.toFixed(2));
			 			$('div[data-mood="inspired"]').children('div').attr('aria-valuenow', inspired.toFixed(2));
			 			$('div[data-mood="afraid"]').children('div').attr('aria-valuenow', afraid.toFixed(2));
			 			$('div[data-mood="sad"]').children('div').attr('aria-valuenow', sad.toFixed(2));
			 			$('div[data-mood="annoyed"]').children('div').attr('aria-valuenow', annoyed.toFixed(2));

			 			$('div[data-mood="happy"]').children('div').css('width', happy.toFixed(2)+'%');
			 			$('div[data-mood="inspired"]').children('div').css('width', inspired.toFixed(2)+'%');
			 			$('div[data-mood="afraid"]').children('div').css('width', afraid.toFixed(2)+'%');
			 			$('div[data-mood="sad"]').children('div').css('width', sad.toFixed(2)+'%');
			 			$('div[data-mood="annoyed"]').children('div').css('width', annoyed.toFixed(2)+'%');


		 				if($token){
			 				var $userId = $userInfo.data._id;
		 					$.ajax({
				        url: "https://hau-rappler.herokuapp.com/api/mood",
				        method:"GET",
				        data: {postId:$postId, userId: $userId}
				    	}).success( function(response){
				    		if(response !== 'Not Yet Voted for a mood for this certain post'){
				    			var $userMood = response.data.mood;
					    		var $emo = 'You are <span>'+ $userMood +'</span>. <button class="btn btn-btn btn-xs btn-danger btn-change pull-right">CHANGE</button>';
							 		$('.changeE').delay(5000).fadeIn('slow').html($emo);


		 							$(document).on('click', '.btn-change', function(){
					 					$.ajax({
					 						url: 'https://hau-rappler.herokuapp.com/api/mood/postId',
					 						method: 'DELETE',
					 						data: {userId: $userId, postId:$postId}
					 					}).success(function(response){
					 						$('.changeE').html("");
					 						$clickable = true;
					 						refreshUserVote();
							    		reviewArticle();
							    		moodVotes();
							    		location.reload();
					 					});
					 				});
				    		}

				    	});
				    }
			 		}
		 		}); //ajax postId - get total votes

					function moodVotes(){
		 				$.ajax({
				 			url: 'https://hau-rappler.herokuapp.com/api/mood/postId',
				 			method: 'GET',
				 			data: {postId:$postId}
				 		}).success( function(response){
				 			if(response){

				 				var totalVote = response.happy + response.sad + response.afraid + response.inspired + response.annoyed;
					 			var happy = response.happy / totalVote * 100;
					 			var inspired = response.inspired / totalVote * 100;
					 			var afraid = response.afraid / totalVote * 100;
					 			var sad = response.sad / totalVote * 100;
					 			var annoyed = response.annoyed / totalVote * 100;

					 			if(isNaN(happy) || isNaN(inspired) || isNaN(afraid) || isNaN(sad) || isNaN(annoyed)){
					 				happy = 0;
					 				inspired = 0;
					 				afraid = 0;
					 				sad = 0;
					 				annoyed = 0;
					 			}

					 			$('div[data-mood="happy"]').children('div').html(happy.toFixed(2)+'%');
					 			$('div[data-mood="inspired"]').children('div').html(inspired.toFixed(2)+'%');
					 			$('div[data-mood="afraid"]').children('div').html(afraid.toFixed(2)+'%');
					 			$('div[data-mood="sad"]').children('div').html(sad.toFixed(2)+'%');
					 			$('div[data-mood="annoyed"]').children('div').html(annoyed.toFixed(2)+'%');

					 			$('div[data-mood="happy"]').children('div').attr('aria-valuenow', happy.toFixed(2));
					 			$('div[data-mood="inspired"]').children('div').attr('aria-valuenow', inspired.toFixed(2));
					 			$('div[data-mood="afraid"]').children('div').attr('aria-valuenow', afraid.toFixed(2));
					 			$('div[data-mood="sad"]').children('div').attr('aria-valuenow', sad.toFixed(2));
					 			$('div[data-mood="annoyed"]').children('div').attr('aria-valuenow', annoyed.toFixed(2));

					 			$('div[data-mood="happy"]').children('div').css('width', happy.toFixed(2)+'%');
					 			$('div[data-mood="inspired"]').children('div').css('width', inspired.toFixed(2)+'%');
					 			$('div[data-mood="afraid"]').children('div').css('width', afraid.toFixed(2)+'%');
					 			$('div[data-mood="sad"]').children('div').css('width', sad.toFixed(2)+'%');
					 			$('div[data-mood="annoyed"]').children('div').css('width', annoyed.toFixed(2)+'%');
					 		}
					 	});
					}

			 		setInterval( function(){
			 			moodVotes();
			 		}, 15000);


				//COMMENT
				var $content;
				var $nickname;
				var $status;
				function listComments(){
					$.ajax({
						url: 'https://hau-rappler.herokuapp.com/api/post/comment',
						method: 'GET',
						data: {postId: $postId}
					}).success(function(response){
						var $comment = '<div>';
								for(var c in response){
								var $date = new Date(response[c].date);
								var $days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
								var $day = $days[$date.getDay()];
								var $months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
								var $day = $days[$d.getDay()];
								var $mt = $months[$d.getMonth()];
								var $dt = $date.getDate();
								var $year = $date.getFullYear();
								var $min = $date.getMinutes();
								var $hr = $date.getHours();
						    var $hr = ($hr+24-2)%24;
						    var $mid='AM';
						    if($hours==0){ //At 00 hours we need to show 12 am
						    $hr=12;
						    }
						    else if($hr>12){
						    $hr= $hr%12;
						    $mid='PM';
						    }
								$comment +='<div class="comment-header clearfix">';
								$comment +=	'<div class="comment-img col-xs-2">';
								$comment +=		'<img class="img-responsive" src="http://cdn.gigya.com/gs/i/comments2/Avatar_empty_x1.png"/>';
								$comment +=	'</div>';
								$comment +=	'<div class="comment-content col-xs-10">';
								if(!response[c].userId){
								$comment +=		'<span class="comment-username">'+response[c].nickname+'</span>';
								}else{
								$comment +=		'<span class="comment-username">'+response[c].displayName+'</span>';
								}
								$comment +=		'<span class="comment-date help-block small">'+$day+' '+$hr+':'+$min+''+$mid+' '+$mt+' '+$dt+', '+$year+'</span>';
								$comment +=		'<p class="comment-comment">'+response[c].content+'</p>';
								$comment +=	'</div>';
								$comment +='</div>';
								}
								$comment += '</div>';
						$('.comments').html($comment);

					});
				}

				listComments();

				setInterval( function(){
					listComments();
				}, 15000);

				function comment(){
					var $content = $('.comment-bar').val();
					if($content === ""){
							alert("Please input something");
							$('.btn-comment').prop('disabled', false).html('comment');
							$('.comment-bar').focus();
						}else{
							if(!$token){
								$('#modalAnonymous').modal('show');

								$('.btn-guest').on('click', function(){
									var $status = 'pending';
									var $nickname = $('.guest-name').val();
									if($nickname === ""){
										alert("Invalid username, your message will not be save!");
									}else{
										$.ajax({
											url: 'https://hau-rappler.herokuapp.com/api/post/comment',
											method: 'POST',
											data: {postId: $postId, content: $content, status: $status, nickname: $nickname}
										}).success(function(response){
											alert("Your comment will be posted upon the approval of the admin!");
											$('.comment-bar').val('');
											$('.guest-name').val('');
											$('.btn-comment').prop('disabled', false).html('comment');
										});
									}
									$('#modalAnonymous').modal('hide');
								});

								$('.guest-name').keypress(function(e){
									if(e.keyCode === 13){
										var $status = 'pending';
										var $nickname = $('.guest-name').val();
										if($nickname === ""){
											alert("Invalid username, your message will not be save!");
										}else{
											$.ajax({
												url: 'https://hau-rappler.herokuapp.com/api/post/comment',
												method: 'POST',
												data: {postId: $postId, content: $content, status: $status, nickname: $nickname}
											}).success(function(response){
												alert("Thank you! Your comment will be posted upon the approval of by the admin!");
												$('.comment-bar').val('');
												$('.guest-name').val('');
												$('.btn-comment').prop('disabled', false).html('comment');
											});
										}
										$('#modalAnonymous').modal('hide');
									}
								});
							}else{
								var $status = 'approved';
								var $userId = $userInfo.data._id;
	 							var $displayName = $userInfo.data.displayName;
								$.ajax({
									url: 'https://hau-rappler.herokuapp.com/api/post/comment',
									method: 'POST',
									data: {postId: $postId, content: $content, status: $status, userId: $userId, displayName: $displayName}
								}).success(function(response){
									$.ajax({
										url: 'https://hau-rappler.herokuapp.com/api/post/comment',
										method: 'GET',
										data: {postId: $postId}
									}).success(function(response){
										$('.comment-bar').val("");
									});
								});
							}
						}
				} //end of comment

				$('.comment-bar').keypress( function(e){
					if(e.keyCode === 13){
						$('.btn-comment').prop('disabled', true).html('please wait...');
						comment();
						setTimeout( function(){
							listComments();
						}, 100);

					}
				});

				$('.btn-comment').on('click', function(){
					$(this).prop('disabled', true).html('please wait...');
					comment();
					setTimeout( function(){
						listComments();
					}, 100);
				});


	 		});

		 }).error( function(response){
		 	console.log('Error!');
		 });
	});
}); //end of document
