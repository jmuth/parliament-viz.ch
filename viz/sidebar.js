/////////////////////////////////////////////////////////////////////
//                                                                 //
//  This file contains the main function that are used for the     //
//  sidebar. It defines the way to show the timeline and the       //
//  friends.                                                       //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Function to deal with the friends
function friendships() {
    // We check if the friendship has been changed
    if (friendship_changed) {
        // If it's the case, we reset the opacity
        resetOp();

        // If a node is selected, we change the opacity
        if(node_selected) {
            changeOpac(node_id);
        }

        // If node_id exists, we can show the new type of friends
        if(node_id != null) {
            showFriends(node_id);
        }

        // And it's finished
        friendship_changed = false;

    }
}

// Function to deal with the interests
function interests() {
    // If the interest has changed and the node_id is not null, then we
    // can show the new interests.
    if (interest_changed) {
        if(node_id != null) {
            showInterests(node_id);
        }

        interest_changed = false;
    }
}

// Function to show the timeline of the interventions
function showTimeline(id) {

    // We remove the old graph
    timelineBarGraph.selectAll('*').remove();

    // Get the data for a given councilor
    var data_timeline = ints[id];

    // We sort them by year
    data_timeline.sort(function(a, b) {
        return a.year - b.year;
    });

    // Compute the range for the x value
    var x = d3.scaleBand()
        .rangeRound([0, barWidth]).padding(0.1);

    // Compute the range for the y value
    var y = d3.scaleLinear()
        .rangeRound([barHeight, 0]);

    // Update information
    var str = "Number of interventions (<font color='red'>red line is median</font>)";
    document.getElementById('timeline_info').innerHTML = str;

    // Create the domains
    x.domain(data_timeline.map(function(d) { return d.year; }));
    y.domain([0, Math.max(d3.max(data_timeline, function(d) { return d.int; }), d3.max(data_timeline, function(d) { return d.median; }))]);

    // Add the X axis
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

    // Add the Y axis
    timelineBarGraph.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(3))

    // Add the rectangles
    timelineBarGraph.selectAll(".bar")
        .data(data_timeline)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.year); })
        .attr("y", function(d) { return y(d.int); })
        .on('mouseover', function(d) { timelineOver(d.year, d.int, d.median);})
        .on('mouseleave', function(d) { timelineOut(str);})
        .attr('fill', 'steelblue')
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return barHeight - y(d.int); });

    // Add the medians
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

// Display information about the timeline
function timelineOver(year, val, med) {

    var str = "Year " + year + ": <font color='#4682b4'>" + val + " interventions</font> (<font color='red'>median: " + med + "</font>)";

    document.getElementById('timeline_info').innerHTML = str;
}

// Put information back to normal
function timelineOut(str) {
    document.getElementById('timeline_info').innerHTML = str;
}

// Function to show the bargraph of the interests
function showInterests(id) {

    // We remove the old graphs
    interestsBarGraph.selectAll('*').remove();
    interestsBarGraph_second.selectAll('*').remove();

    // Get the two types of data
    var data_main;
    var data_secondary;

    if(interest_type == "all") {
        // Data main correspond to author + cosignatory
        data_main = interests_json[id];
        // Data secondary correspond to author
        data_secondary = authors[id];
    } else if (interest_type == "author") {
        // Data main correspond to author
        data_main = authors[id];
    }

    // Sort the main data
    data_main.sort(function(a, b) {
        return a.idx - b.idx;
    });

    // Remove Unknown field
    if(data_main[data_main.length-1].theme == "Unknown") {
        data_main.pop();
    }

    // Count the total
    var total = 0;

    for (var i = 0; i < data_main.length; i++) {
        total += data_main[i].int;
    }

    // If all, we need to do the same for the secondary data
    if(interest_type == "all") {
        data_secondary.sort(function (a, b) {
            return a.idx - b.idx;
        });

        if(data_secondary[data_secondary.length-1].theme == "Unknown") {
            data_secondary.pop();
        }

        var total_sec = 0;

        for (var i = 0; i < data_secondary.length; i++) {
            total_sec += data_secondary[i].int;
        }
    }

    var str = "";

    // Change text
    if (interest_type == 'all') {
        str = "Interests (<font color='#4682b4'>" + (total-total_sec) + " times cosigner </font>& <font color='red'>" + total_sec + " times author</font>)";
    } else if (interest_type == 'author') {
        str = "Interests (<font color='red'>" + total + " times author</font>)";
    }

    document.getElementById('interest_info').innerHTML = str;

    // To put in percentage (Not really good I think)
    /*
     for (var i = 0; i < data.length; i++) {
     data[i].int = data[i].int / total;
     }*/

    // Compute the range for the x value
    var x = d3.scaleBand()
        .rangeRound([0, barWidth]).padding(0.05);

    // Compute the range for the y value
    var y = d3.scaleLinear()
        .rangeRound([barHeight, 0]);

    // Compute the domain for the x and the y value
    x.domain(data_main.map(function(d) { return d.theme; }));
    y.domain([0, d3.max(data_main, function(d) { return d.int; })]);

    // Add the X axis
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

    // Add the Y axis
    interestsBarGraph.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(3));

    // Add the main bars
    interestsBarGraph.selectAll(".bar")
        .data(data_main)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.theme); })
        .attr("y", function(d) { return y(d.int); })
        .on('mouseover', function(d, i) { interestOver(id, i);})
        .on('mouseleave', function(d) { interestOut(str);})
        .attr('fill', function() {
            if(interest_type == "all") {
                return 'steelblue'
            } else {
                return 'red'
            }
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return barHeight - y(d.int); });

    // Add the secondary bars if needed
    if(interest_type == "all") {
        interestsBarGraph_second.selectAll(".bar")
            .data(data_secondary)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.theme);
            })
            .attr("y", function (d) {
                return y(d.int);
            })
            .on('mouseover', function(d, i) { interestOver(id, i);})
            .on('mouseleave', function(d) { interestOut(str);})
            .attr('fill', 'red')
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return barHeight - y(d.int);
            });
    }

}

