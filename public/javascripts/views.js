var dmp = new diff_match_patch();
var original = null;

function mark() {
	original = $("#text").val();
	$("#output").html( breaks(original) );
}

function save() {
	$.post("/copy/blobify", {
	    "blob[content]": $("#output").html(),
	    "blob[raw]": clean_comments(breaks($("#text").val()))
	},
		function(ret) {
			$("#finish_button").hide();
			$("#blob_hash span").html(ret);
			$("#regen_blob").show();
			$("#blob_hash").attr("href", "/" + ret).show();
	})
}

function diff() {
	dmp.Diff_Timeout = 1;
	dmp.Diff_EditCost = 4;

	var d = dmp.diff_main(original, $("#text").val());

	dmp.diff_cleanupSemantic(d);
	var ds = dmp.diff_prettyHtml(d);
	$("#output").html(commentify(ds));
}

function breaks(txt) {
	return txt.replace(/\n/, '<br><br>');
}

function comment_wrap() {
	var textArea = $("#text");
	var len = textArea.val().length;
	var start = textArea[0].selectionStart;
	var end = textArea[0].selectionEnd;
	var selectedText = textArea.val().substring(start, end);
	var replacement = "[" + selectedText + "]()";
	textArea.val(textArea.val().substring(0, start) + replacement + textArea.val().substring(end, len));
};

function clean_comments(txt) {
	var cmnts = /\[(.*?)\]\((.*?)\)/g;
	return txt.replace(cmnts, '$1');
}

function commentify(txt) {
	var cmnts = /(\[)(.*?)(\])\((.*?)\)/g;
	var index = 0;
	txt = txt.replace(cmnts, function(_, a, b, c, d) {
		index = index + 1;
		return '<span class="highlight" nid="' + index + '">' + a + '</span>' +
		        b + '<span class="highlight" nid="' + index + '">' + c + '</span>' + 
		        '<a href="#" class="show_comment" nid="' + index + '">&bull;</a>' + 
		        '<div class="tooltip" nid="' + index + '"><div class="contain"><h3>' + d + '</h3></div></div>';
	});
	return txt;
}

$(document).ready(function() {
    $("#regen_blob").click(function() {
    	$(this).hide();
    	$("#blob_hash").hide();
    	$.post("/copy/reblobify", {
    	    "blob[content]": $("#output").html(), 
    	    "blob[raw]": clean_comments( breaks( $("#text").val() ) ), 
    	    old_hash: $("#blob_hash span").html()},
    		function(ret) {
    			$("#blob_hash span").html(ret);
    			$("#blob_hash").attr("href", "/" + ret).show();
    			$("#regen_blob").show();
    		})
    });

    $("#text").keyup(function() {
    	if (original != null) diff();
    })

    $("#text").keydown(function(e) {
    	var end = $("#text")[0].selectionEnd;
    	var strt = $("#text")[0].selectionStart;
    	var d = end - strt;
    	if (e.keyCode == 219 && d != 0) {
    		comment_wrap();
    		$(this).setCursorPosition(end + 3);
    		return false;
    	};
    })

    $(".show_comment").live("mouseover",
    	function(ev) {
    		var tip = $("div.tooltip[nid=" + $(this).attr("nid") + "]");
    		$(tip).css("top", ev.pageY - 30 + "px");
    		$(tip).css("left", ev.pageX + 20 + "px");
    		$(tip).show();
    		$(".highlight[nid=" + $(this).attr("nid") + "]").addClass("hovered");
    	}
    );

    $(".show_comment").live("mouseout",
    	function(ev) {
    		var tip = $("div.tooltip[nid=" + $(this).attr("nid") + "]");
    		$(tip).hide();
    		$(".highlight[nid=" + $(this).attr("nid") + "]").removeClass("hovered");
    	}
    );

    $(".show_comment").live("mousemove",
    	function(ev) {
    		var tip = $("div.tooltip[nid=" + $(this).attr("nid") + "]");
    		$(tip).css("top", ev.pageY - 30 + "px");
    		$(tip).css("left", ev.pageX + 20 + "px");
    	}
    );

    $(".edit_page .show_comment").live("click", function() {
        var confirmed = confirm("Remove note?");
        if (confirmed) {
            var nid = $(this).attr("nid");
            $(".highlight[nid=" + nid + "], .show_comment[nid=" + nid + "], .tooltip[nid=" + nid + "]").remove();
            $("#text").val( $("#text").val().replace(/\[(.*?)\]\(.*?\)/, '$1'));
        };
        return false;
    });
})