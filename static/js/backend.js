function change_test_num() {
	var new_test_num = $('#new_test_num').val();
	var d = parseInt(new_test_num);
	if (d >= 1 && d <= 100) {
		$.ajax({
			url: "/backend/",
			type: "POST",
			data: {"op": "change_test_num", "new_test_num": d},
        	success: function(data) {
        		alert('修改成功');
        		window.location.reload();
        	}
		});
	} else {
		alert('请输入正确的数字（1-100）');
	}
}

function download_submitted() {
	$.ajax({
		url: "/backend/",
		type: "POST",
		data: {"op": "download_submitted"},
    	success: function(data) {
    		data = JSON.parse(data);
			export_path = '/' + data['export_path'];
			$('a#download').attr('href', export_path);
			document.getElementById("download").click();
    	}
	});
}