$(document).ready(function(){

  $(document).ajaxStart(function() {
    NProgress.start();
  });
  $(document).ajaxStop(function() {
    NProgress.done();
  });

  var objHeadline = [];
  var objTopten = [];
  var objSlides = [];
  var departmentData = 'null';
	//Admin side bar
	$("#menu-toggle").click(function() {
        $("#wrapper").toggleClass("active");
	});

  $('.textarea').wysihtml5();

	//sidebar-nav active
	$("#sidebar.sidebar-nav>li").click(function() {
        $(this).siblings('li.active').removeClass("active");
        $(this).addClass("active");
        var $index = $(this).index();
        $(".news-tab>.news-tab-content").removeClass("active");
        $(".news-tab>.news-tab-content").eq($index).addClass("active");
    });

    var $token = localStorage.getItem('rappler');
     if(!$token){
        console.log("Pls login to view this page");
        window.location = "/";
     }

    //Logout
    $('.fa-power-off').on('click', function(){
        localStorage.removeItem('rappler');
        window.location = "/";
    });

     //Admin Authentication
    $.ajax({
        url: "https://hau-rappler.herokuapp.com/api/userInfo",
        method:"GET",
        data: {token:$token}

    }).success( function(response){
      var $userInfo = response;
      $department = response.data.department;
      var $userEmail = response.data.email;
      //Admins
        if($userInfo.data.accessType === "admin"){
            console.log("Welcome admin!");
            $('#wrapper').show();
            $('#sidebar > li:eq(1)').hide();

            $("#sidebar.sidebar-nav>li").click(function() {
                var $index = $(this).index();

                if($index === 2){
                    $(".news-tab>.news-tab-content").eq($index).find('table').remove();
                    $.ajax({
                        url: "https://hau-rappler.herokuapp.com/api/post/department",
                        method: "GET",
                        data: {department: $department}
                    }).success( function(response){
                           var $post = '<table class="table table-striped">';
                            $post +=    '<thead>';
                            $post +=        '<tr>';
                            $post +=            '<th>Email</th>';
                            $post +=            '<th>Title</th>';
                            $post +=            '<th>Content</th>';
                            $post +=            '<th>Status</th>';
                            $post +=        '</tr>';
                            $post +=    '</thead>';
                            $post += '<tbody>';
                        for( var news in response ) {
                            $post += '<tr><td>' + response[news].email + '</td>';
                            $post += '<td>' + response[news].displayName + '</td>';
                            $post += '<td class="news-title">' + response[news].title + '</td>';
                            $post += '<td><button class="btn btn-sm btn-info view-content">view content <i class="fa fa-search-plus"></i></button><p class="news-content" hidden>'+ response[news].content +'</p><img class="img-responsive news-img hidden" src="'+ response[news].imagePath +'" /> </td>';
                            $post += '<td>' + response[news].status + '</td>'
                            $post += '<td><button class="btn btn-sm btn-warning edit-posted-news">edit <i class="fa fa-gavel"></button></td>';
                            $post += '<td hidden><input type="text" value="'+ response[news]._id +'"/></td></tr>';

                        }
                        $post += '</tbody>';
                        $post += '</table>';

                        $(".news-tab>.news-tab-content").eq($index).find('#dataNews').append($post);

                        //View content
                          $(document).on('click', '.view-content', function(){
                            var $newsContent = $(this).siblings('p.news-content').html();
                            var $newsTitle = $(this).parent('td').siblings('td.news-title').html();
                            $('#viewContentModal').modal('show');
                            $('#viewContentModal .modal-title').html($newsTitle);
                            $('#viewContentModal .modal-content-news').html($newsContent);
                          });


                        //Edit post
                          $(document).on('click', '.edit-posted-news', function(){
                            $('#editPost').modal('show');
                            var $editId = $(this).parent('td').siblings('td').children('input').val();
                            var $editTitle = $(this).parent('td').siblings('td.news-title').html();
                            var $editContent = $(this).parent('td').siblings('td').children('p.news-content').html();
                            var $img = $(this).parent('td').siblings('td').children('.news-img').attr('src');
                            var $editImage = $img.split('/')[4];

                            $('#editPost .edit-id').val($editId);
                            $('#editPost .edit-title').val($editTitle);
                            $('.edit-content').val($editContent);
                            $('#editPost .edit-image').val($editImage);
                          });


                    }).error( function(response){
                        alert("Hello there is no response!");
                    });
                }
            }); //end #sidebar.sidebar-nav>li

        } else if ($userInfo.data.accessType === "student") {
          //Student
          window.location = "/";

        } else if ($userInfo.data.accessType === "master") {

          //Master Admin

          $('#wrapper').show();

          $.ajax({
              url: "https://hau-rappler.herokuapp.com/api/user",
              method:"GET",
          }).success( function(response){
              var $html = '<table class="table table-striped">';
                  $html +=    '<thead>';
                  $html +=        '<tr>';
                  $html +=            '<th>Department</th>';
                  $html +=            '<th>Email</th>';
                  $html +=            '<th>Username</th>';
                  $html +=            '<th>Acces Type</th>';
                  $html +=            '<th>Edit Access</th>';
                  $html +=            '<th>Delete User</th>';
                  $html +=        '</tr>';
                  $html +=    '</thead>';
                  $html += '<tbody class="users">';
              for( var obj in response ) {
                  $html += '<tr><td hidden><input class="id-delete" type="hidden" value="'+ response[obj]._id +'"/></td>';
                  $html += '<td>' + response[obj].department + '</td>';
                  $html += '<td class="email">' + response[obj].email + '</td>';
                  $html += '<td>' + response[obj].displayName + '</td>';
                if(response[obj].accessType !== $userInfo.data.accessType){
                  $html += '<td class="select-access"><select class="form-control input-sm" disabled><option selected>' + response[obj].accessType + '</option>';
                  $html += '<option value="">admin</option>';
                  $html += '<option value="">student</option></select></td>';
                  $html += '<td class="edit-access"><button class="btn btn-primary edit-btn btn-sm">Edit <i class="fa fa-gavel"></i></button></td>';
                  $html += '<td><button class="btn btn-danger btn-sm delete">Delete <i class="fa fa-trash-o"></button></td></tr>';
                } else if(response[obj]._id === $userInfo.data._id){
                  $html += '<td class="select-access"><select class="form-control input-sm" disabled><option selected>' + response[obj].accessType + '</option>';
                  $html += '<option value="">admin</option>';
                  $html += '<option value="">student</option></select></td>';
                  $html += '<td class="edit-access"><button class="btn btn-primary btn-sm">Edit <i class="fa fa-gavel"></i></button></td>';
                  $html += '<td><button class="btn btn-danger btn-sm delete">Delete <i class="fa fa-trash-o"></button></td></tr>';
                } else {
                  $html += '<td class="select-access"><select class="form-control input-sm" disabled><option selected>' + response[obj].accessType + '</option>';
                  $html += '<option value="">admin</option>';
                  $html += '<option value="">student</option></select></td>';
                  $html += '<td class="edit-access"><button class="btn btn-primary btn-sm" disabled>Edit <i class="fa fa-gavel"></i></button></td>';
                  $html += '<td><button class="btn btn-danger btn-sm delete" disabled>Delete <i class="fa fa-trash-o"></button></td></tr>';
                }
              }
                  $html += '</tbody>';
                  $html += '</table>';
              $('.data').append($html);
              // $(document).on('click', '.users .delete', function(){

              // });


              /*==================== Comment =========================*/
               $.ajax({
                url: "https://hau-rappler.herokuapp.com/api/post/comment",
                method:"GET"
              }).success( function(response){
                var $comments = '<table class="table table-striped">';
                    $comments +=    '<thead>';
                    $comments +=        '<tr>';
                    $comments +=            '<th>Username</th>';
                    $comments +=            '<th>Comment</th>';
                    $comments +=            '<th>Status</th>';
                    $comments +=            '<th>Delete</th>';
                    $comments +=        '</tr>';
                    $comments +=    '</thead>';
                    $comments += '<tbody>';
                for( var comment in response ) {
                  if(response[comment].displayName){
                    $comments += '<tr><td>' + response[comment].displayName + '</td>';
                  } else {
                    $comments += '<tr><td>' + response[comment].nickname + '</td>';
                  }
                    $comments += '<td>' + response[comment].content + '</td>';
                  if(response[comment].status === "pending"){
                    $comments += '<td><button class="btn status-comments btn-primary btn-sm">' + response[comment].status + '</button></td>';
                  } else {
                    $comments += '<td><button class="btn status-comments btn-success btn-sm">' + response[comment].status + '</button></td>';
                  }
                    $comments += '<td><button class="btn btn-sm btn-danger btn-delete-comment">Delete <i class="fa fa-trash-o"></button></td>';
                    $comments += '<td hidden><input type="text" value="'+ response[comment]._id +'"/></td></tr>';
                    }
                    $comments += '</tbody>';
                    $comments += '</table>';
                $(".comments-approval").append($comments);


                $(document).on('click', '.status-comments', function(){
                  var $status;
                  var $id = $(this).parent('td').siblings('td').children('input').val();
                  if($(this).hasClass('btn-primary')){
                    $(this).removeClass('btn-primary');
                    $(this).addClass('btn-success');
                    $(this).html("approved");
                    $status = "approved";
                  } else if($(this).hasClass('btn-success')){
                    $(this).removeClass('btn-success');
                    $(this).addClass('btn-primary');
                    $(this).html("pending");
                    $status = "pending";
                  }
                    $.ajax({
                          url: "https://hau-rappler.herokuapp.com/api/post/comment",
                          method: "PUT",
                          data: {id: $id, status:$status}
                      }).success( function(response){
                      });
                  });

                 $(document).on('click', '.btn-delete-comment', function(){
                  var $id = $(this).parent('td').siblings('td').children('input').val();
                  $(this).parent('td').parent('tr').remove();
                  $.ajax({
                    url: 'https://hau-rappler.herokuapp.com/api/post/comment',
                    method: 'DELETE',
                    data:{id:$id}
                  }).success( function(response){
                    console.log(response);
                  });
                });

              });
              /*==================== Comment =========================*/

              $("#sidebar.sidebar-nav>li").click(function() {
                  var $index = $(this).index();
                  if($index === 2){
                      $(".news-tab>.news-tab-content").eq($index).find('table').remove();

                      $.ajax({
                          url: "https://hau-rappler.herokuapp.com/api/post",
                          method: "GET",
                          data: {skip:0, limit:1000}
                      }).success( function(response){
                          var $post = '<table class="table table-striped">';
                          $post +=    '<thead>';
                          $post +=        '<tr>';
                          $post +=            '<th>Email</th>';
                          $post +=            '<th>Username</th>';
                          $post +=            '<th>Title</th>';
                          $post +=            '<th>Content</th>';
                          $post +=            '<th>Status</th>';
                          $post +=            '<th>Edit News</th>';
                          $post +=            '<th>Delete</th>';
                          $post +=        '</tr>';
                          $post +=    '</thead>';
                          $post += '<tbody>';
                      for( var news in response ) {
                          $post += '<tr><td>' + response[news].email + '</td>';
                          $post += '<td>' + response[news].displayName + '</td>';
                          $post += '<td class="news-title">' + response[news].title + '</td>';
                          $post += '<td><button class="btn btn-sm btn-info view-content">view content <i class="fa fa-search-plus"></i></button><p class="news-content" hidden>'+ response[news].content +'</p><img class="img-responsive news-img hidden" src="'+ response[news].imagePath +'" /></td>';
                        if(response[news].status === "pending"){
                          $post += '<td><button class="btn btn-sm status-news btn-primary">' + response[news].status + '</button></td>';
                        } else {
                          $post += '<td><button class="btn btn-sm status-news btn-success">' + response[news].status + '</button></td>';
                        }
                        if($userEmail === response[news].email){
                          $post += '<td><button class="btn btn-sm btn-warning edit-posted-news">edit <i class="fa fa-gavel"></button></td>';
                        } else {
                          $post += '<td><button class="btn btn-sm btn-warning disabled" disabled>edit <i class="fa fa-gavel"></button></td>';
                        }
                          $post += '<td><button class="btn btn-sm btn-danger btn-delete-post">Delete <i class="fa fa-trash-o"></button></td>';
                          $post += '<td hidden><input type="text" value="'+ response[news]._id +'"/></td></tr>';
                      }
                          $post += '</tbody>';
                          $post += '</table>';
                          $(".news-tab>.news-tab-content").eq($index).find('#dataNews').append($post);

                          //Approval of post
                          $(document).on('click', '.status-news', function(){
                            var $status;
                            var $id = $(this).parent('td').siblings('td').children('input').val();
                            if($(this).hasClass('btn-primary')){
                              $(this).removeClass('btn-primary');
                              $(this).addClass('btn-success');
                              $(this).html("approved");
                              $status = "approved";
                            } else if($(this).hasClass('btn-success')){
                              $(this).removeClass('btn-success');
                              $(this).addClass('btn-primary');
                              $(this).html("pending");
                              $status = "pending";
                            }
                              $.ajax({
                                    url: "https://hau-rappler.herokuapp.com/api/post/status",
                                    method: "PUT",
                                    data: {id: $id, status:$status}
                                }).success( function(response){
                                });
                            });

                          //View content/image
                          $(document).on('click', '.view-content', function(){
                            var $newsContent = $(this).siblings('p.news-content').html();
                            var $newsTitle = $(this).parent('td').siblings('td.news-title').html();
                            var $newsImg = $(this).siblings('img.news-img').attr('src');
                            $('#viewContentModal').modal('show');
                            $('#viewContentModal .modal-title').html($newsTitle);
                            $('#viewContentModal .modal-content-news').html($newsContent);
                            $('#viewContentModal .modal-img-news').attr('src', $newsImg);
                          });


                          //Edit post
                          $(document).on('click', '.edit-posted-news', function(){
                            $('#editPost').modal('show');
                            var $editId = $(this).parent('td').siblings('td').children('input').val();
                            var $editTitle = $(this).parent('td').siblings('td.news-title').html();
                            var $editContent = $(this).parent('td').siblings('td').children('p.news-content').html();
                            var $img = $(this).parent('td').siblings('td').children('.news-img').attr('src');
                            var $editImage = $img.split('/')[4];

                            $('#editPost .edit-id').val($editId);
                            $('#editPost .edit-title').val($editTitle);
                            $('.edit-content').val($editContent);
                            $('#editPost .edit-image').val($editImage);
                          });

                          $(document).on('click', '.btn-delete-post', function(){
                            var $id = $(this).parent('td').siblings('td').children('input').val();
                            $(this).parent('td').parent('tr').slideUp(1000).remove();
                            $.ajax({
                              url: 'https://hau-rappler.herokuapp.com/api/post/id',
                              method: 'DELETE',
                              data:{id: $id}
                            }).success( function(response){
                              console.log(response);
                            });
                          });

                      }).error( function(response){
                          alert("Hello there is no response!");
                      });

                  }
              });
          });


        } //End of master admin

        $(document).on('click','.save-btn', function(){
          var $parent = $(this).parent('.edit-access').siblings('td.select-access').children('select');
          var $accessType = $parent.find('option:selected').text();
          var $email =  $(this).parent('.edit-access').siblings('td.email').text();
          $.ajax({
              url:"https://hau-rappler.herokuapp.com/api/user",
              method:"PUT",
              data:{email:$email, accessType:$accessType}
          }).success( function(response){
          });
          $(this).parent('.edit-access').siblings('td.select-access').children('select').attr('disabled', true);
          $(this).removeClass('btn-success save-btn');
          $(this).addClass('btn-primary edit-btn');
          $(this).html('Edit');

          $.ajax({
            url: 'https://hau-rappler.herokuapp.com/api/user',
            method: 'GET'
          });

        });

    });
    //End of admins

    $(document).on('click', '.edit-btn', function() {
        var $parent = $(this).parent('.edit-access').siblings('td.select-access').children('select');
        $parent.attr('disabled', false);
        if ($parent.val() === "student") {
            $parent.children('option:eq(1)').text('admin');
            $parent.children('option:eq(2)').text('master');
        } else if ($parent.val() === "admin"){
          $parent.children('option:eq(1)').text('student');
          $parent.children('option:eq(2)').text('mster');
        }
        $(this).removeClass('btn-primary edit-btn');
        $(this).addClass('btn-success save-btn');
        $(this).html('Save');

    });


    // Create news
    function uploadFile(){
      var input = document.getElementById("file");
      file = input.files[0];
      if(file != undefined){
        formData= new FormData();
        if(!!file.type.match(/image.*/)){
          formData.append("image", file);
          $.ajax({
            url: "https://hau-rappler.herokuapp.com/api/photo",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response){
              var $title = $('#title').val();
              var $content = $('#content').val();
              var $imagePath = response.imagePath;
              $.ajax({
                  url: "https://hau-rappler.herokuapp.com/api/post",
                  method: "POST",
                  data: {title:$title, content: $content, imagePath:$imagePath, token:$token}
              }).success( function(response){
                $('input').val('');
                $('.textarea').val('');
                $('.success-process').fadeIn('fast').delay(3001).fadeOut('slow');
              });
            }
          });
        } else{
          $('.error-process').fadeIn('fast').delay(3001).fadeOut('slow');
        }
      } else {
          var $title = $('#title').val();
          var $content = $('#content').val();
          $.ajax({
              url: "https://hau-rappler.herokuapp.com/api/post",
              method: "POST",
              data: {title:$title, content:$content, imagePath:null, token:$token}
          }).success( function(response){
            $('input').val('');
            $('.textarea').val('');
            $('.success-process').fadeIn('fast').delay(3001).fadeOut('slow');
          });
        }
    }

    $('.create-news').on('click', function(){
        uploadFile();
        $('.create-news input').val("");
    });

    //Delete
    $(document).on('click', '.delete', function(){
      var $id = $(this).parent('td').siblings('td').children('.id-delete').val();
      $(this).parent('td').parent('tr').remove();
      $.ajax({
        url: 'https://hau-rappler.herokuapp.com/api/user?id='+$id,
        method: "DELETE"
      });

    });

//=================== Tyeahead ===========================//
$.ajax({
  url: 'https://hau-rappler.herokuapp.com/api/userInfo',
  method: 'GET',
  data: {token: $token}
}).success( function(response){

  if(response.data.accessType !== 'master'){
  departmentData = response.data.department;
  var departments = new Bloodhound({
    datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: 'https://hau-rappler.herokuapp.com/api/post/department?query=%QUERY&department='+response.data.department,
        filter: function (departments) {
            // Map the remote source JSON array to a JavaScript object array
            return $.map(departments, function (department) {
                return {
                    title: department.title,
                    id: department._id,
                    content: department.content,
                    imagePath: department.imagePath,
                    department: department.department
                };
            });
        }
    }
});
} else {
  var departments = new Bloodhound({
    datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: 'https://hau-rappler.herokuapp.com/api/post?query=%QUERY',
        filter: function (departments) {
            // Map the remote source JSON array to a JavaScript object array
            return $.map(departments, function (department) {
                return {
                    title: department.title,
                    id: department._id,
                    content: department.content,
                    imagePath: department.imagePath,
                    department: department.department
                };
            });
        }
    }
});
}

// Initialize the Bloodhound suggestion engine
departments.initialize();


var booleanHeadline = false;
// Instantiate the Typeahead UI
$('.typeahead').typeahead(null, {
    displayKey: 'title',
    source: departments.ttAdapter()
}).on('typeahead:selected', function(e, response){
   $(this).val('');
  var $navtab = $('.nav-tabs>li');

  //============NEWS HEADLINE=================
  if($navtab.eq(0).hasClass('active')){
    if(objHeadline.length >= 1 ){
      alert("Only one headline news is allowed.");
    }else{
      if(!booleanHeadline){
       objHeadline.push({
          postId: response.id,
          title: response.title,
          content: response.content
        });

        $('ul.headline>li').html(objHeadline[0].title);
        $('.btn-headline').on('click', function(){
          $.ajax({
            url: 'https://hau-rappler.herokuapp.com/api/post/headline',
            method: 'POST',
            data: {postId: objHeadline[0].postId, title: objHeadline[0].title, content: objHeadline[0].content, department: departmentData }
          }).success( function(response){
            objHeadline.push(response);
          });
        });
      }

    }
  }

  //================NEWS TOP 10=============
  if($navtab.eq(1).hasClass('active')){
    if(objTopten.length >= 10){
      alert('The Top 10 News should have only 10 articles, less or more than is not allowed.');
    } else {
      objTopten.push({
        postId: response.id,
        title: response.title,
      });


      for( var obj in objTopten ){
        var topTen = '<li><i class="fa fa-arrow-circle-right"></i> '+objTopten[obj].title+'</li>';
      }

      $('.topTen').append(topTen);
    }
  }

  //============== News Slides ====================
  if($navtab.eq(2).hasClass('active')){
    objSlides.push({
      postId: response.id,
      title: response.title,
      imagePath: response.imagePath
    });

    for( var  slides in objSlides ){
      var slidesTitle = '<li>'+ objSlides[slides].title +'</li>';
    }

    $('.slidesTitle').append(slidesTitle);
  }

  }); //end of typeahead




  $('.headline-tab').on('click', function(){

    if(response.data.accessType === 'master'){
      $department = 'null';
    } else {
      $department = response.data.department;
    }
    //============= headine news ================
    $.ajax({
      url: 'https://hau-rappler.herokuapp.com/api/post/headline',
      method: 'GET',
      data: {department: $department}
    }).success( function(response){
      if(response){
        booleanHeadline = true;
        $('.headline>li').html('<i class="fa fa-arrow-circle-right"></i> '+response.title);
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
        var topTenArray = '<ul class="topNews">';
        for(var topNews in response[0].postTopTen){
            topTenArray += '<li><i class="fa fa-arrow-circle-right"></i> '+response[0].postTopTen[topNews].title+'</li>';
        }
            topTenArray += '</ul>';
        $('.topTen').html(topTenArray);
      }

    });

    //============= Carousel news ================
    $.ajax({
      url: 'https://hau-rappler.herokuapp.com/api/post/carousel',
      method: 'GET',
      data: {department: $department}
    }).success( function(response){
      if(response[0]){
        // booleanHeadline = true;
        var slideCarousel = '<ul class="carousel-slide-list">';
        for(var carousel in response[0].carousel){
            slideCarousel += '<li><i class="fa fa-arrow-circle-right"></i> ' +response[0].carousel[carousel].title+'</li>';
        }
            slideCarousel += '</ul>';
        $('.slidesTitle').html(slideCarousel);
      }

    });

  }); //headline news button

}); //ajax userInfo



