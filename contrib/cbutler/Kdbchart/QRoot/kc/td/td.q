/ some table fruit
td_people:([ID:1 2 3]name:`Carlos`Lucius`Marvin);
td_fruit:([ID:1 2 3]name:`Kumquat`Rambutan`Jackfruit);
td_consumption:([]person:`td_people$();fruit:`td_fruit$();quantity:`int$());
`td_consumption insert (1 1 1 2 2 2 3 3 3;1 2 3 1 2 3 1 2 3;10 0N 20 11 18 0N 8 22 17);

/ AREA/BAR/COLUMN/LINE/SCATTER CHART
kc_sales:([]Year:(2004 2005 2006 2007);Sales:(1000 1170 660 1030);Expenses:(400 460 1120 540));

/ CANDLESTICK CHART
kc_cc_1:([]Date:`date$();Open:`float$();High:`float$();Low:`float$();Close:`float$();Volume:`int$();AdjClose:`float$());
`kc_cc_1 insert ("DFFFFIF";",") 0:`:kc/td/kc_cc_1.csv;
delete from `kc_cc_1 where Date=0N;

kc_cc_2:([]Date:`date$();Open:`float$();High:`float$();Low:`float$();Close:`float$();Volume:`int$();AdjClose:`float$());
`kc_cc_2 insert ("DFFFFIF";",") 0:`:kc/td/kc_cc_2.csv;
delete from `kc_cc_2 where Date=0N;

/ COMBO CHART
kc_comboc:([]Month:`month$();Bolivia:`int$();Ecuador:`int$();Guatemala:`int$();Average:`int$());
`kc_comboc insert ("MIIII";",") 0:`:kc/td/kc_comboc.csv;
delete from `kc_comboc where Month=0N;

/ PIE CHART
kc_pc:([]Task:("Work";"Eat";"Commute";"Disliking Public Transport";"Day Dreaming";"Sleep");Hours:(9 2 2 2 0.5 8.5));