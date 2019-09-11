


$(document).ready(function(){
    $.ajax({
        url: "/survey_create/",
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
            window.setInterval(function(){ 
                tempSave(); 
            }, 10000); 
            questions = JSON.parse(qstring);
            page_status = "create";
            createPage();
            getindex();
            fillanswer();
            
        }
    });
});

function tempSave(){
    var $f = $("form");
    for(var i = 0; i < questions.length; i++){
        var $r = $f.eq(i).find('input[name="single"]');
        questions[i].right_answer = [];
        for(var j = 0; j < $r.length; j++){
            if($r.eq(j).prop("checked") == true){
                questions[i].right_answer.push(j);
            }
        }
    }
}

function fillanswer(){
    var $f = $("form");
    for(var i = 0; i < questions.length; i++){
        var $r = $f.eq(i).find('input[name="single"]');
        for(var j = 0; j < questions[i].right_answer.length; j++){
            $r.eq(questions[i].right_answer[j]).prop("checked",true);
        }
    }
}

function createSurvey(s_type){
    current_status.s_type = s_type;
    current_status.action = 1;
    $("#myModal2").modal("hide");
    createModal();
}



var options = {  
resizeType : 1,
filterMode : true,  
allowImageUpload : false,  
allowFlashUpload : false,  
allowMediaUpload : false,  
allowFileManager : false,  
afterBlur: function(){this.sync();},
items : ['fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',  
'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',  
'insertunorderedlist'],  
}; 

function createModal(){
    switch(current_status.s_type){
        case 1:{
            //single choice
            $("#myModal_body").empty();
            $("#myModal_body").append(table_html,table_html,table_html);
            var $mymodal_table = $("#myModal_body").children(".table");
            $mymodal_table.eq(0).append(table_title_html);
            $mymodal_table.eq(1).attr("id","options");
            $mymodal_table.eq(1).addClass("table-striped");
            $mymodal_table.eq(1).append("<tbody></tbody>");
            $mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
            var single_table_title = "<tr><td class=\"id_col\">选项序号</td>"
                                        +"<td class=\"text_col\">选项文字</td>"
                                        +"<td class=\"op_col\">操作</td></tr>";
            $mymodal_tbody.append(single_table_title);
            $mymodal_tbody.append("<tr>"+option_html+"</tr>");
            $mymodal_tbody.find("input[id=\"option_index\"]").val("A");
            $mymodal_table.eq(2).append(table_jiexi_html);

    
            break;
        }
        case 2:{
            //multiple choice
            $("#myModal_body").empty();
            $("#myModal_body").append(table_html,table_html, table_html);
            var $mymodal_table = $("#myModal_body").children(".table");
            $mymodal_table.eq(0).append(table_title_html);
            $mymodal_table.eq(1).attr("id","options");
            $mymodal_table.eq(1).addClass("table-striped");
            $mymodal_table.eq(1).append("<tbody></tbody>");
            $mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
            var single_table_title = "<tr><td class=\"id_col\">选项序号</td>"
                                        +"<td class=\"text_col\">选项文字</td>"
                                        +"<td class=\"op_col\">操作</td></tr>";
            $mymodal_tbody.append(single_table_title);
            $mymodal_tbody.append("<tr>"+option_html+"</tr>");
            $mymodal_tbody.find("input[id=\"option_index\"]").val("A");
            $mymodal_table.eq(2).append(table_jiexi_html);
                  
            break;
        }
        default: {
            break;
        }
    }
    $("#myModal_body").children(".table").eq(0).find("textarea").eq(0).attr("name","title_bianji");
    title_editor = KindEditor.create('textarea[name="title_bianji"]',options);
    $("#myModal_body").children(".table").eq(2).find("textarea").eq(0).attr("name","jiexi_bianji");
    jiexi_editor = KindEditor.create('textarea[name="jiexi_bianji"]',options);
}

function addOption(b)
{
    var $b = $(b);
    var index = $b.parents("tr").index();
    var current_row = b.parentNode.parentNode;
    var row_type = current_row.getAttribute("class");
    var current_index = current_row.rowIndex;
    var op_table = b.parentNode.parentNode.parentNode;
    var new_row = op_table.insertRow(current_index + 1);
    if(row_type == "option_text"){
        new_row.innerHTML = option_html_text;
        new_row.setAttribute("class","option_text");
    }
    else{
        new_row.innerHTML = option_html;
        $b.parents("table").find("input[id=\"option_index\"]").eq(index).val(String.fromCharCode(65 +index));
    }
}

