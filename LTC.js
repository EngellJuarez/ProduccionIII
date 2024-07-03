function generateTable1() {
    const periodsInput = document.getElementById('periods');
    const sValueInput = document.getElementById('sValue');
    const kValueInput = document.getElementById('kValue');
    const table1Container = document.getElementById('table1Container');

    // Validar que los campos no estén vacíos y sean mayores a 0
    if (!validateInput(periodsInput, 'Número de periodos') || 
        !validateInput(sValueInput, 'Valor de s') || 
        !validateInput(kValueInput, 'Valor de k', true)) {
        return; // Si algún campo no pasa la validación, salir de la función
    }

    const periods = parseInt(periodsInput.value);
    
    table1Container.innerHTML = `
        <h2>Periodos, Requerimientos Brutos y Recepción Planeada</h2>
        <table id="table1">
            <thead>
                <tr>
                    <th>Periodo</th>
                    ${Array.from({ length: periods }, (_, i) => `<th>${i + 1}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Requerimiento Bruto</td>
                    ${Array.from({ length: periods }, (_, i) => `<td><input type="text" id="rb${i + 1}" pattern="\\d*\\.?\\d+" title="Por favor, ingresa un número válido"></td>`).join('')}
                </tr>
                <tr>
                    <td>Recepción Planeada</td>
                    ${Array.from({ length: periods }, (_, i) => `<td id="rp${i + 1}">0</td>`).join('')}
                </tr>
            </tbody>
        </table>
        <button onclick="generateTable2()">Generar Tabla 2</button>
    `;
}

function generateTable2() {
    const periodsInput = document.getElementById('periods');
    const sValueInput = document.getElementById('sValue');
    const kValueInput = document.getElementById('kValue');
    const periods = parseInt(periodsInput.value);
    const s = parseFloat(sValueInput.value);
    let k = parseFloat(kValueInput.value);

    // Validar que los campos no estén vacíos y sean mayores a 0
    if (!validateInput(periodsInput, 'Número de periodos') || 
        !validateInput(sValueInput, 'Valor de s') || 
        !validateInput(kValueInput, 'Valor de k', true)) {
        return; // Si algún campo no pasa la validación, salir de la función
    }

    k = adjustPercentage(k);

    const requerimientosBrutos = [];
    for (let i = 1; i <= periods; i++) {
        const rbInput = document.getElementById(`rb${i}`);
        if (!validateInput(rbInput, `Requerimiento Bruto del periodo ${i}`)) {
            return; // Si algún campo de requerimiento bruto no pasa la validación, salir de la función
        }
        requerimientosBrutos.push(parseFloat(rbInput.value) || 0);
    }

    // Generar tabla 2 (Costos de Mantenimiento Acumulados)
    const table2Container = document.getElementById('table2Container');
    table2Container.innerHTML = `
        <h2>Costos de Mantenimiento Acumulados</h2>
        <table id="table2">
            <thead>
                <tr>
                    <th>Periodo</th>
                    <th>Unidades</th>
                    <th>Periodos mantenidos</th>
                    <th>Costo de mantenimiento</th>
                    <th>Costo de mantenimiento acumulado</th>
                </tr>
            </thead>
            <tbody id="table2Body">
                <!-- Aquí se generará dinámicamente el contenido -->
            </tbody>
        </table>
    `;
    
    let table2Body = document.getElementById('table2Body');
    let costoMantenimientoAcumulado = 0;
    let costoMantenimientoAnterior = 0;

    for (let i = 0; i < periods; i++) {
        let periodosMantenidos = i % 5; // Periodos mantenidos (cíclico cada 5 periodos)
        let costoMantenimiento = requerimientosBrutos[i] * periodosMantenidos * k;
        costoMantenimientoAcumulado = costoMantenimientoAnterior + costoMantenimiento;

        // Reiniciar costoMantenimientoAnterior al final de cada ciclo de 5 periodos
        if ((i + 1) % 5 === 0 || i === periods - 1) {
            costoMantenimientoAnterior = 0; // Reiniciar con el valor inicial (0)
        } else {
            costoMantenimientoAnterior = costoMantenimientoAcumulado;
        }

        // Añadir fila a la tabla 2
        table2Body.innerHTML += `
            <tr class="${((i + 1) % 5 === 0 || i === periods - 1) ? 'highlight' : ''}">
                <td>${i + 1}</td>
                <td>${requerimientosBrutos[i].toFixed(2)}</td>
                <td>${periodosMantenidos}</td>
                <td>${costoMantenimiento.toFixed(2)}</td>
                <td>${costoMantenimientoAcumulado.toFixed(2)}</td>
            </tr>
        `;
    }

    // Actualizar recepción planeada cada 5 periodos
    for (let i = 1; i <= periods; i++) {
        let sum = 0;
        let startPeriod = (Math.floor((i - 1) / 5)) * 5 + 1; // Periodo inicial de la sumatoria
        let endPeriod = Math.min(startPeriod + 4, periods); // Periodo final de la sumatoria
        
        for (let j = startPeriod; j <= endPeriod; j++) {
            sum += requerimientosBrutos[j - 1];
        }
        
        document.getElementById(`rp${i}`).textContent = sum.toFixed(2);
    }
}

function validateInput(inputElement, fieldName, isPercentage = false) {
    const value = inputElement.value.trim();
    if (value === '') {
        alert(`El campo "${fieldName}" no puede estar vacío.`);
        return false;
    }
    if (parseFloat(value) <= 0 || isNaN(parseFloat(value))) {
        alert(`El campo "${fieldName}" debe ser un número mayor a 0.`);
        return false;
    }
    if (isPercentage) {
        inputElement.value = adjustPercentage(parseFloat(value));
    }
    return true;
}

function adjustPercentage(k) {
    // Si k es un número entero mayor o igual a 1, lo convertimos a porcentaje dividiéndolo entre 100
    if (Number.isInteger(k) && k >= 1) {
        return (k / 100).toFixed(2);
    }
    return k.toFixed(2);
}

