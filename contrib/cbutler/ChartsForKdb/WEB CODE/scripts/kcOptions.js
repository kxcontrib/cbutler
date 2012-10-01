/*
 * Charts for kdb+ v2.0
 * Copyright 2012, Carlos Butler
 * Released under the MIT and GNU GPL licenses.
 * For any issues or requests, go to https://bitbucket.org/carlosbutler/charts-for-kdb
 * ==================================================
 * Last Modified: 1st Oct 2012
 */

/*
 * KC_jqPlot_DefaultOptions is used to specify all default options for every chart made with jqPlot API.
 * Any options stated either when calling calling KC_ChartMake or in kc.js will overwrite those stated here.
 */
var KC_jqPlot_DefaultOptions={
	// It is recommeded that for high frequency updating charts that shadows are disabled as it is CPU intensive.
	seriesDefaults:{
		shadow:false,
		markerOptions:{shadow:false}
	},
	grid:{shadow:false},
	cursor:{show:true,zoom:false}
};


/*
 * KC_Flot_DefaultOptions is used to specify all default options for every chart made with the flot API.
 * These were retrieved from the flot JavaScript file.
 * Any options stated either when calling calling KC_ChartMake or are in kc.js will overwrite those stated here.
 */ 
var KC_Flot_DefaultOptions={
	// the color theme used for graphs
	colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
	legend: {
		show: true,
		noColumns: 1, // number of colums in legend table
		labelFormatter: null, // fn: string -> string
		labelBoxBorderColor: "#ccc", // border color for the little label boxes
		container: null, // container (as jQuery object) to put legend in, null means default on top of graph
		position: "ne", // position of default legend container within plot
		margin: 5, // distance from grid edge to default legend container within plot
		backgroundColor: null, // null means auto-detect
		backgroundOpacity: 0.85 // set to 0 to avoid background
	},
	xaxis: {
		show: null, // null = auto-detect, true = always, false = never
		position: "bottom", // or "top"
		mode: null, // null or "time"
		color: null, // base color, labels, ticks
		tickColor: null, // possibly different color of ticks, e.g. "rgba(0,0,0,0.15)"
		transform: null, // null or f: number -> number to transform axis
		inverseTransform: null, // if transform is set, this should be the inverse function
		min: null, // min. value to show, null means set automatically
		max: null, // max. value to show, null means set automatically
		autoscaleMargin: null, // margin in % to add if auto-setting min/max
		ticks: null, // either [1, 3] or [[1, "a"], 3] or (fn: axis info -> ticks) or app. number of ticks for auto-ticks
		tickFormatter: null, // fn: number -> string
		labelWidth: null, // size of tick labels in pixels
		labelHeight: null,
		reserveSpace: null, // whether to reserve space even if axis isn't shown
		tickLength: null, // size in pixels of ticks, or "full" for whole line
		alignTicksWithAxis: null, // axis number or null for no sync

		// mode specific options
		tickDecimals: null, // no. of decimals, null means auto
		tickSize: null, // number or [number, "unit"]
		minTickSize: null, // number or [number, "unit"]
		monthNames: null, // list of names of months
		timeformat: null, // format string to use
		twelveHourClock: false // 12 or 24 time in time mode
	},
	yaxis: {
		autoscaleMargin: 0.02,
		position: "left" // or "right"
	},
	xaxes: [],
	yaxes: [],
	series: {
		points: {
			show: false,
			radius: 3,
			lineWidth: 2, // in pixels
			fill: true,
			fillColor: "#ffffff",
			symbol: "circle" // or callback
		},
		lines: {
			// we don't put in show: false so we can see
			// whether lines were actively disabled 
			lineWidth: 1.5, // in pixels
			fill: false,
			fillColor: null,
			steps: false
		},
		bars: {
			show: false,
			lineWidth: 2, // in pixels
			barWidth:1, // in units of the x axis
			fill: true,
			fillColor: null,
			align: "center", // or "center" 
			horizontal: false
		},
		shadowSize:0
	},
	grid: {
		show: true,
		aboveData: false,
		color: "#545454", // primary color used for outline and labels
		backgroundColor: null, // null for transparent, else color
		borderColor: null, // set if different from the grid color
		tickColor: null, // color for the ticks, e.g. "rgba(0,0,0,0.15)"
		labelMargin: 5, // in pixels
		axisMargin: 8, // in pixels
		borderWidth: 2, // in pixels
		minBorderMargin: null, // in pixels, null means taken from points radius
		markings: null, // array of ranges or fn: axes -> array of ranges
		markingsColor: "#f4f4f4",
		markingsLineWidth: 2,
		// interactive stuff
		clickable: false,
		hoverable: false,
		autoHighlight: true, // highlight in case mouse is near
		mouseActiveRadius: 10 // how far the mouse can be away to activate an item
	},
	hooks: {}
};