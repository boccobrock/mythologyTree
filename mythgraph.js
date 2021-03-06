var width = window.innerWidth-100;
var height = window.innerHeight-100;

var color = ["#1f77b4","#31a354","#d62728","#bcbd22","#ff7f0e","#6baed6","#d6616b","#31a354","#17becf","#9e9ac8","#e7ba52","#bdbdbd","#9467bd","#e377c2","#17becf"];

d3.selectAll(".legend-icon").each(function(d, i){ d3.select(this).style("background", function(d) { return color[i]; } ) });

var force = d3.layout.force()
    .charge(-600)
    .linkDistance(function(d) {return (1+d.value)*80; })
    .linkStrength(0.2)
    .gravity(0.2)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("pantheon.json", function(error, graph) {
    for (var i=0; i < graph.nodes.length; i++) {
        graph.nodes[i].x = Math.random()*width;
        graph.nodes[i].y = Math.random()*height;
    }
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", function(d) { return color[d.value]; });

    var node = svg.append("svg:g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 20)
        .style("fill", function(d) { return color[d.group]; })
        .call(force.drag)
        .on("mouseover", nodemouseover)
        .on("mouseout", nodemouseout);

    var text = svg.append("svg:g").selectAll("g")
        .data(force.nodes())
        .enter().append("svg:g");

    text.append("svg:text")
        .attr("y", ".31em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.name; });

    function nodemouseover(d) {
        svg.selectAll(".link").classed("active", function(p) { return p.source === d || p.target === d; });
        d3.select(this).classed("active", true);
    }

    function nodemouseout() {
        svg.selectAll(".active").classed("active", false);
    }

    node.append("title")
        .text(function(d) { return d.name; });

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        text.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
});
