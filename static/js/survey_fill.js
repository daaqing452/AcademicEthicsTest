$(document).ready(function(){
    $.ajax({
        url: "/survey_fill/",
        type: 'POST',
        data: {'op': 'load'},
        success: function(data) {
            var data = JSON.parse(data);
            title = 'xx';
            qstring = data['qstring'];
            now_time = new Date();
            load_time_format = gettimeformat(now_time);
            load_time = now_time.getTime();
            $('input#title').val(title);
            $('p#title').html(title);
            if(qstring == ""){
                return;
            }
            // window.setInterval(function(){ 
            //     tempSave(); 
            // }, 10000); 
            questions = JSON.parse(qstring);
            // answers_from_database = JSON.parse(data['astring']);
            page_status = "fill";
            createPage();
            getindex();
            
            // fillAnswer();
        }
    });

    /*var username = $('#username').text();
    if (localStorage.getItem('printed-' + username)) {
        //
    } else {
        $("#release_btn").attr('disabled', 'disabled');
    }*/
});

function check_filled() {
    var $f = $("form");
    var wrong_info = "";
    for(var i = 0; i < questions.length; i++){
        var $r = $f.eq(i).find('input[name="single"]');
        questions[i].filled_answer = [];
        for(var j = 0; j < $r.length; j++){
            if($r.eq(j).prop("checked") == true){
                questions[i].filled_answer.push(j);
            }
        }
        if(questions[i].filled_answer.length == 0){
            wrong_info += "第"+(i+1)+"题没有填写 You haven't filled in Question "+(i+1)+"<br/>";
        }
    }
    return wrong_info;
}

function submit(){
    var wrong_info = check_filled();
    if(wrong_info != ""){
        alert(wrong_info, 0);
        return;
    }
    var Qstring = JSON.stringify(questions);
    $.ajax({
        url: "/survey_fill/",
        type: 'POST',
        data: {'op': 'submit', 'qstring': Qstring},
        success: function(data) {
            var data = JSON.parse(data);
            alert('提交成功！你是第' + data['n_answer'] + '个完成自测的！<br/>Submitted! You are the ' +  + data['n_answer'] + ' to complete the Self-testing!', 1);
            //window.location.reload();
        }
    });
}

/*function print_promise() {
    var wrong_info = check_filled();
    if(wrong_info != ""){
        alert(wrong_info);
        return;
    }
    window.location.href='/media/preload/清华大学研究生学术道德承诺书.docx';
    $("#release_btn").removeAttr('disabled');
}*/
