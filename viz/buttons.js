/////////////////////////////////////////////////////////////////////
//                                                                 //
//  This file contains the functions to deal with the different    //
//  buttons in the HTML file.                                      //
//                                                                 //
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
//                                                                 //
//                           Councils                              //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Check if the National Council is active
var rad_national = document.Councils.national;
var national = true;
var national_changed = false;
rad_national.onclick = function() {
    national = this.checked;
    national_changed = true;
};

// Check if the Council of States is active
var rad_states = document.Councils.states;
var states = true;
var states_changed = false;
rad_states.onclick = function() {
    states = this.checked;
    states_changed = true;
};

// Check if the Federal Council is active
var rad_federal = document.Councils.federal;
var federal = true;
var federal_changed = false;
rad_federal.onclick = function() {
    federal = this.checked;
    federal_changed = true;
};

/////////////////////////////////////////////////////////////////////
//                                                                 //
//                          Clustering                             //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Check if the cluster has been activated
var rad_cluster = document.Clustering.button;
var cluster_active = false;
var cluster_activation_changed = true;
rad_cluster.onclick = function() {
    cluster_active  = this.checked;
    cluster_activation_changed = true;
};

// If the cluster has been activated, then we need to check which cluster is activated
var clusters_changed = false;   // True if a checkbox has been checked/unchecked
var deleted = false;            // True if a checkbox has been unchecked
var added = false;              // True if a checkbox has been checked
var ftype = null;               // Name/Type of cluster changed
var foci_order = [];           // Order of all the clusters

// Checkbox for the council
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

// Checkbox for the Parties
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

// Checkbox for the Parl. group
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

// Checkbox for the Gender
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

// Checkbox for the Language
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

// Checkbox for the Age Category
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

// Checkbox for the Canton
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

/////////////////////////////////////////////////////////////////////
//                                                                 //
//                           Majority                              //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Check if the majority has been activated
var rad_majority = document.Majority.button;
var majority_active = false;
var majority_activation_changed = true;
rad_majority.onclick = function() {
    majority_active  = this.checked;
    majority_activation_changed = true;
};

/////////////////////////////////////////////////////////////////////
//                                                                 //
//                            Colors                               //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Get the color with the radio button. Default is the color on the party
var colorType = "ParlGroupAbbreviation";
var color_changed = true;
function change_color(button) {
    colorType = button.val();
    color_changed = true;
}

/////////////////////////////////////////////////////////////////////
//                                                                 //
//                          Friendship                             //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Get the friendship with the radio button. Default is the friendship on the interventions
var rad_friendship = document.Friendship.buttons;
var prev_friendship = null;
var friendship = "intervention";
var friendship_changed = true;
for(var i = 0; i < rad_friendship.length; i++) {
    rad_friendship[i].onclick = function() {
        if(this !== prev_friendship) {
            prev_friendship = this;
            friendship = this.value;
        }
        friendship_changed = true;
    };
}

/////////////////////////////////////////////////////////////////////
//                                                                 //
//                          Interests                              //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Get the interests with the radio button. Default is the interest on the all motions
var rad_interest = document.Interest.buttons;
var prev_interest = null;
var interest_type = "all";
var interest_changed = true;
for(var i = 0; i < rad_interest.length; i++) {
    rad_interest[i].onclick = function() {
        if(this !== prev_interest) {
            prev_interest = this;
            interest_type = this.value;
        }
        interest_changed = true;
    };
}

/////////////////////////////////////////////////////////////////////
//                                                                 //
//                          Test                                   //
//                                                                 //
/////////////////////////////////////////////////////////////////////
$(document).ready(function(){

    /* Button which shows and hides div with a id of "post-details" */
    $( ".toggle-visibility" ).click(function() {

        var target_selector = $(this).attr('data-target');
        var $target = $( target_selector );

        if ($target.is(':hidden'))
        {
            $target.show( "slow" );
        }
        else
        {
            $target.hide( "slow" );
        }

        console.log($target.is(':visible'));


    });

});