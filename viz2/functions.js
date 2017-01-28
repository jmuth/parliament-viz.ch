function emphasisAndShowInfo(d) {

    if(dragging == false) {

        if (node_selected == false) {
            d3.selectAll(".dataNodes").style("r", radius);
            d3.select(this).style("r", 1.5 * radius);
            document.getElementById("councilorName").innerHTML = d.FirstName + " " + d.LastName;
            document.getElementById("councilorName").href = "https://www.parlament.ch/en/biografie?CouncillorId=" + d.PersonNumber;
            document.getElementById("councilorParty").innerHTML = d.PartyName;
            document.getElementById("councilorCouncil").innerHTML = d.CouncilName;
            document.getElementById("councilorBirthday").innerHTML = d.DateOfBirth + " (" + d.age + " y.o.)";
            document.getElementById("councilorCanton").innerHTML = d.CantonName;
            document.getElementById("councilorImage").src = "data/portraits/" + d.PersonIdCode + ".jpg";
            document.getElementById("councilorImage").alt = d.FirstName + " " + d.LastName;

            showTimeline(d.PersonIdCode);
            showInterests(d.PersonIdCode);
            changeOpac(d.PersonIdCode);
            showFriends(d.PersonIdCode);
            node_id = d.PersonIdCode;

        } else {
            var div = $('#tag');
            var top = event.y - 5,
                left = event.x + 15;

            console.log(event.x);

            div.css('display', 'block')
                .css('top', top + 'px')
                .css('left', left + 'px')
                .text(d.FirstName + ' ' + d.LastName);
        }
    }
}

// Simple click on node
function clicked(d) {
    var node = d3.select(this);

    if(d.selected == false) {
        d3.selectAll(".dataNodes")
            .style("r", radius)
            .style("stroke", function(o,i) {
                return color(colorType, getValForColor(colorType, nodes[i]));
            })
            .style("stroke-width", 1);
        ;

        node.style("r", 1.5*radius)
            .style("stroke", function(d) {
                return "#000000"
            })
            .style("stroke-width", 3);

        d3.selectAll(".dataNodes").style("r", radius);
        d3.select(this).style("r", 1.5 * radius);
        document.getElementById("councilorName").innerHTML = d.FirstName + " " + d.LastName;
        document.getElementById("councilorName").href = "https://www.parlament.ch/en/biografie?CouncillorId=" + d.PersonNumber;
        document.getElementById("councilorParty").innerHTML = d.PartyName;
        document.getElementById("councilorCouncil").innerHTML = d.CouncilName;
        document.getElementById("councilorBirthday").innerHTML = d.DateOfBirth + " (" + d.age + " y.o.)";
        document.getElementById("councilorCanton").innerHTML = d.CantonName;
        document.getElementById("councilorImage").src = "data/portraits/" + d.PersonIdCode + ".jpg";
        document.getElementById("councilorImage").alt = d.FirstName + " " + d.LastName;

        showTimeline(d.PersonIdCode);
        showInterests(d.PersonIdCode);
        changeOpac(d.PersonIdCode);
        showFriends(d.PersonIdCode);

        for(var i=0; i<nodes.length; i++) {
            nodes[i].selected = false;
        }

        d.selected = true;
        node_selected = true;
        node_id = d.PersonIdCode;

    } else {
        node.style("r", 1.5*radius)
            .style("stroke", function(d) {
                return color(colorType, getValForColor(colorType, d));
            })
            .style("stroke-width", 1);
        d.selected = false;
        node_selected = false;
        node_id = d.PersonIdCode;
    }

}

// Double click on window
function dbclick() {
    nodes.forEach(function(o, i) {
        o.x = get_foci(o).x;
        o.y = get_foci(o).y;
    });
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.1).restart();
}

function dragged(d) {
    dragging = true;
    d.fx = d3.event.x;
    d.fy = d3.event.y;

    if(cluster == "council") {
        var valx = Math.max(Math.min(d.fx, width), 0);
        var valy = Math.max(Math.min(d.fy, width), 0);
        foci[cluster][d.CouncilAbbreviation]["x"] = valx;
        foci[cluster][d.CouncilAbbreviation]["y"] = valy;

        array_foci[cluster][0]["cx"] = valx;
        array_foci[cluster][0]["cy"] = valy;

        console.log(String(array_foci[cluster][0]["cx"]));

        svg.selectAll(".textFoci").remove();

        svg.selectAll("text")
            .data(array_foci[cluster])
            .enter().append("text")
            .attr("class", "textFoci")
            .attr("x", function (d) {
                return d.cx;
            })
            .attr("y", function (d) {
                return d.cy-radius_foci(radius, nbr[cluster][d.key]);
            })
            .text(function (d) {
                return texts[cluster][d.key] + " (" + nbr[cluster][d.key] + ")";
            })
            .attr("font-family", "serif")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .attr("fill", "#808080")
            .attr("dominant-baseline", "central");
    }

}

function dragended(d) {
    d.fx = null;
    d.fy = null;
    dragging = false;
    if (!d3.event.active) simulation.alphaTarget(0);
}

function changeOpac(id) {
    if (friendship == 'intervention') {
        var line = adj[id];
    } else if (friendship == 'cosign') {
        var line = adj_cosign[id];
    }

    var max = findMax(line);
    if (max == 0) {
        max = 1;
    }

    // Change the opacity
    d3.selectAll(".dataNodes")
        .style("fill-opacity", function(d) {
            var thisId = d.PersonIdCode;
            if (thisId != id) {
                var value = line[thisId] / max;
                return Math.max(value, 0.03)
            }
        })
        .style("stroke-opacity", function(d) {
            var thisId = d.PersonIdCode;
            if (thisId != id) {
                var value = line[thisId] / max;
                return Math.max(value, .1)
            }
        })
        .style("bitch", function(d) {
            return line[d.PersonIdCode]
        });
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

function resetOp() {
    $('#tag').css('display', 'none');
    if (node_selected == false && dragging == false) {
        d3.selectAll(".dataNodes")
            .style("fill-opacity", 1)
            .style("stroke-opacity", 1);
    }
}

document.getElementById('compCouncilors').addEventListener('awesomplete-selectcomplete',function(){
    var val = this.value;
    d3.selectAll(".dataNodes").each(function(o,i)
        {
            if((o.FirstName + " " + o.LastName) == val) {
                clickedBox(o);
            }
        }
    );
});