function delOption(b)
{
    var current_row = b.parentNode.parentNode;
    var current_index = current_row.rowIndex;
    var op_table = b.parentNode.parentNode.parentNode;
    if(current_index == 1 && op_table.rows.length == 2)
    {
        alert("至少一个选项！");
        return;
    }
    op_table.deleteRow(current_index);
}

function closeModal(){
    operate_index = current_status.index;
}

function commitS(){
    var q = getQFromModal();
    if(!q) return;
    $("#myModal").modal('hide');
    if(operate_index == current_status.index){
        questions.push(q);
        var new_row = q_table.insertRow(-1);
        new_row.innerHTML = unescapeHTML(sanitizeHTML(createHtml(q)));
        current_status.index ++;
        if(current_status.action == 2){
            deleteQ($(q_table.rows[operate_index-1]).children("td"));
        }
        operate_index = current_status.index;
        return;
    }
    else{
        questions.splice(operate_index,0,q);
        var new_row = q_table.insertRow(operate_index);
        new_row.innerHTML = unescapeHTML(sanitizeHTML(createHtml(q)));
        var rows = q_table.rows;
        if(q.s_type != 8){
            for(var i = operate_index+1; i < questions.length; i ++)
            {
                questions[i].index ++;
                rows[i].innerHTML = unescapeHTML(sanitizeHTML(createHtml(questions[i])));
            }
        }
        if(current_status.action == 2){
            deleteQ($(q_table.rows[operate_index-1]).children("td"));
        }
        current_status.index ++;
        operate_index = current_status.index;
        return;
    }
}

function getQFromModal(){
    var q = {s_type:current_status.s_type};
    //q.index
    if(questions.length == 0){
        q.index = 0;
    }
    else{
        for(var i = operate_index-1; i >= 0; i--){
            if(questions[i].s_type != 8){
                q.index = questions[i].index+1; 
                break;
            }
            if(i == 0 && questions[0].s_type == 8){
                q.index = 0;
            }
        }
    }
    q.title_html = title_editor.html();
    q.title = title_editor.text();
    q.jiexi_html = jiexi_editor.html();
    q.jiexi = jiexi_editor.text();

    switch(current_status.s_type){
        case 1:{
            var rows = document.getElementById("options").rows;
            if(rows[1].children[1].children[0].value == "" & rows[1].children[2].children[1].value == ""){
                q.n_option = 0;
                q.options = [];
            }
            else{
            q.n_option = rows.length-1;
            q.options = [];
            for(var i = 1; i < rows.length; i ++)
            {
                var option = {}
                var cols = rows[i].children;
                option.index = cols[0].children[0].value;
                option.text = cols[1].children[0].value;
                option.option_type = 0;
                q.options.push(option);
            }
            q.right_answer = [];
            q.filled_answer = [];
            }
            break;
        }
        case 2:{
            var rows = document.getElementById("options").rows;
            if(rows[1].children[1].children[0].value == "" & rows[1].children[2].children[1].value == ""){
                q.n_option = 0;
                q.options = [];
            }
            else{
                q.n_option = rows.length-1;
                q.options = [];
                for(var i = 1; i < rows.length; i ++)
                {
                    var option = {}
                    var cols = rows[i].children;
                    option.index = cols[0].children[0].value;
                    option.text = cols[1].children[0].value;
                    option.option_type = 0;
                    q.options.push(option);
                }
                q.right_answer = [];
                q.filled_answer = [];
            }
            break;
        }
        default: {
            break;
        }

    }
    return q;
}



function addQAfter(b){
    $("#myModal_body2").empty();
    $("#myModal_body2").append($("div[name=\"my-btn-group\"]").html());
    var $b = $(b);
    var index = $b.parents("tr").index();
    operate_index = index+1;
}

