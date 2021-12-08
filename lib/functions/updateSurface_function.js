function updateSurface(){
	// This function is used to create or update most of the svg elements on the drawing surface.
	// See the function removeDynamicAgents() for how we remove svg elements
	
	//Select all svg elements of class "citizen" and map it to the data list called patients
	var allcitizens = surface.selectAll(".citizen").data(bloodCells);
	
	// If the list of svg elements is longer than the data list, the excess elements are in the .exit() list
	// Excess elements need to be removed:
	allcitizens.exit().remove(); //remove all svg elements associated with entries that are no longer in the data list
	// (This remove function is needed when we resize the window and re-initialize the citizens array)
	 
	// If the list of svg elements is shorter than the data list, the new elements are in the .enter() list.
	// The first time this is called, all the elements of data will be in the .enter() list.
	// Create an svg group ("g") for each new entry in the data list; give it class "citizen"
	var newcitizens = allcitizens.enter().append("g").attr("class","citizen"); 
	//Append an image element to each new citizen svg group, position it according to the location data, and size it to fill a cell
	// Also note that we can choose a different image to represent the citizen based on the citizen type
	newcitizens.append("svg:image")
	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
	 .attr("width", Math.min(cellWidth,cellHeight)+"px")
	 .attr("height", Math.min(cellWidth,cellHeight)+"px")
	 .attr("xlink:href",function(d){if (d.type=="U") return bloodCell; else return oxygenatedBloodCell;});
	
	// For the existing citizens, we want to update their location on the screen 
	// but we would like to do it with a smooth transition from their previous position.
	// D3 provides a very nice transition function allowing us to animate transformations of our svg elements.
	
	//First, we select the image elements in the allcitizens list
	var images = allcitizens.selectAll("image");
	// Next we define a transition for each of these image elements.
	// Note that we only need to update the attributes of the image element which change
	images.transition()
	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
     .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
     .attr("xlink:href",function(d){if (d.type=="U") return bloodCell; else return oxygenatedBloodCell;})
	 .duration(animationDelay).ease('linear'); // This specifies the speed and type of transition we want.
	
	// The simulation should serve some purpose 
	// so we will compute and display the average length of stay of each patient type.
	// We created the array "statistics" for this purpose.
	// Here we will create a group for each element of the statistics array (two elements)
	var allstatistics = surface.selectAll(".statistics").data(statistics);
	var newstatistics = allstatistics.enter().append("g").attr("class","statistics");
	// For each new statistic group created we append a text label
	newstatistics.append("text")
	.attr("x", function(d) { var cell= getLocationCell(d.location); return (cell.x+cellWidth)+"px"; })
    .attr("y", function(d) { var cell= getLocationCell(d.location); return (cell.y+cellHeight/2+100)+"px"; })
    .attr("dy", ".35em")
    .text(""); 
	
	// The data in the statistics array are always being updated.
	// So, here we update the text in the labels with the updated information.
	allstatistics.selectAll("text").text(function(d) {
		var nocitizens = d.count; // cumulativeValue and count for each statistic are always changing
		return d.name+nocitizens.toFixed(1); }); //The toFixed() function sets the number of decimal places to display

	// Finally, we would like to draw boxes around the different areas of our system. We can use d3 to do that too.

	//First a box representing the city
	var allareas = surface.selectAll(".areas").data(areas);
	var newareas = allareas.enter().append("g").attr("class","areas");
	// For each new area, append a rectangle to the group
	newareas.append("rect")
	.attr("x", function(d){return (d.startCol-1)*cellWidth;})
	.attr("y",  function(d){return (d.startRow-1)*cellHeight;})
	.attr("width",  function(d){return d.numCols*cellWidth;})
	.attr("height",  function(d){return d.numRows*cellWidth;})
	.style("fill", function(d) { return d.color; })
	.style("stroke","black")
	.style("stroke-width",1);

	var allAirSacs = surface.selectAll(".airSacs").data(airSacs);
	var newSac = allAirSacs.enter().append("g").attr("class","airSacs");
	newSac.append("svg:image")
	 .attr("x",function(d){return d.startCol+"px";})
	 .attr("y",function(d){return d.startRow+"px";})
	 .attr("width", 100+"px")
	 .attr("height", 200+"px")
	 .attr("xlink:href", airSacPic);

	var kidneyArea = surface.selectAll(".kidney").data(kidneyLoc);
	var newKidney = kidneyArea.enter().append("g").attr("class","kidney");
	newKidney.append("svg:image")
	 .attr("x",function(d){return d.startCol+"px";})
	 .attr("y",function(d){return d.startRow+"px";})
	 .attr("width", 200+"px")
	 .attr("height", 200+"px")
	 .attr("xlink:href", kidneyPic);

	var liverArea = surface.selectAll(".liver").data(liverLoc);
	var newLiver = liverArea.enter().append("g").attr("class","liver");
	newLiver.append("svg:image")
	 .attr("x",function(d){return d.startCol+"px";})
	 .attr("y",function(d){return d.startRow+"px";})
	 .attr("width", 200+"px")
	 .attr("height", 200+"px")
	 .attr("xlink:href", liverPic);
}