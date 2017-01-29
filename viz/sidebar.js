function clickedBox(o) {
    d3.selectAll(".dataNodes")
        .style("r", function(d) {
            if(d.PersonIdCode == o.PersonIdCode) {
                return 1.5*radius;
            } else {
                return radius;
            }
        })
        .style("stroke", function(d,i) {
            if(d.PersonIdCode == o.PersonIdCode) {
                return "#000000"
            } else {
                return color(colorType, nodes[i][colorType]);
            }
        })
        .style("stroke-width", function(d) {
            if(d.PersonIdCode == o.PersonIdCode) {
                return 3;
            } else {
                return 1;
            }
        });
    ;

    document.getElementById("councilorName").innerHTML = o.FirstName + " " + o.LastName;
    document.getElementById("councilorName").href = "https://www.parlament.ch/en/biografie?CouncillorId=" + o.PersonNumber;
    document.getElementById("councilorParty").innerHTML = o.PartyName;
    document.getElementById("councilorCouncil").innerHTML = o.CouncilName;
    document.getElementById("councilorBirthday").innerHTML = o.DateOfBirth + " (" + o.age + " y.o.)";
    document.getElementById("councilorCanton").innerHTML = o.CantonName;
    document.getElementById("councilorImage").src = "data/portraits/" + o.PersonIdCode + ".jpg";
    document.getElementById("councilorImage").alt = o.FirstName + " " + o.LastName;

    document.getElementById('compCouncilors').input = o.FirstName + " " + o.LastName;

    showTimeline(o.PersonIdCode);
    showInterests(o.PersonIdCode);
    changeOpac(o.PersonIdCode);
    showFriends(o.PersonIdCode);

    for(var i=0; i<nodes.length; i++) {
        nodes[i].selected = false;
    }

    o.selected = true;
    node_selected = true;
    node_id = o.PersonIdCode;
}

function update_friendship() {
    if (friendship_changed) {
        resetOp();

        if(node_selected) {
            changeOpac(node_id);
        }

        if(node_id != null) {
            showFriends(node_id);
        }

        friendship_changed = false;

    }
}

function update_interest() {
    if (interest_changed) {
        if(node_id != null) {
            showInterests(node_id);
        }

        interest_changed = false;
    }
}

///////////////////////////////
//// BAR GRAPH FUNCTIONS //////
///////////////////////////////
function showTimeline(id) {
    // declaring the bar graph according to id

    // remove what was previously there
    timelineBarGraph.selectAll('*').remove();

    var data_timeline = ints[id];

    data_timeline.sort(function(a, b) {
        return a.year - b.year;
    });

    var x = d3.scaleBand()
        .rangeRound([0, barWidth]).padding(0.1);

    var y = d3.scaleLinear()
        .rangeRound([barHeight, 0]);

    x.domain(data_timeline.map(function(d) { return d.year; }));
    y.domain([0, Math.max(d3.max(data_timeline, function(d) { return d.int; }), d3.max(data_timeline, function(d) { return d.median; }))]);

    timelineBarGraph.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(d3.axisBottom(x).ticks(3))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    timelineBarGraph.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(3))

    timelineBarGraph.selectAll(".bar")
        .data(data_timeline)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.year); })
        .attr("y", function(d) { return y(d.int); })
        .attr('fill', 'steelblue')
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return barHeight - y(d.int); });

    timelineBarGraph.selectAll(".barmedian")
        .data(data_timeline)
        .enter().append("rect")
        .attr("class", "bar")
        .attr('fill', 'red')
        .attr('stroke', 'none')
        .attr('opacity', 1)
        .attr("x", function(d) { return x(d.year); })
        .attr("y", function(d) { return y(d.median); })
        .attr("width", x.bandwidth())
        //.attr("height", function(d) { return barHeight - y(d.median); });
        .attr('height', 1);

}

