/
* Webstudio for kdb+
* Copyright 2012-2013, Carlos Butler
* Released as closed-source free ware
* For any issues or requests, go to http://bitbucket.org/carlosbutler/webstudio-for-kdb
* ==================================================
* Last Modified: 24th Feb 2013
\
\p 5001
/ Check if outdated
.ws.outdated:{
	p:"\r\n\r\n"; /pattern to remove header info
	od:`:http://carlosbutler.com "GET /Webstudio/u.php?v=",x," http/1.0\r\nhost:carlosbutler.com",p;
	:((od ss p)+(count p))_od /cut the header
	}

/ Max result size
.ws.rs:{
	$[
		(type x)=-7h;.z.ws:{neg[.z.w]@[{{$[x<count y;'"Results too big";y]}[x] -8!value -9!y}x;y;{@[-8!`$x;1 8;:;0x0280]}];}x;
		x~"large";.ws.rs[5242880];  / 5MB
		x~"medium";.ws.rs[524288];  / .5MB
		x~"small";.ws.rs[209715];   / .2MB
	];
	}
.ws.rs["medium"]; / Set default maximum return size

/
* Everthing below is from Charts for kdb+ API
\

/
* Charts for kdb+ v2.0
* Copyright 2012, Carlos Butler
* Released under the MIT and GNU GPL licenses.
* For any issues or requests, go to https://bitbucket.org/carlosbutler/charts-for-kdb
* ==================================================
* Last Modified: 1st Oct 2012
\


\d .kc

/ outputChartJS - Outputs the JavaScript required to create the chart, beforehand adding the query and client handle to the subscribers list.
outputChartJS:{[dependantTable;query;chartType;extraOptions;divID;liveUpdate]
	.kc.addToSubscriberList[dependantTable;query;.z.w];
	:"KC_DrawChart('",dependantTable,"','",query,"','",chartType,"','",.kc.tblToCSV[eval parse query],"',",extraOptions,",'",divID,"','",liveUpdate,"');";
	}


/
* The subscription system has subscibers (clients), topics (queries) and clientID (handle).
* Charts will only update when a dependantTable has changed, and the time between the last update and
* now is greater than .kc.uf. Only that last row in the table will be sent to the client.
*
* Ensure the newest data is at the bottom of the table. Otherwise adapt the query (xasc) so that the
* newest row of information is at the bottom.
\
subscriberList:([]dependantTable:(enlist "test_table");query:(enlist "example query");clients:(enlist 1 2i);lastUpdate:(enlist 2012.09.30D12:00:00.000));

/ addToSubscriberList - Searches through the table and checks to see if a query exists, if so then add the client as a subscriber, if not then add the query to the list with the client.
addToSubscriberList:{[dependantTable;chartQuery;handle]
	$[not chartQuery in .kc.subscriberList.query;
		`.kc.subscriberList insert (dependantTable;chartQuery;enlist handle;.z.P);

	not handle in (exec from .kc.subscriberList where query~\:chartQuery)[`clients];
		[newClients:enlist (handle,raze exec clients from .kc.subscriberList where query~\:chartQuery);
		update clients:newClients from `.kc.subscriberList where query~\:chartQuery];
	]
	}

/ removeFromSubscriberList - Search through the table to remove the client from any queries attached to it.
removeFromSubscriberList:{[handle]
	/get handle locations (indices)
	hl:handle in ' .kc.subscriberList.clients;

	/new clients
	nc:exec clients from .kc.subscriberList where hl;
	nc:nc _' nc ?' handle;

	/update table
	update clients:nc from `.kc.subscriberList where hl;

	/remove queries with no clients
	delete from `.kc.subscriberList where clients~\:`int$();
	}

/ updateChart - Called by .z.vs to update a chart used by a client(s)
updateChart:{[tableUpdated]
	tu:string tableUpdated;

	if[tu in .kc.subscriberList.dependantTable;[
		/select list of queries and clients that use the table just updated
		l:select from .kc.subscriberList where dependantTable~\:tu;

		/run query and send to every subscribed client
		c:0;
		do[count l;
			/check last update is greater than .kc.uf
			if[((zpn:.z.P)-l[c]`lastUpdate)>.kc.uf;[
				.kc.evalQuerySendToClients[l[c];tu]; /send update for chart to clients
				update lastUpdate:enlist zpn from `.kc.subscriberList where dependantTable~\:l[c]`dependantTable,query~\:l[c]`query,lastUpdate=l[c]`lastUpdate;
				c+:1; /increase counter
				]
			]
		]
	]];
	}

/ evalQuerySendToClients - Only ever called by updateChart, it takes a dictionary with a statement and list of clients to update
evalQuerySendToClients:{[l;tu]
	ur:enlist last eval parse raze l`query; /updated row
	ts:"KC_WSUpdateChart('",tu,"','",(raze l`query),"','",.kc.tblToCSV[ur],"');"; /to send
	(raze neg l`clients) @\: ts;
	}

/ tblToCSV - Convert a table to a one line CSV with escaped new line characters. 
tblToCSV:{"\\n"sv(.h.cd x)}

/ UTS - Converts a temporal type to a UNIX timestamp
UTS:{:"j"$((86400*("f"$"z"$x))+946684800)} /946... -> seconds between 1970.01.01-2000.01.01

/ JSTS - Converts a temporal type to a JavaScript timestamp (has milliseconds)
JSTS:{:("j"$((86400*("f"$"z"$x))+946684800))*1000}

\d .