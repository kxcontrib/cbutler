/*
 * KdbChart API v0.1.0
 * http://kdbchart.com/
 * Copyright 2012, Carlos Butler
 * Released under the MIT and GNU GPL licenses.
 * See http://kdbchart.com/license for more.
 * For any issues or requests, please submit a ticket here http://kdbchart.com/issues
 * ==================================================
 * Name: kc.js - JavaScript Chart Functions
 * Last Modified: 9th Aug 2012
 * Usage: This file contains all of the JavaScript functions for the API.
 *
 * NOTE: It is entierly written by me. Change as you wish.
 *
 * https://developers.google.com/chart/interactive/docs/gallery
 */

/****************************************
 ******* Settings You Must Change *******
 ****************************************/
var KC_IN_DEV=true, // change to false when not in development, doing so will stop any warnings
KC_Q_SERVER_URL="192.168.0.2:5001", // use only the IP address and port number for the q server
KC_WS_SECURE=false, // using a secure WebSocket connection?

// To add more chart types, simply add the type here (check the Google chart API first to see if they exist, note that it is case sensitive). If the chart type does not use continuous or discrete data in the first column, add the chart type to KC_CHARTS_AVAILABLE_NONCONTINUOUS - this is very important otherwise the scale of the charts may show incorrectly.
KC_CHARTS_AVAILABLE=["AreaChart","BarChart","CandlestickChart","ColumnChart","ComboChart","LineChart","PieChart"],
KC_CHARTS_AVAILABLE_NONCONTINUOUS=["ScatterChart"],

// do not change next line
kc_ws,kc_wsdata,KC_WS_HOST_URI=(KC_WS_SECURE?"wss://":"ws://")+KC_Q_SERVER_URL;

/*
 * KC_ChartOptions - Declares all the options for all the charts.
 * The options stated below are the ones that will most likely need to be changed, however there are plenty more options available - see the relevant Google chart page for more options.
 *
 * The extra options specified in the second parameter will overide those stated in the function below.
 * inputs:
 * -chartType(string)
 * -extraOptions(string) - the extra options need to be supplied in the form of a JSON string, e.g. "{title:'A Title'}" and NOT "{'title':'A Title'}"
 */
