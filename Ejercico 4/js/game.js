let palabraFinal;
let cont_errores = 0; 
let cont_aciertos = 0; 

const palabra_adivinar=
['sueño',
 'queso',     
 'hamburguesa',     
 'programacion',    
 'murcielago',       
 'ahorcado',     
 'aprobado',       
 'naranja',   
 'piedra',
 'manzana'];


const btn = id('generador');
const imagen = id( 'imagenAhorcado' );
const btn_abecedario = document.querySelectorAll( "#abecedario button" );

//iniciar juego
btn.addEventListener('click', iniciar );

function iniciar(event){
    imagen.src = 'sources/error_0.png';
    btn.disabled = true;
    cont_errores = 0;
    cont_aciertos = 0; 

    const parrafo = id('palabra');
    parrafo.innerHTML = ''; 

    const cant_palabras = palabra_adivinar.length;
    const valorRandom = obtener_valor( 0, cant_palabras );

    palabraFinal = palabra_adivinar[ valorRandom  ];
    console.log( palabraFinal );
    const cant_letras = palabraFinal.length;

    for( let i = 0; i < btn_abecedario.length ; i++ ){
        btn_abecedario[ i ].disabled = false;
    }

    for( let i = 0; i < cant_letras; i++ ){
        const span = document.createElement( 'span' );
        parrafo.appendChild( span );
    }
}


//click adivinando cada letra
for( let i = 0; i < btn_abecedario.length ; i++ ){
    btn_abecedario[ i ].addEventListener( 'click', letras);
}

function letras(event){
    const span = document.querySelectorAll( '#palabra span' );
    const button = event.target; 
    button.disabled = true;

    const letra = button.innerHTML.toLowerCase( );
    const palabra = palabraFinal.toLowerCase( );
    let acerto = false;
    for( let i = 0; i < palabra.length;  i++ ){
        if( letra == palabra[i] ){
            span[i].innerHTML = letra;
            cont_aciertos++;
            acerto = true;
        }
    }

    if( acerto == false ){
        cont_errores++;
        const source = `sources/error_${cont_errores}.png` ;
        imagen.src = source;
    }

    if( cont_errores == 8 ){
        id('result').innerHTML ="Perdiste :c La palabra era " + palabraFinal;
        game_over( );
    }else if( cont_aciertos == palabraFinal.length ){
        id('result').innerHTML = "Bien Hecho. G A N A S T E";
        game_over( );
    }
    console.log( "¿La letra " + letra + " existe en " + palabra + "?: " + acerto );
}

function game_over( ){
    for( let i = 0; i < btn_abecedario.length ; i++ ){
        btn_abecedario[ i ].disabled = true;
    }
    btn.disabled = false;
}

game_over( );
