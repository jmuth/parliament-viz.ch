var foci = {"x": 0.5*width, "y": 0.5*height, "nbr": 253};

// Foci
var init_foci = {
    "CouncilAbbreviation": {
        "CN": {"x": 0.2 * width, "y": 0.6 * height, "nbr": 0},
        "CE": {"x": 0.6 * width, "y": 0.2 * height, "nbr": 0},
        "CF": {"x": 0.8 * width, "y": 0.6 * height, "nbr": 0}
    },
    "PartyAbbreviation": {
        "PDC": {"x": 0.1 * width, "y": 0.5 * height, "nbr": 0},
        "PLR": {"x": 0.367 * width, "y": 0.3 * height, "nbr": 0},
        "UDC": {"x": 0.633 * width, "y": 0.5 * height, "nbr": 0},
        "PSS": {"x": 0.9 * width, "y": 0.3 * height, "nbr": 0},
        "MCG": {"x": 0.05 * width, "y": 0.8 * height, "nbr": 0},
        "PEV": {"x": 0.14 * width, "y": 0.8 * height, "nbr": 0},
        "BastA": {"x": 0.23 * width, "y": 0.8 * height, "nbr": 0},
        "PBD": {"x": 0.32 * width, "y": 0.8 * height, "nbr": 0},
        "-": {"x": 0.41 * width, "y": 0.8 * height, "nbr": 0},
        "Lega": {"x": 0.5 * width, "y": 0.8 * height, "nbr": 0},
        "csp-ow": {"x": 0.59 * width, "y": 0.8 * height, "nbr": 0},
        "pvl": {"x": 0.68 * width, "y": 0.8 * height, "nbr": 0},
        "PdT": {"x": 0.77 * width, "y": 0.8 * height, "nbr": 0},
        "PES": {"x": 0.86 * width, "y": 0.8 * height, "nbr": 0},
        "PLD": {"x": 0.95 * width, "y": 0.8 * height, "nbr": 0}
    },
    "ParlGroupAbbreviation": {
        "NaN": {"x": 0.5 * width, "y": 0.5 * height, "nbr": 0},
        "RL": {"x": 0.5 * width, "y": 0.2 * height, "nbr": 0},
        "BD": {"x": 0.7 * width, "y": 0.3 * height, "nbr": 0},
        "C": {"x": 0.8 * width, "y": 0.5 * height, "nbr": 0},
        "S": {"x": 0.7 * width, "y": 0.8 * height, "nbr": 0},
        "G": {"x": 0.3 * width, "y": 0.3 * height, "nbr": 0},
        "GL": {"x": 0.2 * width, "y": 0.5 * height, "nbr": 0},
        "V": {"x": 0.35 * width, "y": 0.8 * height, "nbr": 0}
    },
    "GenderAsString": {
        "m": {"x": 0.3*width, "y": 0.5*height, "nbr": 0},
        "f": {"x": 0.7*width, "y": 0.5*height, "nbr": 0}
    },
    "NativeLanguage": {
        "I": {"x": 0.2 * width, "y": 0.8 * height, "nbr": 0},
        "D": {"x": 0.5 * width, "y": 0.3 * height, "nbr": 0},
        "F": {"x": 0.8 * width, "y": 0.8 * height, "nbr": 0},
        "Tr": {"x": 0.2 * width, "y": 0.3 * height, "nbr": 0},
        "Sk": {"x": 0.8 * width, "y": 0.3 * height, "nbr": 0},
        "RM": {"x": 0.5 * width, "y": 0.8 * height, "nbr": 0}
    },
    "AgeCategory": {
        1: {"x": 0.2*width, "y": 0.3*height, "nbr": 0},
        2: {"x": 0.2*width, "y": 0.8*height, "nbr": 0},
        3: {"x": 0.5*width, "y": 0.3*height, "nbr": 0},
        4: {"x": 0.5*width, "y": 0.8*height, "nbr": 0},
        5: {"x": 0.8*width, "y": 0.3*height, "nbr": 0},
        6: {"x": 0.8*width, "y": 0.8*height, "nbr": 0}
    },
    "CantonAbbreviation": {
        "ZH": {"x": 0.1 * width, "y": 0.2 * height, "nbr": 0},
        "BE": {"x": 0.3 * width, "y": 0.2 * height, "nbr": 0},
        "VD": {"x": 0.5 * width, "y": 0.2 * height, "nbr": 0},
        "AG": {"x": 0.7 * width, "y": 0.2 * height, "nbr": 0},
        "SG": {"x": 0.9 * width, "y": 0.2 * height, "nbr": 0},
        "GE": {"x": 0.1 * width, "y": 0.5 * height, "nbr": 0},
        "LU": {"x": 0.233 * width, "y": 0.5 * height, "nbr": 0},
        "VS": {"x": 0.366 * width, "y": 0.5 * height, "nbr": 0},
        "TI": {"x": 0.5 * width, "y": 0.5 * height, "nbr": 0},
        "FR": {"x": 0.633 * width, "y": 0.5 * height, "nbr": 0},
        "TG": {"x": 0.766 * width, "y": 0.5 * height, "nbr": 0},
        "BL": {"x": 0.9 * width, "y": 0.5 * height, "nbr": 0},
        "SO": {"x": 0.1 * width, "y": 0.7 * height, "nbr": 0},
        "GR": {"x": 0.233 * width, "y": 0.7 * height, "nbr": 0},
        "NE": {"x": 0.366 * width, "y": 0.7 * height, "nbr": 0},
        "BS": {"x": 0.5 * width, "y": 0.7 * height, "nbr": 0},
        "SZ": {"x": 0.633 * width, "y": 0.7 * height, "nbr": 0},
        "ZG": {"x": 0.766 * width, "y": 0.7 * height, "nbr": 0},
        "JU": {"x": 0.9 * width, "y": 0.7 * height, "nbr": 0},
        "SH": {"x": 0.1 * width, "y": 0.9 * height, "nbr": 0},
        "GL": {"x": 0.233 * width, "y": 0.9 * height, "nbr": 0},
        "UR": {"x": 0.366 * width, "y": 0.9 * height, "nbr": 0},
        "OW": {"x": 0.5 * width, "y": 0.9 * height, "nbr": 0},
        "NW": {"x": 0.633 * width, "y": 0.9 * height, "nbr": 0},
        "AI": {"x": 0.766 * width, "y": 0.9 * height, "nbr": 0},
        "AR": {"x": 0.9 * width, "y": 0.9 * height, "nbr": 0}
    }
};

