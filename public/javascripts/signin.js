$(document).ready(function(){
    $("form#TestAnswer").on('submit', function(e){
        e.preventDefault();
        let username = $('input[name=username]').val();
        let password = $('input[name=password]').val();
        console.log("test")
        $.ajax({
            type: 'post',
            url: '/login',
            data: {'username': username, 'password': password},
            dataType: 'text',
            success: function(result){
                console.log(result)
                alert(result)
            }
        })
    });
});
