function updateBloodCell(index){
    //index is an index into the bloodCells data array
    index = Number(index);
    var cell = bloodCells[index];

    // get the current location of the blood cell
    var row = cell.location.row;
    var col = cell.location.col;
    var state = cell.state;
    
    // determine if blood cell has arrived at the target, which hasArrived is a boolean variable
    var hasArrived = (Math.abs(cell.target.row-row)+Math.abs(cell.target.col-col))==0;

	// Behavior of cells depends on its state
	switch(state){
		case ENTERING:
			if (hasArrived){
				if (Math.random() < probDeparture){
					// Blood cell is leaving
					cell.state=LEAVING;
                    var targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow);
                    var targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol);
					cell.target.row = targetrow;
					cell.target.col = targetcol;
				} 
                
                else {
                    // Blood cell is still moving
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
                if (cell.type=="O") {statistics[1].count--}
			}
		break;

		default: break;
	}
    
    // set the current row and column of the blood cell
    var currentrow=cell.location.row;
    var currentcol=cell.location.col;

    // set the destination row and column
    var targetRow = cell.target.row;
    var targetCol = cell.target.col;
    
    //Compute all possible directions of a blood cell
    var nextsteps=[];
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

	// Identify the best next step (i.e. the step with the shortest distance to the target)
    var indexMin = stepdistance.indexOf(Math.min(...stepdistance));
    var minnexstep=nextsteps[indexMin];
    var nextsteprow=minnexstep.row;
    var nextstepcol=minnexstep.col;

	// compute the cell to move to
	var newRow = nextsteprow;
    var newCol = nextstepcol;
    
	// update the location of the cell
	cell.location.row = newRow;
	cell.location.col = newCol;
}

function updateOxygenMolecule(index){
    // index is an index into the oxygenMolecules data array
    index = Number(index);
    var molecule = oxygenMolecules[index];

    // get the current location of the molecule
    var row = molecule.location.row;
    var col = molecule.location.col;
    var state = molecule.state;
    
    // determine if oxygen molecule has arrived at the target, which hasArrived is a boolean variable
    var hasArrived = (Math.abs(molecule.target.row-row)+Math.abs(molecule.target.col-col))==0;

	// Behavior of molecules depends on its state
	switch(state){
		case ENTERING:
			if (hasArrived){
				if (Math.random() < probDeparture){
					//Citizen is leaving // Ensure that the target is not a building
					molecule.state=LEAVING;
                    var targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow);
                    var targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol);
					molecule.target.row = targetrow;
					molecule.target.col = targetcol;
				} 
                
                else {
                    // Citizen is still commuting// specifies a new target (cannot be a building)
                    var targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow);
                    var targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol);
					molecule.target.row = targetrow;
					molecule.target.col = targetcol;
				}
			}
		break;

		case LEAVING:
			if (hasArrived && statistics[2].count > 0){
                statistics[2].count--
                molecule.state = EXITED;
			}
		break;

		default: break;
	}
    
    // set the current row and column of the molecule
    var currentrow=molecule.location.row;
    var currentcol=molecule.location.col;

    // set the destination row and column
    var targetRow = molecule.target.row;
    var targetCol = molecule.target.col;
    
    //Compute all possible directions of a molecule
    var nextsteps=[];
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

	//identify the best next step (i.e. the step with the shortest distance to the target)
    var indexMin = stepdistance.indexOf(Math.min(...stepdistance));
    var minnexstep=nextsteps[indexMin];
    var nextsteprow=minnexstep.row;
    var nextstepcol=minnexstep.col;

	// compute the cell to move to
	var newRow = nextsteprow;
    var newCol = nextstepcol;
    
	// update the location of the molecule
	molecule.location.row = newRow;
	molecule.location.col = newCol;
}