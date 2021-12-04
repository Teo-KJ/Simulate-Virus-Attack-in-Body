var WINDOWBORDERSIZE = 10;
var HUGE = 999999; //Sometimes useful when testing for big or small numbers
var animationDelay = 200; //controls simulation and transition speed
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
const urlPatientA = "images/People-Patient-Female-icon.png";
const urlPatientB = "images/People-Patient-Male-icon.png";
const urlDoctor1 = "images/Doctor_Female.png";
const urlDoctor2 = "images/Doctor_Male.png";
const urlReceptionist ="images/receptionist-icon.png"

var doctorRow = 10;
var doctorCol = 20;
var receptionistRow = 1;
var receptionistCol = 20;

//a patient enters the hospital UNTREATED; he or she then is QUEUEING to be treated by a doctor; 
// then INTREATMENT with the doctor; then TREATED;
// When the patient is DISCHARGED he or she leaves the clinic immediately at that point.
const UNTREATED=0;
const WAITING=1;
const STAGING=2; 
const INTREATMENT =3;
const TREATED=4;
const DISCHARGED=5;
const EXITED = 6;

// The doctor can be either BUSY treating a patient, or IDLE, waiting for a patient 
const IDLE = 0;
const BUSY = 1;

// There are two types of caregivers in our system: doctors and receptionists
const DOCTOR = 0;
const RECEPTIONIST = 1;
console.log(RECEPTIONIST )

// patients is a dynamic list, initially empty
var patients = [];
// caregivers is a static list, populated with a receptionist and a doctor	
var caregivers = [
    {"type":DOCTOR,"label":"Doctor","location":{"row":doctorRow,"col":doctorCol},"state":IDLE},
	{"type":RECEPTIONIST,"label":"Receptionist","location":{"row":receptionistRow,"col":receptionistCol},"state":IDLE}
];
var doctor = caregivers[0]; // the doctor is the first element of the caregivers list.

// We can section our screen into different areas. In this model, the waiting area and the staging area are separate.
var areas =[
 {"label":"Waiting Area","startRow":4,"numRows":5,"startCol":15,"numCols":11,"color":"pink"},
 {"label":"Staging Area","startRow":doctorRow-1,"numRows":1,"startCol":doctorCol-2,"numCols":5,"color":"red"}	
]
var waitingRoom = areas[0]; // the waiting room is the first element of the areas array

var currentTime = 0;
var statistics = [
{"name":"Average time in clinic, Type A: ","location":{"row":doctorRow+3,"col":doctorCol-4},"cumulativeValue":0,"count":0},
{"name":"Average time in clinic, Type B: ","location":{"row":doctorRow+4,"col":doctorCol-4},"cumulativeValue":0,"count":0}
];

// The probability of a patient arrival needs to be less than the probability of a departure, else an infinite queue will build.
// You also need to allow travel time for patients to move from their seat in the waiting room to get close to the doctor.
// So don't set probDeparture too close to probArrival.
var probArrival = 0.25;
var probDeparture = 0.4;

// We can have different types of patients (A and B) according to a probability, probTypeA.
// This version of the simulation makes no difference between A and B patients except for the display image
// Later assignments can build on this basic structure.
var probTypeA = 0.5;

// To manage the queues, we need to keep track of patientIDs.
var nextPatientID_A = 0; // increment this and assign it to the next admitted patient of type A
var nextPatientID_B = 0; // increment this and assign it to the next admitted patient of type B
var nextTreatedPatientID_A =1; //this is the id of the next patient of type A to be treated by the doctor
var nextTreatedPatientID_B =1; //this is the id of the next patient of type B to be treated by the doctor