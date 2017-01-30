/////////////////////////////////////////////////////////////////////
//                                                                 //
//  This file contains some functions that are used without        //
//  belonging to a specific task.                                  //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Function used to emphasis a node when the mouse is on it
function emphasisAndShowInfo(d) {

    // First, we check that the node is being dragged.
    if(dragging == false) {

        // If we don't have any selected node, we will display all the information
        // about the councilor on the right panel
        if (node_selected == false) {

            // Make the node with the mouse on bigger
            d3.selectAll(".dataNodes").style("r", radius);
            d3.select(this).style("r", 1.5 * radius);

            // Replace some info in the HTML
            document.getElementById("councilorName").innerHTML = d.FirstName + " " + d.LastName;
            document.getElementById("councilorName").href = "https://www.parlament.ch/en/biografie?CouncillorId=" + d.PersonNumber;
            document.getElementById("councilorParty").innerHTML = d.PartyName;
            document.getElementById("councilorCouncil").innerHTML = d.CouncilName;
            document.getElementById("councilorBirthday").innerHTML = d.DateOfBirth;
            document.getElementById("councilorCanton").innerHTML = d.CantonName;
            document.getElementById("councilorImage").src = "data/portraits/" + d.PersonIdCode + ".jpg";
            document.getElementById("councilorImage").alt = d.FirstName + " " + d.LastName;

            // Show some information
            showTimeline(d.PersonIdCode);
            showInterests(d.PersonIdCode);
            changeOpac(d.PersonIdCode);
            showFriends(d.PersonIdCode);

            // Set the node_id
            node_id = d.PersonIdCode;
        } else {
            // If a node is selected, we will display some information about another councilor
            // on the left panel.

            // Display the additional information about the councilor
            $('#add_info_counc').css('display', 'block');
            $('#additional-info-card').css('display', 'block');


            // Replace some info in the HTML
            document.getElementById("councilorName_add").innerHTML = d.FirstName + " " + d.LastName;
            document.getElementById("councilorParty_add").innerHTML = d["PartyAbbreviation"];
            document.getElementById("councilorCouncil_add").innerHTML = d.CouncilName;
            document.getElementById("councilorBirthday_add").innerHTML = d.DateOfBirth;
            document.getElementById("councilorCanton_add").innerHTML = d.CantonName;
            document.getElementById("councilorImage_add").src = "data/portraits/" + d.PersonIdCode + ".jpg";
            document.getElementById("councilorImage_add").alt = d.FirstName + " " + d.LastName;
        }
    }

    if(cluster_active && node_selected) {
        $('#new_line').css('display', 'block');
    } else {
        $('#new_line').css('display', 'none');
    }

    // We check if the clusterisation is active
    if(cluster_active) {
        showInfoCluster(d);
    }
}

function showInfoCluster(d) {
    // Display the additional information about the cluster
    $('#additional-info-card').css('display', 'block');
    $('#add_info_cluster').css('display', 'block');

    // Get the number of councilors in the cluster in which
    // he/she belongs. (Depends on the selected councils)
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

    // Display this number
    if(nn > 1) {
        document.getElementById("cluster_nbr").innerHTML = nn + " councilors";
    } else {
        document.getElementById("cluster_nbr").innerHTML = nn + " councilor";
    }

    // Prepare the Clusterisation information
    var str = "";//"<b>Clusterisation </b>: <br>";

    if(foci_order.length == 0) {
        str += "&#8226; All the councilors. <br>"
    } else {
        for(var i=0; i<foci_order.length; i++) {
            str += "&#8226; " + text_info_cluster(foci_order[i]) + ": " + texts[foci_order[i]][d[foci_order[i]]] + "<br>";
        }
    }

    // Show it
    document.getElementById("cluster_info").innerHTML = str;
}