// Function to display information about the interests
function interestOver(id, i) {
    console.log(document.getElementById('interest_info').innerHTML);
    if(interest_type == "all") {
        var val_auth = authors[id][i]["int"];
        var val_cos = interests_json[id][i]["int"] - val_auth;

        var str = authors[id][i]["theme"] + ": (<font color='#4682b4'>" + val_cos + " times co-signatory </font>& <font color='red'>" + val_auth + " times author</font>)";

        document.getElementById('interest_info').innerHTML = str;

    } else {
        var val_auth = authors[id][i]["int"];

        var str = authors[id][i]["theme"] + ": (<font color='red'>" + val_auth + " times author</font>)";

        document.getElementById('interest_info').innerHTML = str;
    }
}

// Function to display information back to its normal state
function interestOut(str) {
    document.getElementById('interest_info').innerHTML = str;
}

// Function to show the friends
function showFriends(id) {

    // Remove the old graph
    gFriends.selectAll('*').remove();

    // Change the text in fucntion of the type of friendship
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
            document.getElementById('friends_info').innerHTML = data.length + " cosigners";
        } else {
            document.getElementById('friends_info').innerHTML = data.length + " cosigner";
        }
    }

    // Length of the scroller
    var length = (223/5)*(data.length);

    // Change the height
    document.getElementById('friends').setAttribute("height", length + "px");

    // Add rectangles for all the friends
    gFriends.selectAll('.friend')
        .data(data)
        .enter().append('g')
        .attr('personIdCode', id)
        .attr('class', 'grect')
        .style('cursor', 'pointer')
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

    // Add their picture
    d3.selectAll('.grect')
        .append('image')
        .attr('xlink:href', function(d) { return 'data/portraits/'+d.friend+'.jpg'; })
        .attr('x', 9)
        .attr('y', function(d, i) {return 9+i*(223/5);})
        .attr('height', '34px')
        .attr('width', '34px');

    // Add their name
    d3.selectAll('.grect')
        .append('text')
        .attr('x', 48)
        .attr('y', function(d, i){ return 21+i*(223/5)})
        .text(function(d) {
            return people[d.friend].FirstName[0] + ". " + people[d.friend].LastName;
        });

    // Add the number of common interventions/motions signed
    d3.selectAll('.grect')
        .append('text')
        .attr('x', 48)
        .attr('y', function(d, i){ return 38+i*(223/5)})
        .text(function(d) { return '# together: '+d.number; });
}

// Change the opacity of the rectangle if mouse if over it.
function friendOver(id) {
    $('#rect'+id).attr('opacity', 1);
    $('#'+id).attr('stroke', 'red')
        .attr('stroke-width', 4);
}

// Put the opacity back to its initial value
function friendOut(id) {
    $('#rect'+id).attr('opacity', .7);
    $('#'+id).attr('stroke', '#555555')
        .attr('stroke-width', 1);
}

// Function that does the same thing as the function clicked in functions.js
// Except that it's used when we click on something else than the node itself
function clickedBox(o) {

    // First, we go through all the nodes
    d3.selectAll(".dataNodes")
        // Change their radius
        .style("r", function(d) {
            if(d.PersonIdCode == o.PersonIdCode) {
                return 1.5*radius;
            } else {
                return radius;
            }
        })
        // Change their stroke color
        .style("stroke", function(d,i) {
            if(d.PersonIdCode == o.PersonIdCode) {
                return "#000000"
            } else {
                return color(colorType, nodes[i][colorType]);
            }
        })
        // Change their stroke width
        .style("stroke-width", function(d) {
            if(d.PersonIdCode == o.PersonIdCode) {
                return 3;
            } else {
                return 1;
            }
        });
    ;

    // Update the information about the councilor
    document.getElementById("councilorName").innerHTML = o.FirstName + " " + o.LastName;
    document.getElementById("councilorName").href = "https://www.parlament.ch/en/biografie?CouncillorId=" + o.PersonNumber;
    document.getElementById("councilorParty").innerHTML = o.PartyName;
    document.getElementById("councilorCouncil").innerHTML = o.CouncilName;
    document.getElementById("councilorBirthday").innerHTML = o.DateOfBirth;
    document.getElementById("councilorCanton").innerHTML = o.CantonName;
    document.getElementById("councilorImage").src = "data/portraits/" + o.PersonIdCode + ".jpg";
    document.getElementById("councilorImage").alt = o.FirstName + " " + o.LastName;

    document.getElementById('compCouncilors').input = o.FirstName + " " + o.LastName;

    // Show different information about this councilor
    showTimeline(o.PersonIdCode);
    showInterests(o.PersonIdCode);
    changeOpac(o.PersonIdCode);
    showFriends(o.PersonIdCode);

    // Finally, say that the node corresponding to the box clicked is selected
    for(var i=0; i<nodes.length; i++) {
        nodes[i].selected = false;
    }

    o.selected = true;
    node_selected = true;
    node_id = o.PersonIdCode;
}

// Redraw the interest and timeline if the window has been resized
function window_resized() {
    if(node_id != null) {
        var max_width = document.getElementById('int_timeline').clientWidth;
        barWidth = max_width - bGMargin.left - bGMargin.right;
        showTimeline(node_id);
        showInterests(node_id);
    }
}