function KC_ChartOptions(chartType,extraOptions){
    var options;
    // default options for each chart - can be changed individually in the switch statement
    var axisTitlesPosition='out',
    backgroundColorFill='whitesmoke',
    enableInteractivity=true,
    fontName='Arial',
    fontSize='auto',
    titlePosition='out';
    switch(chartType){
        case "AreaChart":
            // https://developers.google.com/chart/interactive/docs/gallery/areachart
            options={
                axisTitlesPosition:axisTitlesPosition,
                backgroundColor:{fill:backgroundColorFill},
                enableInteractivity:enableInteractivity,
                fontName:fontName,
                fontSize:fontSize,
                titlePosition:titlePosition,
                //specific to area chart
                areaOpacity:0.3,
                isStacked:false
            }
            break;
        case "BarChart":
            // https://developers.google.com/chart/interactive/docs/gallery/barchart
            options={
                axisTitlesPosition:axisTitlesPosition,
                backgroundColor:{fill:backgroundColorFill},
                enableInteractivity:enableInteractivity,
                fontName:fontName,
                fontSize:fontSize,
                titlePosition:titlePosition,
                //specific to bar chart
                isStacked:false
            }
            break;
        case "CandlestickChart":
            // https://developers.google.com/chart/interactive/docs/gallery/candlestickchart
            options={
                axisTitlesPosition:axisTitlesPosition,
                backgroundColor:{fill:backgroundColorFill},
                enableInteractivity:enableInteractivity,
                fontName:fontName,
                fontSize:fontSize,
                titlePosition:titlePosition,
                //specific to candlestick chart
                candlestick:{fallingColor:{fill:'rgb(250,250,250)'},risingColor:{fill:'#3366cc'}},
                legend:'none'
            }
            break;
        case "ColumnChart":
            // https://developers.google.com/chart/interactive/docs/gallery/columnchart
            options={
                axisTitlesPosition:axisTitlesPosition,
                backgroundColor:{fill:backgroundColorFill},
                enableInteractivity:enableInteractivity,
                fontName:fontName,
                fontSize:fontSize,
                titlePosition:titlePosition
                //specific to column chart
            }
            break;
        case "ComboChart":
            // https://developers.google.com/chart/interactive/docs/gallery/combochart
            options={
                axisTitlesPosition:axisTitlesPosition,
                backgroundColor:{fill:backgroundColorFill},
                enableInteractivity:enableInteractivity,
                fontName:fontName,
                fontSize:fontSize,
                titlePosition:titlePosition
                //specific to combo chart
            }
            break;
        case "LineChart":
            // https://developers.google.com/chart/interactive/docs/gallery/linechart
            options={
                axisTitlesPosition:axisTitlesPosition,
                backgroundColor:{fill:backgroundColorFill},
                enableInteractivity:enableInteractivity,
                fontName:fontName,
                fontSize:fontSize,
                titlePosition:titlePosition
                //specific to line chart
            }
            break;
        case "PieChart":
            // https://developers.google.com/chart/interactive/docs/gallery/piechart
            options={
                axisTitlesPosition:axisTitlesPosition,
                backgroundColor:{fill:backgroundColorFill},
                enableInteractivity:enableInteractivity,
                fontName:fontName,
                fontSize:fontSize,
                titlePosition:titlePosition
                //specific to pie chart
            }
            break;
        case "ScatterChart":
            // https://developers.google.com/chart/interactive/docs/gallery/scatterchart
            options={
                axisTitlesPosition:axisTitlesPosition,
                backgroundColor:{fill:backgroundColorFill},
                enableInteractivity:enableInteractivity,
                fontName:fontName,
                fontSize:fontSize,
                titlePosition:titlePosition,
                //specific to scatter chart
                legend:'none'
            }
            break;
        default:em(12,[chartType]);return;
    }
    return mergeJSON(options,extraOptions);
}


/****************************************
 ************ Creating Charts ***********
 ****************************************/
/*
 * KC_ChartMake - This takes an array of chart details (see LookAtMe.htm) and creates the charts
 * by calling various other functions.
 * inputs:
 * -a(array) - Array of chart info in the form:
 * [["QSQL","Chart Type (see KC_CHARTS_AVAILABLE)","Title","DIV ID"],[...],[...]]
 *
 * NOTE: Ensure that the array contains an array in itself, i.e. list of lists
 * nested to exactly one level, even if there is only one chart, e.g. [[chart1]]
 */
function KC_ChartMake(a){
    var toExec="";
    for(var i=0;i<a.length;i++){
        if(KC_IN_DEV&&typeof a[i][2]!="string")em(15,[]);
        toExec+="KC_WSSendChartRequest('"+a[i][0]+"','"+a[i][1]+"',\""+a[i][2]+"\",'"+a[i][3]+"');";
    }
    setTimeout(toExec,200); // delay is required, otherwise JavaScript gets too ahead of itself
}


/****************************************
 ********** WebSocket Functions *********
 ****************************************/
/*
 * KC_WSCreate - Creates a web socket connection to the Q server.
 */