// Function defining what's happening when the user clicks on a node
function clicked(d) {
    // First, we get the node in which
    var node = d3.select(this);

    if(cluster_active) {
        showInfoCluster(d);
    }

    // If the node isn't already selected
    if(d.selected == false) {

        // We update all the nodes
        d3.selectAll(".dataNodes")
            // radius the same for everyone
            .style("r", radius)
            // Stroke of the right color
            .style("stroke", function(o,i) {
                return color(colorType, nodes[i][colorType]);
            })
            // stroke style smaller again
            .style("stroke-width", 1);

        // We update the newly selected node (bigger radius, black and widder stroke)
        node.style("r", 1.5*radius)
            .style("stroke", function() {
                return "#000000"
            })
            .style("stroke-width", 3);

        // Then we replace some elements in the HTML
        document.getElementById("councilorName").innerHTML = d.FirstName + " " + d.LastName;
        document.getElementById("councilorName").href = "https://www.parlament.ch/en/biografie?CouncillorId=" + d.PersonNumber;
        document.getElementById("councilorParty").innerHTML = d.PartyName;
        document.getElementById("councilorCouncil").innerHTML = d.CouncilName;
        document.getElementById("councilorBirthday").innerHTML = d.DateOfBirth;
        document.getElementById("councilorCanton").innerHTML = d.CantonName;
        document.getElementById("councilorImage").src = "data/portraits/" + d.PersonIdCode + ".jpg";
        document.getElementById("councilorImage").alt = d.FirstName + " " + d.LastName;

        // Show more information in the right panel
        showTimeline(d.PersonIdCode);
        showInterests(d.PersonIdCode);
        changeOpac(d.PersonIdCode);
        showFriends(d.PersonIdCode);

        // Say that all the nodes are unselected
        for(var i=0; i<nodes.length; i++) {
            nodes[i].selected = false;
        }

        // And select this node =)
        d.selected = true;
        node_selected = true;
        node_id = d.PersonIdCode;

    } else {
        // If the node is selected, we unselect it.
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

// Double click on the SVG viz
function dbclick() {
    // If we double-click, we put all the nodes on their focus. With the collision force
    // from d3.js, it will make them move away from each other.
    // This helps when a node is stuck somewhere
    nodes.forEach(function(o) {
        o.x = get_focus(o).x;
        o.y = get_focus(o).y;
    });
}

// Function defining what's happening when the dragging start
function dragstarted() {
    // Something to do with d3
    if (!d3.event.active) simulation.alphaTarget(0.1).restart();

    // If the cluster is active, we don't show the opacity
    // It's easier to see where we move them
    if(cluster_active) {
        resetOp();
    }
}

// Function defining what's happening when a node is being dragged
function dragged(d) {
    // We say that we are dragging
    dragging = true;
    // Give its position as the mouse event
    d.fx = d3.event.x;
    d.fy = d3.event.y;

    // Get the values for the new focus center
    var valx = Math.max(Math.min(d.fx, width), 0);
    var valy = Math.max(Math.min(d.fy, height), 0);

    // Update the focus center
    upd_elem_focus(d, "x", valx);
    upd_elem_focus(d, "y", valy);
}

// Function defining what's happening when the dragging finish
function dragended(d) {
    // We don't force the nodes anymore
    d.fx = null;
    d.fy = null;

    // We say that we are not dragging anymore
    dragging = false;

    // Something to do with d3
    if (!d3.event.active) simulation.alphaTarget(0);

    // If the cluster is active, we reactivate the opacity of the nodes
    if(node_selected && cluster_active) {
        changeOpac(node_id);
    }
}

// Function used to give opacity/transparency to the nodes
function changeOpac(id) {
    // Depending on the type of friendship, we will give opacaity on different nodes
    if (friendship == 'intervention') {
        var line = adj[id];
    } else if (friendship == 'cosign') {
        var line = adj_cosign[id];
    }

    // Get the max
    var max = findMax(line);
    if (max == 0) {
        max = 1;
    }


    // Change the opacity of all the nodes
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

// Function to return the max value in an array
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

// Reset the opacity
function resetOp() {
    // First, we remove the displaying of information about clusters and councilors
    $('#additional-info-card').css('display', 'none');
    $('#add_info_counc').css('display', 'none');
    $('#add_info_cluster').css('display', 'none');

    // Then, we give opacity 1 to all the nodes
    if (node_selected == false && dragging == false) {
        d3.selectAll(".dataNodes")
            .style("fill-opacity", 1)
            .style("stroke-opacity", 1);
    }
}

// Awesomplete function for the autocomplete
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

// Update an element in a focus
// This function has not been written in a functional way.. Sorry =(
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

// Get an element in a focus
// This function has not been written in a functional way.. Sorry =(
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

// Return some text in function of the type of cluster
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

// Remove the councils we don't want
function remove_non_wanted_council() {

    // In order to remove the nodes of the councils we don't want, we
    // just force them to go outside of the viz. We add tell them to go on a
    // circle with a random radius (with a given minimum value) so that when they
    // come back it's prettier.
    var rmin = 600;
    var dr = 1000;

    // Check if one of the wanted/non-wanted council has changed
    if(national_changed) {

        // Remove the nodes in National Council
        if(national == false) {
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CN") {
                    var angle = Math.random()*2*Math.PI;
                    nodes[i].fx = (rmin+Math.random()*dr)*Math.cos(angle) + width/2;
                    nodes[i].fy = (rmin+Math.random()*dr)*Math.sin(angle) + height/2;
                }
            }
        } else {
            // Add the nodes in National Council
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CN") {
                    nodes[i].fx = null;
                    nodes[i].fy = null;
                }
            }
        }

        national_changed = false;
    } else if(states_changed) {

        // Remove the nodes in Council of States
        if(states == false) {
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CE") {
                    var angle = Math.random()*2*Math.PI;
                    nodes[i].fx = (rmin+Math.random()*dr)*Math.cos(angle) + width/2;
                    nodes[i].fy = (rmin+Math.random()*dr)*Math.sin(angle) + height/2;;
                }
            }
        } else {
            // Add the nodes in Council of States
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CE") {
                    nodes[i].fx = null;
                    nodes[i].fy = null;
                }
            }
        }

        states_changed = false;
    } else if(federal_changed) {

        // Remove the nodes in Federal Council
        if(federal == false) {
            for(var i=0; i<nodes.length; i++) {
                if(nodes[i].CouncilAbbreviation == "CF") {
                    var angle = Math.random()*2*Math.PI;
                    nodes[i].fx = (rmin+Math.random()*dr)*Math.cos(angle) + width/2;
                    nodes[i].fy = (rmin+Math.random()*dr)*Math.sin(angle) + height/2;
                }
            }
        } else {
            // Add the nodes in Federal Council
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