function clusters() {
    if(cluster_active) {
        svg.selectAll(".textFoci").remove();

        if(cluster_activation_changed) {
            radius = 5;
            foci = {"x": 0.5*width, "y": 0.5*height, "nbr": 253};
            focis_order = [];

            enable_checkboxes();

            cluster_activation_changed = false;
        }

        if(clusters_changed) {

            update_foci();

            compute_numbers_in_cluster();

            clusters_changed = false;
            added = false;
            deleted = false;
        }

    } else if(cluster_activation_changed) {

        radius = 6;

        disable_checkboxes();

        svg.selectAll(".textFoci").remove();

        svg.append("text")
            .attr("class", "textFoci")
            .attr("x", function() {return 425;})
            .attr("y", function() {return 16.6219;})
            .text("National")
            .attr("font-family", "serif")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("fill", "#808080")
            .attr("dominant-baseline", "central");

        svg.append("text")
            .attr("class", "textFoci")
            .attr("x", function() {return 476.9;})
            .attr("y", function() {return 16.6219;})
            .text("Federal")
            .attr("font-family", "serif")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .attr("fill", "#808080")
            .attr("dominant-baseline", "central");

        svg.append("text")
            .attr("class", "textFoci")
            .attr("x", function() {return 528;})
            .attr("y", function() {return 16.6219;})
            .text("States")
            .attr("font-family", "serif")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .attr("fill", "#808080")
            .attr("dominant-baseline", "central");

        svg.append("line")
            .attr("class", "textFoci")
            .style("stroke", "#808080")
            .attr("x1", 430.9)
            .attr("y1", 6.5)
            .attr("x2", 430.9)
            .attr("y2", 590.3);

        svg.append("line")
            .attr("class", "textFoci")
            .style("stroke", "#808080")
            .attr("x1", 522.9)
            .attr("y1", 6.5)
            .attr("x2", 522.9)
            .attr("y2", 590.3);

        cluster_activation_changed = false;
    }
}

function compute_numbers_in_cluster() {

    if(focis_order.length > 0) {
        for (var i = 0; i < nodes.length; i++) {
            upd_elem_foci(nodes[i], "nbr", get_elem_foci(nodes[i], "nbr") + 1);
        }
    }

}

