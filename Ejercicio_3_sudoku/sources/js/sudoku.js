document.addEventListener('DOMContentLoaded', function () {

    const btnResolver=document.getElementById("btn-resolver");
    btnResolver.addEventListener('click',resolverSudoku);

    const tablaSudoku = document.getElementById("tabla-sudoku");
    const mediaCuadratica = 9;

    for (let fila = 0; fila < mediaCuadratica; fila++) {
        const nuevaFila = document.createElement("tr");

        for (let colum = 0; colum < mediaCuadratica; colum++) {
            const celda = document.createElement("td");
            const input = document.createElement("input");

            input.type = "number";
            input.className = "celda";
            input.id = `celda-${fila}-${colum}`;

            celda.appendChild(input);
            nuevaFila.appendChild(celda);
        }
        tablaSudoku.appendChild(nuevaFila);
    }
});

//Funcion de Resolver

async function resolverSudoku(){
    const mediaCuadratica = 9;
    const listaSudoku=[];

    for (let fila = 0; fila < mediaCuadratica; fila++) {
        listaSudoku[fila]=[];
        for (let colum = 0; colum < mediaCuadratica; colum++) {
            const celdaId = `celda-${fila}-${colum}`;
            const celdaValor=document.getElementById(celdaId).value;
            listaSudoku[fila][colum]=celdaValor !== ""? parseInt(celdaValor):0;
        }
    }

    //identificador de celdas ingresadas

    for (let fila = 0; fila < mediaCuadratica; fila++) {
        for (let colum = 0; colum < mediaCuadratica; colum++) {
            const celdaId = `celda-${fila}-${colum}`;
            const celda=document.getElementById(celdaId);

            if(listaSudoku[fila][colum] !== 0){
                celda.classList.add("respUsuario");
            }
        }
    }

    //Mostrar solucion 
    if(sudoku(listaSudoku)){
        for(let fila=0; fila<mediaCuadratica;fila++){
            for(let colum=0;colum<mediaCuadratica;colum++){

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


//validacion de datos
function validacionDatos(tabla,fila,colum,num){
    const mediaCuadratica =9

    //verificacion fila x colum
    for (let i = 0; i < mediaCuadratica; i++) {
        if (tabla[fila][colum][i] == num || tabla[i][colum]==num) {
            return false;
        }
    }

    //verficacion subcuadricula (osea, cada cuadricula 3x3)
    const filaPrimera = Math.floor(fila/3)*3;
    const columPrimera = Math.floor(colum/3)*3;

    for (let i=filaPrimera; i<filaPrimera + 3; i++) {
        for (let j=columPrimera; j< columPrimera + 3; j++) {
            if (tabla[i][j]==num) {
                return false;
            }  
        }
    }
    return true;
}

// Solucionador
function sudoku(tabla){
    const mediaCuadratica=9
    
    for(let fila=0;fila<mediaCuadratica;fila++){
        for(let colum= 0;colum<mediaCuadratica; colum++){

            if (tabla[fila][colum]===0) {
                for(let num=1;num<=9;num++){

                    if(verific(tabla,fila,num,colum)){
                        tabla[fila][colum]=num;

                        if(sudoku(tabla)){
                            return true;
                        }

                        tabla[colum][fila]=0;
                    }
                }
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


