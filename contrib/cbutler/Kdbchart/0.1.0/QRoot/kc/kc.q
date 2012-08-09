/
* KdbChart API v0.1.0
* http://kdbchart.com/
* Copyright 2012, Carlos Butler
* Released under the MIT and GNU GPL licenses.
* See http://kdbchart.com/license for more.
* For any issues or requests, please submit a ticket here http://kdbchart.com/issues
* ==================================================
* Name: kc.q - Q Chart Functions
* Last Modified: 7th Aug 2012
* Usage: This file contains all of the Q functions and settings for the API.
\
\c 2000 2000
\l kc/td/td.q /remove in production

.z.ws:{neg[.z.w] -8!value -9!x;} /set web socket function to run

\d .kc
/
* tblToCSV - Converts a table to a one line CSV with escaped new line characters. 
* In all cases tested, sv (scaler from vector) is quicker than raze to achieve 
* the same task. This may be different for you.
\
tblToCSV:{"\\n"sv(.h.cd x)}

/
* outputJS - Outputs the JavaScript required to create the chart. This function is
* called by the web socket client to return the JavaScript which is then run using
* the JavaScript function eval(). For more information on the drawChart() function,
* see kc.js.
\
outputJS:{[command;chartType;extraOptions;divID]:"KC_DrawChart('",chartType,"','",.kc.tblToCSV[command],"',\"",extraOptions,"\",'",divID,"',1,1);";}
\d .

/
CODE FOR POTENTIAL FUTURE USE (THOUGH YOU MAY FIND IT USEFUL NOW)
tblToCSV:{raze(.h.cd x),\:"\\n"} 	/ substantially slower than current implementation (to keep?)
.z.ws:{neg[.z.w] -3!value x} 		/ not using serialize or deserialize in c.js
.h.hc:{x} 							/ remove percent-encdoing of "<" <=> "%lt"
.h.hp:.h.hy[`htm]{` sv x}@; 		/ return no HTML at all in HTTP request

chartAPI: maybe `google||`jqplot||`flot
/\l kc/settings.src.q
\
