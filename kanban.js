// Función para validar que los campos no estén vacíos
function validateFields() {
    let demand = document.getElementById('demand').value.trim();
    let leadTime = document.getElementById('leadTime').value.trim();
    let safetyStockPercent = document.getElementById('safetyStock').value.trim();
    let capacityPercent = document.getElementById('capacity').value.trim();

    if (!demand || !leadTime || !safetyStockPercent || !capacityPercent) {
        alert("Por favor, completa todos los campos.");
        return false;
    }
    return true;
}

// Función para validar que los campos sean mayores a cero
function validatePositiveValues() {
    let demand = parseFloat(document.getElementById('demand').value);
    let leadTime = parseFloat(document.getElementById('leadTime').value);
    let safetyStockPercent = parseFloat(document.getElementById('safetyStock').value);
    let capacityPercent = parseFloat(document.getElementById('capacity').value);

    if (demand <= 0 || leadTime <= 0 || safetyStockPercent <= 0 || capacityPercent <= 0) {
        alert("Por favor, ingresa valores mayores a cero en todos los campos.");
        return false;
    }

    return true;
}

// Función para validar que los campos D y L sean enteros
function validateIntegerFields() {
    let demand = document.getElementById('demand').value.trim();
    let leadTime = document.getElementById('leadTime').value.trim();

    if (!Number.isInteger(parseFloat(demand)) || !Number.isInteger(parseFloat(leadTime))) {
        alert("Por favor, ingresa valores enteros para Demanda y Tiempo de entrega.");
        return false;
    }
    return true;
}

// Función para formatear números con comas para miles
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Función para calcular los Kanbanes
function calculateKanban() {
    // Validar campos utilizando las funciones de validación
    if (!validateFields()) {
        return;
    }

    if (!validatePositiveValues()) {
        return;
    }

    if (!validateIntegerFields()) {
        return;
    }

    // Obtener valores del formulario
    let demand = parseFloat(document.getElementById('demand').value);
    let leadTime = parseFloat(document.getElementById('leadTime').value);
    let safetyStockPercent = parseFloat(document.getElementById('safetyStock').value);
    let capacityPercent = parseFloat(document.getElementById('capacity').value);

    // Calcular valores
    let safetyStock = safetyStockPercent < 1 ? safetyStockPercent : safetyStockPercent / 100;
    let capacity = Math.round(capacityPercent < 1 ? capacityPercent * demand : capacityPercent * demand / 100);

    let kanban = ((demand * leadTime) * (1 + safetyStock)) / capacity;

    // Redondear kanban y formatear como entero con comas si es de miles
    kanban = Math.round(kanban);
    let formattedKanban = formatNumberWithCommas(kanban);
    let formattedCapacity = formatNumberWithCommas(capacity);

    // Mostrar resultados
    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
        <h2>Resultados:</h2>
        <p><h4>Capacidad de almacenaje:</h4></p>
        <p>C = ${capacityPercent < 1 ? capacityPercent : capacityPercent / 100} x ${demand} = ${formattedCapacity}</p>
        <p><h4>Determinar cantidad de Kanbanes:</h4></p>
        <p>K = ((${demand} x ${leadTime}) (1 + ${safetyStock})) / ${formattedCapacity} = ${formattedKanban}</p>
    `;
}
