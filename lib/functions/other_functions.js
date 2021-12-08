// We need a function to start and pause the simulation.
function toggleSimStep(){ 
	//this function is called by a click event on the html page. 
	// Search BasicAgentModel.html to find where it is called.
	isRunning = !isRunning;
	console.log("isRunning: "+isRunning);
}

// The window is resizable, so we need to translate row and column coordinates into screen coordinates x and y
function getLocation(location){
	var row = location.row;
	var col = location.col;
	var x = (col-1)*cellWidth; //cellWidth is set in the redrawWindow function
	var y = (row-1)*cellHeight; //cellHeight is set in the redrawWindow function
	return {"x":x,"y":y};
}

function simStep(){
	//This function is called by a timer; if running, it executes one simulation step 
	//The timing interval is set in the page initialization function near the top of this file
	if (isRunning){ //the isRunning variable is toggled by toggleSimStep
		// Increment current time (for computing statistics)
		currentTime++;
		// Sometimes new agents will be created in the following function
		addDynamicAgents();
		// In the next function we update each agent
		updateDynamicAgents();
		// Sometimes agents will be removed in the following function
        removeDynamicAgents();
		
		//Update statistics
		// cumulativeOxygenatedCells=cumulativeOxygenatedCells+(statistics[1].count/(statistics[0].count+0.001));
        // statistics[2].count=cumulativeOxygenatedCells/currentTime*100;
        statistics[3].count = statistics[1].count/statistics[0].count;
		statistics[4].count = kidneyFunctionality * statistics[3].count;
		statistics[5].count = liverFunctionality * statistics[3].count;
	}
}