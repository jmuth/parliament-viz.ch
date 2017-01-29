/////////////////////////////////////////////////////////////////////
//                                                                 //
//  This file contains the main function that are used for the     //
//  majority. It defines the way the majority is computed on       //
//  each side of the visualization.                                //
//                                                                 //
/////////////////////////////////////////////////////////////////////

// Number of nodes on the left and the right of the middle
var left = 0;
var right = 0;

// Function to compute the majorities
function majorities() {
    // If the majority is active, we need to update the texts (# of nodes on each side)
    if(majority_active) {

        if(majority_activation_changed) {
            // If the majority juste changed, we draw the line in the middle of the viz
            draw_line();
        }

        // We count the number of nodes on each side
        count_each_side();

        // We write it on the viz
        write_majority();

    } else if(majority_activation_changed) {
        // If the majority is not active, we just remove everything
        svg.selectAll(".lineMaj").remove();
        svg.selectAll(".textMaj").remove();
    }
}

// Function to count the number of nodes on the left and the right of the middle bar
function count_each_side() {
    // Reinitialize them to 0
    left = 0;
    right = 0;

    // Go through all the nodes
    for(var i=0; i<nodes.length; i++) {
        // Check if they are in the viz or not (if not in the viz, we don't count them <=> council removed)
        if(nodes[i].x > 0 && nodes[i].x < width && nodes[i].y > 0 && nodes[i].y < height) {
            // Check on which side the node is and update the right variable
            if(nodes[i].x > 0.5*width){
                right += 1;
            } else {
                left += 1;
            }
        }
    }
}

// Write the majority
function write_majority() {
    // Get the total number of nodes in function of the councils the user wants
    var total = 0;

    if(national) {
        total += 200;
    }

    if(states) {
        total += 46;
    }

    if(federal) {
        total += 7;
    }

    // Remove old text
    svg.selectAll(".textMaj").remove();

    // If total is bigger than 0, we add the majority on the right or on the left
    // depending on the number of nodes on the right and on the left of the middle line
    if(total > 0) {
        svg.append("text")
            .attr("class", "textMaj")
            .attr("x", function () {
                if (left > right) {
                    return 0.25 * width;
                } else if (right > left) {
                    return 0.75 * width;
                }
            })
            .attr("y", function () {
                return 20;
            })
            .text("Majority")
            .attr("font-family", "sans-serif")
            .attr("font-size", "30px")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("fill", "red")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central");
    }

    // Add the number of points on the left of the middle line
    svg.append("text")
        .attr("class", "textMaj")
        .attr("x", 0.25*width)
        .attr("y", 50)
        .text("(" + left + "/" + total + ")")
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .attr("fill", "#000000")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central");

    // Add the number of points on the right of the middle line
    svg.append("text")
        .attr("class", "textMaj")
        .attr("x", 0.75*width)
        .attr("y", 50)
        .text("(" + right + "/" + total + ")")
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .attr("fill", "#000000")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central");
}

// Draw the middle line
function draw_line() {

    svg.append("line")
        .attr("class", "lineMaj")
        .style("stroke", "#000000")
        .style("stroke-width", "3px")
        .attr("x1", 0.5*width)
        .attr("y1", 0)
        .attr("x2", 0.5*width)
        .attr("y2", height);
}