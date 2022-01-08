function addDynamicAgents(){
	// Blood cells and oxygen molecules are dynamic agents: they enter the vessel, commute and then leave
	// We have entering blood cells of two types "U" and "O"
	// We could specify their probabilities of arrival in any simulation step separately
	// Or we could specify a probability of arrival of blood cells and then specify the probability of a unoxygenated arrival.
	// We have done the latter. probArrival is probability of arrival a blood cell and viralLoad is the probability of an arrival of oxygen molecules.
	// First see if a blood cell arrives in this sim step.
 
    if (Math.random()< probArrival){
        statistics[0].count++
        var homerow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow)
        var homecol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol)

        var targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow)
        var targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol)

        var newBloodCell = {"id":id++,"type":"U","location":{"row":homerow,"col":homecol},
        "target":{"row":targetrow,"col":targetcol},"state":ENTERING,"timeAdmitted":0};
        
		// Oxygen levels depend on the viral load, the higher is the load, the lower is the oxygen levels
        if (Math.random() > viralLoad) {
        	newBloodCell.type = "O", statistics[1].count++

			oxygenMolecules.push({"location":{"row":homerow,"col":homecol},
			"target":{"row":targetrow,"col":targetcol},"state":ENTERING});

			statistics[2].count++
		}

		else{newBloodCell.type = "U"};
    
	bloodCells.push(newBloodCell);
	}
}

function removeDynamicAgents(){
	// We need to remove cells who have exited. 
	//Select all svg elements of class "cell" and map it to the data list called allBloodCells
	var allBloodCells = surface.selectAll(".cell").data(bloodCells);

	//Select all the svg groups of class "cell" whose state is EXITED
	var exitedBloodCells = allBloodCells.filter(function(d){return d.state==EXITED;});

	// Remove the svg groups of EXITED cells: they will disappear from the screen at this point
	exitedBloodCells.remove();
	
	// Remove the EXITED cells from the cell list using a filter command
	bloodCells = bloodCells.filter(function(d){return d.state!=EXITED;});

	// At this point the cells list should match the images on the screen one for one 
	// and no cells should have state EXITED

	var allMolecules = surface.selectAll(".cell").data(oxygenMolecules);
	var exitedMolecules = allMolecules.filter(function(d){return d.state==EXITED;});
	exitedMolecules.remove();
	oxygenMolecules = oxygenMolecules.filter(function(d){return d.state!=EXITED;});
}

function updateDynamicAgents(){
	// loop over all the citizens and update their states
	for (var index in bloodCells){
		updateBloodCell(index);
	}
	for (var index in oxygenMolecules){
		updateOxygenMolecule(index);
	}
	updateSurface();	
}