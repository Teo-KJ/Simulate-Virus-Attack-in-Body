function addDynamicAgents(){
	// Citizens are dynamic agents: they enter the city, commute and then leave
	// We have entering patients of two types "I" and "N"
	// We could specify their probabilities of arrival in any simulation step separately
	// Or we could specify a probability of arrival of all citizens and then specify the probability of a Type I arrival.
	// We have done the latter. probArrival is probability of arrival a citizen and probInfected is the probability of a type I citizen who arrives.
	// First see if a citizen arrives in this sim step. Then, the citizen is generated in one of the buildings of the city. Then the citizen type is selected
 
    if (Math.random()< probArrival){
        statistics[0].count++
        var homerow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow)
        var homecol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol)

        var targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow)
        var targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol)

        var newcitizen = {"id":id++,"type":"I","location":{"row":homerow,"col":homecol},
        "target":{"row":targetrow,"col":targetcol},"state":COMUTTING,"timeAdmitted":0};
        
        if (Math.random()<viralLoad) {
        	newcitizen.type = "I", statistics[1].count++, totinfected++}
        
		 else{newcitizen.type = "N"};	
        //console.log(newcitizen)
    
	citizens.push(newcitizen);
	}
}

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
		updateBloodCell(citizenIndex);
	}
	updateSurface();	
}