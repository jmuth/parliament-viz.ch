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
    height = 600;

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
    "language": {}                                          // Foci are created later
};

var nbr = {};
nbr["council"] = {};
nbr["party"] = {};
nbr["gender"] = {};
nbr["language"] = {};

var texts = {}
texts["council"] = {'CN': 'National Council', 'CE': 'States Council', 'CF': 'Federal Council'};
texts["party"] = {};
texts["gender"] = {'m': 'Men', 'f': 'Women'};
texts["language"] = {};

var svg = d3.select("div#viz")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 960 600")
        //class to make it responsive
        .classed("svg-content-responsive", true);

var simulation = d3.forceSimulation().alphaDecay(0)
        .velocityDecay(0.1)
        .force("collision", d3.forceCollide().radius(radius+2*padding).iterations(2))
    //.force("link", d3.forceLink().id(function(d) { return d.id; }))
    //.force("charge", d3.forceManyBody().strength(-2));
    //.force("center", d3.forceCenter(width / 2, height / 2));
    ;

d3.json("data/active.json", function(error, graph) {
    if (error) throw error;

    var nodes = graph.nodes;

    var list_parties = [];
    var list_languages = [];

    for(var i=0; i<nodes.length; i++) {
        nodes[i]["x"] = Math.random()*width;
        nodes[i]["y"] = Math.random()*height;
        nodes[i]["radius"] = radius;

        // Get nbr by council
        if(!(nodes[i]["CouncilAbbreviation"] in nbr["council"])) {
            nbr["council"][nodes[i]["CouncilAbbreviation"]] = 1;
        } else {
            nbr["council"][nodes[i]["CouncilAbbreviation"]] += 1;
        }

        // Get nbr by party
        if(!(nodes[i]["PartyAbbreviation"] in nbr["party"])) {
            nbr["party"][nodes[i]["PartyAbbreviation"]] = 1;
            list_parties.push(nodes[i]["PartyAbbreviation"]);
            texts["party"][nodes[i]["PartyAbbreviation"]] = nodes[i]["PartyAbbreviation"];
        } else {
            nbr["party"][nodes[i]["PartyAbbreviation"]] += 1;
        }

        // Get nbr by gender
        if(!(nodes[i]["GenderAsString"] in nbr["gender"])) {
            nbr["gender"][nodes[i]["GenderAsString"]] = 1;
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
        } else {
            nbr["language"][nodes[i]["NativeLanguage"]] += 1;
        }
    }

    // Create Foci for parties
    shuffle(list_parties);

    for(var i=0; i<list_parties.length; i++) {
        foci["party"][list_parties[i]] = {"x": (i+1)/(list_parties.length+1)*width, "y": (Math.pow(-1, i)*0.25 + 0.5)*height};
    }

    // Create Foci for languages
    shuffle(list_languages);

    for(var i=0; i<list_languages.length; i++) {
        foci["language"][list_languages[i]] = {"x": (i+1)/(list_languages.length+1)*width, "y": (Math.pow(-1, i)*0.25 + 0.5)*height};
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
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("mouseover", emphasis)
            .on("mouseout", back_to_normal)
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

        update_cluster(cluster_changed);

        update_color(color_changed);

        node
            .each(gravity())
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function emphasis(d) {
        d3.selectAll(".dataNodes").style("r", radius);
        d3.select(this).style("r", 1.5*radius);
        document.getElementById("councilorName").innerHTML = d.FirstName + " " + d.LastName;
        document.getElementById("councilorParty").innerHTML = d.PartyName;
        document.getElementById("councilorCouncil").innerHTML = d.CouncilName;
        document.getElementById("councilorBirthday").innerHTML = d.DateOfBirth;
        document.getElementById("councilorLanguage").innerHTML = d.NativeLanguage;
        document.getElementById("councilorImage").src = "data/portraits/" + d.PersonIdCode + ".jpg";
        document.getElementById("councilorImage").alt = d.FirstName + " " + d.LastName;
    }

    window.addEventListener('click', function (evt) {
        if (evt.detail === 3) {
            nodes.forEach(function(o, i) {
                o.x += (Math.random() - .5) * 40;
                o.y += (Math.random() - .5) * 40;
            });
        }
    });

    function back_to_normal(d) {
        //d3.select(this).style("r", radius);
    }

    function dbclick() {
        // Put force back to null
        nodes.forEach(function(o,i) {
            o.fx = null;
            o.fy = null;
        });

        // Change stroke back to white
        node.style("stroke", null);
    }

    function update_color(color_changed) {
        if (color_changed) {

            d3.selectAll(".dataNodes").style("fill", function(d) { return color(colorType, d);});

            color_changed = false;
        }
    }

    function update_cluster(cluster_changed) {
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
                    .attr("text-anchor", "middle");

                cluster_changed = false;
            }

        }
    }

});

