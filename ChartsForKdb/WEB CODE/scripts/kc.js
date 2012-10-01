/*
 * Charts for kdb+ v2.0
 * Copyright 2012, Carlos Butler
 * Released under the MIT and GNU GPL licenses.
 * For any issues or requests, go to http://bitbucket.org/carlosbutler/charts-for-kdb
 * ==================================================
 * Last Modified: 1st Oct 2012
 */


var KC_IN_DEV=true, // change to false when not in development, doing so will stop any warnings
KC_Q_SERVER_URL="192.168.0.2:5001", // use only the IP address and port number for the q server
KC_WS_SECURE=false, // using a secure WebSocket connection?

// Do not change below variables/constants
kc_ws,kc_wsdata,kc_loadingchart=false,kc_subscribedCharts=[],
KC_WS_HOST_URI=(KC_WS_SECURE?"wss://":"ws://")+KC_Q_SERVER_URL;


/*
 * KC_ChartOptions - Declares all the options for all the charts.
 * The options below are the default options required for that type of chart.
 *
 * The extra options specified in the second parameter will overide those stated in the function below.
 * inputs:
 * -chartType(string)
 * -extraOptions(string) - the extra options need to be supplied in the form of a JSON string, e.g. "{title:'A Title'}" and NOT "{'title':'A Title'}"
 */
