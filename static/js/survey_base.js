var option_html = "<td><input type=\"text\" id=\"option_index\" class=\"form-control input-sm\"></td><td><input type=\"text\" id=\"option_text\" class=\"form-control input-sm\"></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span></td>"
var option_html_text = "<td><input type=\"text\" class=\"form-control input-sm\"></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span></td>";
var table_html = "<table class=\"table table-condensed\"></table>";
var table_title_html = "<thead><tr><td>题目标题</td></tr><tr><td style=\"padding:0 0 0 0;\"><textarea style=\"width: 100%; height: 100px; overflow: auto; resize: none;\"></textarea></td></tr></thead>"
var condition_html = "<tr><td id=\"must_answer\"><input type=\"checkbox\"> 必答</td><td id=\"jump_to\" ><input type=\"checkbox\" onclick=\"jump(1)\"> 无条件跳题</td><td id=\"jump_from\" ><input type=\"checkbox\" onclick=\"jump(2)\"> 关联逻辑</td><tr>";
var current_status = {s_type: 0, action: 0, index: 0};
var operate_index = current_status.index;
var questions = new Array();
var answers = new Array();
var q_table = document.getElementById("questions");
var page_status = "";

function prefixzero(num){
    if(Number(num) < 10){
        return "0" + num.toString();
    }
    else{
        return num.toString();
    }
}

function gettimeformat(now_t) {
    var year = prefixzero(now_t.getFullYear().toString());
    var month = prefixzero((now_t.getMonth()+1).toString());
    var day = prefixzero(now_t.getDate().toString());
    var hour = prefixzero(now_t.getHours().toString());
    var minute = prefixzero(now_t.getMinutes().toString());
    var second = prefixzero(now_t.getSeconds().toString());
    var t_format = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return t_format;
}

function createPage(){
    for(var i = 0; i < questions.length; i++){
        var new_row = q_table.insertRow(-1);
        new_row.innerHTML = createHtml(questions[i],i);
    }

}

function getindex(){
    var q_table = document.getElementById("questions");
    var row_length = document.getElementById('questions').rows.length;
    current_status.index += row_length;
    operate_index = current_status.index;
}

function createHtml(q,random_index = 0){
    var HTMLContent = "<td>";
    var index = q.index;
    if(page_status == "create"){
        HTMLContent += "<div><font size=\"3\">"+(index + 1).toString() + "." + q.title_html+"</font>";
    }
    if(page_status == "fill"){
        HTMLContent += "<div><font size=\"3\">"+(random_index + 1).toString() + "." + q.title_html+"</font>";
    }
    switch(q.s_type){
        case 1:{
            HTMLContent += "</div>";
            HTMLContent += "<div><form>";
            for(var i = 0; i < q.n_option; i ++)
            {
                var option = q.options[i];
                HTMLContent += "<p class=\"q_item\"><input type=\"radio\" name=\"single\" > "+option.index+". ";
                HTMLContent += option.text;
                HTMLContent += "</p>";
                
            }
            HTMLContent += "</form></div>";
            break;
        }
        case 2:{
            HTMLContent += "</div>";
            HTMLContent += "<div><form>";
            for(var i = 0; i < q.n_option; i ++)
            {
                var option = q.options[i];
                HTMLContent += "<p class=\"q_item\"><input type=\"checkbox\" name=\"single\"> "+option.index+". ";
                HTMLContent += option.text;
                HTMLContent += "</p>";
                
            }
            HTMLContent += "</form></div>";
            break;
        }
    }
    if(page_status == "create"){
    	HTMLContent += "<br><div><button class=\"btn btn-primary btn-sm\" data-toggle=\"modal\" data-target=\"#myModal2\" onclick=\"addQAfter(this)\">插入</button><button class=\"btn btn-danger btn-sm\" onclick=\"deleteQ(this)\">删除</button><button data-toggle=\"modal\" data-target=\"#myModal\" class=\"btn btn-warning btn-sm\" onclick=\"modifyQ(this)\">修改</button>";
    	HTMLContent += "<button class=\"btn btn-success btn-sm\" onclick=\"moveQup(this)\">上移</button><button class=\"btn btn-success btn-sm\" onclick=\"moveQdown(this)\">下移</button><button class=\"btn btn-success btn-sm\" onclick=\"copyQ(this)\">复制</button></div><hr>";
    }
    HTMLContent += "</td>";
    return HTMLContent;
}

