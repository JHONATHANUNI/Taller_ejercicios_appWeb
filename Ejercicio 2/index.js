/*Simbolos de cartas , contiene nuestros emogis*/
const symbols = ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🐯', '🦁'];
const totalPairs = symbols.length;/*Largo del arreglo*/

let cards = [];/* Variables de cartas , arreglo vacio */
let flippedCards = [];/*Nuestras cartas voltiadas*/
let pairsFound = 0;/**/

// Programar en ingles es una buena practica 
/*Calculo para tomar nuestro arreglo y desordenarlo*/
function shuffle(array){
    return array.slice().sort( () => Math.random() - 0.5 );/*Ordena de forma aleatoria el array*/
}
/**/
cards = shuffle([...symbols, ...symbols]); 

/*Toma el parametro symbolo para crear la carta*/
function createCard(symbol){
    const card = document.createElement('div');/**/
    card.classList.add('card');/**/
/*Contenedor del emogi o animalito*/
    const symbolContainer = document.createElement('div');
    symbolContainer.classList.add('symbol');
    symbolContainer.textContent = symbol;
/*Metodo para el clik de la carta*/
    card.appendChild(symbolContainer);

    card.addEventListener('click', () => flipCard(card) );
    return card;/*Retorno carta*/
}

// Funcion para volter las cartas
/**/
function flipCard(card){
    if( flippedCards.length < 2 
        && !flippedCards.includes(card) 
        && !card.classList.contains('flipped'))
        {
            card.classList.add('flipped');
            flippedCards.push(card);
        }
    if (flippedCards.length === 2 ){
        setTimeout(checkMatch, 1000);/**/
    }

}
/*Compara los simbolos de las tarjetas voltedas si coninciden eliminar el flip*/
function checkMatch(){
    const [card1, card2] = flippedCards;
    const symbol1 = card1.textContent;
    const symbol2 = card2.textContent;

    if( symbol1 === symbol2 ){
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        pairsFound++;        
        
        if(pairsFound === totalPairs){
            alert('Has ganado Felicitaciones!!!!!!');
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    
    flippedCards = [];

}


// Esta funcion va a iniciar nuestro juego
/**/
function initializeGame(){
    cards = shuffle([...symbols, ...symbols]);/**/
    pairsFound = 0;/*pares encontrados*/
    flippedCards = [];/*Cartas voltedas*/

    const gameContainer = document.querySelector('.memory-game');
    gameContainer.innerHTML = '';
/**/
    cards.forEach( symbol => {
        const card = createCard(symbol);
        gameContainer.appendChild(card);
    });

}

initializeGame();/*Funcion iniciar juego*/