function showInterests(id) {

    // Remove what was previously there
    interestsBarGraph.selectAll('*').remove();
    interestsBarGraph_second.selectAll('*').remove();

    var data_int_all;
    var data_int_author;
    if(interest_type == "all") {
        data_int_all = interests[id];
        data_int_author = authors[id];
    } else if (interest_type == "author") {
        data_int_all = authors[id];
    }

    data_int_all.sort(function(a, b) {
        return a.idx - b.idx;
    });

    // Remove Unknown field
    if(data_int_all[data_int_all.length-1].theme == "Unknown") {
        data_int_all.pop();
    }

    var total = 0;

    for (var i = 0; i < data_int_all.length; i++) {
        total += data_int_all[i].int;
    }

    if(interest_type == "all") {
        data_int_author.sort(function (a, b) {
            return a.idx - b.idx;
        });

        if(data_int_author[data_int_author.length-1].theme == "Unknown") {
            data_int_author.pop();
        }

        var total_cos = 0;

        for (var i = 0; i < data_int_author.length; i++) {
            total_cos += data_int_author[i].int;
        }
    }

    // Change text
    if (interest_type == 'all') {
        document.getElementById('interest_info').innerHTML = "Interests (<font color='#4682b4'>" + (total-total_cos) + " times co-signatory </font>& <font color='red'>" + total_cos + " times author</font>)";
    } else if (interest_type == 'author') {
        document.getElementById('interest_info').innerHTML = "Interests (<font color='red'>" + total + " times author</font>)";
    }

    // To put in percentage (Not really good I think)
    /*
     for (var i = 0; i < data.length; i++) {
     data[i].int = data[i].int / total;
     }*/

    var x = d3.scaleBand()
        .rangeRound([0, barWidth]).padding(0.05);

    var y = d3.scaleLinear()
        .rangeRound([barHeight, 0]);

    x.domain(data_int_all.map(function(d) { return d.theme; }));
    y.domain([0, d3.max(data_int_all, function(d) { return d.int; })]);

    interestsBarGraph.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(d3.axisBottom(x).ticks(3))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".40em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    interestsBarGraph.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(3));

    interestsBarGraph.selectAll(".bar")
        .data(data_int_all)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.theme); })
        .attr("y", function(d) { return y(d.int); })
        .attr('fill', function() {
            if(interest_type == "all") {
                return 'steelblue'
            } else {
                return 'red'
            }
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return barHeight - y(d.int); });

    if(interest_type == "all") {
        interestsBarGraph_second.selectAll(".bar")
            .data(data_int_author)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.theme);
            })
            .attr("y", function (d) {
                return y(d.int);
            })
            .attr('fill', 'red')
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return barHeight - y(d.int);
            });
    }

}

// some height values hardcoded, bad
function showFriends(id) {

    // removing the previous ones
    gFriends.selectAll('*').remove();

    // Change text
    if (friendship == 'intervention') {
        var data = friends[id];
        if(data.length > 1) {
            document.getElementById('friends_info').innerHTML = data.length + " co-speakers";
        } else {
            document.getElementById('friends_info').innerHTML = data.length + " co-speaker";
        }
    } else if (friendship == 'cosign') {
        var data = friends_cosign[id];
        if(data.length > 1) {
            document.getElementById('friends_info').innerHTML = data.length + " co-signatories";
        } else {
            document.getElementById('friends_info').innerHTML = data.length + " co-signatory";
        }
    }

    var length = (223/5)*(data.length);

    document.getElementById('friends').setAttribute("height", length + "px");



    gFriends.selectAll('.friend')
        .data(data)
        .enter().append('g')
        .attr('personIdCode', id)
        .attr('class', 'grect')
        // mouse events on the g element
        .on('mouseover', function(d) { friendOver(d.friend);})
        .on('mouseleave', function(d) { friendOut(d.friend);})
        // friendclick
        .on('click', function(d) {
            d3.selectAll(".dataNodes").each(function(o,i)
                {
                    if(o.PersonIdCode == d.friend) {
                        clickedBox(o);
                    }
                }
            );
        })
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
            return color(colorType, people[d.friend][colorType]);
        })
        .attr('opacity', .7)

    // mini photo
    d3.selectAll('.grect')
        .append('image')
        .attr('xlink:href', function(d) { return 'data/portraits/'+d.friend+'.jpg'; })
        .attr('x', 9)
        .attr('y', function(d, i) {return 9+i*(223/5);})
        .attr('height', '34px')
        .attr('width', '34px');

    // names
    d3.selectAll('.grect')
        .append('text')
        .attr('x', 48)
        .attr('y', function(d, i){ return 21+i*(223/5)})
        .text(function(d) {
            if (people[d.friend].GenderAsString == "m") {
                return people[d.friend].FirstName[0] + ". " + people[d.friend].LastName;
            } else {
                return people[d.friend].FirstName[0] + ". " + people[d.friend].LastName;
            }
        });

    // # of common interventions
    d3.selectAll('.grect')
        .append('text')
        .attr('x', 48)
        .attr('y', function(d, i){ return 38+i*(223/5)})
        .text(function(d) { return '# together: '+d.number; });
}

function friendOver(id) {
    $('#rect'+id).attr('opacity', 1);
    $('#'+id).attr('stroke', 'red')
        .attr('stroke-width', 4);
}

function friendOut(id) {
    $('#rect'+id).attr('opacity', .7);
    $('#'+id).attr('stroke', '#555555')
        .attr('stroke-width', 1);
}