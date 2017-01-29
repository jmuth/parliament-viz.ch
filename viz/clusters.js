/////////////////////////////////////////////////////////////////////
//                                                                 //
//  This file contains the main function that are used for the     //
//  clusters. It defines the base clusters as well as the          //
//  functions to update them.                                      //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Base focus (when no clusters are selected)
var foci = {"x": 0.5*width, "y": 0.5*height, "nbr_CN": 200, "nbr_CE": 46, "nbr_CF": 7};

// Inital foci (when only one cluster is selected)
var init_foci = {
    "CouncilAbbreviation": {
        "CN": {"x": 0.2 * width, "y": 0.6 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "CE": {"x": 0.6 * width, "y": 0.2 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "CF": {"x": 0.8 * width, "y": 0.6 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0}
    },
    "PartyAbbreviation": {
        "PDC": {"x": 0.1 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "PLR": {"x": 0.367 * width, "y": 0.3 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "UDC": {"x": 0.633 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "PSS": {"x": 0.9 * width, "y": 0.3 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "MCG": {"x": 0.05 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "PEV": {"x": 0.14 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "BastA": {"x": 0.23 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "PBD": {"x": 0.32 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "-": {"x": 0.41 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "Lega": {"x": 0.5 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "csp-ow": {"x": 0.59 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "pvl": {"x": 0.68 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "PdT": {"x": 0.77 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "PES": {"x": 0.86 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "PLD": {"x": 0.95 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0}
    },
    "ParlGroupAbbreviation": {
        "NaN": {"x": 0.5 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "RL": {"x": 0.5 * width, "y": 0.2 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "BD": {"x": 0.7 * width, "y": 0.3 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "C": {"x": 0.8 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "S": {"x": 0.7 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "G": {"x": 0.3 * width, "y": 0.3 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "GL": {"x": 0.2 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "V": {"x": 0.35 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0}
    },
    "GenderAsString": {
        "m": {"x": 0.3*width, "y": 0.5*height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "f": {"x": 0.7*width, "y": 0.5*height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0}
    },
    "NativeLanguage": {
        "I": {"x": 0.2 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "D": {"x": 0.5 * width, "y": 0.3 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "F": {"x": 0.8 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "Tr": {"x": 0.2 * width, "y": 0.3 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "Sk": {"x": 0.8 * width, "y": 0.3 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "RM": {"x": 0.5 * width, "y": 0.8 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0}
    },
    "AgeCategory": { // Missing for 0, but we don't care. Babies are not in the parliament
        1: {"x": 0.2*width, "y": 0.3*height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        2: {"x": 0.2*width, "y": 0.8*height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        3: {"x": 0.5*width, "y": 0.3*height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        4: {"x": 0.5*width, "y": 0.8*height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        5: {"x": 0.8*width, "y": 0.3*height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        6: {"x": 0.8*width, "y": 0.8*height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0}
    },
    "CantonAbbreviation": {
        "ZH": {"x": 0.1 * width, "y": 0.2 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "BE": {"x": 0.3 * width, "y": 0.2 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "VD": {"x": 0.5 * width, "y": 0.2 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "AG": {"x": 0.7 * width, "y": 0.2 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "SG": {"x": 0.9 * width, "y": 0.2 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "GE": {"x": 0.1 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "LU": {"x": 0.233 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "VS": {"x": 0.366 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "TI": {"x": 0.5 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "FR": {"x": 0.633 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "TG": {"x": 0.766 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "BL": {"x": 0.9 * width, "y": 0.5 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "SO": {"x": 0.1 * width, "y": 0.7 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "GR": {"x": 0.233 * width, "y": 0.7 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "NE": {"x": 0.366 * width, "y": 0.7 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "BS": {"x": 0.5 * width, "y": 0.7 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "SZ": {"x": 0.633 * width, "y": 0.7 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "ZG": {"x": 0.766 * width, "y": 0.7 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "JU": {"x": 0.9 * width, "y": 0.7 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "SH": {"x": 0.1 * width, "y": 0.9 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "GL": {"x": 0.233 * width, "y": 0.9 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "UR": {"x": 0.366 * width, "y": 0.9 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "OW": {"x": 0.5 * width, "y": 0.9 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "NW": {"x": 0.633 * width, "y": 0.9 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "AI": {"x": 0.766 * width, "y": 0.9 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0},
        "AR": {"x": 0.9 * width, "y": 0.9 * height, "nbr_CN": 0, "nbr_CE": 0, "nbr_CF": 0}
    }
};

// Main function to update the clusters
function clusters() {
    // First we check if the clusterisation is activated
    if(cluster_active) {

        // If the user just activated the clusterisation, we need to prepare the clusters
        if(cluster_activation_changed) {
            // Remove the text displayed when there's no cluster
            svg.selectAll(".textParl").remove();
            // Create the base foci
            foci = {"x": 0.5*width, "y": 0.5*height, "nbr_CN": 200, "nbr_CE": 46, "nbr_CF": 7};
            // Clear the foci_order
            foci_order = [];

            // We enable the checboxes for the different clusters
            enable_checkboxes();

            // And we say that the activation is finished
            cluster_activation_changed = false;
        }

        // If a cluster has changed (has been checked/unchecked)
        if(clusters_changed) {

            // We update the foci
            update_foci();

            // Then, we compute the numbers in each clusters
            compute_numbers_in_cluster();

            // And we finish this part
            clusters_changed = false;
            added = false;
            deleted = false;
        }

    // If the cluster is not longer active and the clusterisation changed, it means that the user comes back
    // to the non-clustered viz
    } else if(cluster_activation_changed) {

        // We disable the choices of clusters
        disable_checkboxes();

        // Write the text when there's no clusterisation
        text_no_cluster();

        // And we finish
        cluster_activation_changed = false;
    }
}

// Function to write the information on the viz when there isn't any cluster.
function text_no_cluster() {
    // First we remove all the text (just in case)
    svg.selectAll(".textParl").remove();

    // We add the National name
    svg.append("text")
        .attr("class", "textParl")
        .attr("x", function() {return 425;})
        .attr("y", function() {return 16.6219;})
        .text("National")
        .attr("font-family", "serif")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .attr("fill", "#808080")
        .attr("dominant-baseline", "central");

    // We add the Federal name
    svg.append("text")
        .attr("class", "textParl")
        .attr("x", function() {return 476.9;})
        .attr("y", function() {return 16.6219;})
        .text("Federal")
        .attr("font-family", "serif")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("fill", "#808080")
        .attr("dominant-baseline", "central");

    // We add the States name
    svg.append("text")
        .attr("class", "textParl")
        .attr("x", function() {return 528;})
        .attr("y", function() {return 16.6219;})
        .text("States")
        .attr("font-family", "serif")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .attr("fill", "#808080")
        .attr("dominant-baseline", "central");

    // We add a line to separate between National and Federal
    svg.append("line")
        .attr("class", "textParl")
        .style("stroke", "#808080")
        .attr("x1", 430.9)
        .attr("y1", 6.5)
        .attr("x2", 430.9)
        .attr("y2", 590.3);

    // We add a line to separate between Federal and States
    svg.append("line")
        .attr("class", "textParl")
        .style("stroke", "#808080")
        .attr("x1", 522.9)
        .attr("y1", 6.5)
        .attr("x2", 522.9)
        .attr("y2", 590.3);
}

// Compute the number of councilors in each cluster
function compute_numbers_in_cluster() {

    // If the foci_order has a length of 0, it means that it's the base cluster
    // => We already have the information
    if(foci_order.length > 0) {
        // Go through all the nodes
        for (var i = 0; i < nodes.length; i++) {
            // Compute the number for each councils (in case of a user remove one of the councils
            // The function upd_elem_foci is defined in functions.js
            if(nodes[i].CouncilAbbreviation == "CN") {
                upd_elem_foci(nodes[i], "nbr_CN", get_elem_foci(nodes[i], "nbr_CN") + 1);
            } else if(nodes[i].CouncilAbbreviation == "CE") {
                upd_elem_foci(nodes[i], "nbr_CE", get_elem_foci(nodes[i], "nbr_CE") + 1);
            } else if(nodes[i].CouncilAbbreviation == "CF") {
                upd_elem_foci(nodes[i], "nbr_CF", get_elem_foci(nodes[i], "nbr_CF") + 1);
            }
        }
    }

}

// Update the foci
function update_foci(){

    // We first check if a focus type has been added or deleted
    if(added) {
        // If it has been added, we add a new level in the tree of foci
        foci_order = addition_tree(foci_order, ftype);
    } else { //deleted
        // If it has been deleted, we start from the base focus and we rebuild the tree
        // It's not the best way to do it, but it's the easiest =)

        // Remove the
        var idx = foci_order.indexOf(ftype);
        foci_order.splice(idx, 1);

        // Start with the base foci
        foci = {"x": 0.5*width, "y": 0.5*height, "nbr_CN": 200, "nbr_CE": 46, "nbr_CF": 7};

        // We will update the new order until it becomes the same as the foci_order
        var new_order = [];

        for(var i = 0; i<foci_order.length; i++) {
            // Add a level for each focus type in foci_order
            new_order = addition_tree(new_order, foci_order[i]);
        }
    }
}

// Add a level in the tree of foci
function addition_tree(order, addition) {
    // There is a possibility to write this in a functional way.
    // But we were a bit lazy and decided just to write the different
    // possibilities in function of the number of foci type


    // If the length is 0, it means that we add the first cluster
    // Therefore, we just have to update the foci with one of the
    // init_foci.
    if(order.length == 0) {
        delete foci.x;
        delete foci.y;

        foci = JSON.parse(JSON.stringify(init_foci[addition]));

    } else {

        // If the length is not 0, then we have to go through all the leafs in order to split the clusters

        // Leafs to update
        var to_update = Object.keys(init_foci[order[order.length - 1]]);

        // New leafs to add
        var new_keys = Object.keys(init_foci[addition]);

        // For each level, we add a layer (new leafs) on the last layer (actual leafs)
        if (order.length == 1) {
            foci = add_layer(to_update, foci, new_keys)
        } else if (order.length == 2) {
            for (var id0 in init_foci[order[0]]) {
                foci[id0] = add_layer(to_update, foci[id0], new_keys);
            }
        } else if (order.length == 3) {
            for (var id0 in init_foci[order[0]]) {
                for (var id1 in init_foci[order[1]]) {
                    foci[id0][id1] = add_layer(to_update, foci[id0][id1], new_keys);

                }
            }
        } else if (order.length == 4) {
            for (var id0 in init_foci[order[0]]) {
                for (var id1 in init_foci[order[1]]) {
                    for (var id2 in init_foci[order[2]]) {
                        foci[id0][id1][id2] = add_layer(to_update, foci[id0][id1][id2], new_keys);
                    }
                }
            }
        } else if (order.length == 5) {
            for (var id0 in init_foci[order[0]]) {
                for (var id1 in init_foci[order[1]]) {
                    for (var id2 in init_foci[order[2]]) {
                        for (var id3 in init_foci[order[3]]) {
                            foci[id0][id1][id2][id3] = add_layer(to_update, foci[id0][id1][id2][id3], new_keys);
                        }
                    }
                }
            }
        } else if (order.length == 6) {
            for (var id0 in init_foci[order[0]]) {
                for (var id1 in init_foci[order[1]]) {
                    for (var id2 in init_foci[order[2]]) {
                        for (var id3 in init_foci[order[3]]) {
                            for (var id4 in init_foci[order[4]]) {
                                foci[id0][id1][id2][id3][id4] = add_layer(to_update, foci[id0][id1][id2][id3][id4], new_keys);
                            }
                        }
                    }
                }
            }
        }
    }

    // We add the new leaf type in the order of foci
    order.push(addition);

    return order;
}

// This function add new leafs to current level of leaf
function add_layer(upd, foc, new_keys) {
    // Go through all the nodes that have to be updated
    for (var i = 0; i < upd.length; i++) {

        // Get the actual focus value
        var x = foc[upd[i]].x;
        var y = foc[upd[i]].y;

        // Delete them
        delete foc[upd[i]].x;
        delete foc[upd[i]].y;

        // For each new leaf, we add the new foci while moving them randomly a bit from their original position
        for (var j = 0; j < new_keys.length; j++) {
            var json = {}
            json["x"] = Math.max(10, Math.min(width-10, move_a_bit(nbr, x)));
            json["y"] = Math.max(10, Math.min(height-10, move_a_bit(nbr, y)));
            json["nbr_CN"] = 0;
            json["nbr_CE"] = 0;
            json["nbr_CF"] = 0;

            // Update the foci
            foc[upd[i]][new_keys[j]] = json;
        }
    }

    return foc;
}

// Function to move randomly a bit a point from its original value
function move_a_bit(nbr, val) {
    return Math.random()*(2*radius_focus(nbr))-radius_focus(nbr) + val;
}

// Get the focus for a given node
function get_focus(d) {
    var foci_spec;

    // If the clusterisation is not active, then each node has to go
    // to its position in the parliament
    if(cluster_active == false) {
        foci_spec = pos[d.PersonIdCode];
    } else {
        // Other, the node has to go through the tree of foci in order to get the right one
        if(foci_order.length == 0) {
            foci_spec = foci;
        } else {
            // We use a for loop to go through the tree if the size isn't 0
            foci_spec = foci[d[foci_order[0]]];
            for(var i=1; i<foci_order.length; i++) {
                foci_spec = foci_spec[d[foci_order[i]]];
            }
        }
    }

    return foci_spec;
}

// Function to apply the gravity on the nodes
function gravity() {
    return function(d) {
        var alpha,
            focus_x,
            focus_y;

        // We need to get the focus of the given node
        focus_x = get_focus(d).x;
        focus_y = get_focus(d).y;

        // Then, we get the intensity of the force
        if (cluster_active == false) {
            alpha = 0.1;
        } else {
            alpha = 0.05;
        }

        // Get the distance between the node and its focus
        var dx = focus_x - d.x;
        var dy = focus_y - d.y;

        // Change its position
        d.x += dx*alpha;
        d.y += dy*alpha;

        // Avoid that the points go outside the viz
        // TODO: Check why it can go outside at the bottom
        //d.x = Math.max(0, Math.min(width, d.x));
        //d.y = Math.max(0, Math.min(width, d.y));

    };
}

// Get the radius of the focus. Used when we want to move a bit the points
// when splitting the clusters
function radius_focus(n) {
    var ratio = 0;

    if(n < 10) {
        ratio = 5;
    } else if (n < 50) {
        ratio = 10;
    } else if (n < 150) {
        ratio = 20;
    } else {
        ratio = 30;
    }

    return radius*ratio;
}

// Disable the checkboxes for the clustes
function disable_checkboxes() {
    // Disable all the cluster choices
    document.getElementById("btn_council").disabled = true;
    document.getElementById("btn_party").disabled = true;
    document.getElementById("btn_parl_gr").disabled = true;
    document.getElementById("btn_gender").disabled = true;
    document.getElementById("btn_language").disabled = true;
    document.getElementById("btn_age").disabled = true;
    document.getElementById("btn_canton").disabled = true;

    // Uncheck them
    document.getElementById("btn_council").checked = false;
    document.getElementById("btn_party").checked = false;
    document.getElementById("btn_parl_gr").checked = false;
    document.getElementById("btn_gender").checked = false;
    document.getElementById("btn_language").checked = false;
    document.getElementById("btn_age").checked = false;
    document.getElementById("btn_canton").checked = false;

    // Disable and uncheck the majority button
    document.getElementById("majority").disabled = true;
    document.getElementById("majority").checked = false;

    majority_active = false;
    majority_activation_changed = true;
}

// Enable the checkboxes for the clusters
function enable_checkboxes() {
    // Enable all the cluster choices
    document.getElementById("btn_council").disabled = false;
    document.getElementById("btn_party").disabled = false;
    document.getElementById("btn_parl_gr").disabled = false;
    document.getElementById("btn_gender").disabled = false;
    document.getElementById("btn_language").disabled = false;
    document.getElementById("btn_age").disabled = false;
    document.getElementById("btn_canton").disabled = false;

    // Enable the majority button
    document.getElementById("majority").disabled = false;
}