//=================== Delete Headline ==================
      $('.delete-headline').on('click', function(){
          objHeadline.splice(0, 1);
          $('.headline>li').html("");
          $.ajax({
            url: 'https://hau-rappler.herokuapp.com/api/post/headline',
            method: 'DELETE',
            data : {department: departmentData}
          }).success( function(response){
          });
        });

//=================== Delete TOP 10 ==================
      $('.delete-top-ten').on('click', function(){
          $('.topTen').html("");
          $.ajax({
            url: 'https://hau-rappler.herokuapp.com/api/post/toptennews',
            method: 'DELETE',
            data: {department: departmentData}
          }).success( function(response){
          });
        });

//=================== Delete carousel ==================
      $('.delete-carousel').on('click', function(){
          $('.slidesTitle').html('');
          $.ajax({
            url: 'https://hau-rappler.herokuapp.com/api/post/carousel',
            method: 'DELETE',
            data: {department: departmentData}
          }).success( function(response){
          });
        });




//=================== TOP 10 POST ==================
      $('.btn-topTen').on('click', function(){
        var topTenObj = JSON.stringify(objTopten);
        if(objTopten.length === 10 ){
          $.ajax({
            url: 'https://hau-rappler.herokuapp.com/api/post/toptennews',
            method: 'POST',
            data: {data: topTenObj, department: departmentData},
            // contentType: 'application/json',
          }).success( function(response){
          });
        } else {
          alert("Less or more than 10 articles are not allowed.");
        }
      });

