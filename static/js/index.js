$(document).ready(function(){
	if(IsPC()==false){
		$('body').prop("background", "{% static 'img/background2.jpg' %}");
	}
});

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function uglyEncrypt(s) {
    var magic_number = 123456789;
    $.ajax({
        url: window.location.href,
        type: "POST",
        async: false,
        data: {"op": "get_magic_number"},
        success: function(data) {
            var data = JSON.parse(data);
            magic_number = data["magic_number"];
        }
    });
    var eps = 0.0000001;
    var n = s.length;
    var m = parseInt((n-1)/3+eps) + 1;
    var t = "";
    for (var i = 0; i < m * 3; i += 3) {
        var x = s.charCodeAt(i);
        x = x * 1000 + (i+1<n ? s.charCodeAt(i+1) : 0);
        x = x * 1000 + (i+2<n ? s.charCodeAt(i+2) : 0);
        x = x ^ magic_number;
        for (var j = 0; j < 7; j++) {
            var y = x % 26;
            x = parseInt(x/26+eps);
            t += String.fromCharCode(97 + y);
        }
    }
    return t;
}

function checkAndSubmit() {
    var username = $('#username').val();
    var password = $('#password').val();
    password = uglyEncrypt(password);
    $('#password').val(password);
    return true;
}

function logout() {
    $.ajax({
        url: "/index/",
        type: "POST",
        async: false,
        data: {"op": "logout"},
        success: function(data) {
            var data = JSON.parse(data);
            window.location.reload();
        }
    });
}