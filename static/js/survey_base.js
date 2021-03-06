var option_html = "<td><input type=\"text\" id=\"option_index\" class=\"form-control input-sm\"></td><td><input type=\"text\" id=\"option_text\" class=\"form-control input-sm\"></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span></td>"
var option_html_text = "<td><input type=\"text\" class=\"form-control input-sm\"></td><td><span class=\"glyphicon glyphicon-plus\" onclick=\"addOption(this)\"></span><span class=\"glyphicon glyphicon-minus\" onclick=\"delOption(this)\"></span></td>";
var table_html = "<table class=\"table table-condensed\"></table>";
var table_title_html = "<thead><tr><td>题目标题</td></tr><tr><td style=\"padding:0 0 0 0;\"><textarea style=\"width: 100%; height: 100px; overflow: auto; resize: none;\"></textarea></td></tr></thead>"
var table_jiexi_html = "<thead><tr><td>题目解析</td></tr><tr><td style=\"padding:0 0 0 0;\"><textarea style=\"width: 100%; height: 100px; overflow: auto; resize: none;\"></textarea></td></tr></thead>"
var condition_html = "<tr><td id=\"must_answer\"><input type=\"checkbox\"> 必答</td><td id=\"jump_to\" ><input type=\"checkbox\" onclick=\"jump(1)\"> 无条件跳题</td><td id=\"jump_from\" ><input type=\"checkbox\" onclick=\"jump(2)\"> 关联逻辑</td><tr>";
var current_status = {s_type: 0, action: 0, index: 0};
var operate_index = current_status.index;
var questions = new Array();
var answers = new Array();
var q_table = document.getElementById("questions");
var page_status = "";

var sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

function prefixzero(num){
    if(Number(num) < 10){
        return "0" + num.toString();
    }
    else{
        return num.toString();
    }
}

window.alert = function create_alert(str, flag){
    $("#myModal_alert_body").empty();
    $("#myModal_alert_body").append("<p style=\"color:white\">" + str + "</p>");
    if(flag == 1){
        $("#check_button").attr("onclick", "window.location.reload()");
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
        var ch = createHtml(questions[i],i);
        new_row.innerHTML = createHtml(questions[i],i);
    }

}

var unescapeHTML = function(a){  
    a = "" + a;  
    return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");  
} 

function getindex(){
    var q_table = document.getElementById("questions");
    var row_length = document.getElementById('questions').rows.length;
    current_status.index += row_length;
    operate_index = current_status.index;
}

