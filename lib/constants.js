var WINDOWBORDERSIZE = 10;
var HUGE = 999999; //Sometimes useful when testing for big or small numbers
var animationDelay = 300; //controls simulation and transition speed
var isRunning = false; // used in simStep and toggleSimStep
var surface; // Set in the redrawWindow function. It is the D3 selection of the svg drawing surface
var simTimer; // Set in the initialization function

//The drawing surface will be divided into logical cells
var maxCols = 40;
var cellWidth; //cellWidth is calculated in the redrawWindow function
var cellHeight; //cellHeight is calculated in the redrawWindow function

//You are free to change images to suit your purpose. These images came from icons-land.com. 
// The copyright rules for icons-land.com require a backlink on any page where they appear. 
// See the credits element on the html page for an example of how to comply with this rule.
const urlInfected = "images/Zombie.png";
const urlNotInfected = "images/Mask.png";

//a citizen may be COMUTTING; LEAVING (i.e. returning home); or Exited (i.e. left the system); 
const COMUTTING=0;
const LEAVING=1;
const EXITED = 2;

// ctizens is a dynamic list, initially empty
citizens = [];

// We can section our screen into different areas. In this model, the areas represent solely the city.
var srow=2
var nrow=maxCols/2.1-3
var scol=2
var ncol=maxCols/2.1-2

var areas =[
 {"label":"City","startRow":srow,"numRows":nrow,"startCol":scol,"numCols":ncol,"color":"#FFCC99"},	
]

// We need to add buildings to the city. These buildings should be equally spaced from 3 to 3 cells. You can modify the spacing
// Buildings is a empty list
var Buildings = [];

//Function used to compute the coordinates of each building
// Compute feasible row coordinates and column coordinates
function range(start, end, step = 1) {
	const len = Math.floor((end - start) / step) + 1
	return Array(len).fill().map((_, idx) => start + (idx * step))
  }
  var rowBuildings = range(srow, srow+nrow, 3);
  var colBuildings = range(scol+1, scol+ncol, 3);
 
//Create all possible combinations of building coordinates
  for (i = 0; i < rowBuildings.length; i++) {
	for (j = 0; j < colBuildings.length; j++){
		var newbuilding ={"row":rowBuildings[i], "col":colBuildings[j]};
	    Buildings.push(newbuilding); 
	}
  }
  

var currentTime = 0;
var maxrowbuilding=Math.max.apply(Math, rowBuildings);

// At each simulation step we want to know how many citizens are commuting, how many are infected,
// what is the average % of citizens infected; What is the R0, i.e. how many citizens and infected citizen infectes on average

var statistics = [
    {"name":"No. Citizens Commuting: ","location":{"row":maxrowbuilding-3,"col":scol+ncol},"count":0},
    {"name":"No. Citizens Infected: ","location":{"row":maxrowbuilding-2,"col":scol+ncol},"count":0},
    {"name":"Avg % Citizens Infected: ","location":{"row":maxrowbuilding-1,"col":scol+ncol},"count":0},
    {"name":"R0: ","location":{"row":maxrowbuilding,"col":scol+ncol},"count":0}
    ];

var cumratioinfected=0;
var totinfected=0;
var totnewinfected=0

// The probability of a citizen leaving home (probArrival); The probability of a citizen returning home (probDeparture).
var probArrival = 0.5;
var probDeparture = 0.2;

// We have different types of citizes (infected=I and notinfected=N) according to a probability, probInfected.
var probInfected = 0.1;

// These variables define what is the probability of getting infected when a notinfected citizen is near to a infected citizen, 
// It also specifies the minimum distance for an infection opportunity to take place
var InfectionRate=0.2;
var DistTransmission=4;