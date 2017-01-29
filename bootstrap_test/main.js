// Get the clustering
var rad_cluster = document.Clustering.button;
var cluster_active = false;
var cluster_activation_changed = true;
rad_cluster.onclick = function() {
    cluster_active  = this.checked;
    cluster_activation_changed = true;
};

var clusters_changed = false;
var deleted = false;
var added = false;
var ftype = null;
var focis_order = [];

var rad_council = document.ClusterType.btn_council;
rad_council.onclick = function() {
    if(this.checked) {
        added = true;
    } else {
        deleted = true;
    }
    ftype = "CouncilAbbreviation";
    clusters_changed = true;
};

var rad_party = document.ClusterType.btn_party;
rad_party.onclick = function() {
    if(this.checked) {
        added = true;
    } else {
        deleted = true;
    }
    ftype = "PartyAbbreviation";
    clusters_changed = true;
};

var rad_parl_gr = document.ClusterType.btn_parl_gr;
rad_parl_gr.onclick = function() {
    if(this.checked) {
        added = true;
    } else {
        deleted = true;
    }
    ftype = "ParlGroupAbbreviation";
    clusters_changed = true;
};

var rad_gender = document.ClusterType.btn_gender;
rad_gender.onclick = function() {
    if(this.checked) {
        added = true;
    } else {
        deleted = true;
    }
    ftype = "GenderAsString";
    clusters_changed = true;
};

var rad_language = document.ClusterType.btn_language;
rad_language.onclick = function() {
    if(this.checked) {
        added = true;
    } else {
        deleted = true;
    }
    ftype = "NativeLanguage";
    clusters_changed = true;
};

var rad_age = document.ClusterType.btn_age;
rad_age.onclick = function() {
    if(this.checked) {
        added = true;
    } else {
        deleted = true;
    }
    ftype = "AgeCategory";
    clusters_changed = true;
};

var rad_canton = document.ClusterType.btn_canton;
rad_canton.onclick = function() {
    if(this.checked) {
        added = true;
    } else {
        deleted = true;
    }
    ftype = "CantonAbbreviation";
    clusters_changed = true;
};

// Get the majority
var rad_majority = document.Majority.button;
var majority_active = false;
var majority_activation_changed = true;
rad_majority.onclick = function() {
    majority_active  = this.checked;
    majority_activation_changed = true;
};

var rad_national = document.Councils.national;
var national = true;
var national_changed = false;
rad_national.onclick = function() {
    national = this.checked;
    national_changed = true;
};

var rad_states = document.Councils.states;
var states = true;
var states_changed = false;
rad_states.onclick = function() {
    states = this.checked;
    states_changed = true;
};

var rad_federal = document.Councils.federal;
var federal = true;
var federal_changed = false;
rad_federal.onclick = function() {
    federal = this.checked;
    federal_changed = true;
};
// Get the color
var rad_color = document.Colors.buttons;
var prev_color = null;
var colorType = "PartyAbbreviation";
var color_changed = true;
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

var rad_friendship = document.Friendship.buttons;
var prev_friendship = null;
var friendship = "intervention";
var friendship_changed = true;
for(var i = 0; i < rad_friendship.length; i++) {
    rad_friendship[i].onclick = function() {
        (prev_friendship)? console.log(prev_friendship.value):null;
        if(this !== prev_friendship) {
            prev_friendship = this;
            friendship = this.value;
        }
        friendship_changed = true;
    };
}

var rad_interest = document.Interest.buttons;
var prev_interest = null;
var interest_type = "all";
var interest_changed = true;
for(var i = 0; i < rad_interest.length; i++) {
    rad_interest[i].onclick = function() {
        (prev_interest)? console.log(prev_interest.value):null;
        if(this !== prev_interest) {
            prev_interest = this;
            interest_type = this.value;
        }
        interest_changed = true;
    };
}

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
        .style("width", "100%")
        .style("height", "100%")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 737 600")
        // .attr("width", '100%')
        // .attr("height", '100%')
        // .attr("viewBox", "0 0 1000 6000")
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

// Warning: do not update itself if you resize the window
var max_width = document.getElementById('int_timeline').clientWidth
var barWidth = max_width - bGMargin.left - bGMargin.right,
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