function addDynamicAgents(){
	// Blood cells and oxygen molecules are dynamic agents: they enter the vessel, commute and then leave
	// We have entering blood cells of two types "U" and "O"
	// We could specify their probabilities of arrival in any simulation step separately
	// Or we could specify a probability of arrival of all citizens and then specify the probability of a Type I arrival.
	// We have done the latter. probArrival is probability of arrival a citizen and probInfected is the probability of a type I citizen who arrives.
	// First see if a citizen arrives in this sim step. Then, the citizen is generated in one of the buildings of the city. Then the citizen type is selected
 
    if (Math.random()< probArrival){
        statistics[0].count++
        var homerow=Math.floor(Math.random() * nrow + srow)
        var homecol=Math.floor(Math.random() * ncol + scol)

        var targetrow=Math.floor(Math.random() * nrow + srow)
        var targetcol=Math.floor(Math.random() * ncol + scol)

        var newBloodCell = {"id":id++,"type":"U","location":{"row":homerow,"col":homecol},
        "target":{"row":targetrow,"col":targetcol},"state":COMUTTING,"timeAdmitted":0};
        
		// Oxygen levels depend on the viral load, the higher is the load, the lower is the oxygen levels
        if (Math.random() < viralLoad) {
        	newBloodCell.type = "O", statistics[1].count++, totalOxygenatedCells++}
        
		 else{newBloodCell.type = "U"};
    
	bloodCells.push(newBloodCell);
	}
}

function removeDynamicAgents(){
	// We need to remove citizens who have been discharged. 
	//Select all svg elements of class "citizen" and map it to the data list called patients
	var allcitizens = surface.selectAll(".citizen").data(bloodCells);
	//Select all the svg groups of class "citizens" whose state is EXITED
	var exitedcitizens = allcitizens.filter(function(d,i){return d.state==EXITED;});
	// Remove the svg groups of EXITED citizens: they will disappear from the screen at this point
	exitedcitizens.remove();
	
	// Remove the EXITED citizens from the citizens list using a filter command
	bloodCells = bloodCells.filter(function(d){return d.state!=EXITED;});
	// At this point the citizens list should match the images on the screen one for one 
	// and no citizens should have state EXITED
}

function updateDynamicAgents(){
	// loop over all the citizens and update their states
	for (var citizenIndex in bloodCells){
		updateBloodCell(citizenIndex);
	}
	updateSurface();	
}