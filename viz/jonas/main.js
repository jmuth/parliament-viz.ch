var bitch;

function importJSON(json) {
	$.getJSON(json, function(d) {
		bitch = d
	});
};

$('circle').each(function(i, obj) {
	var oldId = obj.id;
	var newId = oldId[3]+oldId.slice(5,8);
	obj.id = newId;
	$(obj).attr('r', 8)
	$(this).on('mouseover', {'id': obj.id}, opacBitch);
	$(this).on('mouseleave', resetOp)
})

function findMax(line) {
	var max = 0;
	for (var key in line) {
		var val = line[key];
		if (val > max) {
			max = val;
		}
	}
	return max;
}

function resetOp() {
	$('circle').each(function(i, obj) {
		$(obj).fadeTo(500, 1);
	})
}

function opacBitch(event) {
	var line = bitch[event.data.id]
	var max = findMax(line)
	$('circle').each(function(i, obj) {
		var thisId = obj.id;
		if (thisId != event.data.id) {
			var value = line[thisId]/max;
			
			$(obj).fadeTo(100, value);
			/*if (thisId[0] == 'I') {
				$(obj).fadeTo(300, 0);
			}*/
		}
	})
	
}

function checkBitch() {
	var test = [];
	$('.st1').each(function(i, obj) {
		var this_id = obj.id;
		if (test.indexOf(this_id) == -1) {
			test.push(this_id);
			console.log(test.length);
		} else {
			console.log('BIATCH!!');
		}
	})
}

importJSON('adj.JSON');