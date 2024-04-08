document.addEventListener('DOMContentLoaded', function () {
    const tablaSudoku = document.getElementById("tabla-sudoku");
    const mediaCuadratica = 9;

    for (let fila = 0; fila < mediaCuadratica; fila++) {
        const nuevaFila = document.createElement("tr");

        for (let colum = 0; colum < mediaCuadratica; colum++) {
            const celda = document.createElement("td");
            const input = document.createElement("input");

            input.type = "number";
            input.className = "celda";
            input.id = 'celda-${fila}-${colum}';

            celda.appendChild(input);
            nuevaFila.appendChild(celda);
        }
        tablaSudoku.appendChild(nuevaFila);
    }
});

async function resolverSudoku(){
    const mediaCuadratica = 9;
    const listaSudoku=[];

    for (let fila = 0; fila < mediaCuadratica; fila++) {
        listaSudoku[fila]=[];
        for (let colum = 0; colum < mediaCuadratica; colum++) {
            const celdaId = 'celda-${fila}-${colum}';
            const celdaValor=document.getElementById(celdaId).value;
        }
    }
}