function updateCitizen(citizenIndex){
	//citizenIndex is an index into the citizens data array
	citizenIndex = Number(citizenIndex);
	var citizen = citizens[citizenIndex];
	// get the current location of the citizen
	var row = citizen.location.row;
    var col = citizen.location.col;
	var state = citizen.state;
	
	// determine if citizen has arrived at the target
	var hasArrived = (Math.abs(citizen.target.row-row)+Math.abs(citizen.target.col-col))==0;
	
	//identify the citizens infected 
    var infectedcitizens=citizens.filter(function(d){return d.type=="I";});

    //determine if any citizen infected is nearby
    i=0
    if (infectedcitizens.length>0 && citizen.type=="N") {
        while (citizen.type=="N" && i< infectedcitizens.length){
           var infected=infectedcitizens[i];
           var infectedrow=infected.location.row
           var infectedcol=infected.location.col
           var distance=Math.sqrt((infectedrow-row)*(infectedrow-row)+(infectedcol-col)*(infectedcol-col))
           if (distance<DistTransmission){
                if (Math.random()<InfectionRate) {citizen.type="I",statistics[1].count++, totnewinfected++ }    
            }
           i=i+1 
        }
    }

	// Behavior of citizen depends on his or her state
	switch(state){
		case COMUTTING:
			if (hasArrived){
				if (Math.random()<probDeparture){
					//Citizen is leaving // Ensure that the target is not a building
					citizen.state=LEAVING;
                    var targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow);
                    var targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol);
                    var targetisbuilding=Buildings.filter(function(d){return d.row==targetrow && d.col==targetcol;});
                    while (targetisbuilding.length>0){
                        targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow);
                        targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol);
                        targetisbuilding=Buildings.filter(function(d){return d.row==targetrow && d.col==targetcol;});    
                        }
					citizen.target.row = targetrow;
					citizen.target.col = targetcol;
				} else {
                    // Citizen is still commuting// specifies a new target (cannot be a building)
                    var targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow);
                    var targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol);
                    var targetisbuilding=Buildings.filter(function(d){return d.row==targetrow && d.col==targetcol;});
                    while (targetisbuilding.length>0){
                        targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow);
                        targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol);
                        targetisbuilding=Buildings.filter(function(d){return d.row==targetrow && d.col==targetcol;});    
                        }
					citizen.target.row = targetrow;
					citizen.target.col = targetcol;
				}
				
			}
		break;
		case LEAVING:
			if (hasArrived){
                statistics[0].count--
                citizen.state = EXITED;
                if (citizen.type=="I") {statistics[1].count--};
			}
		break;
		default:
        break;
	}
    
    
   // set the current row and column of the citizen
   var currentrow=citizen.location.row;
   var currentcol=citizen.location.col;

   // set the destination row and column
   var targetRow = citizen.target.row;
   var targetCol = citizen.target.col;
   
   //Compute all possible directions o a citizen
   nextsteps=[];
    for(const dx of [-1, 0, 1]) {
        for(const dy of [-1, 0, 1]) {
          if(dx === 0 && dy === 0) continue;
          nextsteps.push({ row: currentrow + dx, col: currentcol + dy });
       }
    }
   
	// Compute distance of each possible step to the destination
    stepdistance=[]
    for (i = 0; i < nextsteps.length-1; i++) {
        var nextstep=nextsteps[i];
        var nextrow=nextstep.row
        var nextcol=nextstep.col
        stepdistance[i]=Math.sqrt((nextrow-targetRow)*(nextrow-targetRow)+(nextcol-targetCol)*(nextcol-targetCol));
    } 

	//identify if the best next step (i.e. the step with the shortest distance to the target) is a building
    var indexMin = stepdistance.indexOf(Math.min(...stepdistance));
    var minnexstep=nextsteps[indexMin];
    var nextsteprow=minnexstep.row;
    var nextstepcol=minnexstep.col;
    var nextstepisbuilding=Buildings.filter(function(d){return d.row==nextsteprow && d.col==nextstepcol;});
 
	//If the best next step is a building, then we analyze the 2nd best next step...etc, until the next step is not a building
	//Citizens cannot move through the buildings!
    while (nextstepisbuilding.length>0){
        nextsteps.splice((indexMin), 1);
        stepdistance.splice((indexMin), 1);
        var indexMin = stepdistance.indexOf(Math.min(...stepdistance));
        var minnexstep=nextsteps[indexMin];
        var nextsteprow=minnexstep.row;
        var nextstepcol=minnexstep.col;
        var nextstepisbuilding=Buildings.filter(function(d){return d.row==nextsteprow && d.col==nextstepcol;});
    }

	// compute the cell to move to
	var newRow = nextsteprow;
    var newCol = nextstepcol;
    
	// update the location of the citizen
	citizen.location.row = newRow;
	citizen.location.col = newCol;
	
}