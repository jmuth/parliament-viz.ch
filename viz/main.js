// Define some variables
var radius = 6,
    padding = 1;

// We consider that the size of the box is 960x600
var width = 737,
    height = 600,
    height_l = 64;

// Variable for node selection
var node_selected = false;
var node_id = null;

var dragging = false;

var texts = {};
texts["CouncilAbbreviation"] = {'CN': 'National Council', 'CE': 'Council of States', 'CF': 'Federal Council'};
texts["PartyAbbreviation"] = {};
texts["ParlGroupAbbreviation"] = {'NaN': 'Federal Council', "GL": "Grp. Vert'Libéral", "BD": "Grp. BD", "C": "Grp. PDC", "S": "Grp. Socialiste", "G": "Grp. des Verts", "RL": "Grp. LR", "V": "Grp. UDC"};
texts["GenderAsString"] = {'m': 'Men', 'f': 'Women'};
texts["NativeLanguage"] = {"F": "French", "I": "Italian", "Sk": "Slovak", "RM": "Romansh", "D": "German", "Tr": "Turkish"};
texts["AgeCategory"] = {};
texts["CantonAbbreviation"] = {};

var nbr = {};
nbr["CouncilAbbreviation"] = {};
nbr["PartyAbbreviation"] = {};
nbr["ParlGroupAbbreviation"] = {};
nbr["GenderAsString"] = {};
nbr["NativeLanguage"] = {};
nbr["AgeCategory"] = {};
nbr["CantonAbbreviation"] = {};

var variables = {};
variables["CouncilAbbreviation"] = [];
variables["PartyAbbreviation"] = [];
variables["ParlGroupAbbreviation"] = [];
variables["GenderAsString"] = [];
variables["NativeLanguage"] = [];
variables["AgeCategory"] = [];
variables["CantonAbbreviation"] = [];

// SVG for the main Viz
var svg = d3.select("div#viz")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 737 600")
        //class to make it responsive
        .classed("svg-content-responsive", true);

// Legend for the colors
var legend = d3.select("div#legend")
    .append("div")
    .classed("svg-container-legend", true) //container class to make it responsive
    .append("svg")
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 737 64")
    //class to make it responsive
    .classed("svg-content-responsive-legend", true);


// Prepare the Bar Graph
var bGMargin = {top: 10, right: 10, bottom: 10, left: 30};

var barGraph = d3.select("#int_graph")
    .append("g")
    .attr("transform", "translate(" + bGMargin.left + "," + bGMargin.top + ")");

// Prepare the Bar Graph for the interests
var interestsBarGraph = d3.select('#themes')
    .append("g")
    .attr("transform", "translate(" + bGMargin.left + "," + bGMargin.top + ")");

// Prepare the Bar Graph for the interests
var interestsBarGraph_second = d3.select('#themes')
    .append("g")
    .attr("transform", "translate(" + bGMargin.left + "," + bGMargin.top + ")");

var barWidth = 390 - bGMargin.left - bGMargin.right,
    barHeight = 105 - bGMargin.top - bGMargin.bottom;

// Prepare the Friends
var svgFriends = d3.select('#friends'),
    gFriends = svgFriends.append('g');

// Prepare the autocomplete
var compCounc = document.getElementById("compCouncilors");

// Simulation
var simulation = d3.forceSimulation().alphaDecay(0)
        .velocityDecay(0.1)
        .force("collision", d3.forceCollide().radius(radius+padding).iterations(5).strength(0.5))
    //.force("link", d3.forceLink().id(function(d) { return d.id; }))
    //.force("charge", d3.forceManyBody().strength(-2));
    //.force("center", d3.forceCenter(width / 2, height / 2));
    ;

// Define different functions used to import
// useful stuff

var pos;
function importPositions(json) {
    $.getJSON(json, function(d) {
        pos = d;
    })
}

var adj;
function importAdj(json) {
    $.getJSON(json, function(d) {
        adj =  d;
    });
};

var interests;
function importInterests(json) {
    $.getJSON(json, function(d) {
        interests =  d;
    });
};

var authors;
function importAuthors(json) {
    $.getJSON(json, function(d) {
        authors =  d;
    });
};

var adj_cosign;
function importAdjCosign(json) {
    $.getJSON(json, function(d) {
        adj_cosign = d;
    })
}

var ints;
function importInts(json) {
    $.getJSON(json, function(d) {
        ints = d;
    });
}

var people;
function importPeople(json) {
    $.getJSON(json, function(d) {
        people = d;
    });
}

var friends;
function importFriends(json) {
    $.getJSON(json, function(d) {
        friends = d;
    });
}

var friends_cosign;
function importFriendsCosign(json) {
    $.getJSON(json, function(d) {
        friends_cosign = d;
    });
}

importPositions('data/positions.json');
importAdj('data/adj.json');
importInts('data/interventions.json');
importPeople('data/people.json');
importFriends('data/friends.json');
importAdjCosign('data/adj_cosign.json');
importFriendsCosign('data/friends_cosign.json');
importInterests('data/interests.json');
importAuthors('data/authors.json');

