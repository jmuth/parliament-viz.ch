var bitch;
var ints;
var people;

var height = 150;
var width = 400;

function importAdj(json) {
	$.getJSON(json, function(d) {
		bitch =  d;
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

$('circle').each(function(i, obj) {
	var oldId = obj.id;
	var newId = oldId[3]+oldId.slice(5,8);
	obj.id = newId;
	$(obj).attr('r', 6.5)
	$(obj).attr('stroke', '#555555');
	$(obj).attr('stroke-opacity', .7);
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
		$(obj).attr('fill-opacity', 1);
		$(obj).attr('stroke-opacity', .7);
	})
}

function opacBitch(event) {
	var id = event.data.id;
	var line = bitch[id];
	var max = findMax(line);

	$('#pic').attr('src', 'portraits/'+event.data.id+'.jpg');

	$('#bioName').text(people[id].FirstName+' '+people[id].LastName);
	$('#bioParty').text(people[id].PartyName);
	$('#bioCanton').text(people[id].CantonAbbreviation);

	//$('#wc').attr('src', 'wc/'+event.data.id+'_wc.jpg');
	showTimeline(event.data.id);
	$('circle').each(function(i, obj) {
		var thisId = obj.id;
		if (thisId != event.data.id) {
			var value = line[thisId]/max;	
			$(obj).attr('fill-opacity', value);
			$(obj).attr('stroke-opacity', Math.max(value, .05));
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

function showTimeline(id) {

	g.selectAll('*').remove();

	dat = ints[id];

	data = dat.years.map(function(d, i) {
		return { 'year' : d, 'int' : dat.ints[i], 'median' : dat.median[i] };
	});

	var x = d3.scaleBand()
    	.rangeRound([0, width]).padding(0.1);

	var y = d3.scaleLinear()
	    .rangeRound([height, 0]);

   /*
    var line = d3.line()
    	.curve(d3.curveMonotoneX)
	    .x(function(d) { return x(d.sesh); })
	    .y(function(d) { return y(d.int); });
    */

	x.domain(data.map(function(d) { return d.year; }));
  	y.domain([0, Math.max(d3.max(data, function(d) { return d.int; }), d3.max(data, function(d) { return d.median; }))]);

  	
	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(3))
		.selectAll("text")
	    .attr("y", 0)
	    .attr("x", 9)
	    .attr("dy", ".35em")
	    .attr("transform", "rotate(90)")
	    .style("text-anchor", "start");
	
	g.append("g")
		.attr("class", "axis axis--y")
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

  	/*
	g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

	g.append("g")
	  .attr("class", "axis axis--y")
	  .call(d3.axisLeft(y));

	g.append("path")
	  .datum(data)
	  .attr("class", "line")
	  .attr("d", line);
	*/
	console.log(data);
}

var svg = d3.select("#bitch"),
    g = svg.append("g"),
    margin = {top: 10, right: 10, bottom: 10, left: 30},
    width = +width - margin.left - margin.right,
    height = +height - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
/*


d3.tsv("data.tsv", function(d) {
  d.date = parseTime(d.date);
  d.close = +d.close;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
});

*/
importAdj('adj.JSON');
importInts('year_ints.json');
importPeople('people_jonas.json');