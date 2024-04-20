document.addEventListener('DOMContentLoaded', function () {

    const btnResolver=document.getElementById("btn-resolver");
    btnResolver.addEventListener('click',resolverSudoku);

    const btnReiniciar = document.getElementById("btn-reiniciar");
    btnReiniciar.addEventListener('click', reiniciarSudoku);


    const tablaSudoku = document.getElementById("tabla-sudoku");
    const Cuadricula = 9;

    for (let fila = 0; fila < Cuadricula; fila++) {
        const nuevaFila = document.createElement("tr");

        for (let colum = 0; colum < Cuadricula; colum++) {
            const celda = document.createElement("td");
            const input = document.createElement("input");

            input.type = "number";
            input.className = "celda";
            input.id = `celda-${fila}-${colum}`;

            //Validacion en el momento
            input.addEventListener('input', function(event){
                validarEntrada(event,fila,colum);
            });
            //-------------------------------------

            celda.appendChild(input);
            nuevaFila.appendChild(celda);
        }
        tablaSudoku.appendChild(nuevaFila);
    }

    //Función para reiniciar el juego

    function reiniciarSudoku(){
        for(let fila = 0; fila < Cuadricula; fila++){
            for(let col = 0; col < Cuadricula; col++){
                const celdaId = `celda-${fila}-${col}`;
                const celda = document.getElementById(celdaId);
                celda.value="";
                celda.classList.remove("resolverEfecto", "entradaUsuario");
            }
        }
    }

   
});


//Funcion de Resolver

async function resolverSudoku(){
    const Cuadricula = 9;
    const listaSudoku=[];

    for (let fila = 0; fila < Cuadricula; fila++) {
        listaSudoku[fila]=[];
        for (let colum = 0; colum < Cuadricula; colum++) {
            const celdaId = `celda-${fila}-${colum}`;
            const celdaValor=document.getElementById(celdaId).value;
            listaSudoku[fila][colum]=celdaValor !== ""? parseInt(celdaValor):0;
        }
    }

    //identificador de celdas ingresadas

    for (let fila = 0; fila < Cuadricula; fila++) {
        for (let colum = 0; colum < Cuadricula; colum++) {
            const celdaId = `celda-${fila}-${colum}`;
            const celda=document.getElementById(celdaId);

            if(listaSudoku[fila][colum] !== 0){
                celda.classList.add("respUsuario");
            }
        }
    }

    //Mostrar solucion 
    if(sudoku(listaSudoku)){
        for(let fila=0; fila<Cuadricula;fila++){
            for(let colum=0;colum<Cuadricula;colum++){

                const celdaId=`celda-${fila}-${colum}`;
                const celda=document.getElementById(celdaId);

                if(!celda.classList.contains("respUsuario")){
                    celda.value=listaSudoku[fila][colum];
                    celda.classList.add("efectoResol")

                    await efectoLLenado(20);
                }
            }
        }
    } else{
        alert("Lastimosamente no existe solucion :c");
    }

}

