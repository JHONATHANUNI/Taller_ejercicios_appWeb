/*Simbolos de cartas, contiene nuestros emojis*/
const symbols = ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🐯', '🦁'];
const totalPairs = symbols.length; // Almacena la longitud del arreglo de símbolos, que representa la cantidad total de pares de cartas

let cards = []; // Arreglo vacío para almacenar las cartas del juego
let flippedCards = []; // Arreglo para almacenar las cartas que han sido volteadas
let pairsFound = 0; // Variable para contar la cantidad de pares de cartas encontradas

// Función para desordenar un arreglo
function shuffle(array) {
    return array.slice().sort(() => Math.random() - 0.5); // Devuelve una copia del arreglo desordenada aleatoriamente
}

cards = shuffle([...symbols, ...symbols]); // Genera un arreglo de cartas duplicando los símbolos y luego desordenándolos

// Función para crear una nueva carta
function createCard(symbol) {
    const card = document.createElement('div'); // Crea un nuevo elemento div para representar la carta
    card.classList.add('card'); // Agrega la clase 'card' al elemento div

    // Crea un contenedor para el símbolo de la carta
    const symbolContainer = document.createElement('div');
    symbolContainer.classList.add('symbol'); // Agrega la clase 'symbol' al contenedor
    symbolContainer.textContent = symbol; // Establece el texto del contenedor como el símbolo de la carta

    card.appendChild(symbolContainer); // Agrega el contenedor de símbolo como hijo del elemento de la carta
    card.addEventListener('click', () => flipCard(card)); // Agrega un evento de clic a la carta para voltearla al hacer clic

    return card; // Devuelve la carta creada
}

// Función para voltear una carta al hacer clic
function flipCard(card) {
    // Verifica si la carta puede ser volteada
    if (flippedCards.length < 2 && !flippedCards.includes(card) && !card.classList.contains('flipped')) {
        card.classList.add('flipped'); // Agrega la clase 'flipped' para mostrar el lado volteado de la carta
        flippedCards.push(card); // Agrega la carta al arreglo de cartas volteadas

        // Verifica si se han volteado dos cartas y llama a la función para comprobar si coinciden
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000); // Espera un segundo antes de verificar si las cartas coinciden
        }
    }
}

// Función para verificar si las cartas volteadas coinciden
function checkMatch() {
    const [card1, card2] = flippedCards; // Obtiene las dos cartas volteadas
    const symbol1 = card1.textContent; // Obtiene el símbolo de la primera carta volteada
    const symbol2 = card2.textContent; // Obtiene el símbolo de la segunda carta volteada

    // Compara los símbolos de las cartas volteadas
    if (symbol1 === symbol2) {
        card1.removeEventListener('click', flipCard); // Si coinciden, se eliminan los eventos de clic de las cartas
        card2.removeEventListener('click', flipCard);
        pairsFound++; // Incrementa el contador de pares encontrados

        // Si se han encontrado todos los pares, muestra un mensaje de felicitaciones
        if (pairsFound === totalPairs) {
            alert('¡Has ganado! ¡Felicitaciones!');
        }
    } else {
        // Si los símbolos no coinciden, se quita la clase 'flipped' para volver a mostrar el reverso de las cartas
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = []; // Reinicia el arreglo de cartas volteadas
}

// Función para inicializar el juego
function initializeGame() {
    const numCards = document.getElementById('num-cards').value; // Obtiene la cantidad de cartas seleccionada por el jugador
    const totalPairs = numCards / 2; // Calcula la cantidad total de pares de cartas

    // Verifica que la cantidad de cartas sea par y mayor que 1
    if (numCards % 2 !== 0 || numCards < 2) {
        alert('Por favor selecciona un número par de cartas mayor que 1.');
        return;
    }

    // Genera un arreglo de cartas duplicando los símbolos seleccionados y luego desordenándolos
    cards = shuffle(symbols.slice(0, totalPairs).concat(symbols.slice(0, totalPairs)));
    pairsFound = 0; // Reinicia el contador de pares encontrados
    flippedCards = []; // Reinicia el arreglo de cartas volteadas

    const gameContainer = document.querySelector('.memory-game');
    gameContainer.innerHTML = ''; // Elimina el contenido actual del contenedor de juego

    // Crea y agrega las cartas al contenedor de juego
    cards.forEach(symbol => {
        const card = createCard(symbol);
        gameContainer.appendChild(card);
    });
}

// Agrega un evento al botón de inicio del juego para llamar a la función de inicialización del juego
document.getElementById('start-btn').addEventListener('click', initializeGame);
