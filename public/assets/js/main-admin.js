$(document).ready(function(){
	//Admin side bar
	$("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("active");
	});
        var $click = true;
        var $click2 = true;

	//sidebar-nav active
	$("#sidebar.sidebar-nav>li").click(function(event) {
        event.preventDefault();
        $(this).siblings('li.active').removeClass("active");
        $(this).addClass("active");
        var $index = $(this).index();
        $(".news-tab>.news-tab-content").removeClass("active");
        $(".news-tab>.news-tab-content").eq($index).addClass("active");
    });


    //Logout
    $('.fa-power-off').on('click', function(){
        localStorage.removeItem('rappler');
        window.location = "/";
    });


     var $token = localStorage.getItem('rappler');
     if(!$token){
        console.log("Pls login to view this page");
        window.location = "/";
     }

     //Admin Authentication
    $.ajax({
        url: "http://hau-rappler.herokuapp.com/api/userInfo",
        method:"GET",
        data: {token:$token}

    }).success( function(response){
        if(response.data === "admin"){
            console.log("your are not the master admin");
            $('#sidebar > li:eq(1)').hide();

            $("#sidebar.sidebar-nav>li").click(function(event) {
                event.preventDefault();
                var $index = $(this).index();

                if($index === 2){
                    $(".news-tab>.news-tab-content").eq($index).find('table').remove();
                    //var $post = '';
                    $.ajax({
                        url: "http://hau-rappler.herokuapp.com/api/post",
                        method: "GET",
                        data: {skip:0, limit:10}
                    }).success( function(response){
                        console.log(response);
                           var $post = '<table class="table table-striped">';
                            $post +=    '<thead>';
                            $post +=        '<tr>';
                            $post +=            '<th>Email</th>';
                            $post +=            '<th>Title</th>';
                            $post +=            '<th>Conten</th>';
                            $post +=            '<th></th>';
                            $post +=        '</tr>';
                            $post +=    '</thead>';
                            $post += '<tbody>';
                        for( var news in response ) {
                            $post += '<tr><td>' + response[news].email + '</td>';
                            $post += '<td>' + response[news].title + '</td>';
                            $post += '<td>' + response[news].content + '</td>';
                            $post += '<td>' + response[news].status + '</option></td></tr>';

                        }
                        $post += '</tbody>';
                        $post += '</table>';
                        $(".news-tab>.news-tab-content").eq($index).find('#dataNews').append($post);
                    }).error( function(response){
                        alert("Hello there is no response!");
                    });
                }
            });

        } else if (response.data === "student") {
            window.location = "/";
        } else {

            //Master Admin
            console.log(response);
            $.ajax({
                url: "http://hau-rappler.herokuapp.com/api/user",
                method:"GET",
            }).success( function(response){
                console.log(response);
                var $html = '<table class="table table-striped">';
                    $html +=    '<thead>';
                    $html +=        '<tr>';
                    $html +=            '<th>Department</th>';
                    $html +=            '<th>Email</th>';
                    $html +=            '<th>Acces Type</th>';
                    $html +=            '<th></th>';
                    $html +=        '</tr>';
                    $html +=    '</thead>';
                    $html += '<tbody>';
                for( var obj in response ) {
                    $html += '<tr><td><input class="id-delete" type="hidden" value="'+ response[obj]._id +'"/></td>';
                    $html += '<td>' + response[obj].department + '</td>';
                    $html += '<td>' + response[obj].email + '</td>';
                    $html += '<td><select class="form-control" disabled><option selected>' + response[obj].accessType + '</option>';
                    $html += '<option value="">admin</option>';
                    $html += '<option value="">student</option></select></td>';
                    $html += '<td class="edit-access"><button class="btn btn-primary edit-btn">Edit</button></td>';
                    $html += '<td><button class="btn btn-danger delete">Delete</button></td></tr>';

                }
                $html += '</tbody>';
                $html += '</table>';
                $('.data').append($html);

                $("#sidebar.sidebar-nav>li").click(function(event) {
                    event.preventDefault();
                    var $index = $(this).index();
                    if($index === 2){
                        $(".news-tab>.news-tab-content").eq($index).find('table').remove();
                        //var $post = '';
                        $.ajax({
                            url: "http://hau-rappler.herokuapp.com/api/post",
                            method: "GET",
                            data: {skip:0, limit:10}
                        }).success( function(response){
                            console.log(response);
                            var $post = '<table class="table table-striped">';
                            $post +=    '<thead>';
                            $post +=        '<tr>';
                            $post +=            '<th>Email</th>';
                            $post +=            '<th>Title</th>';
                            $post +=            '<th>Conten</th>';
                            $post +=            '<th></th>';
                            $post +=        '</tr>';
                            $post +=    '</thead>';
                            $post += '<tbody>';
                        for( var news in response ) {
                            $post += '<tr><td>' + response[news].email + '</td>';
                            $post += '<td>' + response[news].title + '</td>';
                            $post += '<td>' + response[news].content + '</td>';
                            $post += '<td><select class="form-control status"><option>' + response[news].status + '</option>';
                            $post += '<option></option></select></td>';
                            $post += '<td hidden><input type="text" value="'+ response[news]._id +'"/></td></tr>';
                            }
                            $post += '</tbody>';
                            $post += '</table>';
                            $(".news-tab>.news-tab-content").eq($index).find('#dataNews').append($post);
                        }).error( function(response){
                            alert("Hello there is no response!");
                        });
                    }
                });
            });
         
        }
    }).error( function(){

    });

    $(document).on('click', '.edit-btn', function() {
        var $parent = $(this).parent('.edit-access').siblings('td:eq(2)').children('select');
        $parent.attr('disabled', false);
        if ($parent.val() === "student") {
            console.log("hello");
            $parent.children('option:eq(1)').text('master');
            $parent.children('option:eq(2)').text('admin');
        }
        $(this).removeClass('btn-primary edit-btn');
        $(this).addClass('btn-success save-btn');
        $(this).html('Save');

    });

    $(document).on('click','.save-btn', function(){
        var $parent = $(this).parent('.edit-access').siblings('td:eq(2)').children('select');
        var $accessType = $parent.find('option:selected').text();
        var $email =  $(this).parent('.edit-access').siblings('td:eq(1)').text();
        $.ajax({
            url:"http://hau-rappler.herokuapp.com/api/user",
            method:"PUT",
            data:{email:$email, accessType:$accessType}
        }).success( function(response){
            console.log(response);
        });
        $(this).parent('.edit-access').siblings('td:eq(2)').children('select').attr('disabled', true);
        $(this).removeClass('btn-success save-btn');
        $(this).addClass('btn-primary edit-btn');
        $(this).html('Edit');
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
            url: "http://hau-rappler.herokuapp.com/api/photo",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response){
                console.log(response.imagePath);
                var $title = $('#title').val();
                var $content = $('#content').val();
                var $imagePath = response.imagePath;
                console.log($title);
                alert('success');
                $.ajax({
                    url: "http://hau-rappler.herokuapp.com/api/post",
                    method: "POST",
                    data: {title:$title, content: $content, imagePath:$imagePath, token:$token}
                });
            }
          });
        }else{
          alert('Not a valid image!');
        }
      } else {
          var $title = $('#title').val();
          var $content = $('#content').val();
          $.ajax({
              url: "http://hau-rappler.herokuapp.com/api/post",
              method: "POST",
              data: {title:$title, content:$content, imagePath:null, token:$token}
          });  
        }
    }

    $('.create-news').on('click', function(){
        uploadFile();
    });


    //Approval of post
    $(document).on('change', '.status', function(){
        var $id = $(this).parent('td').siblings('td').children('input').val();
        var $status = $(this).find('option:selected').text();
        if($status === "pending"){
            $(this).find('option:eq(1)').html('approved');
        } else {
            $(this).find('option:eq(1)').html('pending');
        }
        console.log($status);
          $.ajax({
                url: "http://hau-rappler.herokuapp.com/api/post/status",
                method: "PUT",
                data: {id: $id, status:$status}
            }).success( function(response){
               console.log(response);
            });
            
    });

    $(document).on('click', '.delete', function(){
      var $id = $(this).parent('td').siblings('td').children('.id-delete').val();
      console.log($id);
      $.ajax({
        url: 'http://hau-rappler.herokuapp.com/api/user?id='+$id,
        method: "DELETE"
      }).success( function(response){
        console.log(response);
      }).error( function(){  
        console.log("Error response!");
      });
    });


});

   

