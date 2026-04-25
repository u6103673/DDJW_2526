TREBALL INDIVIDUAL - MEMORY - DDJW
JÚLIA CONDE FABRA - U6103673

i. Introducció
Desenvolupar un joc web de cartes de memòria interactiu amb html, css i javascript (amb ús de JQuery) on es poden triar diferents modes de joc, dificultats i nombre de cartes, tot això amb un sistema de guardat amb un rànking local de top 10 millors puntuacions.

ii. Descripció del disseny del joc
El disseny visual se centra en una estètica amigable amb tons lila i formes arrodonides. Els botons animats amb ombres. Ús de flexbox per adaptar-se dinàmicament al nombre de cartes triat. Les cartes segueixen aquesta estètica i estan fetes amb SVG.

iii. Descripció de les parts més rellevants de la implementació
La part més complexa es troba al memory.js.
Afegit els modes de trios i quartets. Codi adaptat per fer servir una llista de cartes i poder comprovar 3 o 4 cartes alhora en lloc de només una parella.
Utilitzat sessionStorage per guardar les opcions del menú i per al rànquing i les opcions globals el localStorage.
Mode 2 (supervivència) un mode on després d'encertar totes les cartes passes al següent nivell, guardant la puntuació i augmentant el nombre de cartes.
Un botó de guardar connectat al servidor per enviar les dades de la partida en JSON a PHP.


iv. Conclusions i problemes trobats
He entés a connectar varies pantalles i connectar dades entre el menú i el joc i gestionar la memòria del navegador.
Un problema que he trobat era amb les partides guardades del mode infinit. Quan carregava una partida d'aquest mode i completava el nivell, en lloc de passar al següent nivell la finestra es recarrregava i tornava al mateix nivell. Vaig veure que passava perquè la partida es quedava fixada a la memòria. Ho vaig solucionar fent que el joc esborrés l'arxiu de càrrega després de posar les cartes al tauler per poder permetre que el següent nivell es generés desde zero.

Conclusió: Al final el joc funciona de manera fluida, amb comunicació entre menú i partida correcta i sistema de guardat i càrrega funcional. Tot això amb una estètica que m'agrada molt i és amigable.

