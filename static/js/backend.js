function change_test_num() {
	var new_test_num = $('#new_test_num').val();
	var d = parseInt(new_test_num);
	if (d >= 1 && d <= 100) {
		$.ajax({
			url: window.location.href,
			type: "POST",
			data: {"op": "change_test_num", "new_test_num": d},
        	success: function(data) {
        		
        	}
		});
	} else {
		alert('请输入正确的数字（1-100）');
	}
}