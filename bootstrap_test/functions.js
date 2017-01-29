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
            $('#add_info_counc').css('display', 'block');

            document.getElementById("councilorName_add").innerHTML = d.FirstName + " " + d.LastName;
            document.getElementById("councilorParty_add").innerHTML = d.PartyName;
            document.getElementById("councilorCouncil_add").innerHTML = d.CouncilName;
            document.getElementById("councilorBirthday_add").innerHTML = d.DateOfBirth + " (" + d.age + " y.o.)";
            document.getElementById("councilorCanton_add").innerHTML = d.CantonName;
            document.getElementById("councilorImage_add").src = "data/portraits/" + d.PersonIdCode + ".jpg";
            document.getElementById("councilorImage_add").alt = d.FirstName + " " + d.LastName;
        }
    }

    if(cluster_active) {

        $('#add_info_cluster').css('display', 'block');

        var nn = 0;

        if(national) {
            nn += get_elem_focus(d, "nbr_CN");
        }

        if(states) {
            nn += get_elem_focus(d, "nbr_CE");
        }

        if(federal) {
            nn += get_elem_focus(d, "nbr_CF");
        }

        if(nn > 1) {
            document.getElementById("cluster_nbr").innerHTML = nn + " councilors";
        } else {
            document.getElementById("cluster_nbr").innerHTML = nn + " councilor";
        }

        var str = "";//"<b>Clusterisation </b>: <br>";

        if(foci_order.length == 0) {
            str += "&#8226; All the councilors. <br>"
        } else {
            for(var i=0; i<foci_order.length; i++) {
                str += "&#8226; " + text_info_cluster(foci_order[i]) + ": " + texts[foci_order[i]][d[foci_order[i]]] + "<br>";
            }
        }


        document.getElementById("cluster_info").innerHTML = str;

    }
}

// Simple click on node
function clicked(d) {
    var node = d3.select(this);

    if(d.selected == false) {
        d3.selectAll(".dataNodes")
            .style("r", radius)
            .style("stroke", function(o,i) {
                return color(colorType, nodes[i][colorType]);
            })
            .style("stroke-width", 1);

        node.style("r", 1.5*radius)
            .style("stroke", function() {
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
                return color(colorType, d[colorType]);
            })
            .style("stroke-width", 1);
        d.selected = false;
        node_selected = false;
        node_id = d.PersonIdCode;
    }

}

// Double click on window
function dbclick() {
    nodes.forEach(function(o) {
        o.x = get_focus(o).x;
        o.y = get_focus(o).y;
    });
}

function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.1).restart();

    if(cluster_active) {
        resetOp();
    }
}

function dragged(d) {
    dragging = true;
    d.fx = d3.event.x;
    d.fy = d3.event.y;

    var valx = Math.max(Math.min(d.fx, width), 0);
    var valy = Math.max(Math.min(d.fy, width), 0);

    upd_elem_focus(d, "x", valx);
    upd_elem_focus(d, "y", valy);
}

