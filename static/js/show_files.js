function view_url(a) {
	var a = $(a);
	$.ajax({
		url: "/show_files/",
		type: 'POST',
		data: {'op': 'view', 'filename': a.attr('filename')},
		success: function(data) {
			window.location.href = a.attr('url');
		}
	});
}