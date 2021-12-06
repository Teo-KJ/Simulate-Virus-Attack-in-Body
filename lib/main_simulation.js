// This next function is executed when the script is loaded. It contains the page initialization code.
(function() {
	// Your page initialization code goes here
	// All elements of the DOM will be available here
	window.addEventListener("resize", redrawWindow); //Redraw whenever the window is resized
	simTimer = window.setInterval(simStep, animationDelay); // call the function simStep every animationDelay milliseconds
	// Initialize the slider bar to match the initial animationDelay;
	
	redrawWindow();
})();

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
