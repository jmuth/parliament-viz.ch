// Get the clustering
var rad_cluster = document.Clustering.buttons;
var prev_cluster = null;
var cluster = "none";
var cluster_changed = false;
for(var i = 0; i < rad_cluster.length; i++) {
    rad_cluster[i].onclick = function() {
        (prev_cluster)? console.log(prev_cluster.value):null;
        if(this !== prev_cluster) {
            prev_cluster = this;
            cluster = this.value;
        }
        cluster_changed = true;
    };
}

// Get the color
var rad_color = document.Colors.buttons;
var prev_color = null;
var colorType = "none";
var color_changed = false;
for(var i = 0; i < rad_color.length; i++) {
    rad_color[i].onclick = function() {
        (prev_color)? console.log(prev_color.value):null;
        if(this !== prev_color) {
            prev_color = this;
            colorType = this.value;
        }
        color_changed = true;
    };
}

// Define some variables
var radius = 7,
    padding = 1;

// We consider that the size of the box is 960x600
var width = 960,
    height = 600,
    height_l = 64;

// Variable for node selection
var node_selected = false;

// Foci
var foci = {
    "council": {
        "CN": {"x": 0.2 * width, "y": 0.6 * height},        // Foci CN
        "CE": {"x": 0.6 * width, "y": 0.2 * height},        // Foci CE
        "CF": {"x": 0.8 * width, "y": 0.6 * height}         // Foci CF
    },
    "none": {},                                             // No Foci
    "party": {},                                            // Foci are created later
    "gender": {
        "m": {"x": 0.3*width, "y": 0.5*height},             // Foci Male
        "f": {"x": 0.7*width, "y": 0.5*height}              // Foci Female
    },
    "language": {},                                         // Foci are created later
    "age": {},                                              // Foci are created later
    "canton": {}                                            // Foci are created later
};

var nbr = {};
nbr["council"] = {};
nbr["party"] = {};
nbr["gender"] = {};
nbr["language"] = {};
nbr["age"] = {};
nbr["canton"] = {};

var texts = {};
texts["council"] = {'CN': 'National Council', 'CE': 'States Council', 'CF': 'Federal Council'};
texts["party"] = {};
texts["gender"] = {'m': 'Men', 'f': 'Women'};
texts["language"] = {};
texts["age"] = {};
texts["canton"] = {};

var variables = {};
variables["council"] = [];
variables["party"] = [];
variables["gender"] = [];
variables["language"] = [];
variables["age"] = [];
variables["canton"] = [];


// SVG for the main Viz
var svg = d3.select("div#viz")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 960 600")
        //class to make it responsive
        .classed("svg-content-responsive", true);

// Legend for the colors
var legend = d3.select("div#legend")
    .append("div")
    .classed("svg-container-legend", true) //container class to make it responsive
    .append("svg")
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 960 64")
    //class to make it responsive
    .classed("svg-content-responsive-legend", true);

// Simulation
var simulation = d3.forceSimulation().alphaDecay(0)
        .velocityDecay(0.1)
        .force("collision", d3.forceCollide().radius(radius+padding).iterations(5).strength(0.5))
    //.force("link", d3.forceLink().id(function(d) { return d.id; }))
    //.force("charge", d3.forceManyBody().strength(-2));
    //.force("center", d3.forceCenter(width / 2, height / 2));
    ;

