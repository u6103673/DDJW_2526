const resources = ['../resources/cb.svg', '../resources/co.svg',
                '../resources/sb.svg', '../resources/so.svg',
                '../resources/tb.svg', '../resources/to.svg'];
const back = '../resources/back.svg';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    flippedCards: [], // llista per guardar les cartes girades
    score: 200,
    pairs: 2, 
    flipTime: 1000,
    penalty: 25,
    
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    
    select: function(){
        if (sessionStorage.load){ 
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.flippedCards = toLoad.flippedCards || [];
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
        }
        else { 
            let globalOptions = localStorage.options ? JSON.parse(localStorage.options) : { pairs: 2 };
			this.pairs = parseInt(globalOptions.pairs) || 2;
            
            // llegir la mida
            let groupSize = parseInt(sessionStorage.groupSize) || 2;
            
            // llegir dificultat
            let diff = sessionStorage.difficulty || 'normal';
            if (diff === 'easy') { 
                this.flipTime = 2000;
                this.penalty = 10;
            } else if (diff === 'hard') { 
                this.flipTime = 500;
                this.penalty = 50;
            } else {
                this.flipTime = 1000; 
                this.penalty = 25; 
            }
            
            this.items = resources.slice();          
            shuffe(this.items);                      
            this.items = this.items.slice(0, this.pairs); 
            
            let deck = [];
            for (let i = 0; i < groupSize; i++) {
                deck = deck.concat(this.items);
            }
            this.items = deck;        
            
            shuffe(this.items);
            this.states = new Array(this.items.length).fill(StateCard.ENABLE);
        }
    },
    
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
            }
        });
    },
    
    click: function(indx){
        if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        
        this.goFront(indx);
        this.flippedCards.push(indx); // afegir carta girada

        let groupSize = parseInt(sessionStorage.groupSize) || 2;

        if (this.flippedCards.length === groupSize) {
            
            let firstCardImg = this.items[this.flippedCards[0]];
            let allMatch = this.flippedCards.every(id => this.items[id] === firstCardImg);

            if (allMatch){
                this.pairs--;
                this.flippedCards.forEach(id => this.states[id] = StateCard.DONE);
                if (this.pairs <= 0){
                    setTimeout(() => {
                        alert(`Has guanyat amb ${this.score} punts!!!!`);
                        window.location.assign("../");
                    }, 500);
                }
            }
            else {
				
                let cardsToFlipBack = [...this.flippedCards];
                setTimeout(() => {
                    cardsToFlipBack.forEach(id => this.goBack(id));
                }, this.flipTime);

                this.score -= this.penalty;
                if (this.score <= 0){
                    setTimeout(() => {
                        alert ("Has perdut...");
                        window.location.assign("../");
                    }, this.flipTime);
                }
            }
			
            this.flippedCards = [];
        }
    },
    
    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            flippedCards: this.flippedCards,
            score: this.score,
            pairs: this.pairs
        });
        let ret = false;
        fetch('../php/save.php', {
            method: "POST",
            body: to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => ret = JSON.parse(response))
        .catch (err => console.error(err));

        if (!ret) {
            console.warn("La partida s'ha guardat en local.");
            localStorage.save = to_save;
        }
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}
export function saveGame(){
    game.save();
}