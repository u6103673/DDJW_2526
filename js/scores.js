import {$} from "../library/jquery-4.0.0.slim.module.min.js";

$(document).ready(function() {
    let rankingBox = $('#ranking-list');
    let ranking = localStorage.ranking ? JSON.parse(localStorage.ranking) : [];

    if (ranking.length === 0) {
        rankingBox.html("<h2 style='color:#8e44ad;'>Encara no hi ha cap partida registrada!</h2>");
    } else {
        // ensenyar punts en una taula
        let taula = `<table style="width: 100%; color: #8e44ad; font-size: 1.2rem; text-align: left; border-collapse: collapse;">
                        <tr style="border-bottom: 2px solid #b97bed;">
                            <th style="padding: 10px;">Jugador</th>
                            <th style="padding: 10px;">Nivell</th>
                            <th style="padding: 10px;">Punts</th>
                        </tr>`;
        
        // top 10
        let limit = Math.min(ranking.length, 10);
        for (let i = 0; i < limit; i++) {
            taula += `<tr>
                        <td style="padding: 5px 10px;"><strong>${i+1}.</strong> ${ranking[i].alies}</td>
                        <td style="padding: 5px 10px;">${ranking[i].nivell}</td>
                        <td style="padding: 5px 10px;"><strong>${ranking[i].punts}</strong></td>
                      </tr>`;
        }
        taula += `</table>`;
        rankingBox.html(taula);
    }

    $('#back').click(function(){
        window.location.assign("../");
    });
});