//=================== slides ==================
      $('.btn-slides').on('click', function(){
        var slidesObj = JSON.stringify(objSlides);
        $.ajax({
          url: 'https://hau-rappler.herokuapp.com/api/post/carousel',
          method: 'POST',
          data: {data: slidesObj, department: departmentData}
          // contentType: 'application/json',
        }).success( function(response){
        });
      });




      // Create news
    function uploadFilePUT(){
      var input = document.getElementById("editFile");
      file = input.files[0];
      if(file != undefined){
        formData= new FormData();
        if(!!file.type.match(/image.*/)){
          formData.append("image", file);
          $.ajax({
            url: "https://hau-rappler.herokuapp.com/api/photo",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response){
                var $id = $('#editPost .edit-id').val();
                var $title = $('#editPost .edit-title').val();
                var $content = $('#editPost .edit-content').val();
                var $imagePath = response.imagePath;
                $.ajax({
                    url: "https://hau-rappler.herokuapp.com/api/post",
                    method: "PUT",
                    data: {id:$id, title:$title, content: $content, imagePath:$imagePath}
                }).success( function(response){
                  $('input').val('');
                  $('.textarea').val('');
                  $('.success-process').fadeIn('fast').delay(3001).fadeOut('slow');
                });
            }
          });
        }else{
          $('.error-process').fadeIn('fast').delay(3001).fadeOut('slow');
        }
      } else {
          var $id = $('#editPost .edit-id').val();
          var $title = $('#editPost .edit-title').val();
          var $content = $('#editPost .edit-content').val();
          $.ajax({
              url: "https://hau-rappler.herokuapp.com/api/post",
              method: "PUT",
              data: {id: $id, title:$title, content:$content, imagePath:null}
          }).success( function(response){
            $('input').val('');
            $('.textarea').val('');
            $('.success-process').fadeIn('fast').delay(3001).fadeOut('slow');
          });
        }
    }

    $('#editPost .btn-save-changes').on('click', function(){
      uploadFilePUT();
    });



  // ===========================About Us Content=============================
  $('.btn-aboutUs').on('click', function(){
    var $tag = $('.aboutUs-post #aboutUs-tag').val();
    var $aboutTitle = $('.aboutUs-post #aboutUs-title').val();
    var $aboutContent = $('.aboutUs-post #aboutUs-content').val();

    $.ajax({
        url: "https://hau-rappler.herokuapp.com/api/aboutUs",
        method: "POST",
        data: {tag: $tag, title:$aboutTitle, content:$aboutContent}
    }).success( function(response){
      console.log(response);
      $('.aboutUs-post input').val('');
      $('.aboutUs-post .textarea').val('');
      $('.aboutUs-post .success-process').fadeIn('fast').delay(3001).fadeOut('slow');
    }).error( function(response){
      $('.aboutUs-post .error-process').fadeIn('fast').delay(3001).fadeOut('slow');
    });

  });

  // ===========================Contact Us content=============================
    $('.btn-contactUs').on('click', function(){
    var $st = $('.contactUs-post #contactUs-street').val();
    var $brgy = $('.contactUs-post #contactUs-brgy').val();
    var $city = $('.contactUs-post #contactUs-city').val();
    var $prov = $('.contactUs-post #contactUs-prov').val();
    var $contact = $('.contactUs-post #contactUs-contac').val();
    var $content = $('.contactUs-post #contactUs-content').val();

    
    $.ajax({
        url: "https://hau-rappler.herokuapp.com/api/contact",
        method: "POST",
        data: {street: $st, barangay:$brgy, city:$city, province:$prov, contact:$contact, content:$content}
    }).success( function(response){
      console.log(response);
      $('.contactUs-post input').val('');
      $('.contactUs-post .textarea').val('');
      $('.aboutUs-post .success-process').fadeIn('fast').delay(3001).fadeOut('slow');
    }).error( function(response){
      $('.contactUs-post .error-process').fadeIn('fast').delay(3001).fadeOut('slow');
    });

  });



});


// ==========================================================================