function KC_ChartOptions(chartType,extraOptions){
	var chartTypeOptions,mj;
	
	if(chartType.search("jqPlot_")!=-1){
		/*
		 * NOTE: Please see http://www.jqplot.com/docs/files/jqPlotOptions-txt.html for some of the options that are available to use. 
		 * As mentioned by the developer, not all options are specified so there may be more to use.
		 */

		/*
		 * Includes required for all charts:
		 <script type="text/javascript" src="scripts/jqplot/plugins/jqplot.dateAxisRenderer.min.js"></script>
		 <script type="text/javascript" src="scripts/jqplot/plugins/jqplot.categoryAxisRenderer.min.js"></script>
		 <script type="text/javascript" src="scripts/jqplot/plugins/jqplot.highlighter.min.js"></script>
		 <script type="text/javascript" src="scripts/jqplot/plugins/jqplot.cursor.min.js"></script>
		 * plus any chart specific types
		 */
		switch(chartType){
			case "jqPlot_Area":
				chartTypeOptions={
					seriesDefaults:{
						fill:true
						/* Edit below */
					}
				};
				break;

			case "jqPlot_Bar":
			//<script type="text/javascript" src="scripts/jqplot/plugins/jqplot.barRenderer.min.js"></script>
				chartTypeOptions={
					seriesDefaults:{
						renderer:$.jqplot.BarRenderer
						/* Edit below */
					}
				};
				break;

			case "jqPlot_Bubble":
			//<script type="text/javascript" src="scripts/jqplot/plugins/jqplot.bubbleRenderer.min.js"></script>
				chartTypeOptions={
					seriesDefaults:{
						renderer:$.jqplot.BubbleRenderer,
						/* Edit below */
						rendererOptions:{
							bubbleAlpha:0.6,
							highlightAlpha:0.8,
						},
						shadow:true,
						shadowAlpha:0.05
					},
					cursor:{show:false}
				};
				break;

			case "jqPlot_Candlestick":
			//<script type="text/javascript" src="scripts/jqplot/plugins/jqplot.ohlcRenderer.min.js"></script>
				chartTypeOptions={
					series:[{renderer:$.jqplot.OHLCRenderer,rendererOptions:{}}],
					/* Edit below */
					axes:{
						xaxis:{
							renderer:$.jqplot.DateAxisRenderer
						},
						yaxis:{
							tickOptions:{prefix:'€'}
						}
					},
					cursor:{
						zoom:true,
						tooltipOffset: 10,
						tooltipLocation: 'nw'
					},
					highlighter:{
						showMarker:false
					}
				};
				break;

			case "jqPlot_Line":
				chartTypeOptions={
					/* Edit below */
					series:[{rendererOptions:{smooth:true}}],
					axes:{
						yaxis:{
							tickOptions:{prefix:'¥'}
						}
					}
				};
				break;

			case "jqPlot_OHLC":
			//<script type="text/javascript" src="scripts/jqplot/plugins/jqplot.ohlcRenderer.min.js"></script>
				chartTypeOptions={
					series:[{renderer:$.jqplot.OHLCRenderer,rendererOptions:{candleStick:true}}],
					/* Edit below */
					axes:{
						xaxis:{
							renderer:$.jqplot.DateAxisRenderer
						},
						yaxis:{
							tickOptions:{prefix:'€'}
						}
					},
					cursor:{
						zoom:true,
						tooltipOffset: 10,
						tooltipLocation: 'nw'
					},
					highlighter:{
						showMarker:false,
						tooltipAxes:'xy',
						yvalues:4,
						tooltipLocation:'e',
						formatString:'<table style="font-style:italic;font-size:12px;"> \
						<tr><td>date:</td><td>%s</td></tr> \
						<tr><td>open:</td><td>%s</td></tr> \
						<tr><td>hi:</td><td>%s</td></tr> \
						<tr><td>low:</td><td>%s</td></tr> \
						<tr><td>close:</td><td>%s</td></tr></table>'
					}
				};
				break;

			case "jqPlot_Pie":
			//<script type="text/javascript" src="scripts/jqplot/plugins/jqplot.pieRenderer.min.js"></script>
				/*
				 * NOTE: If using a Pie chart on the page, you must remove jqplot.highlighter.min.js.
				 * This is because there is a confilct between the two in the cursor highlighter
				 */
				chartTypeOptions={
					seriesDefaults:{
						renderer: $.jqplot.PieRenderer,
						/* Edit below */
						shadow: false,
						rendererOptions: { padding: 2, sliceMargin: 2, showDataLabels: false }
					},
					legend:{
						show:true,
						location: 'e'
					},
					cursor:{show:false}
		        };
				break;
			default:em(12,[chartType]);return;
		}
		mj=mergeJSON(KC_jqPlot_DefaultOptions,mergeJSON(chartTypeOptions,extraOptions));
	}

	// Flot is still experimental. There is an issue with Dates that will get sorted out at some point.
	else if(chartType.search("Flot_")!=-1){
		switch(chartType){
			case "Flot_Area":
				chartTypeOptions={
					lines:{show:true,fill:true}
					/* Edit below */
				};
				break;

			case "Flot_Bar":
				chartTypeOptions={
					bars:{show:true}
					/* Edit below */
				};
				break;

			case "Flot_Line":
				chartTypeOptions={
					lines:{show:true}
					/* Edit below */
				};
				break;

			case "Flot_LinePoints":
				chartTypeOptions={
					lines:{show:true},
					points:{show:true}
					/* Edit below */
				};
				break;

			case "Flot_Pie":
				chartTypeOptions={
					series:{pie:{show:true}}
					/* Edit below */
				};
				break;

			case "Flot_Points":
				chartTypeOptions={
					points:{show:true}
					/* Edit below */
				};
				break;

			case "Flot_Steps":
				chartTypeOptions={
					lines:{show:true,steps:true}
					/* Edit below */
				};
				break;
			default:em(12,[chartType]);return;
		}mergeJSON
		mj=mergeJSON(KC_Flot_DefaultOptions,mergeJSON(extraOptions,chartTypeOptions));
	}
	return mj;
}
/*
 * KC_ChartExtras - Checks when a chart is loaded whether there are Pause and/or Save As PNG buttons for the user to click.
 * If there are buttons, it will bind them with the appropriate actions.
 * inputs:
 * -c(string) - The DIV ID where the chart is contained, the same as the 5th sublist element in kc_subscribedCharts
 */
function KC_ChartExtras(c){
	// Setup pause button binding
	if($("#"+c+"_pause").length>0)
		$("#"+c+"_pause").click(function(){ KC_ChartPause(c); });

	// Setup show PNG binding
	if($("#"+c+"_png").length>0){
		$("#"+c+"_png").click(function(){
			KC_ChartToPNG(c,false);
		});
	}

	// Setup show PNG and print binding
	if($("#"+c+"_print").length>0){
		$("#"+c+"_print").click(function(){
			KC_ChartToPNG(c,true);
		});
	}	
}
/*
 * KC_ChartPause - Takes chart JavaScript variable name and will either pause or unpause it.
 * This is done by changing the 5th (index 4) sublist element of the specified chart in kc_subscribedCharts between false and true.
 * inputs:
 * -c(string) - The DIV ID where the chart is contained, the same as the 5th sublist element in kc_subscribedCharts
 *
 * NOTE: This was taken out of KC_ChartExtras and turned in to its own function to allow more flexabilty with pausing live updates.
 */