function deleteQ(b){
    var $b = $(b);
    var index = $b.parents("tr").index();
    current_status.index --;
    q_table.deleteRow(index);
    var now_s_type = questions[index].s_type;
    questions.splice(index, 1);
    var rows = q_table.rows;
    if(now_s_type != 8){
        for(var i = index; i < questions.length; i ++)
        {
            questions[i].index --;
            rows[i].innerHTML = unescapeHTML(sanitizeHTML(createHtml(questions[i])));
        }
    }
    operate_index = current_status.index;
}

function modifyQ(b){
    var $b = $(b);
    var index = $b.parents("tr").index();
    var q = questions[index];
    current_status.action = 2;
    current_status.s_type = q.s_type;
    switch(q.s_type){
        case 1:{
            //single choice
            $("#myModal_body").empty();
            $("#myModal_body").append(table_html,table_html,table_html);
            var $mymodal_table = $("#myModal_body").children(".table");
            $mymodal_table.eq(0).append(table_title_html);
            $("#myModal_body").children(".table").eq(0).find("textarea").eq(0).attr("name","title_bianji");
            title_editor = KindEditor.create('textarea[name="title_bianji"]',options);
            title_editor.html(q.title_html);
            $mymodal_table.eq(1).attr("id","options");
            $mymodal_table.eq(1).addClass("table-striped");
            $mymodal_table.eq(1).append("<tbody></tbody>");
            $mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
            var single_table_title = "<tr><td class=\"id_col\">选项序号</td>"
                                    +"<td class=\"text_col\">选项文字</td>"
                                    
                                    +"<td class=\"op_col\">操作</td></tr>";
            $mymodal_tbody.append(single_table_title);
            for(var i = 0; i < q.n_option; i++){
                $mymodal_tbody.append("<tr>"+option_html+"</tr>");
            }
            if(q.n_option==0){
                $mymodal_tbody.append("<tr>"+option_html+"</tr>");
            }
            for(var i = 0; i < q.n_option; i++){
                var option = q.options[i];
                $mymodal_tbody.find("input[id=\"option_index\"]").eq(i).val(option.index);
                $mymodal_tbody.find("input[id=\"option_text\"]").eq(i).val(option.text);
                

            }
            $mymodal_table.eq(2).append(table_jiexi_html);
            $("#myModal_body").children(".table").eq(2).find("textarea").eq(0).attr("name","jiexi_bianji");
            jiexi_editor = KindEditor.create('textarea[name="jiexi_bianji"]',options);
            jiexi_editor.html(q.jiexi_html);
            
            break;
        }
        case 2:{
            $("#myModal_body").empty();
            $("#myModal_body").append(table_html,table_html);
            var $mymodal_table = $("#myModal_body").children(".table");
            $mymodal_table.eq(0).append(table_title_html);
            $("#myModal_body").children(".table").eq(0).find("textarea").eq(0).attr("name","title_bianji");
            title_editor = KindEditor.create('textarea[name="title_bianji"]',options);
            title_editor.html(q.title_html);
            $mymodal_table.eq(1).attr("id","options");
            $mymodal_table.eq(1).addClass("table-striped");
            $mymodal_table.eq(1).append("<tbody></tbody>");
            $mymodal_tbody = $mymodal_table.eq(1).children().eq(0);
            var single_table_title = "<tr><td class=\"id_col\">选项序号</td>"
                                    +"<td class=\"text_col\">选项文字</td>"
                                    +"<td class=\"op_col\">操作</td></tr>";
            $mymodal_tbody.append(single_table_title);
            for(var i = 0; i < q.n_option; i++){
                $mymodal_tbody.append("<tr>"+option_html+"</tr>");
            }
            if(q.n_option==0){
                $mymodal_tbody.append("<tr>"+option_html+"</tr>");
            }
            for(var i = 0; i < q.n_option; i++){
                var option = q.options[i];
                $mymodal_tbody.find("input[id=\"option_index\"]").eq(i).val(option.index);
                $mymodal_tbody.find("input[id=\"option_text\"]").eq(i).val(option.text);
            }
            
            $mymodal_table.eq(2).append(table_jiexi_html);
            $("#myModal_body").children(".table").eq(2).find("textarea").eq(0).attr("name","jiexi_bianji");
            jiexi_editor = KindEditor.create('textarea[name="jiexi_bianji"]',options);
            jiexi_editor.html(q.jiexi_html);
            break;
        }
        default: {
            break;
        }
    }
        
    operate_index = index+1;
}

