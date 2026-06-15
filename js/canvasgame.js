import {$} from "../library/jquery-4.0.0.slim.module.min.js";
import {clickCard, gameItems, selectCards, startGame, initCard, saveGame} from "./memory.js";

let game = $('#game');
let canvas = game[0].getContext('2d');
let resources = {};
let cards = [];
const e_click = {click: false, x: -1, y: -1};
let key = null;
const c_w = 96;
const c_h = 128;
let idxSel = -1;

if (canvas){
    //mida del canvas
    game.attr("width", 800);
    game.attr("height", 600);
    start();
    update();
}

function start(){
    selectCards();
    cards = gameItems.map((c)=>{return {texture:c}});

    loadCardResource("../resources/back.svg"); 
    
    let columns = 4;
    if (cards.length === 6) columns = 3;
    else if (cards.length === 8) columns = 4;
    else if (cards.length === 10) columns = 5;
    else if (cards.length === 12) columns = 4;
    else if (cards.length > 12) columns = 6;

    const rows = Math.ceil(cards.length / columns);
    const padding = 20; // Espai entre cartes
    const gridWidth = (columns * c_w) + ((columns - 1) * padding);
    const gridHeight = (rows * c_h) + ((rows - 1) * padding);
    const gridXStart = (800 - gridWidth) / 2;
    const gridYStart = (600 - gridHeight) / 2;

    cards.forEach((card, indx) => {
        loadCardResource(card.texture);
        initCard(val => card.texture = val);

        const col = indx % columns;              
        const row = Math.floor(indx / columns);  

        card.position = {
            xMin: gridXStart + (c_w + padding) * col,
            yMin: gridYStart + (c_h + padding) * row,
            xMax: 0,
            yMax: 0
        };
        card.position.xMax = card.position.xMin + c_w;
        card.position.yMax = card.position.yMin + c_h;

        card.onClick = function(x, y){
            return x >= this.position.xMin && x <= this.position.xMax && y >= this.position.yMin && y <= this.position.yMax;
        };
    });
    
    game.on('click', function(e){
        e_click.click = true;
        e_click.x = e.pageX - this.offsetLeft;
        e_click.y = e.pageY - this.offsetTop;
    });
    
    $('#save').on('click', () => saveGame());

    $(document).keydown(e => key = e.key);
    
    startGame();
}

function update(){
    checkInput();
    draw();
    //bucle
    requestAnimationFrame(update);
}

function loadCardResource(src){
    if (!resources[src]){
        let res = {image: null, ready: false};
        res.image = new Image();
        res.image.src = src;
        res.image.onload = () => res.ready = true;
        resources[src] = res;
    }
}

function draw(){
    canvas.clearRect(0, 0, 800, 600); 
    
    cards.forEach((card, indx) => {
        let res = resources[card.texture];
        if (res && res.ready){
            if (idxSel === indx) {
                canvas.drawImage(res.image, card.position.xMin, card.position.yMin, c_w + 4, c_h + 4);
            } else {
                canvas.drawImage(res.image, card.position.xMin, card.position.yMin, c_w, c_h);
            }
        }
    });
}

function checkInput(){
    if (e_click.click){
        cards.some((card, indx) => {
            let click = card.onClick(e_click.x, e_click.y);
            if (click) clickCard(indx);
            return click;
        });
    }
    if (key){
        let prevIndx = idxSel;
        switch(key){
            case "Escape":
                saveGame();
                break;
            case "ArrowRight":
                idxSel = (idxSel + 1) % cards.length;
                break;
            case "ArrowLeft":
                idxSel = (idxSel - 1 + cards.length) % cards.length;
                break;
            case "Enter":
                if (idxSel >= 0) clickCard(idxSel);
                break;
            default:
                console.warn("Tecla " + key + " no reconeguda.");
        }
        
        if (idxSel !== prevIndx){
            if (prevIndx >= 0) {
                cards[prevIndx].position.xMin += 2;
            }
            if (idxSel >= 0) {
                cards[idxSel].position.xMin -= 2;
            }
        }
    }
    
    e_click.click = false;
    key = null;
}