//Función Juego Sudoku - Solucionador
function juegoSudoku(tablero){
    const Cuadricula = 9

    for(let fila = 0; fila < Cuadricula; fila++){
        for(let colum = 0; colum < Cuadricula; colum++){
            if(tablero[fila][colum]===0){
                for(let num = 1; num <= 9; num++){
                    if(verificaConflictos(tablero,fila,colum,num)){
                        tablero[fila][colum] = num;

                        //Intentamos resolverlo con recursividad
                        if(juegoSudoku(tablero)){
                            return true;
                        }
                        tablero[fila][colum] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}



//validacion de datos
function validacionDatos(tablero,fila,colum,num){
    const Cuadricula =9

    //verificacion fila x colum
    for (let i = 0; i < Cuadricula; i++) {
        if (tablero[fila][colum][i] == num || tablero[i][colum]==num) {
            return false;
        }
    }

    //verficacion subcuadricula (osea, cada cuadricula 3x3)
    const filaPrimera = Math.floor(fila/3)*3;
    const columPrimera = Math.floor(colum/3)*3;

    for (let i=filaPrimera; i<filaPrimera + 3; i++) {
        for (let j=columPrimera; j< columPrimera + 3; j++) {
            if (tablero[i][j]==num) {
                return false;
            }  
        }
    }
    return true;
}

// Solucionador
function sudoku(tablero){
    const Cuadricula=9
    
    for(let fila=0;fila<Cuadricula;fila++){
        for(let colum= 0;colum<Cuadricula; colum++){

            if (tablero[fila][colum]===0) {
                for(let num=1;num<=9;num++){

                    if(validacionDatos(tablero,fila,colum,num)){
                        tablero[fila][colum]=num;
                        //recursividad
                        if(sudoku(tablero)){
                            return true;
                        }
                        tablero[colum][fila]=0;
                    }
                }
                return false;
            }   
        }
    }
    return true;
}

//verificacion para evitar errores en la solución
function verificaConflictos(tablero, fila, colum, num){
    const Cuadricula = 9

    //Verificamos la fila y la columna
    for(let i=0;i< Cuadricula;i++){
        if(tablero[fila][i]===num || tablero[i][colum] === num){
            return false;
        }
    }
    //Verificacion  subcuadricula 3x3
    const filaInicio = Math.floor(fila/3)*3;
    const colInicio = Math.floor(colum/3)*3;

    for(let i=filaInicio;i<filaInicio+3;i++){
        for(let j=colInicio;j<colInicio+3;j++){
            if(tablero[i][j] === num){
                return false;
            }
        }
    }
    return true;
}

//Efecto bonito de llenado
function efectoLLenado(ef){
    return new Promise (sudoku=>setTimeout(sudoku,ef))
}





//Función para validar la entrada

function validarEntrada(event,fila,colum){
    const celdaId = `celda-${fila}-${colum}`;
    const celda = document.getElementById(celdaId);
    const valor = celda.value;

    //Validar número del 1-9
    if(!/^[1-9]$/.test(valor)){
        //captura el error y muestra mensaje
        Swal.fire({
            icon: "warning", title: "["+valor+"] no es válido, ingrese otro numero (1-9)",
            showConfirmButton: false,
            timer: 2500
          });
          
        celda.value = "";
        return;
    }
    //Verificacion de numero ya existente
    const numeroIngresado = parseInt(valor);

//verificacion fila

    for(let i=0;i<9;i++){
        if(i !== colum && document.getElementById(`celda-${fila}-${i}`).value == numeroIngresado){
            Swal.fire({
                icon: "warning",
                title: "["+numeroIngresado+"], ya esta en la Fila.",
                showConfirmButton: false,
                timer: 2500
              });
              
            celda.value = "";
            return;
        }

//verificacion columna

        if(i!==fila && document.getElementById(`celda-${i}-${colum}`).value == numeroIngresado){
            Swal.fire({
                icon: "warning",title: "["+numeroIngresado+"], ya esta en la Columna.",
                showConfirmButton: false,
                timer: 2500
              });
              
            celda.value = "";
            return;
        }
    }

//Verificar en la subcuadricula 3x3

    const subcuadriculaFilaInicio = Math.floor(fila / 3) * 3;
    const subcuadriculaColInicio = Math.floor(colum / 3) * 3;

    for(let i = subcuadriculaFilaInicio; i < subcuadriculaFilaInicio + 3; i++){
        for(let j = subcuadriculaColInicio; j < subcuadriculaColInicio + 3; j++){
            if(i !== fila & j !== col && document.getElementById(`celda-${i}-${j}`).value == numeroIngresado){
                Swal.fire({
                    icon: "warning",title: "["+numeroIngresado+"], ya esta en la misma subcuadricula 3x3.",
                    showConfirmButton: false,
                    timer: 2500
                  });
                  
                celda.value = "";
                return;
            }
        }
    }
}