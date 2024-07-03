document.getElementById('calculateBtn').addEventListener('click', function() {
    // Obtener los valores del formulario
    const demandRate = parseFloat(document.getElementById('demandRate').value);
    let leadTime = parseFloat(document.getElementById('leadTime').value);
    const containerSize = parseFloat(document.getElementById('containerSize').value);
    const timeUnit = document.getElementById('timeUnit').value;
  
    // Validar los inputs antes de proceder con el cálculo
    if (!validateInputs(demandRate, leadTime, containerSize)) {
      return; // Detener la ejecución si hay problemas de validación
    }
  
    let conversionText = '';
    let leadTimeText = '';
  
    // Convertir el tiempo de vuelta del recipiente a minutos si está en horas
    if (timeUnit === 'hours') {
      conversionText = `<h4>Tiempo de vuelta convertido:</h4> ${leadTime} horas * 60 = ${leadTime * 60} minutos`;
      leadTime *= 60; // Convertir horas a minutos
      leadTimeText = `${leadTime} minutos`;
    } else {
      leadTimeText = `${leadTime} minutos`;
    }
  
    // Calcular la cantidad de recipientes (N) y redondear a entero
    const N = Math.round((demandRate * leadTime) / (60 * containerSize));
  
    // Calcular el inventario máximo (I) y redondear a entero
    const I = Math.round(N * containerSize);
  
    // Mostrar los resultados
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
      <h2>Resultados:</h2>
      <p>${conversionText}</p>
      <p><h4>Cantidad de recipientes (N):</h4> (${demandRate} x ${leadTimeText}) / (60 x ${containerSize}) = ${N}</p>
      <p><h4>Inventario máximo (I):</h4> ${N} x ${containerSize} = ${I}</p>
    `;
  });
  
  function validateInputs(demandRate, leadTime, containerSize) {
    // Validar campos vacíos y valores numéricos
    if (isNaN(demandRate) || isNaN(leadTime) || isNaN(containerSize)) {
      alert('Por favor llene todos los campos con valores numéricos.');
      return false;
    }
  
    // Validar valores mayores a cero
    if (demandRate <= 0 || leadTime <= 0 || containerSize <= 0) {
      alert('Por favor ingrese valores mayores a cero en todos los campos.');
      return false;
    }
  
    return true;
  }
  