function KC_WSCreate(){
    try{
        kc_ws=new WebSocket(KC_WS_HOST_URI);
        kc_ws.binaryType='arraybuffer';
        kc_ws.onopen=function(e){clog("WS Connected - status "+this.readyState);};
        kc_ws.onclose=function(e){clog("WS Disconnected - status "+this.readyState);};
        kc_ws.onerror=function(e){clog("WS Error - status"+this.readyState);};
        kc_ws.onmessage=function(e){
            if(e.data){
                kc_wsdata=deserialize(e.data);
                clog("Received: "+kc_wsdata);
                eval(kc_wsdata);
            }
        };
    }
    catch(err){em(14,[KC_WS_HOST_URI,err]);}
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
 * -command(string) - QSQL command
 * -chartType(string) - The type of chart required, see KC_CHARTS_AVAILABLE variable at top
 * -extraOptions(string) - Extra options that must be in the form of a JSON string, e.g. "{title:'A Title'}" and NOT "{'title':'A Title'}"
 * -divID(string) - The HTML attribute 'ID' for a DIV element where the chart is to be displayed
 */
function KC_WSSendChartRequest(command,chartType,extraOptions,divID){
    KC_WSSend('.kc.outputJS['+command+';"'+chartType+'";"'+extraOptions+'";"'+divID+'"]');
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
 * NOTE: If any new chart types are added, they may need to be added to KC_CHARTS_AVAILABLE
 */
function KC_DrawChart(chartType,data,extraOptions,divID,isCSV,hasColumnNames){
    // the true parameter states the first column is discrete or continuous
    var fc=true;
    // this checks to see if the chart type requested uses discrete or continuous data in the first column. if it doesn't then the CSVtoJSONRowArray returns data slightly differently.
    if(KC_CHARTS_AVAILABLE_NONCONTINUOUS.indexOf(chartType)!=-1)fc=false;

    // create JSON if data is CSV
    if(isCSV)data=$.parseJSON(CSVtoJSONRowArray(data,fc));

    // create data table using the CSV - false means headers in first row (google swaps it)
    var dataTable=google.visualization.arrayToDataTable(data,!hasColumnNames);

    if(KC_CHARTS_AVAILABLE.indexOf(chartType)!=-1||KC_CHARTS_AVAILABLE_NONCONTINUOUS.indexOf(chartType)!=-1){
        eval("var chart=new google.visualization."+chartType+"(document.getElementById(divID));");
        eval("extraOptions="+extraOptions+";");
        chart.draw(dataTable,KC_ChartOptions(chartType,extraOptions));
    }else em(11,[chartType]);
}


/****************************************
 ********** Assist Functions  ***********
 ****************************************/
/*
 * You need not worry yourself about these functions as they simply assist other functions in the script.
 * However if you change any other functions you will need to look at these.
 */
function isNum(s){if(isNaN(new Number(s)))return false;else return true;}
function CSVtoJSONRowArray(d,c){
    var ls=d.split('\n'),numL=ls.length;o="[";
    $.each(ls,function(idxL,l){
            var is=l.split(','),numI=is.length;
            o+="[";
            $.each(is,function(idxIs,i){
                //this if else is really ugly, needs to change at some point
                if(c){
                    if(idxIs==0)o+="\""+i+"\"";
                    else if(!isNum(i))o+="\""+i+"\"";
                    else if(i==null||i.replace(/\s+/g,"")=="")o+="null";else o+=i;
                }
                else{
                    if(!isNum(i))o+="\""+i+"\"";
                    else if(i==null||i.replace(/\s+/g,"")=="")o+="null";else o+=i;
                }
                if(idxIs<numI-1)o+=",";
            });
            o+="]";
            if(idxL<numL-1)o+=",";
    });
    return o+="]";
}
function mergeJSON(o1,o2){
    var o3={};
    for(var a in o1){o3[a]=o1[a];}
    for(var a in o2){o3[a]=o2[a];}
    return o3;
}
function ea(f,func,m,e){alert("ERROR #"+e+"\nSource File: "+f+"\nFunction: "+func+"\n\nMESSAGE\n"+m+"\n\nEXTRA INFORMATION\nhttp://kdbchart.com/e/?e="+e);}
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
                ea("kc.js","KC_WSSend()","Tried sending data to the Q server using the WebSocket. The WebSocket returned the error:\n\""+m[0],n);
                break;
            case 14:
                ea("kc.js","KC_WSCreate()","Tried creating a WebSocket connection to \""+m[0]+"\" but failed. The error:\n\""+m[1],n);
                break;
            case 15:
                ea("kc.js","KC_ChartMake()","Tried sending options that were not in a string. Please do not send a JSON object as this will not work.",n);
                break;
        }
    }
}
function clog(m){if(KC_IN_DEV)console.log("Kdbchart: "+m);}