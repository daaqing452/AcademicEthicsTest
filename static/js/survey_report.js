$(document).ready(function(){
    $.ajax({
        url: window.location.href,
        type: 'POST',
        data: {'op': 'load'},
        success: function(data) {
            var data = JSON.parse(data);
            
            qstring = data['qstring'];
            score = data['score'];
            $('span#score').text(score);
            now_time = new Date();
            load_time_format = gettimeformat(now_time);
            load_time = now_time.getTime();
            
            if(qstring == ""){
                return;
            }
            // window.setInterval(function(){ 
            //     tempSave(); 
            // }, 10000); 
            questions = JSON.parse(qstring);
            // answers_from_database = JSON.parse(data['astring']);
            page_status = "report";
            createPage();
            getindex();
            
            showresults();
            // fillAnswer();
        }
    });
});

function genMessage(q){
    var message = "你选择了选项";
    for(var i = 0; i < q.filled_answer.length; i++){
        message += String.fromCharCode(65 + q.filled_answer[i]);
    }
    message += ", 正确答案为";
    for(var i = 0; i < q.right_answer.length; i++){
        message += String.fromCharCode(65 + q.right_answer[i]);
    }
    return message;
}

function showresults(){
    var $f = $("form");
    for(var i = 0; i < questions.length; i++){
        $div = $f.eq(i).parent();
        var message = genMessage(questions[i]);
        $div.append(message + "<hr>");
    }
}

function retest() {
    $.ajax({
        url: window.location.href,
        type: 'POST',
        data: {'op': 'retest'},
        success: function(data) {
            var username = $('#username').text();
            localStorage.setItem('printed-' + username, true);
            window.location.href = '/survey_fill/';
        }
    });
}

function print_promise() {
    window.location.href='/media/preload/清华大学研究生学术道德承诺书.docx';
}