var nodes;
var node;
// Read the Nodes and do stuff!
d3.json("data/active.json", function(error, graph) {
    if (error) throw error;

    for(var key in pos) {
        pos[key]["x"] = pos[key]["x"]*width;
        pos[key]["y"] = pos[key]["y"]*height;

    }

    nodes = graph.nodes;

    var list_councilors = [];

    for(var i=0; i<nodes.length; i++) {
        nodes[i]["x"] = pos[nodes[i]["PersonIdCode"]]["x"];
        nodes[i]["y"] = pos[nodes[i]["PersonIdCode"]]["y"];
        nodes[i]["radius"] = radius;
        nodes[i]["selected"] = false;
        nodes[i]["dragged"] = false;

        list_councilors.push(nodes[i]["FirstName"] + " " + nodes[i]["LastName"]);

        // Get nbr by council
        if(!(nodes[i]["CouncilAbbreviation"] in nbr["CouncilAbbreviation"])) {
            var jj = {};
            jj["CN"] = 0;
            jj["CE"] = 0;
            jj["CF"] = 0;
            nbr["CouncilAbbreviation"][nodes[i]["CouncilAbbreviation"]] = jj;
            variables["CouncilAbbreviation"].push(nodes[i]["CouncilAbbreviation"]);
        }
        nbr["CouncilAbbreviation"][nodes[i]["CouncilAbbreviation"]][nodes[i]["CouncilAbbreviation"]] += 1;

        // Get nbr by party
        if(!(nodes[i]["PartyAbbreviation"] in nbr["PartyAbbreviation"])) {
            var jj = {};
            jj["CN"] = 0;
            jj["CE"] = 0;
            jj["CF"] = 0;
            nbr["PartyAbbreviation"][nodes[i]["PartyAbbreviation"]] = jj;
            texts["PartyAbbreviation"][nodes[i]["PartyAbbreviation"]] = nodes[i]["PartyAbbreviation"];
            variables["PartyAbbreviation"].push(nodes[i]["PartyAbbreviation"]);
        }
        nbr["PartyAbbreviation"][nodes[i]["PartyAbbreviation"]][nodes[i]["CouncilAbbreviation"]] += 1;

        // Get nbr by parl group
        if(!(nodes[i]["ParlGroupAbbreviation"] in nbr["ParlGroupAbbreviation"])) {
            var jj = {};
            jj["CN"] = 0;
            jj["CE"] = 0;
            jj["CF"] = 0;
            nbr["ParlGroupAbbreviation"][nodes[i]["ParlGroupAbbreviation"]] = jj;
            variables["ParlGroupAbbreviation"].push(nodes[i]["ParlGroupAbbreviation"]);
        }
        nbr["ParlGroupAbbreviation"][nodes[i]["ParlGroupAbbreviation"]][nodes[i]["CouncilAbbreviation"]] += 1;

        // Get nbr by gender
        if(!(nodes[i]["GenderAsString"] in nbr["GenderAsString"])) {
            var jj = {};
            jj["CN"] = 0;
            jj["CE"] = 0;
            jj["CF"] = 0;
            nbr["GenderAsString"][nodes[i]["GenderAsString"]] = jj;
            variables["GenderAsString"].push(nodes[i]["GenderAsString"]);
        }
        nbr["GenderAsString"][nodes[i]["GenderAsString"]][nodes[i]["CouncilAbbreviation"]] += 1;

        // Get nbr by language
        if(!(nodes[i]["NativeLanguage"] in nbr["NativeLanguage"])) {
            var jj = {};
            jj["CN"] = 0;
            jj["CE"] = 0;
            jj["CF"] = 0;
            nbr["NativeLanguage"][nodes[i]["NativeLanguage"]] = jj;
            variables["NativeLanguage"].push(nodes[i]["NativeLanguage"]);
        }
        nbr["NativeLanguage"][nodes[i]["NativeLanguage"]][nodes[i]["CouncilAbbreviation"]] += 1;

        // Get nbr by age
        if(!(nodes[i]["AgeCategory"] in nbr["AgeCategory"])) {
            nbr["AgeCategory"][nodes[i]["AgeCategory"]] = 1;
            texts["AgeCategory"][nodes[i]["AgeCategory"]] = nodes[i]["AgeCategoryText"];
            variables["AgeCategory"].push(nodes[i]["AgeCategory"]);
        } else {
            nbr["AgeCategory"][nodes[i]["AgeCategory"]][nodes[i]["CouncilAbbreviation"]] += 1;
        }

        // Get nbr by cantons
        if(!(nodes[i]["CantonAbbreviation"] in nbr["CantonAbbreviation"])) {
            var jj = {};
            jj["CN"] = 0;
            jj["CE"] = 0;
            jj["CF"] = 0;
            nbr["CantonAbbreviation"][nodes[i]["CantonAbbreviation"]] = jj;
            variables["CantonAbbreviation"].push(nodes[i]["CantonAbbreviation"]);
            texts["CantonAbbreviation"][nodes[i]["CantonAbbreviation"]] = nodes[i]["CantonName"];
        }
        nbr["CantonAbbreviation"][nodes[i]["CantonAbbreviation"]][nodes[i]["CouncilAbbreviation"]] += 1;
    }

    variables["AgeCategory"].sort();

    // Awesomplete
    new Awesomplete(compCounc, {list: list_councilors});


    node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "dataNodes")
            .attr("r", radius)
            .attr("fill", function(d) { return color(colorType, d);})
            .attr("desc", false)
            .attr("id", function(d) { return d.PersonIdCode;})
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("mouseover", emphasisAndShowInfo)
            .on('mouseleave', resetOp)
            .on("click", clicked)
        ;

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked)
    ;

    svg.on("dblclick", dbclick);

});

function ticked() {
    /*link
     .attr("x1", function(d) { return d.source.x; })
     .attr("y1", function(d) { return d.source.y; })
     .attr("x2", function(d) { return d.target.x; })
     .attr("y2", function(d) { return d.target.y; });*/

    clusters();

    majorities();

    update_color();

    update_friendship();

    update_interest();

    remove_non_wanted_council();

    node
        .each(gravity())
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}