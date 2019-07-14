
$(document).ready(function(){
    $.ajax({
        url: window.location.href,
        type: 'POST',
        data: {'op': 'load'},
        success: function(data) {
            var data = JSON.parse(data);
            situation = data['status'];
            title = data['title'];
            qstring = data['qstring'];
            now_time = new Date();
            load_time_format = gettimeformat(now_time);
            load_time = now_time.getTime();
            $('input#title').val(title);
            $('p#title').html(title);
            if(qstring == ""){
                return;
            }
            if(situation == 0){
                questions = JSON.parse(qstring);
                createPage();
                getindex();
            }
            if(situation == 1){
                //定时保存
                window.setInterval(function(){ 
                    tempSave(); 
                }, 10000); 
                questions = JSON.parse(qstring);
                answers_from_database = JSON.parse(data['astring']);
                showPage();
                getindex();
                fillAnswer();
            }

        }
    });

});