document.addEventListener('DOMContentLoaded', function() {
    const methodSelect = document.getElementById('method');
    const fixedCostFields = document.getElementById('fixedCostFields');
    const averageCostFields = document.getElementById('averageCostFields');
    const inventoryForm = document.getElementById('inventoryForm');
    const resultsDiv = document.getElementById('results');
    const operationsText = document.getElementById('operations');

    // Inicialización: Mostrar campos iniciales según la opción seleccionada por defecto
    toggleFields();

    // Escuchar cambios en la selección del método
    methodSelect.addEventListener('change', function() {
        clearFields();
        toggleFields();
        clearResults();
    });

    // Manejar el envío del formulario
    inventoryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        calculateInventoryRotation();
    });

    // Alternar visibilidad de los campos
    function toggleFields() {
        if (methodSelect.value === 'fijo') {
            fixedCostFields.classList.add('active');
            averageCostFields.classList.remove('active');
        } else if (methodSelect.value === 'promedio') {
            fixedCostFields.classList.remove('active');
            averageCostFields.classList.add('active');
        }
    }

    // Limpiar campos visibles
    function clearFields() {
        const activeFields = document.querySelectorAll('.fields.active input');
        activeFields.forEach(input => input.value = '');
    }

    // Limpiar resultados
    function clearResults() {
        resultsDiv.style.display = 'none';
        operationsText.innerHTML = ''; // Limpiar contenido HTML
    }

    // Validar que un campo no esté vacío
    function isNotEmpty(value) {
        return value.trim() !== '';
    }

    // Validar que un campo sea mayor a cero
    function isGreaterThanZero(value) {
        return parseFloat(value) > 0;
    }

    // Calcular la rotación del inventario
    function calculateInventoryRotation() {
        const method = methodSelect.value;
        let demand, orderQuantity, reviewCycle, safetyStock, rotation, averageInventoryCost;
        let operationsOutput = '';

        if (method === 'fijo') {
            demand = document.getElementById('demand').value.trim();
            orderQuantity = document.getElementById('orderQuantity').value.trim();
            safetyStock = document.getElementById('safetyStock').value.trim();

            // Validar que todos los campos no estén vacíos para el método Costo Fijo
            if (!isNotEmpty(demand) || !isNotEmpty(orderQuantity) || !isNotEmpty(safetyStock)) {
                alert('Por favor completa todos los campos para el método Costo Fijo.');
                return;
            }

            // Validar que todos los campos sean mayores a cero para el método Costo Fijo
            if (!isGreaterThanZero(demand) || !isGreaterThanZero(orderQuantity) || !isGreaterThanZero(safetyStock)) {
                alert('Por favor ingresa valores mayores a cero para el método Costo Fijo.');
                return;
            }

            // Convertir a números después de validar
            demand = parseFloat(demand);
            orderQuantity = parseFloat(orderQuantity);
            safetyStock = parseFloat(safetyStock);

            // Calcular costo promedio del inventario (fijo)
            averageInventoryCost = Math.round((orderQuantity / 2) + safetyStock);

            // Calcular rotación y redondear a entero
            rotation = Math.round(demand / averageInventoryCost);

            // Crear texto de operaciones con saltos de línea usando <br>
            operationsOutput = `<h4>Valor promedio del Inventario (costo fijo):</h4><br>(${numberWithCommas(orderQuantity)} / 2) + ${numberWithCommas(safetyStock)} = ${numberWithCommas(averageInventoryCost)}<br><br>` +
                               `<h4>Rotación de Inventario:</h4><br>${numberWithCommas(demand)} / ${numberWithCommas(averageInventoryCost)} = ${rotation}`;

            // Mostrar resultados
            resultsDiv.style.display = 'block';
            operationsText.innerHTML = operationsOutput; // Usar innerHTML para interpretar <br>
        } else if (method === 'promedio') {
            demand = document.getElementById('demandProm').value.trim();
            reviewCycle = document.getElementById('reviewCycle').value.trim();
            safetyStock = document.getElementById('safetyStockProm').value.trim();

            // Validar que todos los campos no estén vacíos para el método Costo Promedio
            if (!isNotEmpty(demand) || !isNotEmpty(reviewCycle) || !isNotEmpty(safetyStock)) {
                alert('Por favor completa todos los campos para el método Costo Promedio.');
                return;
            }

            // Validar que todos los campos sean mayores a cero para el método Costo Promedio
            if (!isGreaterThanZero(demand) || !isGreaterThanZero(reviewCycle) || !isGreaterThanZero(safetyStock)) {
                alert('Por favor ingresa valores mayores a cero para el método Costo Promedio.');
                return;
            }

            // Convertir a números después de validar
            demand = parseFloat(demand);
            reviewCycle = parseFloat(reviewCycle);
            safetyStock = parseFloat(safetyStock);

            // Calcular costo promedio del inventario (promedio)
            averageInventoryCost = Math.round((demand * (reviewCycle / 2)) + safetyStock);

            // Calcular rotación y redondear a entero
            rotation = Math.round((demand * 52) / averageInventoryCost);

            // Crear texto de operaciones con saltos de línea usando <br>
            operationsOutput = `<h4>Valor promedio del Inventario (costo promedio):</h4><br>(${numberWithCommas(demand)} * (${reviewCycle} / 2)) + ${numberWithCommas(safetyStock)} = ${numberWithCommas(averageInventoryCost)}<br><br>` +
                               `<h4>Rotación de Inventario:</h4><br>(${numberWithCommas(demand)} * 52) / ${numberWithCommas(averageInventoryCost)} = ${rotation}`;

            // Mostrar resultados
            resultsDiv.style.display = 'block';
            operationsText.innerHTML = operationsOutput; // Usar innerHTML para interpretar <br>
        }
    }

    // Función para agregar comas como separadores de miles
    function numberWithCommas(x) {
        return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});
