// This next function is executed when the script is loaded. It contains the page initialization code.
(function() {
	// Your page initialization code goes here
	// All elements of the DOM will be available here
	window.addEventListener("resize", redrawWindow); //Redraw whenever the window is resized
	simTimer = window.setInterval(simStep, animationDelay); // call the function simStep every animationDelay milliseconds
	// Initialize the slider bar to match the initial animationDelay;
	
	redrawWindow();
})();

function redrawWindow(){
	isRunning = false; // used by simStep
	window.clearInterval(simTimer); // clear the Timer
    animationDelay = 550 - document.getElementById("slider1").value; 
    probArrival = document.getElementById("slider2").value; //Parameters are no longer defined in the code but through the sliders
    probDeparture = document.getElementById("slider3").value;//Parameters are no longer defined in the code but through the sliders
    probInfected = document.getElementById("slider4").value;//Parameters are no longer defined in the code but through the sliders
    InfectionRate = document.getElementById("slider5").value;//Parameters are no longer defined in the code but through the sliders
    DistTransmission = document.getElementById("slider6").value;//Parameters are no longer defined in the code but through the sliders
	simTimer = window.setInterval(simStep, animationDelay); // call the function simStep every animationDelay milliseconds
	
	// Re-initialize simulation variables
	currentTime = 0;
    statistics[0].count=0;
    statistics[1].count=0;
    statistics[2].count=0;
    statistics[3].count=0;
    cumratioinfected=0;
    totinfected=0;
    totnewinfected=0

    citizens = [];
		
	//resize the drawing surface; remove all its contents; 
	var drawsurface = document.getElementById("surface");
	var creditselement = document.getElementById("credits");
	var w = window.innerWidth;
	var h = window.innerHeight;
	var surfaceWidth =(w - 3*WINDOWBORDERSIZE);
	var surfaceHeight= (h-creditselement.offsetHeight - 3*WINDOWBORDERSIZE);
	
	drawsurface.style.width = surfaceWidth+"px";
	drawsurface.style.height = surfaceHeight+"px";
	drawsurface.style.left = WINDOWBORDERSIZE/2+'px';
	drawsurface.style.top = WINDOWBORDERSIZE/2+'px';
	drawsurface.style.border = "thick solid #0000FF"; //The border is mainly for debugging; okay to remove it
	drawsurface.innerHTML = ''; //This empties the contents of the drawing surface, like jQuery erase().
	
	// Compute the cellWidth and cellHeight, given the size of the drawing surface
	numCols = maxCols;
	cellWidth = surfaceWidth/numCols;
	numRows = Math.ceil(surfaceHeight/cellWidth);
	cellHeight = surfaceHeight/numRows;
	
	// In other functions we will access the drawing surface using the d3 library. 
	//Here we set the global variable, surface, equal to the d3 selection of the drawing surface
	surface = d3.select('#surface');
	surface.selectAll('*').remove(); // we added this because setting the inner html to blank may not remove all svg elements
	surface.style("font-size","100%");
	// rebuild contents of the drawing surface
	updateSurface();	
};

id=1;
function addDynamicAgents(){
	// Citizens are dynamic agents: they enter the city, commute and then leave
	// We have entering patients of two types "I" and "N"
	// We could specify their probabilities of arrival in any simulation step separately
	// Or we could specify a probability of arrival of all citizens and then specify the probability of a Type I arrival.
	// We have done the latter. probArrival is probability of arrival a citizen and probInfected is the probability of a type I citizen who arrives.
	// First see if a citizen arrives in this sim step. Then, the citizen is generated in one of the buildings of the city. Then the citizen type is selected
 
    if (Math.random()< probArrival){
        statistics[0].count++
        var randombuilding = Math.floor(Math.random() * (Buildings.length));
        var home=Buildings[randombuilding]
        var homerow=home.row;
        var homecol=home.col;
        var targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow)
        var targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol)
        var targetisbuilding=Buildings.filter(function(d){return d.row==targetrow && d.col==targetcol;});
        while (targetisbuilding.length>0){
        targetrow=Math.floor(Math.random() * ((nrow+srow) - srow) +srow)
        targetcol=Math.floor(Math.random() * ((ncol+scol) - scol) +scol)
        targetisbuilding=Buildings.filter(function(d){return d.row==targetrow && d.col==targetcol;});    
        }
        var newcitizen = {"id":id++,"type":"I","location":{"row":homerow,"col":homecol},
        "target":{"row":targetrow,"col":targetcol},"state":COMUTTING,"timeAdmitted":0};
        if (Math.random()<probInfected) {
         newcitizen.type = "I", statistics[1].count++, totinfected++}
        else{newcitizen.type = "N"};	
        //console.log(newcitizen)
    citizens.push(newcitizen);
	}
}
