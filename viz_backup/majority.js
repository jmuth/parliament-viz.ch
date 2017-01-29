var left = 0;
var right = 0;

function majorities() {
    if(majority_active) {

        if(majority_activation_changed) {
            draw_line();
        }

        count_each_side();

        write_majority();

    } else if(majority_activation_changed) {
        svg.selectAll(".lineMaj").remove();
        svg.selectAll(".textMaj").remove();
    }
}

function count_each_side() {
    left = 0;
    right = 0;

    for(var i=0; i<nodes.length; i++) {
        if(nodes[i].x > 0 && nodes[i].x < width && nodes[i].y > 0 && nodes[i].y < height) {
            if(nodes[i].x > 0.5*width){
                right += 1;
            } else {
                left += 1;
            }
        }
    }
}

function write_majority() {
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

    svg.selectAll(".textMaj").remove();

    svg.append("text")
        .attr("class", "textMaj")
        .attr("x", function() {
            if(left > right) {
                return 0.25*width;
            } else if(right > left) {
                return 0.75*width;
            }
        })
        .attr("y", function() {return 20;})
        .text("Majority")
        .attr("font-family", "sans-serif")
        .attr("font-size", "30px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .attr("fill", "red")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central");

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