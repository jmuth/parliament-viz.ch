function update_color() {
    if (color_changed) {

        // Change the color
        d3.selectAll(".dataNodes")
            .style("fill", function(d) {
                return color(colorType, getValForColor(colorType, d));
            })
            .style("stroke", function(d) {
                if (d.selected == true) {
                    return "#000000";
                } else {
                    return color(colorType, getValForColor(colorType, d));
                }
            });

        // Change the legend
        legend.selectAll(".circleLegend").remove();
        legend.selectAll(".textLegend").remove();


        var start = 20;
        var dx_text = 10;

        console.log(colorType);

        legend.selectAll("circle")
            .data(variables[colorType])
            .enter().append("circle")
            .attr("class", "circleLegend")
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
            .attr("cy", function(o,i) {
                if(colorType == "PartyAbbreviation"|| colorType == "ParlGroupAbbreviation") {
                    if(i<variables[colorType].length/2) {
                        return height_l / 4;
                    } else {
                        return 3*height_l / 4;
                    }
                } else {
                    return height_l / 4;
                }
            })
            .attr("r", radius)
            .attr("fill", function (o, i) {
                return color(colorType, variables[colorType][i]);
            })

        legend.selectAll("text")
            .data(variables[colorType])
            .enter().append("text")
            .attr("class", "textLegend")
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
            .attr("y", function(o,i) {
                if(colorType == "PartyAbbreviation" || colorType == "ParlGroupAbbreviation") {
                    if(i<variables[colorType].length/2) {
                        return height_l / 4;
                    } else {
                        return 3*height_l / 4;
                    }
                } else {
                    return height_l / 4;
                }
            })
            .text(function (o, i) {
                return texts[colorType][variables[colorType][i]] + " (" + nbr[colorType][variables[colorType][i]] + ")";
            })
            .attr("font-weight", "bold")
            .attr("font-size", "14px")
            .attr("fill", "#808080")
            .attr("dominant-baseline", "central");

        if(node_id != null) {
            showFriends(node_id);
        }
        color_changed = false;
    }
}

function getValForColor(colorType, node) {
    return node[colorType];
}

function color(colorType, val) {
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
    } else if(colorType == "CouncilAbbreviation") {
        if (val == "CN") {
            return "#ff1c14";
        } else if (val == "CE") {
            return "#3b5998";
        } else if (val == "CF") {
            return "#2ea52a";
        }
    } else if(colorType == "GenderAsString") {
        if (val == "m") {
            return "#00FFFF";
        } else if (val == "f") {
            return "#FF69B4";
        }
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
    } else if(colorType == "AgeCategory") {
        if (val == 0 || val == "-20") {
            return "#a65628";
        } else if (val == 1 || val == "20-29") {
            return "#e41a1c";
        } else if (val == 2 || val == "30-39") {
            return "#377eb8";
        } else if (val == 3 || val == "40-49") {
            return "#4daf4a";
        } else if (val == 4 || val == "50-59") {
            return "#984ea3";
        } else if (val == 5 || val == "60-69") {
            return "#ff7f00";
        } else if (val == 6 || val == "70+") {
            return "#ffff33";
        }
    }
}