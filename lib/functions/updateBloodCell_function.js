function updateBloodCell(index){
	//citizenIndex is an index into the citizens data array
	index = Number(index);
	var cell = bloodCells[index];

	// get the current location of the citizen
	var row = cell.location.row;
    var col = cell.location.col;
	var state = cell.state;
	
	// determine if citizen has arrived at the target
	var hasArrived = (Math.abs(cell.target.row-row)+Math.abs(cell.target.col-col))==0;
	
	//identify the citizens infected 
    var infectedcitizens=bloodCells.filter(function(d){return d.type=="U";});

    //determine if any citizen infected is nearby
    i=0
    if (infectedcitizens.length>0 && cell.type=="O") {
        while (cell.type=="O" && i< infectedcitizens.length){
           var infected=infectedcitizens[i];
           var infectedrow=infected.location.row
           var infectedcol=infected.location.col
           var distance=Math.sqrt((infectedrow-row)*(infectedrow-row)+(infectedcol-col)*(infectedcol-col))
           if (distance<liverFunctionality){
                if (Math.random()<kidneyFunctionality) {cell.type="U",statistics[1].count++, totnewinfected++ }    
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
					cell.state=LEAVING;
                    var targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow);
                    var targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol);
					cell.target.row = targetrow;
					cell.target.col = targetcol;
				} 
                
                else {
                    // Citizen is still commuting// specifies a new target (cannot be a building)
                    var targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow);
                    var targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol);
					cell.target.row = targetrow;
					cell.target.col = targetcol;
				}
				
			}
		break;
		case LEAVING:
			if (hasArrived){
                statistics[0].count--
                cell.state = EXITED;
                if (cell.type=="U") {statistics[1].count--};
			}
		break;
		default:
        break;
	}
    
   // set the current row and column of the citizen
   var currentrow=cell.location.row;
   var currentcol=cell.location.col;

   // set the destination row and column
   var targetRow = cell.target.row;
   var targetCol = cell.target.col;
   
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

	// compute the cell to move to
	var newRow = nextsteprow;
    var newCol = nextstepcol;
    
	// update the location of the citizen
	cell.location.row = newRow;
	cell.location.col = newCol;
	
}