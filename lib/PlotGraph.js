// set global variables
const limit = 10000; // How many points can be on the graph before sliding occurs
const refreshInterval = 100; // Time between refresh intervals

// set functions to retrieve the data values
function getData1() {
	return statistics[4].count;
}

function getData2() {
	return statistics[5].count;
}

function getData3() {
	return statistics[3].count;
}	
	
// set chart layout to plot out the charts
const layout1 = {
	paper_bgcolor: 'rgba(0,0,0,0)',
	plot_bgcolor: 'rgba(0,0,0,0)',
	xaxis: {title: 'Time'},
	yaxis: {title: 'Kidney and Liver Functionality'}
};

const layout2 = {
	paper_bgcolor: 'rgba(0,0,0,0)',
	plot_bgcolor: 'rgba(0,0,0,0)',
	xaxis: {title: 'Time'},
	yaxis: {title: 'Oxygen Supply'}
};

// plot all charts
Plotly.plot('chart1',[{
		y:[getData1()],
		mode:'lines',
		line: {
			color: 'rgb(255,0,255)',
			width: 3}, name: 'Kidney'
	},

	{
		y:[getData2()],
		mode:'lines',
		line: {
			color: 'rgb(0,0,255)',
			width: 3}, name: 'Liver'
	}

], layout1);

Plotly.plot('chart2',[{
	y:[getData3()],
	mode:'lines',
	line: {
		color: 'rgb(255,0,0)',
		width: 3 }
}], layout2);	

// set refresh interval and graph limit
var cnt = 0;
setInterval(function(){
	if (isRunning == true) {
		Plotly.extendTraces('chart1',{y: [[getData1()], [getData2()]]}, [0, 1]);
		cnt++;
		if(cnt > limit) {
			Plotly.relayout("chart1", {
				xaxis: {
					range: [cnt-limit,cnt]
					}
				});
			}

		Plotly.extendTraces('chart2',{ y:[[getData3()]]}, [0]);
		if(cnt > limit) {
			Plotly.relayout("chart2", {
				xaxis: {
					range: [cnt-limit,cnt]
					}
				});
			}
	}},refreshInterval);