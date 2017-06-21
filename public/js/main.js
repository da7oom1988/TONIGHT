


function going(id){
    if($('#'+ id).hasClass('btn-info')){

    $.ajax({
        type: 'POST',
        url: '/going',
        data: {id: id},
        success: function(data) {
            if (data.redirect) {
                return document.location.href = data.redirect;
            }
             $('#'+ id).removeClass('btn-info');
             $('#'+ id).addClass('btn-primary');
        },error: function(jqXHR, textStatus, err) {
                //show error message
                alert('text status '+textStatus+', err '+err)
            }
    });

    }else{
        $.ajax({
            type: 'POST',
            url: '/ungoing',
            data: {id: id},
            success: function(data) {
               if (data.redirect) {
                 return document.location.href = data.redirect;
                }
                 $('#'+ id).addClass('btn-info');
                 $('#'+ id).removeClass('btn-primary');
            },error: function(jqXHR, textStatus, err) {
                //show error message
                alert('text status '+textStatus+', err '+err)
            }
        });
    }
    
}