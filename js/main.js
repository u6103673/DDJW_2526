import {$} from "../library/jquery-4.0.0.slim.module.min.js";

$(document).ready(function() {
    $('#play').click(function(){
        // Llegim els valors dels selectors
        let selectedMode = $('#game-mode').val();
        let selectedDiff = $('#difficulty').val();
        let selectedGroup = $('#group-size').val();

        // Demanem l'àlies
        let alies = prompt("Introdueix l'àlies:");
        
        if (alies) {
            // Guardem tota la configuració a la memòria del navegador
            sessionStorage.alies = alies;
            sessionStorage.gameMode = selectedMode;
            sessionStorage.difficulty = selectedDiff;
            sessionStorage.groupSize = selectedGroup;
            
            console.log(`L'àlies és: ${alies} | Mode: ${selectedMode} | Dificultat: ${selectedDiff} | Mida grup: ${selectedGroup}`);
            sessionStorage.removeItem('load');
            window.location.assign("./html/game.html");
        }
    });

    $('#scores').click(function(){
        window.location.assign("./html/scores.html");
    });

    $('#options').click(function(){
        window.location.assign("./html/options.html");
    });

    $('#saves').click(function(){
        let to_load = localStorage.save;
        fetch('../php/load.php', {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => to_load = (!json.error)?JSON.stringify(json.save): localStorage.save)
        .catch (err => {
            console.error(err);
            console.warn("La partida s'intentarà carregar de local");
        });

        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });
});