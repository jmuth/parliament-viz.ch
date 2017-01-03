var colors = {
	'st0': '#BD2227',
    'st1': '#9CCC4A',
    'st2': '#A1729A',
    'st3': '#FBEF98',
    'st4': '#F79753',
    'st5': '#486FB6',
    'st6': '#258051',
}

var adj;
var ints;
var people;
var friends;

var focusOn = 0;

var height = 105;
var width = 390;


// modifies the ID's so they're correct
function setupId() {
	$('circle').each(function(i, obj) {
		var oldId = obj.id;
		var newId = oldId[3]+oldId.slice(5,8);
		obj.id = newId;
	})
}

function setupCircles() {
	$('circle').each(function(i, obj) {
		$(obj).attr('r', 6.5)
			.attr('stroke', '#555555')
			.attr('stroke-opacity', .7)
			.attr('stroke-width', 1)
			.on('mouseover', {'id': obj.id}, showInfo)
			.on('mouseleave', resetOp)
			.off('click')
			.on('click', focus);
	})
}

function focus() {
	focusOn = 1;
	/*
	$('circle').each(function() {
		$(this).off('mouseover');
		$(this).off('mouseleave');
	})
	*/
	$(this).off('click')
		.on('click', unfocus);
	//$(document).on('click', setup);
}

function focusId(id) {
	focusOn = 1;
	$('#'+id).off('click')
		.on('click', unfocus);
} 

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

function unfocus() {
	focusOn = 0;
	resetOp();
}

function resetOp() {
	if (focusOn == 0) {
		$('circle').each(function(i, obj) {
			$(obj).attr('fill-opacity', 1)
				.attr('stroke-opacity', .7)
				.attr('stroke', '#555555')
				.attr('stroke-width', 1)
				.off('click')
				.on('click', focus);
		})
	}
	//setupCircles();
}

function showInfo(event) {
	if (focusOn == 0) {
		var id = event.data.id;
		opacBitch(id);
	}
}

function showInfo2(id) {
	console.log('bitches');
	opacBitch(id);
}

function opacBitch(id) {
	var line = adj[id];
	var max = findMax(line);

	$('#'+id).attr('stroke', 'red')
		.attr('stroke-width', 4);

	$('#pic').attr('src', 'portraits/'+id+'.jpg');

	$('#bioName').text(people[id].FirstName+' '+people[id].LastName);
	$('#bioParty').text(people[id].PartyName);
	$('#bioCanton').text(people[id].CantonAbbreviation);

	//$('#wc').attr('src', 'wc/'+event.data.id+'_wc.jpg');
	showTimeline(id);
	showFriends(id);
	$('circle').each(function(i, obj) {
		var thisId = obj.id;
		if (thisId != id) {
			var value = line[thisId]/max;	
			$(obj).attr('fill-opacity', value);
			$(obj).attr('stroke-opacity', Math.max(value, .05));
			/*if (thisId[0] == 'I') {
				$(obj).fadeTo(300, 0);
			}*/
		}
	})
	
}

///////////////////////////////
//// BAR GRAPH FUNCTIONS //////
///////////////////////////////
function showTimeline(id) {

	g.selectAll('*').remove();

	data = ints[id];

	var x = d3.scaleBand()
    	.rangeRound([0, width]).padding(0.1);

	var y = d3.scaleLinear()
	    .rangeRound([height, 0]);

	x.domain(data.map(function(d) { return d.year; }));
  	y.domain([0, Math.max(d3.max(data, function(d) { return d.int; }), d3.max(data, function(d) { return d.median; }))]);
  	
	g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(3))
		.selectAll("text")
	    .attr("y", 0)
	    .attr("x", 9)
	    .attr("dy", ".35em")
	    .attr("transform", "rotate(90)")
	    .style("text-anchor", "start");
	
	g.append("g")
		.attr("class", "axis")
		.call(d3.axisLeft(y).ticks(3))

	g.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.year); })
		.attr("y", function(d) { return y(d.int); })
		.attr('fill', 'steelblue')
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d.int); });

	g.selectAll(".barmedian")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr('fill', 'red')
		.attr('stroke', 'none')
		.attr('opacity', 1)
		.attr("x", function(d) { return x(d.year); })
		.attr("y", function(d) { return y(d.median); })
		.attr("width", x.bandwidth())
		//.attr("height", function(d) { return height - y(d.median); });
		.attr('height', 1);

}


///////////////////////////////
//// 'FRIENDS' FUNCTIONS //////
///////////////////////////////
function friendOver(id) {
	$('#rect'+id).attr('opacity', 1);
}

function friendOut(id) {
	$('#rect'+id).attr('opacity', .7);
}

// some height values hardcoded, bad
function showFriends(id) {
	// removing the previous ones
	gFriends.selectAll('*').remove();
	// slicing the data
	data = friends[id];

	gFriends.selectAll('.friend')
		.data(data)
		.enter().append('g')
		.attr('personIdCode', id)
		.attr('class', 'grect')
		// mouse events on the g element
		.on('mouseover', function(d) { friendOver(d.friend);})
		.on('mouseleave', function(d) { friendOut(d.friend);})
		// friendclick
		.on('click', function(d) { unfocus(); console.log('bitch'); showInfo2(d.friend); focusId(d.friend);})
		// rectangle
		.append('rect')
		.attr('rx', 2)
		.attr('ry', 2)
		.attr('id', function(d) { return 'rect'+d.friend; })
		.attr('x', 5)
		.attr('y', function(d, i) {return 5+i*(223/5);})
		.attr('width', 175)
		.attr('height', (223/5)-3)
		.attr('fill', function(d) {
			// looking for the node class to check color
			var cla = $('#'+d.friend).attr('class');
			return colors[cla]
		})
		.attr('opacity', .7)
	
	// mini photo
	d3.selectAll('.grect')
		.append('image')
		.attr('xlink:href', function(d) { return 'portraits/'+d.friend+'.jpg'; })
		.attr('x', 9)
		.attr('y', function(d, i) {return 9+i*(223/5);})
		.attr('height', '34px')
		.attr('width', '34px');

	// names
	d3.selectAll('.grect')
		.append('text')
		.attr('x', 48)
		.attr('y', function(d, i){ return 21+i*(223/5)})
		.text(function(d) { return people[d.friend].FirstName+' '+people[d.friend].LastName; });

	// # of common interventions
	d3.selectAll('.grect')
		.append('text')
		.attr('x', 48)
		.attr('y', function(d, i){ return 38+i*(223/5)})
		.text(function(d) { return '# together: '+d.number; });
}


///////////////////////////////
//// SETTING D3 VARIABLES /////
///////////////////////////////
var svg = d3.select("#bitch"),
    g = svg.append("g"),
    margin = {top: 10, right: 10, bottom: 10, left: 30},
    width = +width - margin.left - margin.right,
    height = +height - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgFriends = d3.select('#friends'),
	gFriends = svgFriends.append('g');


///////////////////////////////
//// IMPORT FUNCTIONS /////////
///////////////////////////////
function importAdj(json) {
	$.getJSON(json, function(d) {
		adj =  d;
	});
};

function importInts(json) {
	$.getJSON(json, function(d) {
		ints = d;
	});
}

function importPeople(json) {
	$.getJSON(json, function(d) {
		people = d;
	});
}

function importFriends(json) {
	$.getJSON(json, function(d) {
		friends = d;
	});
}

///////////////////////////////
//// INITIALIZING /////////////
///////////////////////////////
importAdj('adj.JSON');
importInts('year_ints2.json');
importPeople('people_jonas2.json');
importFriends('friends.json');
setupId();
setupCircles();