function KC_ChartPause(c){
	for(var i=0;i<kc_subscribedCharts.length;i++){
		if(kc_subscribedCharts[i][2]==c){
			kc_subscribedCharts[i][4]=kc_subscribedCharts[i][4]=="true"?"false":"true";
			$("#"+c+"_pause").val(kc_subscribedCharts[i][4]=="true"?"Pause":"Unpause");
		}
	}
}
/*
 * KC_ChartToPNG - Takes chart JavaScript variable name and will display it in a pop up window.
 * Optionally, it will prompt the user to either print or to save as PDF (if available on OS).
 * inputs:
 * -c(string) - The DIV ID where the chart is contained, the same as the 5th sublist element in kc_subscribedCharts
 * -p(bool) - Whether to show the print prompt
 */
function KC_ChartToPNG(c,p){
	var nw=window.open('','',"toolbar=no,location=no,scrollbars=yes,width=750,height=550");
	nw.document.write("<img src='"+jqplotToImg($("#"+c))+"' />");
	nw.focus();
	if(p)nw.print();
}


/****************************************
 ************ Creating Charts ***********
 ***************************************
/*
 * KC_ChartMake - This takes an array of chart details (see LookAtMe.htm) and creates the charts
 * by calling various other functions.
 * inputs:
 * -a(array) - Array of chart info in the form:
 * [["query","Chart Type","{options}","DIV ID","true|false"live updates],[...],[...]]
 *
 * NOTE: Ensure that the array contains an array in itself, i.e. list of lists
 * nested to exactly one level, even if there is only one chart, e.g. [[chart1]]
 */
function KC_ChartMake(a){
	var toExec="";
	for(var i=0;i<a.length;i++){
		if(typeof a[i][0]!="string"&&typeof a[i][1]!="string"&&typeof a[i][2]!="string"&&typeof a[i][3]!="string"&&typeof a[i][4]!="string"&&typeof a[i][5]!="string")em(15,[]);//need to shorten
		var ai3=a[i][3]!="" ? a[i][3] : "''";

		toExec+='KC_WSSendChartRequest("'+a[i][0]+'","'+a[i][1]+'","'+a[i][2]+'","'+ai3+'","'+a[i][4]+'","'+a[i][5]+'");';
	}
	toExec+='kc_loadingchart=true;';
	clog(toExec);
	setTimeout(toExec,250); // delay is required, otherwise JavaScript gets too ahead of itself
	setTimeout('kc_loadingchart=false;',350);
}


/****************************************
 ********** WebSocket Functions *********
 ****************************************/
/*
 * KC_WSCreate - Creates a WebSocket connection to the Q server.
 */
function KC_WSCreate(){
	try{
		kc_ws=new WebSocket(KC_WS_HOST_URI);
		kc_ws.binaryType='arraybuffer';
		kc_ws.onopen=function(e){clog("WS Connected - status "+this.readyState);};
		kc_ws.onclose=function(e){clog("WS Disconnected - status "+this.readyState);};
		kc_ws.onerror=function(e){clog("WS Error - status"+this.readyState);em(14,[KC_WS_HOST_URI,"WebSocket error."]);};
		kc_ws.onmessage=function(e){
			if(e.data){				
				if(kc_loadingchart){
					kc_wsdata="";
					kc_wsdata=deserialize(e.data);
					eval(kc_wsdata);
				}
				else{
					eval(e.data);
				}
			}
		};
	}
	catch(err){em(14,[KC_WS_HOST_URI,err]);}
}
/*
 * KC_WSUpdateChart - Function that is called each time a table is updated in the active Q session.
 * inputs:
 * -dependantTable(string) - Name of the variable (must always be a table) that was updated in the session
 * -query(string) - Query the chart is displaying
 * -d(string) - CSV in the form of a one line string with \n character for new lines
 */
