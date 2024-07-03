document.getElementById('mtbf_porcentaje').addEventListener('change', function() {
    const mtbfRelativoDiv = document.getElementById('mtbf_relativo_div');
    if (this.checked) {
        mtbfRelativoDiv.style.display = 'block';
    } else {
        mtbfRelativoDiv.style.display = 'none';
    }
});

// Variable global para almacenar el estado del checkbox
let mtbfEnPorcentaje = false;

// Función para actualizar el valor del campo mtbf_valor
function actualizarMTBFValor() {
    const mtbfInput = document.getElementById('mtbf_valor');
    const inputValue = parseFloat(mtbfInput.value);

    if (mtbfEnPorcentaje) {
        // Si está marcado el checkbox y el valor es >= 1, convertir a porcentaje
        if (inputValue >= 1 ) {
            mtbfInput.value = (inputValue / 100).toFixed(2); // Convertir a decimal
        }
    } else {
        // Si no está marcado el checkbox y el valor es < 1, convertir a número completo
        if (inputValue < 1) {
            mtbfInput.value = (inputValue * 100) // Volver al número original
        }
    }
}

// Escuchar cambios en el checkbox
document.getElementById('mtbf_porcentaje').addEventListener('change', function() {
    mtbfEnPorcentaje = this.checked;
    actualizarMTBFValor();
});

// Escuchar cambios en el campo de MTBF
document.getElementById('mtbf_valor').addEventListener('input', function() {
    actualizarMTBFValor();
});


function validarCampos() {
    // Obtener valores del formulario
    const horas = document.getElementById('horas').value.trim();
    const mtbf_valor = document.getElementById('mtbf_valor').value.trim();
    const duracion_tarea = document.getElementById('duracion_tarea').value.trim();
    const costo_trabajo_hora = document.getElementById('costo_trabajo_hora').value.trim();
    const costo_repuestos = document.getElementById('costo_repuestos').value.trim();
    const costos_operacionales = document.getElementById('costos_operacionales').value.trim();
    const retraso_logistico = document.getElementById('retraso_logistico').value.trim();
    const costo_unitario_parada = document.getElementById('costo_unitario_parada').value.trim();
    const costo_falla_unica = document.getElementById('costo_falla_unica').value.trim();

    // Validar que los campos no estén vacíos
    if (horas === '' || mtbf_valor === '' || duracion_tarea === '' || costo_trabajo_hora === '' ||
        costo_repuestos === '' || costos_operacionales === '' || costo_unitario_parada === '' || costo_falla_unica === '') {
        alert('Por favor, completa todos los campos.');
        return false;
    }

    // Convertir valores a números y validar si son válidos
    const horasValor = parseFloat(horas);
    const mtbfValor = parseFloat(mtbf_valor);
    const duracionTareaValor = parseFloat(duracion_tarea);
    const costoTrabajoHoraValor = parseFloat(costo_trabajo_hora);
    const costoRepuestosValor = parseFloat(costo_repuestos);
    const costosOperacionalesValor = parseFloat(costos_operacionales);
    const retrasoLogisticoValor = parseFloat(retraso_logistico) || 0;
    const costoUnitarioParadaValor = parseFloat(costo_unitario_parada);
    const costoFallaUnicaValor = parseFloat(costo_falla_unica);

    // Validar que los valores sean numéricos y mayores a cero, excepto retraso logístico
    if (isNaN(horasValor) || horasValor <= 0 || isNaN(mtbfValor) || mtbfValor <= 0 ||
        isNaN(duracionTareaValor) || duracionTareaValor <= 0 || isNaN(costoTrabajoHoraValor) || costoTrabajoHoraValor <= 0 ||
        isNaN(costoRepuestosValor) || costoRepuestosValor <= 0 || isNaN(costosOperacionalesValor) || costosOperacionalesValor <= 0 ||
        isNaN(costoUnitarioParadaValor) || costoUnitarioParadaValor <= 0 || isNaN(costoFallaUnicaValor) || costoFallaUnicaValor <= 0) {
        alert('Por favor, ingresa valores numéricos mayores a cero en los campos correspondientes.');
        return false;
    }

    return true;
}