function moveQup(b){
    var $b = $(b);
    var index = $b.parents("tr").index();
    if(index == 0){
        return;
    }
    var swap_index = index - 1;
    if(questions[index].s_type == 8 || questions[swap_index].s_type == 8){
        var temp_q = questions[index];
        questions.splice(index, 1);
        questions.splice(swap_index,0,temp_q);
    }
    else{
        var temp_q = questions[index];
        temp_q.index -= 1;
        questions[swap_index].index += 1;
        questions.splice(index, 1);
        questions.splice(swap_index,0,temp_q);
    }
    var rows = q_table.rows;
    for(var i = 0; i < questions.length; i++){
        rows[i].innerHTML = unescapeHTML(sanitizeHTML(createHtml(questions[i])));
    }
}

function moveQdown(b){
    var $b = $(b);
    var index = $b.parents("tr").index();
    if(index == questions.length-1){
        return;
    }
    var swap_index = index + 1;
    if(questions[index].s_type == 8 || questions[swap_index].s_type == 8){
        var temp_q = questions[index];
        questions.splice(index, 1);
        questions.splice(swap_index,0,temp_q);
    }
    else{
        var temp_q = questions[index];
        temp_q.index += 1;
        questions[swap_index].index -= 1;
        questions.splice(index, 1);
        questions.splice(swap_index,0,temp_q);
    }
    var rows = q_table.rows;
    for(var i = 0; i < questions.length; i++){
        rows[i].innerHTML = unescapeHTML(sanitizeHTML(createHtml(questions[i])));
    }
}

function copyQ(b){
    var $b = $(b);
    var index = $b.parents("tr").index();
    var temp_q = clone(questions[index]);
    temp_q.index += 1
    questions.splice(index+1,0,temp_q);
    var new_row = q_table.insertRow(index+1);
    new_row.innerHTML = unescapeHTML(sanitizeHTML(createHtml(temp_q)));
    var rows = q_table.rows;
    for(var i = index+2; i < questions.length; i++){
        if(temp_q.s_type != 8){
            questions[i].index ++;
        }
        rows[i].innerHTML = unescapeHTML(sanitizeHTML(createHtml(questions[i])));
    }
    current_status.index ++;
    operate_index = current_status.index;

}

function clone(myObj){  
    var new_obj = {};
    new_obj.s_type = myObj.s_type;
    new_obj.index = myObj.index;
    new_obj.title_html = myObj.title_html;
    new_obj.title = myObj.title;
    new_obj.n_option =  myObj.n_option;
    if(myObj.hasOwnProperty("n_set")){
        new_obj.n_set = myObj.n_set;
    }
    new_obj.options = myObj.options;
    new_obj.must_answer = myObj.must_answer;
    new_obj.jump_to = myObj.jump_to;
    new_obj.jump_from = myObj.jump_from;
    if(myObj.hasOwnProperty("min_select")){
        new_obj.min_select = myObj.min_select;
    }
    if(myObj.hasOwnProperty("max_select")){
        new_obj.max_select = myObj.max_select;
    }
    return new_obj;
} 

function check_filled() {
    var $f = $("form");
    var wrong_info = "";
    for(var i = 0; i < questions.length; i++){
        var $r = $f.eq(i).find('input[name="single"]');
        questions[i].right_answer = [];
        for(var j = 0; j < $r.length; j++){
            if($r.eq(j).prop("checked") == true){
                questions[i].right_answer.push(j);
            }
        }
        if(questions[i].right_answer.length == 0){
            wrong_info += "第"+(i+1)+"题没有填写正确答案\n";
        }
    }
    return wrong_info;
}

function save() {
    var wrong_info = check_filled();
    if(wrong_info != ""){
        alert(wrong_info);
        return;
    }
    var Qstring = JSON.stringify(questions);
    $.ajax({
        url: "/survey_create/",
        type: 'POST',
        data: {'op': 'release', 'qstring': Qstring},
        success: function(data) {
            var data = JSON.parse(data);
            alert("保存成功！");
            window.location.reload();
        }
    });
}