function KC_WSUpdateChart(dependantTable,query,d){
	timer(true);
	var chartVar,liveUpdate,chartType,newdata,re_TimeStamp;
	// search for the variable name that matches the dependantTable and query
	// kc_subscribedCharts=[dependant table, query, javascript variable name, chart type, live updating]
	for(var i=0;i<kc_subscribedCharts.length;i++){
		if(kc_subscribedCharts[i][0]==dependantTable&&kc_subscribedCharts[i][1]==query){
			chartVar=kc_subscribedCharts[i][2];
			chartType=kc_subscribedCharts[i][3];
			liveUpdate=kc_subscribedCharts[i][4];

			if(liveUpdate=="true"){
				// new data converted to JSON
				newdata=$.parseJSON(CSVtoJSONRowArray(d,true,false));

				if(chartType.search("Flot_")!=-1){
					var currentdata=eval(chartVar+".getData()[0].data.slice(1)");
					currentdata.push(newdata);
					eval(chartVar+".setData([currentdata])");
					eval(chartVar+".setupGrid()");
					eval(chartVar+".draw()");
				}
				else if(chartType.search("jqPlot_")!=-1){
					var currentdata=eval(chartVar+".series[0].data.slice(1)");

					re_TimeStamp=/(\d{4})(\.|-|\/)(\d{2})(\.|-|\/)(\d{2})( |D|d|t)?/;
					// 2012-02-02 12:12:12.123
					if(re_TimeStamp.test(newdata[0])){
						newdata[0]=new Date(newdata[0].toString().replace(re_TimeStamp,"$1-$3-$5T")).getTime();
					}
					// 2012-02-02
					else if(isNaN(new Date(newdata[0]))){
						newdata[0]=new Date(newdata[0]).getTime();
					}
					currentdata.push(newdata);
					eval(chartVar+".series[0].data=currentdata");
					eval(chartVar+".replot({resetAxes:true})");
				}
			}
		}
	}
	timer(false);
}
/*
 * KC_WSSend - Sends a message to the web socket currently used by this client.
 * inputs:
 * -m(string) - Command to send to the server
 */
function KC_WSSend(m){
	try{
		kc_ws.send(serialize(m));
		clog('KC_WSSend(): '+m);
	}
	catch(err){em(13,[err]);}
}
/*
 * KC_WSSendChartRequest - Send different parameters to the Q server so that it returns JavaScript
 * code that can be run in the kc_ws.onmessage function.
 * This is called each time a chart is to be loaded.
 * inputs:
 * -dependantTable(string) - The table the chart is dependant on
 * -query(string) - QSQL query
 * -chartType(string) - The type of chart required
 * -extraOptions(string) - Extra options that must be in the form of a JSON string, e.g. "{title:'A Title'}" and NOT "{'title':'A Title'}"
 * -divID(string) - The HTML attribute 'ID' for a DIV element where the chart is to be displayed
 * -liveUpdate(string) - true|false whether the chart is to accept new data from the server
 */
function KC_WSSendChartRequest(dependantTable,query,chartType,extraOptions,divID,liveUpdate){
	KC_WSSend('.kc.outputChartJS["'+dependantTable+'";"'+query+'";"'+chartType+'";"'+extraOptions+'";"'+divID+'";"'+liveUpdate+'"]');
}


/****************************************
 ****** The Chart Drawing Function ******
 ****************************************/
/*
 * KC_DrawChart - Call to draw a chart on page
 * inputs:
 * -chartType(string)
 * -data(string||JSON) - This can be either CSV or JSON NOTE: isCSV parameter needs to be changed accordinly
 * -extraOptions(string)
 * -divID(string)
 * -isCSV(BOOL) - Must be true if data is string, or false if data is a JSON object
 * -hasColumnNames(BOOL) - True means the first row of data contains column names
 *
 * !!!! NOTE: Temporal data must be converted to a JavaScript time stamp using .kc.JSTS for Flot or
 * the data must be of type15h/z/`datetime for jqPlot !!!!
 */
function KC_DrawChart(dependantTable,query,chartType,data,extraOptions,divID,liveUpdate){
	//,isCSV,hasColumnNames

	kc_subscribedCharts.push([dependantTable,query,divID,chartType,liveUpdate]);

	options=KC_ChartOptions(chartType,extraOptions);

	data=CSVtoJSONRowArray(data,1);
	var te=divID+"=";

	if(chartType.search("jqPlot_")!=-1){
		te+="$.jqplot(divID,["+data+"],options);";
		KC_ChartExtras(divID);
	}
	else if(chartType.search("Flot_")!=-1){
		te+="$.plot($(\"#"+divID+"\"),["+data+"],options);";
		KC_ChartExtras(divID);
	}
	eval(te);
}


/****************************************
 ********** Assist Functions  ***********
 ****************************************/
/*
 * These functions are to assist other functions in the script.
 * However if you change any other functions you will probably need to look at these.
 */
/*
 * isNum(anytype) - Stronger check for number. If it is a string, for example, it will attempt to convert the input to a number. 
 */
