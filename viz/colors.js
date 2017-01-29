/////////////////////////////////////////////////////////////////////
//                                                                 //
//  This file contains the functions to update the colors when     //
//  a color is changed.                                            //
//  The legend, the nodes and the friends have to be updated.      //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Main function to update the colors
function update_color() {

    // First, we check if the color has changed
    if (color_changed) {

        // We update the color of all the nodes
        d3.selectAll(".dataNodes")
            .style("fill", function (d) {
                return color(colorType, d[colorType]);
            })
            .style("stroke", function (d) {
                if (d.selected == true) { //If a node is selected, its stroke is in black
                    return "#000000";
                } else {
                    return color(colorType, d[colorType]);
                }
            });

        // If the node_id is not null, i.e. a node has already been selected,
        // We update the friends, i.e. their color. But we redraw everything. =)
        if(node_id != null) {
            showFriends(node_id);
        }
    }

    // Now, we get a bit more permissive. The purpose here is to update the legend.
    // We will update the legend for two cases:
    //      1. The color has changed
    //      2. A council has been added/removed
    if(color_changed || national_changed || states_changed || federal_changed) {

        // Update the legend
        draw_legend();

        color_changed = false;
    }
}

// Function to write the legend
function draw_legend() {
    // Delete everything
    legend.selectAll(".circleLegend").remove();
    legend.selectAll(".textLegend").remove();

    // Some variables
    var start = 20;
    var dx_text = 10;

    // We draw the circles for the legend
    // For the legend on the parties or on the parl. group, we need to draw the circles
    // on two levels (too many different points)
    legend.selectAll("circle")
        .data(variables[colorType])
        .enter().append("circle")
        .attr("class", "circleLegend")
        // x position
        .attr("cx", function (o, i) {
            if(colorType == "PartyAbbreviation" || colorType == "ParlGroupAbbreviation") {
                var half = Math.round(variables[colorType].length/2);
                var incr = (width-start)/(half);
                if(i<half) {
                    return incr * (i) + start;
                } else {
                    return incr * (i-half) + start;
                }
            } else {
                var incr = (width-start)/(variables[colorType].length);
                return incr * (i) + start;
            }
        })
        // Y position
        .attr("cy", function(o,i) {
            if(colorType == "PartyAbbreviation"|| colorType == "ParlGroupAbbreviation") {
                if(i<variables[colorType].length/2) {
                    return height_legend / 4;
                } else {
                    return 3*height_legend / 4;
                }
            } else {
                return height_legend / 4;
            }
        })
        .attr("r", radius)
        .attr("fill", function (o, i) {
            return color(colorType, variables[colorType][i]);
        })

    // Draw the text.
    // Same for parties and parl. groups, the texts is shown on two levels.
    legend.selectAll("text")
        .data(variables[colorType])
        .enter().append("text")
        .attr("class", "textLegend")
        // X position
        .attr("x", function(o,i) {
            if(colorType == "PartyAbbreviation" || colorType == "ParlGroupAbbreviation") {
                var half = Math.round(variables[colorType].length/2);
                var incr = (width-start)/(half);
                if(i<half) {
                    return incr * (i) + start + dx_text;
                } else {
                    return incr * (i-half) + start + dx_text;
                }
            } else {
                var incr = (width-start)/(variables[colorType].length);
                return incr * (i) + start + dx_text;
            }
        })
        // Y position
        .attr("y", function(o,i) {
            if(colorType == "PartyAbbreviation" || colorType == "ParlGroupAbbreviation") {
                if(i<variables[colorType].length/2) {
                    return height_legend / 4;
                } else {
                    return 3*height_legend / 4;
                }
            } else {
                return height_legend / 4;
            }
        })
        // Text
        .text(function (o, i) {
            // Text is given by the type of color and the number of nodes concerned by this color.
            // The number of nodes is different dependending on the councils the user want.
            var nn = 0;

            if(national) {
                nn += nbr[colorType][variables[colorType][i]]["CN"];
            }

            if(states) {
                nn += nbr[colorType][variables[colorType][i]]["CE"];
            }

            if(federal) {
                nn += nbr[colorType][variables[colorType][i]]["CF"];
            }
            return texts[colorType][variables[colorType][i]] + " (" + nn + ")";
        })
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .attr("fill", "#808080")
        .attr("dominant-baseline", "central");
}

// Return the color in function of the type of and the value given
function color(colorType, val) {

    // Colors for the parties
    if(colorType == "PartyAbbreviation") {
        if (val == 'PLD') {
            return '#3131BD'
        } else if (val == 'UDC') {
            return '#088A4B'
        } else if (val == 'PSS') {
            return '#FA1360'
        } else if (val == 'PDC') {
            return '#FE9A2E'
        } else if (val == 'PLR') {
            return '#0174DF'
        } else if (val == 'PES') {
            return '#01DF01'
        } else if (val == 'pvl') {
            return '#9AFE2E'
        } else if (val == 'PBD') {
            return '#FFFF00'
        } else if (val == 'PEV') {
            return '#FFD735'
        } else if (val == 'Lega') {
            return '#0B3861'
        } else if (val == 'csp-ow') {
            return '#E2563B'
        } else if (val == '-') {
            return '#CCCCCC'
        } else if (val == 'MCG') {
            return '#FECC01'
        } else if (val == 'BastA') {
            return '#DFDE00'
        }  else if (val == 'PdT') {
            return '#FF0000'
        }
    // Color for the Parl groups
    } else if(colorType == "ParlGroupAbbreviation") {
        if(val == "NaN") {
            return '#CCCCCC'
        } else if (val == "GL") {
            return '#9AFE2E'
        } else if (val == "BD") {
            return '#FFFF00'
        } else if (val == "C") {
            return '#FE9A2E'
        } else if (val == "S") {
            return '#FA1360'
        } else if (val == "G") {
            return '#01DF01'
        } else if (val == "RL") {
            return '#0174DF'
        } else if (val == "V") {
            return '#088A4B'
        }
    // Colors for the councils
    } else if(colorType == "CouncilAbbreviation") {
        if (val == "CN") {
            return "#ff1c14";
        } else if (val == "CE") {
            return "#3b5998";
        } else if (val == "CF") {
            return "#2ea52a";
        }
    // Colors for the genders
    } else if(colorType == "GenderAsString") {
        if (val == "m") {
            return "#00FFFF";
        } else if (val == "f") {
            return "#FF69B4";
        }
    // Colors for the Native languages
    } else if(colorType == "NativeLanguage") {
        if (val == "I") {
            return "#009246";
        } else if (val == "D") {
            return "#FFCC1E";
        } else if (val == "F") {
            return "#002395";
        } else if (val == "Tr") {
            return "#E30A17";
        } else if (val == "Sk") {
            return "#489DD3";
        } else if (val == "RM") {
            return "#E2017B";
        }
    // Colors for the Age Category
    } else if(colorType == "AgeCategory") {
        if (val == 0 || val == "-20") {
            return "#a65628";
        } else if (val == 1 || val == "20-29") {
            return "#b3b000";
        } else if (val == 2 || val == "30-39") {
            return "#81b300";
        } else if (val == 3 || val == "40-49") {
            return "#00b399";
        } else if (val == 4 || val == "50-59") {
            return "#0087b3";
        } else if (val == 5 || val == "60-69") {
            return "#0060b3";
        } else if (val == 6 || val == "70+") {
            return "#0003ff";
        }
    }
}