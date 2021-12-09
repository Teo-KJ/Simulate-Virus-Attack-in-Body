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
const oxygenMolecule = "images/oxygen.png", oxygenatedBloodCell = "images/blood_with_oxygen.png", 
bloodCell = "images/blood_cell.png", airSacPic = "images/airSac.png",
kidneyPic = "images/kidney.png", liverPic = "images/liver.png";

//a citizen may be COMUTTING; LEAVING (i.e. returning home); or Exited (i.e. left the system); 
const ENTERING=0;
const LEAVING=1;
const EXITED = 2;

// // ctizens is a dynamic list, initially empty
// bloodCells = [];

// We can section our screen into different areas. In this model, the areas represent solely the city.
var srow=7
var nrow=maxCols/2.1-13
var scol=2
var ncol=maxCols/2.1-2

var areas = [
 {"label":"City","startRow":srow,"numRows":nrow,"startCol":scol,"numCols":ncol,"color":"#FFB6C1"},	
]

var kidneyLoc = [
  {"startRow":srow+60,"startCol":scol+5},	
]

var liverLoc = [
  {"startRow":srow+60,"startCol":scol+25},
]

// Create an array of waitingSeats using functional programming
airSacs = []; // this is a dynamic array that will be sized by the number of cells (seats) in the waiting area
var numOfSacs = 3;
var init = 10, step = 10;

for (i = 0; i < numOfSacs; i++) {
  airSacs.push({"startRow":srow, "startCol":init})
  init = init + step;
}

var currentTime = 0;

// At each simulation step we want to know how many citizens are commuting, how many are infected,
// what is the average % of citizens infected; What is the R0, i.e. how many citizens and infected citizen infectes on average

var statistics = [
  {"name":"No. Red Blood Cells: ","location":{"row":srow+nrow-4,"col":scol+ncol},"count":0},
  {"name":"No. Oxygenated Blood Cells: ","location":{"row":srow+nrow-3,"col":scol+ncol},"count":0},
  {"name":"No. Oxygen Molecules: ","location":{"row":srow+nrow-2,"col":scol+ncol},"count":0},
  {"name":"Oxygen Supply in Body: ","location":{"row":srow+nrow-1,"col":scol+ncol},"count":0},
  {"name":"Kidney Functionality: ","location":{"row":srow+nrow,"col":scol+ncol},"count":0},
  {"name":"Liver Functionality: ","location":{"row":srow+nrow+1,"col":scol+ncol},"count":0}
  ];

var cumulativeOxygenatedCells=0;
var totalOxygenatedCells=0;
var totnewinfected=0

// The probability of a citizen leaving home (probArrival); The probability of a citizen returning home (probDeparture).
var probArrival = 0.7;
var probDeparture = 0.2;

// We have different types of citizes (infected=I and notinfected=N) according to a probability, probInfected.
var viralLoad = 0.2;

var oxygenMolecules = [];

// These variables define what is the probability of getting infected when a notinfected citizen is near to a infected citizen, 
// It also specifies the minimum distance for an infection opportunity to take place
var kidneyFunctionality=0.8;
var liverFunctionality=0.8;

id=1;