/ CANDLESTICK CHART
kc_cc_1:([]Date:`date$();Open:`float$();High:`float$();Low:`float$();Close:`float$();Volume:`int$();AdjClose:`float$());
`kc_cc_1 insert ("DFFFFIF";",") 0:`:kc/td/kc_cc_1.csv;
delete from `kc_cc_1 where Date=0N;
kc_cc_1:`Date xasc kc_cc_1;

/ PIE CHART
kc_pie_1:([]Task:("Work";"Eat";"Commute";"Disliking Train";"Day Dreaming";"Sleep");Hours:(8 1 3 2 1.5 8.5));

/ LIVE DATA
kc_line_1:([]dt:enlist 2012.01.01T09:00:00;val:enlist 300.0);
do[200;`kc_line_1 insert ((exec max (dt) from kc_line_1)+0.00001157406;(1?21.0)[0]+290.0)];

/ BUBBLE
kc_bubble_1:([]name:("Honda";"Alfa Romeo";"Mazda";"Mercedes-Benz";"Pagani";"Jaguar";"Vespa");val1:11 45 24 50 18 7 2;val2:123 92 104 23 17 89 13;val3:1236 1067 1276 1310 639 864 1026);

/ Updating
/`kc_line_1 insert ((exec max (dt) from kc_line_1)+.00001157406;(1?30.0)[0]+290.0)
/.z.ts:{`kc_line_1 insert ((exec max (dt) from kc_line_1)+.00001157406;(1?30.0)[0]+290.0)}
/\t 250