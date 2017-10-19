$(document).ready(function(){
	$("#post > h1:first").prepend('<a href="/" class="home"><i class="fa fa-home" aria-hidden="true"></i></a><i class="fa fa-caret-right" aria-hidden="true"></i>');

	/* add wrappers to all tables */
	$("table").each(function(i){
		$(this).wrap('<div class="table-wrapper" data-index="' + i + '"></div');
	});

	/* use debounce from LoDash library to avoid repetitive calls from the resize event */
	var resizetables_debounce = _.debounce(function(){
		var postWidth = $(".content:first").width();
		/* check all tables to see if they fit */
		$(".table-wrapper > table").each(function(i) {
			var p = $(this).parent();
			/* if the table doesn't fit in .content */
			if($(this).width() > postWidth) {
				/* if the table doesn't have a pre-built table-teaser, build it now */
				if(!p.hasClass("dirty")) {
					p.append('<div class="table-teaser"><div class="teaser-cover"><span>Κάνε κλικ εδώ για να δεις το γράφημα</span></div></div>');
					teaser = p.find(".table-teaser");
					/* show a small preview of the full table in the teaser mode; only two rows are shown */
					$(this).clone().appendTo(teaser);
					teaser.find("tbody tr:gt(1)").remove();
					p.addClass("dirty");
				}
				p.addClass("teaser-mode");
			} else {
				p.removeClass("teaser-mode");
			}
		});
	}, 250);

	/* expand function */
	$(document).on("click", ".teaser-cover", function(){
		tableWrapper = $(this).parent().parent();
		originalTable = tableWrapper.find("> table");
		/* save tableIndex to avoid recopying the table when the user just previously viewed the same table */
		tableIndex = tableWrapper.attr("data-index");
		/* save scrollTop value to return there when modal is closed */
		scrollVal = $(window).scrollTop();

		/* create table-expand modal if it doesn't exist */
		if($("#table-expand").length == 0) {
			$("body").append('<div id="table-expand" data-table="' + tableIndex + '" data-scroll="' + scrollVal + '"><div class="table-expand-wrapper"></div><button type="button" class="close" aria-label="Κλείσιμο"><span aria-hidden="true">&times;</span></button></div>');
			originalTable.clone().appendTo($("#table-expand .table-expand-wrapper"));
		} else {
			$("#table-expand").attr("data-scroll", scrollVal);
			/* if the user is viewing a new table, empty the table-wrapper and fill it with the new table */
			if(tableIndex != $("#table-expand").attr("data-table")) {
				$("#table-expand .table-expand-wrapper").empty();
				originalTable.clone().appendTo($("#table-expand .table-expand-wrapper"));
				$("#table-expand").attr("data-table", tableIndex);
			}
			/* otherwise just reopen the previously shown modal with no changes */
		}
		$("header, aside, section").addClass("hide");
		$("#table-expand").addClass("show");
		/* when the modal opens we want the user to see the top of the table */
		$("#vp").attr("content", "width=1024");
		$(window).scrollTop(0);
	});

	var closeExpand = (function(){
		$("header, aside, section").removeClass("hide");
		$("#table-expand").removeClass("show");
		/* return to the scroll position before the modal opened */
		$("#vp").attr("content", "width=device-width, initial-scale=1");
		$(window).scrollTop($("#table-expand").attr("data-scroll"));
		/* if the window was resized while the modal was open, teasers will be shown instead of the full tables, even if those fit well in .content */
		$(window).trigger('resize');

	});

	$(document).on("click", "#table-expand button.close", closeExpand);
	$(window).keyup(function(e) {
		/* ESC triggers closeExpand */
		if(e.which == 27) {
			closeExpand();
		}
	});

	$(window).on('resize', resizetables_debounce);
	/* check if tables fit in .content upon the first loading of the page */
	$(window).trigger('resize');
});