function isNum(s){if(isNaN(new Number(s)))return false;else return true;}
function JSONtoCSV(d){
	var str='',line='';
	for(var i=0;i<d.length;i++){
		line='';
		for(var j=0;j<d[i].length;j++){
			line+=d[i][j]+',';
		}
		line=line.slice(0,line.length-1);
		str+=line+'\n';
	}
	return str.slice(0,str.length-1);
}
/*
 * CSVtoJSONRowArray - Will convert a CSV string to a JSON data object. The CSV string must contain \n for a new line. For example 'col1,col2\n"Monday",1\n"Tuesday",2\n"Wednesday",3'. This parser gives the option for the first row to contain column names or not, and whether to return the column names in the output.
 * d(string) - CSV in the form of a string
 * c(BOOL) - Whether the first line are column names
 * rn(BOOL) - Whether to return names (NOTE: If c is false, rn is automatically true)
 *
 * NOTE: Anything that is not a number will be converted to a string.
 */
function CSVtoJSONRowArray(d,c,rn){
	//will output the item in a row as a number, string or null value (null is a string "null")
	//think of better name
	function doDa(i){
		re_TimeStamp=/(\d{4})(\.|-|\/)(\d{2})(\.|-|\/)(\d{2})( |D|d|t)?/;

		if(isNum(i))return i;
		else if(i==null||i.replace(/\s+/g,"")=="")return "null";
		else if(re_TimeStamp.test(i)){
			var a=new Date(i.toString().replace(re_TimeStamp,"$1-$3-$5T"));
			a=a.getTime()-(a.getTimezoneOffset()*60000);
			return a;
		}
		else return "\""+i+"\"";
	}
	try{
		var csvSplit=d.split('\n'),numberRows=csvSplit.length,output="";
		$.each(csvSplit,function(indexRows,row){
				var row=row.split(','),numberRowItems=row.length,tempOutput="";
				/*
				c && rn = first row is names and return the names
				c && !rn = first row is names and do not return them
				!c && rn || !c && !rn = first row is not names
				*/
				if(c&&rn){ //c&&rn
					$.each(row,function(indexRowItem,item){
						if(indexRows==0)tempOutput+="\""+item+"\"";
						else tempOutput+=doDa(item);
						if(indexRowItem<numberRowItems-1)tempOutput+=",";
					});
					output+="["+tempOutput+"]";
					if(indexRows<numberRows-1)output+=",";
				}
				else if((c&&!rn&&indexRows>0)||(!c)){ //c&&!rn - !c&&rn
					tempOutput+="[";
					$.each(row,function(indexRowItem,item){
						tempOutput+=doDa(item);
						if(indexRowItem<numberRowItems-1)tempOutput+=",";
					});
					tempOutput+="]";
					if(indexRows<numberRows-1)tempOutput+=",";
					output+=tempOutput;
				}
		});
		if((numberRows==1)||(!rn&&numberRows<=2))return output;
		else return "["+output+"]";
	}
	catch(err){em(16,[err]);}
}
function mergeJSON(o1,o2){return $.extend(true,{},o1,o2)}
function ea(f,func,m,e){alert("ERROR #"+e+"\nSource File: "+f+"\nFunction: "+func+"\n\nMESSAGE\n"+m)}
function em(n,m){
	if(KC_IN_DEV){
		switch(n){
			case 11:
				ea("kc.js","KC_DrawChart()","Trying to draw the chart type "+m[0]+", that does not exist. Please check to see if the chart is in the KC_CHARTS_AVAILABLE array.",n);
				break;
			case 12:
				ea("kc.js","KC_ChartOptions()","Trying to get the chart options for chart type "+m[0]+", that does not exist. Please check to see if the chart is in the switch statement.",n);
				break;
			case 13:
				ea("kc.js","KC_WSSend()","Tried sending data to the Q server using the WebSocket. The WebSocket returned the error:\n"+m[0],n);
				break;
			case 14:
				ea("kc.js","KC_WSCreate()","Tried creating a WebSocket connection to \""+m[0]+"\" but failed or there is an error with the socket. The error:\n"+m[1],n);
				break;
			case 15:
				ea("kc.js","KC_ChartMake()","Tried sending a non-string parameter. Please do not send a JSON object as this will not work, or non-string type.",n);
				break;
			case 16:
				ea("kc.js","CSVtoJSONRowArray()","Tried creating a JSON data object from a CSV string of data. The error:\n"+m[0],n);
		}
	}
}
function clog(m){if(KC_IN_DEV)console.log("Charts for kdb+: "+m)}
function timer(ss){if(ss)kc_t_s=new Date().getTime();else clog("Timer: Finish "+(new Date().getTime())+" "+((new Date().getTime())-kc_t_s)+"ms")}
function popUp(u,w,h){nw=window.open(u,'newWin',"resizable=no,toolbar=no,location=no,scrollbars=yes,width="+w+",height="+h);nw.focus();}