function dragended(d) {
    d.fx = null;
    d.fy = null;
    dragging = false;
    if (!d3.event.active) simulation.alphaTarget(0);
    if(node_selected && cluster_active) {
        changeOpac(node_id);
    }
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
    $('#add_info_counc').css('display', 'none');
    $('#add_info_cluster').css('display', 'none');

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



function upd_elem_focus(d, elem, val) {
    if(foci_order.length == 0) {
        foci[elem] = val
    } else if(foci_order.length == 1) {
        foci[d[foci_order[0]]][elem] = val
    } else if(foci_order.length == 2) {
        foci[d[foci_order[0]]][d[foci_order[1]]][elem] = val
    } else if(foci_order.length == 3) {
        foci[d[foci_order[0]]][d[foci_order[1]]][d[foci_order[2]]][elem] = val;
    } else if(foci_order.length == 4) {
        foci[d[foci_order[0]]][d[foci_order[1]]][d[foci_order[2]]][d[foci_order[3]]][elem] = val;
    } else if(foci_order.length == 5) {
        foci[d[foci_order[0]]][d[foci_order[1]]][d[foci_order[2]]][d[foci_order[3]]][d[foci_order[4]]][elem] = val;
    } else if(foci_order.length == 6) {
        foci[d[foci_order[0]]][d[foci_order[1]]][d[foci_order[2]]][d[foci_order[3]]][d[foci_order[4]]][d[foci_order[5]]][elem] = val;
    } else if(foci_order.length == 7) {
        foci[d[foci_order[0]]][d[foci_order[1]]][d[foci_order[2]]][d[foci_order[3]]][d[foci_order[4]]][d[foci_order[5]]][d[foci_order[6]]][elem] = val;
    }
}

function get_elem_focus(d, elem) {
    if(foci_order.length == 0) {
        return foci[elem];
    } else if(foci_order.length == 1) {
        return foci[d[foci_order[0]]][elem];
    } else if(foci_order.length == 2) {
        return foci[d[foci_order[0]]][d[foci_order[1]]][elem];
    } else if(foci_order.length == 3) {
        return foci[d[foci_order[0]]][d[foci_order[1]]][d[foci_order[2]]][elem];
    } else if(foci_order.length == 4) {
        return foci[d[foci_order[0]]][d[foci_order[1]]][d[foci_order[2]]][d[foci_order[3]]][elem];
    } else if(foci_order.length == 5) {
        return foci[d[foci_order[0]]][d[foci_order[1]]][d[foci_order[2]]][d[foci_order[3]]][d[foci_order[4]]][elem];
    } else if(foci_order.length == 6) {
        return foci[d[foci_order[0]]][d[foci_order[1]]][d[foci_order[2]]][d[foci_order[3]]][d[foci_order[4]]][d[foci_order[5]]][elem];
    } else if(foci_order.length == 7) {
        return foci[d[foci_order[0]]][d[foci_order[1]]][d[foci_order[2]]][d[foci_order[3]]][d[foci_order[4]]][d[foci_order[5]]][d[foci_order[6]]][elem];
    }
}

function text_info_cluster(val) {
    if(val == "CouncilAbbreviation") {
        return "Council";
    } else if(val == "PartyAbbreviation") {
        return "Party";
    } else if(val == "ParlGroupAbbreviation") {
        return "Parl. Group";
    } else if(val == "GenderAsString") {
        return "Gender";
    } else if(val == "NativeLanguage") {
        return "Native Language";
    } else if(val == "AgeCategory") {
        return "Age Category"
    } else if(val == "CantonAbbreviation") {
        return "Canton"
    }
}

function remove_non_wanted_council() {

    var rmin = 600;
    var dr = 1000;

    if(national_changed) {

        if(national == false) {
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CN") {
                    var angle = Math.random()*2*Math.PI;
                    nodes[i].fx = (rmin+Math.random()*dr)*Math.cos(angle) + width/2;
                    nodes[i].fy = (rmin+Math.random()*dr)*Math.sin(angle) + height/2;
                }
            }
        } else {
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CN") {
                    nodes[i].fx = null;
                    nodes[i].fy = null;
                }
            }
        }

        national_changed = false;
    } else if(states_changed) {
        if(states == false) {
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CE") {
                    var angle = Math.random()*2*Math.PI;
                    nodes[i].fx = (rmin+Math.random()*dr)*Math.cos(angle) + width/2;
                    nodes[i].fy = (rmin+Math.random()*dr)*Math.sin(angle) + height/2;;
                }
            }
        } else {
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CE") {
                    nodes[i].fx = null;
                    nodes[i].fy = null;
                }
            }
        }

        states_changed = false;
    } else if(federal_changed) {
        if(federal == false) {
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CF") {
                    var angle = Math.random()*2*Math.PI;
                    nodes[i].fx = (rmin+Math.random()*dr)*Math.cos(angle) + width/2;
                    nodes[i].fy = (rmin+Math.random()*dr)*Math.sin(angle) + height/2;
                }
            }
        } else {
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CF") {
                    nodes[i].fx = null;
                    nodes[i].fy = null;
                }
            }
        }

        federal_changed = false;
    }
}