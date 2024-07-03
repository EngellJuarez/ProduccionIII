function validateForm() {
    const demand = document.getElementById('demand').value.trim();
    const orderCost = document.getElementById('orderCost').value.trim();
    let holdingCostInput = document.getElementById('holdingCost').value.trim();
    
    // Validar que los campos no estén vacíos
    if (demand === '' || orderCost === '' || holdingCostInput === '') {
        alert('Por favor, complete todos los campos.');
        return false;
    }

    // Convertir a números y validar que sean mayores a 0
    const numDemand = parseFloat(demand);
    const numOrderCost = parseFloat(orderCost);
    const numHoldingCost = parseFloat(holdingCostInput);

    if (isNaN(numDemand) || numDemand <= 0 || isNaN(numOrderCost) || numOrderCost <= 0 || isNaN(numHoldingCost) || numHoldingCost <= 0) {
        alert('Ingrese valores numéricos válidos y mayores a 0 en todos los campos.');
        return false;
    }

    // Convertir a porcentaje si es entero
    let holdingCost;
    if (holdingCostInput.indexOf('.') === -1 && !isNaN(parseInt(holdingCostInput))) {
        holdingCost = numHoldingCost / 100;
    } else {
        holdingCost = numHoldingCost;
    }
    
    return true;
}

function calculateEOQ() {

    if (!validateForm()) {
        return; // Detener el cálculo si los campos no son válidos
    }

    // Obtener valores del formulario
    const demand = parseFloat(document.getElementById('demand').value);
    const orderCost = parseFloat(document.getElementById('orderCost').value);
    let holdingCostInput = document.getElementById('holdingCost').value.trim();
    let holdingCost;

    // Convertir a porcentaje si es entero
    if (holdingCostInput.indexOf('.') === -1 && !isNaN(parseInt(holdingCostInput))) {
        holdingCost = parseFloat(holdingCostInput) / 100;
    } else {
        holdingCost = parseFloat(holdingCostInput);
    }

    const period = document.getElementById('period').value;

    let daysInPeriod;
    
    // Definir días en función del período seleccionado
    switch (period) {
        case 'annual':
            daysInPeriod = 365;
            break;
        case 'monthly':
            daysInPeriod = 30;
            break;
        case 'weekly':
            daysInPeriod = 7;
            break;
        case 'daily':
            daysInPeriod = 1;
            break;
        default:
            daysInPeriod = 365; // Por defecto anual
            break;
    }
    
    // Calcular EOQ
    const EOQ = Math.sqrt(2 * demand * daysInPeriod * orderCost / holdingCost);
    
    // Formatear EOQ como entero y con separador de miles
    const formattedEOQ = Math.round(EOQ).toLocaleString();
    
    // Construir la fórmula con los valores sustituidos y operación completa
    const formula = `EOQ = √((2)(${demand.toLocaleString()})(${daysInPeriod})(${orderCost.toLocaleString()}))/(${holdingCost.toLocaleString()})`;

    // Construir la operación matemática completa
    const operation = `EOQ = √(${2} × ${demand.toLocaleString()} × ${daysInPeriod} × ${orderCost.toLocaleString()}) / (${holdingCost.toLocaleString()})`;
    
    // Mostrar resultados
    const eoqResultElement = document.getElementById('eoqResult');
    const analysisElement = document.getElementById('analysis');
    
    eoqResultElement.textContent = `${operation} = ${formattedEOQ}`;
    analysisElement.textContent = `La cantidad de pedido que la empresa debe realizar es de ${formattedEOQ} unidades para que el inventario no se agote durante el tiempo de entrega.`;
    
    // Mostrar área de resultados
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';
}