function color(colorType, node) {
    if (colorType == "none") {
        return "#000000";
    } else if(colorType == "party") {
        var abbrev = node.PartyAbbreviation;
        if (abbrev == 'PLD') {
            return '#3131BD'
        } else if (abbrev == 'UDC') {
            return '#088A4B'
        } else if (abbrev == 'PSS') {
            return '#FA1360'
        } else if (abbrev == 'PDC') {
            return '#FE9A2E'
        } else if (abbrev == 'PLR') {
            return '#0174DF'
        } else if (abbrev == 'PES') {
            return '#01DF01'
        } else if (abbrev == 'pvl') {
            return '#9AFE2E'
        } else if (abbrev == 'PBD') {
            return '#FFFF00'
        } else if (abbrev == 'PEV') {
            return '#FFD735'
        } else if (abbrev == 'Lega') {
            return '#0B3861'
        } else if (abbrev == 'csp-ow') {
            return '#E2563B'
        } else if (abbrev == '-') {
            return '#CCCCCC'
        } else if (abbrev == 'MCG') {
            return '#FECC01'
        } else if (abbrev == 'BastA') {
            return '#DFDE00'
        }  else if (abbrev == 'PdT') {
            return '#FF0000'
        }
    } else if(colorType == "council") {
        var cncil = node.CouncilAbbreviation;
        if (cncil == "CN") {
            return "#ff1c14";
        } else if (cncil == "CE") {
            return "#3b5998";
        } else if (cncil == "CF") {
            return "#2ea52a";
        }
    } else if(colorType == "gender") {
        var gndr = node.GenderAsString;
        if (gndr == "m") {
            return "#89CFF0";
        } else if (gndr == "f") {
            return "#F4C2C2";
        }
    } else if(colorType == "language") {
        var lng = node.NativeLanguage;
        if (lng == "I") {
            return "#009246";
        } else if (lng == "D") {
            return "#FFCC1E";
        } else if (lng == "F") {
            return "#002395";
        } else if (lng == "Tr") {
            return "#E30A17";
        } else if (lng == "Sk") {
            return "#489DD3";
        } else if (lng == "RM") {
            return "#E2017B";
        }
    }
}

// Move nodes toward cluster focus.
function gravity() {
    return function(d) {
        var alpha,
            foci_x,
            foci_y;

        if(cluster == "council") {
            foci_x = foci[cluster][d.CouncilAbbreviation].x;
            foci_y = foci[cluster][d.CouncilAbbreviation].y;
        } else if (cluster == "none") {
            // Find a way such that the points goes to a random location
            foci_x = d.x;
            foci_y = d.y;
        } else if (cluster == "party") {
            foci_x = foci[cluster][d.PartyAbbreviation].x;
            foci_y = foci[cluster][d.PartyAbbreviation].y;
        } else if (cluster == "gender") {
            foci_x = foci[cluster][d.GenderAsString].x;
            foci_y = foci[cluster][d.GenderAsString].y;
        } else if (cluster == "language") {
            foci_x = foci[cluster][d.NativeLanguage].x;
            foci_y = foci[cluster][d.NativeLanguage].y;
        }
        alpha = 0.05;
        d.y += (foci_y - d.y) * alpha;
        d.x += (foci_x - d.x) * alpha;
    };
}

function dragstarted(d) {
    d3.select(this).style("stroke", "black");
    if (!d3.event.active) simulation.alphaTarget(0.1).restart();
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    d3.select(this).style("stroke", "black");
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
    } else if (n<=37) {
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
        ratio = 26;
    } else {
        ratio = 29;
    }

    return radius*ratio;
}
