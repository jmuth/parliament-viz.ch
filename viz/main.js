/////////////////////////////////////////////////////////////////////
//                                                                 //
//  This file contains the main function that are used for the     //
//  visualization. Some variables are defined and then the         //
//  loading of all the JSON files is done.                         //
//                                                                 //
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
//                                                                 //
//                     Define some variables                       //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Define the variables for the nodes
var radius = 6,
    padding = 1;    // Distance between the nodes

// Define the size of the visualization
var width = 737,
    height = 600,
    height_legend = 64;

// Variables for node selection
var node_selected = false;
var node_id = null;
var dragging = false;

// Text to display for the information about the foci
var texts = {};
texts["CouncilAbbreviation"] = {'CN': 'National Council', 'CE': 'Council of States', 'CF': 'Federal Council'};
texts["PartyAbbreviation"] = {};
texts["ParlGroupAbbreviation"] = {'NaN': 'Federal Council', "GL": "Grp. Vert'Libéral", "BD": "Grp. BD", "C": "Grp. PDC", "S": "Grp. Socialiste", "G": "Grp. des Verts", "RL": "Grp. LR", "V": "Grp. UDC"};
texts["GenderAsString"] = {'m': 'Men', 'f': 'Women'};
texts["NativeLanguage"] = {"F": "French", "I": "Italian", "Sk": "Slovak", "RM": "Romansh", "D": "German", "Tr": "Turkish"};
texts["AgeCategory"] = {};
texts["CantonAbbreviation"] = {};

// Number of councilors in each foci (Used in the legend)
var nbr = {};
nbr["CouncilAbbreviation"] = {};
nbr["PartyAbbreviation"] = {};
nbr["ParlGroupAbbreviation"] = {};
nbr["GenderAsString"] = {};
nbr["NativeLanguage"] = {};
nbr["AgeCategory"] = {};
nbr["CantonAbbreviation"] = {};

// List of all the variables for each different kind of clusters (Also use in the legend
var variables = {};
variables["CouncilAbbreviation"] = [];
variables["PartyAbbreviation"] = [];
variables["ParlGroupAbbreviation"] = [];
variables["GenderAsString"] = [];
variables["NativeLanguage"] = [];
variables["AgeCategory"] = [];
variables["CantonAbbreviation"] = [];

/////////////////////////////////////////////////////////////////////
//                                                                 //
//                     Get parts of the HTML                       //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Get the main SVG visualization
var svg = d3.select("div#viz")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 737 600")
        //class to make it responsive
        .classed("svg-content-responsive", true);

// Get the SVG for the legend
var legend = d3.select("div#legend")
    .append("div")
    .classed("svg-container-legend", true) //container class to make it responsive
    .append("svg")
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 737 64")
    //class to make it responsive
    .classed("svg-content-responsive-legend", true);


// Margins for the two bargraphs
var bGMargin = {top: 10, right: 10, bottom: 10, left: 30};

// Warning: do not update itself if you resize the window
var max_width = document.getElementById('int_timeline').clientWidth;
var barWidth = max_width - bGMargin.left - bGMargin.right,
    barHeight = 105 - bGMargin.top - bGMargin.bottom;

// Get the SVG for the bar graph on the timeline
var timelineBarGraph = d3.select("#int_graph")
    .append("g")
    .attr("transform", "translate(" + bGMargin.left + "," + bGMargin.top + ")");

// Get the SVG for the first bar graph on the interests
var interestsBarGraph = d3.select('#themes')
    .append("g")
    .attr("transform", "translate(" + bGMargin.left + "," + bGMargin.top + ")");

// Get the SVG for the second bar graph on the interests
var interestsBarGraph_second = d3.select('#themes')
    .append("g")
    .attr("transform", "translate(" + bGMargin.left + "," + bGMargin.top + ")");

// Get the friends
var svgFriends = d3.select('#friends'),
    gFriends = svgFriends.append('g');

// Get the autocomplete
var compCounc = document.getElementById("compCouncilors");

/////////////////////////////////////////////////////////////////////
//                                                                 //
//     Define functions for the simulation and loading files       //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Simulation with forces
var simulation = d3.forceSimulation().alphaDecay(0)
        // Decay in velocity in order to avoid the nodes to giggle
        .velocityDecay(0.1)
        // Collision forces in order to avoid overlap
        .force("collision", d3.forceCollide().radius(radius+padding).iterations(5).strength(0.5));

// Get the positions (JSON)
var pos;
function importPositions(json) {
    $.getJSON(json, function(d) {
        pos = d;
    })
}