function update_foci(){

    if(added) {
        focis_order = addition_tree(focis_order, ftype);
    } else { //deleted
        var idx = focis_order.indexOf(ftype);

        focis_order.splice(idx, 1);

        foci = {"x": 0.5*width, "y": 0.5*height, "nbr": 253};

        var new_order = [];

        for(var i = 0; i<focis_order.length; i++) {
            new_order = addition_tree(new_order, focis_order[i]);
        }
    }
}
function addition_tree(order, addition) {

    if(order.length == 0) {
        delete foci.x;
        delete foci.y;

        foci = JSON.parse(JSON.stringify(init_foci[addition]));

    } else {
        var to_update = Object.keys(init_foci[order[order.length - 1]]);
        var new_keys = Object.keys(init_foci[addition]);

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
    order.push(addition);

    return order;
}

function add_layer(upd, foc, new_keys) {
    for (var i = 0; i < upd.length; i++) {

        var x = foc[upd[i]].x;
        var y = foc[upd[i]].y;
        var nbr = foc[upd[i]].nbr;

        console.log(nbr);

        delete foc[upd[i]].x;
        delete foc[upd[i]].y;

        for (var j = 0; j < new_keys.length; j++) {
            var json = {}
            json["x"] = Math.max(5, Math.min(width, move_a_bit(nbr + new_keys.length, x)));
            json["y"] = Math.max(5, Math.min(width, move_a_bit(nbr + new_keys.length, y)));
            json["nbr"] = 0;

            foc[upd[i]][new_keys[j]] = json;
        }
    }

    return foc;
}

function move_a_bit(nbr, val) {
    return Math.random()*(2*radius_foci(nbr))-radius_foci(nbr) + val;
}

function get_foci(d) {
    var foci_spec;

    if(cluster_active == false) {
        foci_spec = pos[d.PersonIdCode];
    } else {
        if(focis_order.length == 0) {
            foci_spec = foci;
        } else {
            foci_spec = foci[d[focis_order[0]]];
            for(var i=1; i<focis_order.length; i++) {
                foci_spec = foci_spec[d[focis_order[i]]];
            }
        }
    }

    return foci_spec;
}

// Move nodes toward cluster focus.
function gravity() {
    return function(d) {
        var alpha,
            foci_x,
            foci_y;

        foci_x = get_foci(d).x;
        foci_y = get_foci(d).y;

        if (cluster_active == false) {
            alpha = 0.1;
        } else {
            alpha = 0.05;
        }

        var dx = foci_x - d.x;
        var dy = foci_y - d.y;

        d.x += dx*alpha;
        d.y += dy*alpha;
    };
}

function radius_foci(n) {
    var ratio = 0;

    if (n==1) {
        ratio = 3;
    } else if (n<=7) {
        ratio = 6;
    } else if (n<=19) {
        ratio = 9;
    } else if (n<=38) {
        ratio = 12;
    } else if (n<=61) {
        ratio = 15;
    } else if (n<=91) {
        ratio = 18;
    } else if (n<=127) {
        ratio = 21;
    } else if (n<=169) {
        ratio = 23;
    } else if (n<=217) {
        ratio = 23;
    } else {
        ratio = 29;
    }

    return radius*ratio;
}

function disable_checkboxes() {
    document.getElementById("btn_council").disabled = true;
    document.getElementById("btn_party").disabled = true;
    document.getElementById("btn_parl_gr").disabled = true;
    document.getElementById("btn_gender").disabled = true;
    document.getElementById("btn_language").disabled = true;
    document.getElementById("btn_age").disabled = true;
    document.getElementById("btn_canton").disabled = true;

    document.getElementById("btn_council").checked = false;
    document.getElementById("btn_party").checked = false;
    document.getElementById("btn_parl_gr").checked = false;
    document.getElementById("btn_gender").checked = false;
    document.getElementById("btn_language").checked = false;
    document.getElementById("btn_age").checked = false;
    document.getElementById("btn_canton").checked = false;
}

function enable_checkboxes() {
    document.getElementById("btn_council").disabled = false;
    document.getElementById("btn_party").disabled = false;
    document.getElementById("btn_parl_gr").disabled = false;
    document.getElementById("btn_gender").disabled = false;
    document.getElementById("btn_language").disabled = false;
    document.getElementById("btn_age").disabled = false;
    document.getElementById("btn_canton").disabled = false;
}