function createHtml(q,random_index = 0){
    var HTMLContent = "<td><div class=\"box-shadow\" style=\"margin-left: 10%; margin-right: 10%; margin-bottom: 2%; overflow: hidden;\">";
    var index = q.index;
    if(page_status == "create"){
        HTMLContent += "<div style=\"margin-bottom: 10px; margin-left: 5%; margin-top: 5%\"><font size=\"4\">"+(index + 1).toString() + "." + q.title_html+"</font>";
    }
    else{
        HTMLContent += "<div style=\"margin-bottom: 10px; margin-left: 5%; margin-top: 5%\"><font size=\"4\">"+(random_index + 1).toString() + "." + q.title_html+"</font>";
    }
    switch(q.s_type){
        case 1:{
            HTMLContent += "</div>";
            HTMLContent += "<div style=\"margin-left: 5%;  height: 100%; margin-bottom: 10px\"><form>";
            for(var i = 0; i < q.n_option; i ++)
            {

                var option = q.options[i];
                if(page_status == "report"){
                    HTMLContent += "<p class=\"q_item\"> "+option.index+". " + option.text + "</p>";
                }
                else{
                    if((q.right_answer.indexOf(i) > -1) && (page_status == "create")){
                        if(i == q.n_option - 1){
                            HTMLContent += "<div class=\"col-xs-12\" style = \"margin-bottom: 2%\"><input type=\"radio\" name=\"single\" checked=\"true\" class=\"col-xs-1\" style = \"margin-left: -1em; margin-right: -5.2em;\"> <label class=\"q_item col-xs-11\" onclick=\"textcheck(this)\" >"+option.index+". ";
                        }
                        else{
                            HTMLContent += "<div class=\"col-xs-12\"><input type=\"radio\" name=\"single\" checked=\"true\" class=\"col-xs-1\" style = \"margin-left: -1em; margin-right: -5.2em;\"> <label class=\"q_item col-xs-11\" onclick=\"textcheck(this)\" >"+option.index+". ";
                        }
                    }
                    else{
                        if(i == q.n_option - 1){
                            HTMLContent += "<div class=\"col-xs-12\" style = \"margin-bottom: 2%\"><input type=\"radio\" name=\"single\" class=\"col-xs-1\" style = \"margin-left: -1em; margin-right: -5.2em;\"> <label class=\"q_item col-xs-11\" onclick=\"textcheck(this)\" >"+option.index+". ";
                        }
                        else{
                            HTMLContent += "<div class=\"col-xs-12\"><input type=\"radio\" name=\"single\" class=\"col-xs-1\" style = \"margin-left: -1em; margin-right: -5.2em;\"> <label class=\"q_item col-xs-11\" onclick=\"textcheck(this)\" >"+option.index+". ";
                        }
                    }
                    HTMLContent += option.text;
                    HTMLContent += "</label></div>";
                    
                }
                
                
            }
            HTMLContent += "</form></div>";
            break;
        }
        case 2:{
            HTMLContent += "</div>";
            HTMLContent += "<div style=\"margin-left: 5%; margin-bottom: 10px\"><form>";
            for(var i = 0; i < q.n_option; i ++)
            {
                var option = q.options[i];
                if(page_status == "report"){
                    HTMLContent += "<p class=\"q_item\"> "+option.index+". " + option.text + "</p>";
                }
                else{
                    if((q.right_answer.indexOf(i) > -1) && (page_status == "create")){
                        if(i == q.n_option - 1){
                            HTMLContent += "<div class=\"col-xs-12\" style = \"margin-bottom: 2%\"><input type=\"checkbox\" name=\"single\" checked=\"true\" class=\"col-xs-1\" style = \"margin-left: -1em; margin-right: -5.2em;\"> <label class=\"q_item col-xs-11\" onclick=\"textcheck(this)\" >"+option.index+". ";
                        }
                        else{
                            HTMLContent += "<div class=\"col-xs-12\"><input type=\"checkbox\" name=\"single\" checked=\"true\" class=\"col-xs-1\" style = \"margin-left: -1em; margin-right: -5.2em;\"> <label class=\"q_item col-xs-11\" onclick=\"textcheck(this)\" >"+option.index+". ";
                        }
                    }
                    else{
                        if(i == q.n_option - 1){
                            HTMLContent += "<div class=\"col-xs-12\" style = \"margin-bottom: 2%\"><input type=\"checkbox\" name=\"single\" class=\"col-xs-1\" style = \"margin-left: -1em; margin-right: -5.2em;\"> <label class=\"q_item col-xs-11\" onclick=\"textcheck(this)\" > "+option.index+". ";
                        }
                        else{
                            HTMLContent += "<div class=\"col-xs-12\"><input type=\"checkbox\" name=\"single\" class=\"col-xs-1\" style = \"margin-left: -1em; margin-right: -5.2em;\"> <label class=\"q_item col-xs-11\" onclick=\"textcheck(this)\" > "+option.index+". ";
                        }
                    }
                    HTMLContent += option.text;
                    HTMLContent += "</label></div>";
                }
                
                
            }
            HTMLContent += "</form></div>";
            break;
        }
        default: {
            break;
        }
    }
    if(page_status == "create"){
        HTMLContent += "<div style=\"margin-left: 5%;\"><font size=\"3\">题目解析: " + q.jiexi_html + "</div>"
    	HTMLContent += "<br><div style=\"margin-left: 5%;\"><button class=\"btn btn-primary btn-sm\" data-toggle=\"modal\" data-target=\"#myModal2\" onclick=\"addQAfter(this)\">插入 <br> Insert</button><button class=\"btn btn-danger btn-sm\" onclick=\"deleteQ(this)\">删除 <br> Delete </button><button data-toggle=\"modal\" data-target=\"#myModal\" class=\"btn btn-warning btn-sm\" onclick=\"modifyQ(this)\">修改 <br> Modify</button>";
    	HTMLContent += "<button class=\"btn btn-success btn-sm\" onclick=\"moveQup(this)\">上移 <br> Move up</button><button class=\"btn btn-success btn-sm\" onclick=\"moveQdown(this)\">下移 <br> Move down</button></div><hr>";
    }
    HTMLContent += "</td>";
    return HTMLContent;
}

function textcheck(b){
    var $b = $(b);
    if($b.prev().prop('checked')){
        $b.prev().prop('checked', false);
    }
    else{
        $b.prev().prop('checked', true);
    }
    
}