// Get the adjacency matrix on the interventions (JSON)
var adj;
function importAdj(json) {
    $.getJSON(json, function(d) {
        adj =  d;
    });
};

// Get the interests (JSON)
var interests_json;
function importInterests(json) {
    $.getJSON(json, function(d) {
        interests_json =  d;
    });
};

// Get the authors (JSON)
var authors;
function importAuthors(json) {
    $.getJSON(json, function(d) {
        authors =  d;
    });
};

// Get the adjacency matrix on the cosignations (JSON)
var adj_cosign;
function importAdjCosign(json) {
    $.getJSON(json, function(d) {
        adj_cosign = d;
    })
}

// Get the interventions (JSON)
var ints;
function importInts(json) {
    $.getJSON(json, function(d) {
        ints = d;
    });
}

// Get the people (JSON)
var people;
function importPeople(json) {
    $.getJSON(json, function(d) {
        people = d;
    });
}

// Get the friends with the interventions (JSON)
var friends;
function importFriends(json) {
    $.getJSON(json, function(d) {
        friends = d;
    });
}

// Get the friends with the cosignations (JSON)
var friends_cosign;
function importFriendsCosign(json) {
    $.getJSON(json, function(d) {
        friends_cosign = d;
    });
}

// Load all the JSON files
importPositions('data/positions.json');
importAdj('data/adj.json');
importInts('data/interventions.json');
importPeople('data/people.json');
importFriends('data/friends.json');
importAdjCosign('data/adj_cosign.json');
importFriendsCosign('data/friends_cosign.json');
importInterests('data/interests.json');
importAuthors('data/authors.json');

