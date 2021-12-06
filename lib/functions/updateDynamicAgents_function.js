function removeDynamicAgents(){
	// We need to remove citizens who have been discharged. 
	//Select all svg elements of class "citizen" and map it to the data list called patients
	var allcitizens = surface.selectAll(".citizen").data(citizens);
	//Select all the svg groups of class "citizens" whose state is EXITED
	var exitedcitizens = allcitizens.filter(function(d,i){return d.state==EXITED;});
	// Remove the svg groups of EXITED citizens: they will disappear from the screen at this point
	exitedcitizens.remove();
	
	// Remove the EXITED citizens from the citizens list using a filter command
	citizens = citizens.filter(function(d){return d.state!=EXITED;});
	// At this point the citizens list should match the images on the screen one for one 
	// and no citizens should have state EXITED
}

function updateDynamicAgents(){
	// loop over all the citizens and update their states
	for (var citizenIndex in citizens){
		updateCitizen(citizenIndex);
	}
	updateSurface();	
}