function CalcularMantCorrectivo() {

    // Validar campos antes de calcular
    if (!validarCampos()) {
        return; // Detener el cálculo si los campos no son válidos
    }

    // Obtener valores del formulario
    const horas = parseFloat(document.getElementById('horas').value);
    const mtbf_valor = parseFloat(document.getElementById('mtbf_valor').value);
    const duracion_tarea = parseFloat(document.getElementById('duracion_tarea').value);
    const costo_trabajo_hora = parseFloat(document.getElementById('costo_trabajo_hora').value);
    const costo_repuestos = parseFloat(document.getElementById('costo_repuestos').value);
    const costos_operacionales = parseFloat(document.getElementById('costos_operacionales').value);
    const retraso_logistico = parseFloat(document.getElementById('retraso_logistico').value || 0);
    const costo_unitario_parada = parseFloat(document.getElementById('costo_unitario_parada').value);
    const costo_falla_unica = parseFloat(document.getElementById('costo_falla_unica').value);

    // Calcular MTBF si es porcentaje
    let mtbf_calculado;
    let mtbf_explicacion = "";
    if (document.getElementById('mtbf_porcentaje').checked) {
        const mtbf_relativo = document.getElementById('mtbf_relativo').value;
        let base = 0;
        if (mtbf_relativo === "horas") base = horas;
        if (mtbf_relativo === "duracion_tarea") base = duracion_tarea;
        if (mtbf_relativo === "costo_trabajo_hora") base = costo_trabajo_hora;
        if (mtbf_relativo === "costo_repuestos") base = costo_repuestos;
        if (mtbf_relativo === "costos_operacionales") base = costos_operacionales;
        if (mtbf_relativo === "costo_unitario_parada") base = costo_unitario_parada;
        if (mtbf_relativo === "costo_falla_unica") base = costo_falla_unica;
        mtbf_calculado = base * (mtbf_valor);
        mtbf_explicacion = `<h4>MTBF :</h4> (${base.toLocaleString()})(${mtbf_valor}) = ${mtbf_calculado.toLocaleString()}`;
    } else {
        mtbf_calculado = mtbf_valor;
        mtbf_explicacion = `<h4>MTBF :</h4> ${mtbf_calculado.toLocaleString()}`;
    }

    // Calcular Número de Fallas y redondear
    const numero_fallas = Math.round(horas / mtbf_calculado);
    const numero_fallas_explicacion = `<h4>Número de Fallas :</h4> ${horas.toLocaleString()} / ${mtbf_calculado.toLocaleString()} = ${numero_fallas}`;

    // Calcular Costo de la Tarea de Mantenimiento
    const costo_tarea_mantenimiento = (
        (duracion_tarea * costo_trabajo_hora) +
        costo_repuestos +
        costos_operacionales +
        retraso_logistico
    );
    const costo_tarea_mantenimiento_explicacion = `<h4>Costo de la Tarea de Mantenimiento :</h4> (${duracion_tarea} x ${costo_trabajo_hora.toLocaleString()}) + ${costo_repuestos.toLocaleString()} + ${costos_operacionales.toLocaleString()} + ${retraso_logistico.toLocaleString()} = ${costo_tarea_mantenimiento.toLocaleString()}`;

    // Calcular Costo de la Falla
    const costo_falla = (duracion_tarea * costo_unitario_parada) + costo_falla_unica;
    const costo_falla_explicacion = `<h4>Costo de la Falla :</h4> (${duracion_tarea} x ${costo_unitario_parada.toLocaleString()}) + ${costo_falla_unica.toLocaleString()} = ${costo_falla.toLocaleString()}`;

    // Calcular Costo Total de Mantenimiento Correctivo
    const costo_mantenimiento_correctivo = numero_fallas * (costo_tarea_mantenimiento + costo_falla);
    const costo_mantenimiento_correctivo_explicacion = `<h4>Costo de Mantenimiento Correctivo :</h4> ${numero_fallas.toLocaleString()} x (${costo_tarea_mantenimiento.toLocaleString()} + ${costo_falla.toLocaleString()}) = ${costo_mantenimiento_correctivo.toLocaleString()}`;

    // Generar resultado
    const resultadosHTML = `
        <h1>Resultados:</h1>
        <p>${mtbf_explicacion}</p>
        <p>${numero_fallas_explicacion}</p>
        <p>${costo_tarea_mantenimiento_explicacion}</p>
        <p>${costo_falla_explicacion}</p>
        <p>${costo_mantenimiento_correctivo_explicacion}</p>
    `;

    // Mostrar resultados en el div de resultados
    document.getElementById('resultados').innerHTML = resultadosHTML;
}