/////////////////////////////////////////////////////////////////////
//                                                                 //
//          Load the last file and start the simulation            //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Define the two variables
var nodes;
var node;
// Read the Nodes and do the viz!
d3.json("data/active.json", function(error, graph) {
    if (error) throw error;

    // Update the positions such that it matches the number of picels
    for(var key in pos) {
        pos[key]["x"] = pos[key]["x"]*width;
        pos[key]["y"] = pos[key]["y"]*height;

    }

    // Get the nodes and go through them in order to fill some of the variables
    nodes = graph.nodes;

    var list_councilors = [];

    for(var i=0; i<nodes.length; i++) {
        // Add additional fields in the JSON object
        nodes[i]["x"] = pos[nodes[i]["PersonIdCode"]]["x"];
        nodes[i]["y"] = pos[nodes[i]["PersonIdCode"]]["y"];
        nodes[i]["radius"] = radius;
        nodes[i]["selected"] = false;
        nodes[i]["dragged"] = false;

        // Update list of councilors for the autocomplete
        list_councilors.push(nodes[i]["FirstName"] + " " + nodes[i]["LastName"]);

        // Update number and variables for the councils
        if(!(nodes[i]["CouncilAbbreviation"] in nbr["CouncilAbbreviation"])) {
            var jj = {};
            jj["CN"] = 0;   // For National council
            jj["CE"] = 0;   // For council of States
            jj["CF"] = 0;   // For Federal council
            nbr["CouncilAbbreviation"][nodes[i]["CouncilAbbreviation"]] = jj;
            variables["CouncilAbbreviation"].push(nodes[i]["CouncilAbbreviation"]);
        }
        nbr["CouncilAbbreviation"][nodes[i]["CouncilAbbreviation"]][nodes[i]["CouncilAbbreviation"]] += 1;

        // Update number and variables for the parties
        if(!(nodes[i]["PartyAbbreviation"] in nbr["PartyAbbreviation"])) {
            var jj = {};
            jj["CN"] = 0;   // For National council
            jj["CE"] = 0;   // For council of States
            jj["CF"] = 0;   // For Federal council
            nbr["PartyAbbreviation"][nodes[i]["PartyAbbreviation"]] = jj;
            texts["PartyAbbreviation"][nodes[i]["PartyAbbreviation"]] = nodes[i]["PartyAbbreviation"];
            variables["PartyAbbreviation"].push(nodes[i]["PartyAbbreviation"]);
        }
        nbr["PartyAbbreviation"][nodes[i]["PartyAbbreviation"]][nodes[i]["CouncilAbbreviation"]] += 1;

        // Update number and variables for the parliamentary groups
        if(!(nodes[i]["ParlGroupAbbreviation"] in nbr["ParlGroupAbbreviation"])) {
            var jj = {};
            jj["CN"] = 0;   // For National council
            jj["CE"] = 0;   // For council of States
            jj["CF"] = 0;   // For Federal council
            nbr["ParlGroupAbbreviation"][nodes[i]["ParlGroupAbbreviation"]] = jj;
            variables["ParlGroupAbbreviation"].push(nodes[i]["ParlGroupAbbreviation"]);
        }
        nbr["ParlGroupAbbreviation"][nodes[i]["ParlGroupAbbreviation"]][nodes[i]["CouncilAbbreviation"]] += 1;

        // Update number and variables for the genders
        if(!(nodes[i]["GenderAsString"] in nbr["GenderAsString"])) {
            var jj = {};
            jj["CN"] = 0;   // For National council
            jj["CE"] = 0;   // For council of States
            jj["CF"] = 0;   // For Federal council
            nbr["GenderAsString"][nodes[i]["GenderAsString"]] = jj;
            variables["GenderAsString"].push(nodes[i]["GenderAsString"]);
        }
        nbr["GenderAsString"][nodes[i]["GenderAsString"]][nodes[i]["CouncilAbbreviation"]] += 1;

        // Update number and variables for the native languages
        if(!(nodes[i]["NativeLanguage"] in nbr["NativeLanguage"])) {
            var jj = {};
            jj["CN"] = 0;   // For National council
            jj["CE"] = 0;   // For council of States
            jj["CF"] = 0;   // For Federal council
            nbr["NativeLanguage"][nodes[i]["NativeLanguage"]] = jj;
            variables["NativeLanguage"].push(nodes[i]["NativeLanguage"]);
        }
        nbr["NativeLanguage"][nodes[i]["NativeLanguage"]][nodes[i]["CouncilAbbreviation"]] += 1;

        // Update number and variables for the age categories
        if(!(nodes[i]["AgeCategory"] in nbr["AgeCategory"])) {
            var jj = {};
            jj["CN"] = 0;   // For National council
            jj["CE"] = 0;   // For council of States
            jj["CF"] = 0;   // For Federal council
            nbr["AgeCategory"][nodes[i]["AgeCategory"]] = jj;
            texts["AgeCategory"][nodes[i]["AgeCategory"]] = nodes[i]["AgeCategoryText"];
            variables["AgeCategory"].push(nodes[i]["AgeCategory"]);
        } else {
            nbr["AgeCategory"][nodes[i]["AgeCategory"]][nodes[i]["CouncilAbbreviation"]] += 1;
        }

        // Update number and variables for the cantons
        if(!(nodes[i]["CantonAbbreviation"] in nbr["CantonAbbreviation"])) {
            var jj = {};
            jj["CN"] = 0;   // For National council
            jj["CE"] = 0;   // For council of States
            jj["CF"] = 0;   // For Federal council
            nbr["CantonAbbreviation"][nodes[i]["CantonAbbreviation"]] = jj;
            variables["CantonAbbreviation"].push(nodes[i]["CantonAbbreviation"]);
            texts["CantonAbbreviation"][nodes[i]["CantonAbbreviation"]] = nodes[i]["CantonName"];
        }
        nbr["CantonAbbreviation"][nodes[i]["CantonAbbreviation"]][nodes[i]["CouncilAbbreviation"]] += 1;
    }

    // Sort the variables in AgeCategory (Prettier to show)
    variables["AgeCategory"].sort();

    // Start the autocomplete with Awesomplete
    new Awesomplete(compCounc, {list: list_councilors});

    // Create the SVG nodes for each councilor
    node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", "dataNodes")
            .attr("r", radius)
            .attr("fill", function(d) { return color(colorType, d[colorType]);})
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

    // Start the simulation on the nodes
    simulation
        .nodes(graph.nodes)
        // Ticked is the main function to update the simulation
        .on("tick", ticked)
    ;

    // Double click function on the whole SVG of the viz.
    svg.on("dblclick", dbclick);

});

// Main function used to update the visualization
function ticked() {
    // Links are note used. But they can be in the future of the project
    /*link
     .attr("x1", function(d) { return d.source.x; })
     .attr("y1", function(d) { return d.source.y; })
     .attr("x2", function(d) { return d.target.x; })
     .attr("y2", function(d) { return d.target.y; });*/

    // Update the clusters (defined in clusters.js)
    clusters();

    // Update the majorities (defined in majority.js)
    majorities();

    // Update the colors (defined in colors.js)
    colors();

    // Update the friendships (defined in sidebar.js)
    friendships();

    // Update the interests (defined in sidebar.js)
    interests();

    // Remove some councils if not wanted (defined in functions.js)
    remove_non_wanted_council();

    // Check if the window has been resized and update the graph
    window_resized();

    // Apply the gravity on the nodes (defined in clusters.js)
    node
        .each(gravity())
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

// Checking if the window is being resized
var rtime;
var timeout = false;
var delta = 200;
$(window).resize(function() {
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(window_resized, delta);
    }
});