// Read the Nodes and do stuff!
d3.json("data/active.json", function(error, graph) {
    if (error) throw error;

    var nodes = graph.nodes;

    var list_parties = [];
    var list_languages = [];
    var list_ages = [];
    var list_cantons = [];

    for(var i=0; i<nodes.length; i++) {
        nodes[i]["x"] = Math.random()*width;
        nodes[i]["y"] = Math.random()*height;
        nodes[i]["radius"] = radius;
        nodes[i]["selected"] = false;
        nodes[i]["dragged"] = false;

        // Get nbr by council
        if(!(nodes[i]["CouncilAbbreviation"] in nbr["council"])) {
            nbr["council"][nodes[i]["CouncilAbbreviation"]] = 1;
            variables["council"].push(nodes[i]["CouncilAbbreviation"]);
        } else {
            nbr["council"][nodes[i]["CouncilAbbreviation"]] += 1;
        }

        // Get nbr by party
        if(!(nodes[i]["PartyAbbreviation"] in nbr["party"])) {
            nbr["party"][nodes[i]["PartyAbbreviation"]] = 1;
            list_parties.push(nodes[i]["PartyAbbreviation"]);
            texts["party"][nodes[i]["PartyAbbreviation"]] = nodes[i]["PartyAbbreviation"];
            variables["party"].push(nodes[i]["PartyAbbreviation"]);
        } else {
            nbr["party"][nodes[i]["PartyAbbreviation"]] += 1;
        }

        // Get nbr by gender
        if(!(nodes[i]["GenderAsString"] in nbr["gender"])) {
            nbr["gender"][nodes[i]["GenderAsString"]] = 1;
            variables["gender"].push(nodes[i]["GenderAsString"]);
        } else {
            nbr["gender"][nodes[i]["GenderAsString"]] += 1;
        }

        // Get nbr by language
        if(!(nodes[i]["NativeLanguage"] in nbr["language"])) {
            nbr["language"][nodes[i]["NativeLanguage"]] = 1;
            list_languages.push(nodes[i]["NativeLanguage"]);
            var lng = nodes[i]["NativeLanguage"];
            if(lng == "F") {
                texts["language"][lng] = "French";
            } else if(lng == "I") {
                texts["language"][lng] = "Italian";
            } else if(lng == "Sk") {
                texts["language"][lng] = "Slovak";
            } else if(lng == "RM") {
                texts["language"][lng] = "Romansh";
            } else if(lng == "D") {
                texts["language"][lng] = "German";
            } else if(lng == "Tr") {
                texts["language"][lng] = "Turkish";
            }
            variables["language"].push(nodes[i]["NativeLanguage"]);

        } else {
            nbr["language"][nodes[i]["NativeLanguage"]] += 1;
        }

        // Get nbr by age
        if(!(nodes[i]["AgeCategory"] in nbr["age"])) {
            nbr["age"][nodes[i]["AgeCategory"]] = 1;
            texts["age"][nodes[i]["AgeCategory"]] = nodes[i]["AgeCategoryText"];
            variables["age"].push(nodes[i]["AgeCategory"]);
            list_ages.push(nodes[i]["AgeCategory"]);
        } else {
            nbr["age"][nodes[i]["AgeCategory"]] += 1;
        }

        // Get nbr by cantons
        if(!(nodes[i]["CantonAbbreviation"] in nbr["canton"])) {
            nbr["canton"][nodes[i]["CantonAbbreviation"]] = 1;
            texts["canton"][nodes[i]["CantonAbbreviation"]] = nodes[i]["CantonAbbreviation"];
            variables["canton"].push(nodes[i]["CantonAbbreviation"]);
            list_cantons.push(nodes[i]["CantonAbbreviation"]);
        } else {
            nbr["canton"][nodes[i]["CantonAbbreviation"]] += 1;
        }
    }

    // Create Foci for parties
    shuffle(list_parties);

    for(var i=0; i<list_parties.length; i++) {
        foci["party"][list_parties[i]] = {"x": (i+1)/(list_parties.length+1)*width, "y": (Math.pow(-1, i)*0.2 + 0.6)*height};
    }

    // Create Foci for languages
    shuffle(list_languages);

    for(var i=0; i<list_languages.length; i++) {
        foci["language"][list_languages[i]] = {"x": (i+1)/(list_languages.length+1)*width, "y": (Math.pow(-1, i)*0.25 + 0.5)*height};
    }

    list_ages.sort();
    variables["age"].sort();

    // Create Foci for age
    for(var i=0; i<list_ages.length; i++) {
        foci["age"][list_ages[i]] = {"x": (i+1)/(list_ages.length+1)*width, "y": (Math.pow(-1, i)*0.2 + 0.6)*height};
    }

    // Create Foci for canton
    shuffle(list_cantons);

    for(var i=0; i<list_cantons.length; i++) {
        var yy = 0;
        var xx = 0;

        if (i<9) {
            yy = 1/4*height;
            xx = (i+1)/10*width;
        } else if (i<17) {
            yy = 1/2*height;
            xx = (i-8)/9*width;
        } else {
            yy = 3/4*height;
            xx = (i-16)/10*width;
        }

        foci["canton"][list_cantons[i]] = {"x": xx, "y": yy};
    }

    // Create array of foci
    var array_foci = {};
    for(var key1 in foci) {
        if(key1 != "none") {
            array_foci[key1] = []
            for (var key in foci[key1]) {
                var json = {}
                json["cx"] = foci[key1][key]["x"];
                json["cy"] = foci[key1][key]["y"];
                json["key"] = key;

                array_foci[key1].push(json);
            }
        }
    }

    var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "dataNodes")
            .attr("r", radius)
            .attr("fill", function(d) { return color(colorType, d);})
            .attr("desc", false)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("mouseover", emphasis)
            .on("click", clicked)
        ;

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked)
    ;

    svg.on("dblclick", dbclick);

    function ticked() {
        /*link
         .attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });*/

        update_cluster();

        update_color();

        node
            .each(gravity())
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function emphasis(d) {
        if (node_selected == false) {
            d3.selectAll(".dataNodes").style("r", radius);
            d3.select(this).style("r", 1.5 * radius);
            document.getElementById("councilorName").innerHTML = d.FirstName + " " + d.LastName;
            document.getElementById("councilorParty").innerHTML = d.PartyName;
            document.getElementById("councilorCouncil").innerHTML = d.CouncilName;
            document.getElementById("councilorBirthday").innerHTML = d.DateOfBirth;
            document.getElementById("councilorAge").innerHTML = d.age;
            document.getElementById("councilorCanton").innerHTML = d.CantonName;
            document.getElementById("councilorLanguage").innerHTML = d.NativeLanguage;
            document.getElementById("councilorImage").src = "data/portraits/" + d.PersonIdCode + ".jpg";
            document.getElementById("councilorImage").alt = d.FirstName + " " + d.LastName;
        }
    }

    // Simple click on node
    function clicked(d) {
        var node = d3.select(this);

        if(d.selected == false) {
            d3.selectAll(".dataNodes")
                .style("r", radius)
                .style("stroke", function(o,i) {
                    if(nodes[i].dragged == false) {
                        return null;
                    } else {
                        return color(colorType, getValForColor(colorType, nodes[i]));
                    }
                })
                .style("fill", function(o,i) {
                    if(nodes[i].dragged == false) {
                        return color(colorType, getValForColor(colorType, nodes[i]));
                    } else {
                        return "black";
                    }
                })
                ;

            node.style("r", 1.5*radius)
                .style("stroke", function(d) {
                    if (d.dragged == true) {
                        return color(colorType, getValForColor(colorType, d));
                    } else {
                        return "#D3D3D3"
                    }
                })
                .style("fill", function(d) {
                    if (d.dragged == false) {
                        return color(colorType, getValForColor(colorType, d));
                    } else {
                        return "#D3D3D3"
                    }
                })
                .style("stroke-width", 3);

            d3.selectAll(".dataNodes").style("r", radius);
            d3.select(this).style("r", 1.5 * radius);
            document.getElementById("councilorName").innerHTML = d.FirstName + " " + d.LastName;
            document.getElementById("councilorParty").innerHTML = d.PartyName;
            document.getElementById("councilorCouncil").innerHTML = d.CouncilName;
            document.getElementById("councilorBirthday").innerHTML = d.DateOfBirth;
            document.getElementById("councilorAge").innerHTML = d.age;
            document.getElementById("councilorCanton").innerHTML = d.CantonName;
            document.getElementById("councilorLanguage").innerHTML = d.NativeLanguage;
            document.getElementById("councilorImage").src = "data/portraits/" + d.PersonIdCode + ".jpg";
            document.getElementById("councilorImage").alt = d.FirstName + " " + d.LastName;

            for(var i=0; i<nodes.length; i++) {
                nodes[i].selected = false;
            }

            d.selected = true;
            node_selected = true;

        } else {
            node.style("r", radius)
                .style("stroke", function(d) {
                    if(d.dragged == true) {
                        return color(colorType, getValForColor(colorType, d));
                    } else {
                        return null;
                    }
                })
                .style("fill", function(d) {
                    if(d.dragged == true) {
                        return "black";
                    } else {
                        return color(colorType, getValForColor(colorType, d));
                    }
                });

            d.selected = false;
            node_selected = false;
        }

    }

    // Double click on window
    function dbclick() {

        var nslctd = -1;
        // Put force back to null
        nodes.forEach(function(o,i) {
            o.fx = null;
            o.fy = null;
            o.dragged = false;
        });

        // Change stroke back to white
        node
            .style("fill", function(o,i) {
                return color(colorType, getValForColor(colorType, nodes[i]));
            })
            .style("stroke", function(o,i) {
                if(nodes[i].selected == false) {
                    return null;
                } else {
                    return "#D3D3D3";
                }
            })
            .style("stroke-width", function(o,i) {
                if(nodes[i].selected == false) {
                    return 0;
                } else {
                    return 3;
                }
            })
            ;
    }

    // Triple click on window
    window.addEventListener('click', function (evt) {
        if (evt.detail === 3) {
            nodes.forEach(function(o, i) {
                o.x = get_foci(o).x;
                o.y = get_foci(o).y;
            });
        }
    });

    function update_color() {
        if (color_changed) {

            // Change the color
            d3.selectAll(".dataNodes")
                .style("fill", function(d) {
                    if (d.dragged == true && d.selected == true) {
                        return "#D3D3D3";
                    } else if (d.dragged == true && d.selected == false) {
                        return "black";
                    } else if (d.dragged == false && d.selected == true) {
                        return color(colorType, getValForColor(colorType, d));
                    } else {
                        return color(colorType, getValForColor(colorType, d));
                    }
                })
                .style("stroke", function(d) {
                    if (d.dragged == true && d.selected == true) {
                        return color(colorType, getValForColor(colorType, d));
                    } else if (d.dragged == true && d.selected == false) {
                        return color(colorType, getValForColor(colorType, d));
                    } else if (d.dragged == false && d.selected == true) {
                        return "#D3D3D3";
                    } else {
                        return null;
                    }
                });

            // Change the legend
            legend.selectAll(".circleLegend").remove();
            legend.selectAll(".textLegend").remove();

            if(colorType != "none") {

                var start = 20;
                var dx_text = 10;

                console.log(variables["party"].length);

                legend.selectAll("circle")
                    .data(variables[colorType])
                    .enter().append("circle")
                    .attr("class", "circleLegend")
                    .attr("cx", function (o, i) {
                        if(colorType == "party") {
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
                        if(colorType == "party") {
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
                        if(colorType == "party") {
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
                        if(colorType == "party") {
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
                    .attr("fill", "white")
                    .attr("dominant-baseline", "central");
            }
            color_changed = false;
        }
    }

    function update_cluster() {
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
                    .attr("font-size", "18px")
                    .attr("font-weight", "bold")
                    .attr("text-anchor", "middle")
                    .attr("fill", "white")
                    .attr("dominant-baseline", "central");

                cluster_changed = false;
            }

        }
    }

});

function getValForColor(colorType, node) {
    if (colorType == "none") {
        return "0";
    } else if(colorType == "party") {
        return node.PartyAbbreviation;
    } else if(colorType == "gender") {
        return node.GenderAsString;
    } else if(colorType == "council") {
        return node.CouncilAbbreviation;
    } else if(colorType == "language") {
        return node.NativeLanguage;
    } else if(colorType == "age") {
        return node.AgeCategoryText;
    } else if(colorType == "canton") {
        return node.cantonAbbreviation;
    }
}

function color(colorType, val) {
    if (colorType == "none") {
        return "#FFFFFF";
    } else if(colorType == "party") {
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
    } else if(colorType == "council") {
        if (val == "CN") {
            return "#ff1c14";
        } else if (val == "CE") {
            return "#3b5998";
        } else if (val == "CF") {
            return "#2ea52a";
        }
    } else if(colorType == "gender") {
        if (val == "m") {
            return "#00FFFF";
        } else if (val == "f") {
            return "#FF69B4";
        }
    } else if(colorType == "language") {
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
    } else if(colorType == "age") {
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

function get_foci(d) {
    var foci_spec;

    if (cluster == "council") {
        foci_spec = foci[cluster][d.CouncilAbbreviation];
    } else if (cluster == "none") {
        // Find a way such that the points goes to a random location
        foci_spec = d;
    } else if (cluster == "party") {
        foci_spec = foci[cluster][d.PartyAbbreviation];
    } else if (cluster == "gender") {
        foci_spec = foci[cluster][d.GenderAsString];
    } else if (cluster == "language") {
        foci_spec = foci[cluster][d.NativeLanguage];
    } else if (cluster == "age") {
        foci_spec = foci[cluster][d.AgeCategory];
    } else if (cluster == "canton") {
        foci_spec = foci[cluster][d.CantonAbbreviation];
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



        alpha = 0.05;

        var dx = foci_x - d.x;
        var dy = foci_y - d.y;

        d.x += dx*alpha;
        d.y += dy*alpha;
    };
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.1).restart();
}

function dragged(d) {
    d3.select(this)
        .style("fill", function(d) {
            if (d.selected == true) {
                return "#D3D3D3";
            } else {
                return "black";
            }
        })
        .style("stroke", color(colorType,getValForColor(colorType, d)))
        .style("stroke-width", 3)
    ;
    d.dragged = true;
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
}

function shuffle(a) {
    for (var i = a.length; i; i--) {
        var j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
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
