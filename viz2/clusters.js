var foci = {"x": 0.5*width, "y": 0.5*height};

var focis_nbr = {
    "CouncilAbbreviation": 3,
    "PartyAbbreviation": 15,
    "ParlGroupAbbreviation": 8,
    "GenderAsString": 2,
    "NativeLanguage": 6,
    "AgeCategory": 6,
    "CantonAbbreviation": 26
}

// Foci
var init_foci = {
    "CouncilAbbreviation": {
        "CN": {"x": 0.2 * width, "y": 0.6 * height},        // Foci CN
        "CE": {"x": 0.6 * width, "y": 0.2 * height},        // Foci CE
        "CF": {"x": 0.8 * width, "y": 0.6 * height}         // Foci CF
    },
    "PartyAbbreviation": {
        "PDC": {"x": 0.1 * width, "y": 0.5 * height},
        "PLR": {"x": 0.367 * width, "y": 0.3 * height},
        "UDC": {"x": 0.633 * width, "y": 0.5 * height},
        "PSS": {"x": 0.9 * width, "y": 0.3 * height},
        "MCG": {"x": 0.05 * width, "y": 0.8 * height},
        "PEV": {"x": 0.14 * width, "y": 0.8 * height},
        "BastA": {"x": 0.23 * width, "y": 0.8 * height},
        "PBD": {"x": 0.32 * width, "y": 0.8 * height},
        "-": {"x": 0.41 * width, "y": 0.8 * height},
        "Lega": {"x": 0.5 * width, "y": 0.8 * height},
        "csp-ow": {"x": 0.59 * width, "y": 0.8 * height},
        "pvl": {"x": 0.68 * width, "y": 0.8 * height},
        "PdT": {"x": 0.77 * width, "y": 0.8 * height},
        "PES": {"x": 0.86 * width, "y": 0.8 * height},
        "PLD": {"x": 0.95 * width, "y": 0.8 * height}
    },
    "ParlGroupAbbreviation": {
        "NaN": {"x": 0.5 * width, "y": 0.5 * height},
        "RL": {"x": 0.5 * width, "y": 0.2 * height},
        "BD": {"x": 0.7 * width, "y": 0.3 * height},
        "C": {"x": 0.8 * width, "y": 0.5 * height},
        "S": {"x": 0.7 * width, "y": 0.8 * height},
        "G": {"x": 0.3 * width, "y": 0.3 * height},
        "GL": {"x": 0.2 * width, "y": 0.5 * height},
        "V": {"x": 0.35 * width, "y": 0.8 * height}
    },
    "GenderAsString": {
        "m": {"x": 0.3*width, "y": 0.5*height},             // Foci Male
        "f": {"x": 0.7*width, "y": 0.5*height}              // Foci Female
    },
    "NativeLanguage": {
        "I": {"x": 0.2 * width, "y": 0.8 * height},
        "D": {"x": 0.5 * width, "y": 0.3 * height},
        "F": {"x": 0.8 * width, "y": 0.8 * height},
        "Tr": {"x": 0.2 * width, "y": 0.3 * height},
        "Sk": {"x": 0.8 * width, "y": 0.3 * height},
        "RM": {"x": 0.5 * width, "y": 0.8 * height}
    },
"AgeCategory": {},                                              // Foci are created later
    "CantonAbbreviation": {
        "ZH": {"x": 0.1 * width, "y": 0.2 * height},
        "BE": {"x": 0.3 * width, "y": 0.2 * height},
        "VD": {"x": 0.5 * width, "y": 0.2 * height},
        "AG": {"x": 0.7 * width, "y": 0.2 * height},
        "SG": {"x": 0.9 * width, "y": 0.2 * height},
        "GE": {"x": 0.1 * width, "y": 0.5 * height},
        "LU": {"x": 0.233 * width, "y": 0.5 * height},
        "VS": {"x": 0.366 * width, "y": 0.5 * height},
        "TI": {"x": 0.5 * width, "y": 0.5 * height},
        "FR": {"x": 0.633 * width, "y": 0.5 * height},
        "TG": {"x": 0.766 * width, "y": 0.5 * height},
        "BL": {"x": 0.9 * width, "y": 0.5 * height},
        "SO": {"x": 0.1 * width, "y": 0.7 * height},
        "GR": {"x": 0.233 * width, "y": 0.7 * height},
        "NE": {"x": 0.366 * width, "y": 0.7 * height},
        "BS": {"x": 0.5 * width, "y": 0.7 * height},
        "SZ": {"x": 0.633 * width, "y": 0.7 * height},
        "ZG": {"x": 0.766 * width, "y": 0.7 * height},
        "JU": {"x": 0.9 * width, "y": 0.7 * height},
        "SH": {"x": 0.1 * width, "y": 0.9 * height},
        "GL": {"x": 0.233 * width, "y": 0.9 * height},
        "UR": {"x": 0.366 * width, "y": 0.9 * height},
        "OW": {"x": 0.5 * width, "y": 0.9 * height},
        "NW": {"x": 0.633 * width, "y": 0.9 * height},
        "AI": {"x": 0.766 * width, "y": 0.9 * height},
        "AR": {"x": 0.9 * width, "y": 0.9 * height}
    }
};

function clusters() {
    if(cluster_active) {
        svg.selectAll(".textFoci").remove();

        if(cluster_activation_changed) {
            enable_checkboxes();

            cluster_activation_changed = false;
        }

        if(clusters_changed) {

            update_foci();

            clusters_changed = false;
            added = false;
            deleted = false;
        }

    } else if(cluster_activation_changed) {

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

function update_foci(){
    if(focis_order.length == 1) {
        delete foci.x;
        delete foci.y;

        foci = init_foci[focis_order[0]];
    } else if(focis_order.length == 0) {
        foci = {"x": 0.5*width, "y": 0.5*height};
    } else {
        if(added) {
            var angle = Math.random() * Math.PI() * 2;

            var to_update = init_foci[focis_order[-2]].key();

            for (var i=0; i<to_update.length; i++) {
                console.log(to_update[i] + ", ");
            }
        }
    }
}

function get_foci(d) {
    var foci_spec;

    if(cluster_active == false) {
        foci_spec = pos[d.PersonIdCode];
    } else {
        if(focis_order.length == 0) {
            foci_spec = foci;
        } else {
            for(var i=0; i<focis_order.length; i++) {
                foci_spec = foci[d[focis_order[i]]];
            }
        }
    }

    /*
    if (cluster == "council") {
        foci_spec = foci[cluster][d.CouncilAbbreviation];
    } else if (cluster == "none") {
        foci_spec = pos[d.PersonIdCode];
    } else if (cluster == "party") {
        foci_spec = foci[cluster][d.PartyAbbreviation];
    } else if (cluster == "parl_gr") {
        foci_spec = foci[cluster][d.ParlGroupAbbreviation];
    } else if (cluster == "gender") {
        foci_spec = foci[cluster][d.GenderAsString];
    } else if (cluster == "language") {
        foci_spec = foci[cluster][d.NativeLanguage];
    } else if (cluster == "age") {
        foci_spec = foci[cluster][d.AgeCategory];
    } else if (cluster == "canton") {
        foci_spec = foci[cluster][d.CantonAbbreviation];
    }*/

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

function radius_foci(radius, n) {
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

/*function update_cluster() {
 if (cluster_changed) {
 svg.selectAll(".textFoci").remove();

 if(cluster != "none") {

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

 } else {
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
 }

 cluster_changed = false;
 }
 }*/