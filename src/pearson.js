/* =========================================================
   TEMA 1: COEFICIENTE DE CORRELACIÓN DE PEARSON
   Guarda este archivo como src/pearson.js
   ========================================================= */

/* Datos de los ejercicios (hardcodeados para los botones de carga rápida) */
const EJERCICIOS_PEARSON = {
  1: {
    titulo: 'Ejercicio 1: Horas de Estudio',
    x: [1, 1.5, 2, 2.5, 3, 4, 5],
    y: [6, 6.5, 7, 7.5, 8, 9, 10],
  },
  2: {
    titulo: 'Ejercicio 2: Programadores',
    x: [2, 4, 6, 7, 8, 9, 10],
    y: [10, 20, 30, 35, 40, 45, 50],
  },
};

/* ---------- LÓGICA MATEMÁTICA ---------- */
const suma = arr => arr.reduce((acc, v) => acc + v, 0);

export function calcularPearson(x, y) {
  if (x.length !== y.length || x.length === 0) {
    throw new Error('X y Y deben tener la misma cantidad de datos (y al menos uno).');
  }
  const n = x.length;
  const promX = suma(x) / n;
  const promY = suma(y) / n;

  // Columnas intermedias (cada una en su propio arreglo)
  const difX = x.map(v => v - promX);               // X - PROMEDIO X
  const difY = y.map(v => v - promY);               // Y - PROMEDIO Y
  const mult = difX.map((d, i) => d * difY[i]);     // Multiplicación
  const cuadX = difX.map(d => d * d);               // Cuadrado X
  const cuadY = difY.map(d => d * d);               // Cuadrado Y

  // Sumatorias
  const sumMult = suma(mult);
  const sumCuadX = suma(cuadX);
  const sumCuadY = suma(cuadY);

  // R = ΣMultiplicación / √(ΣCuadradoX × ΣCuadradoY)
  const raiz = Math.sqrt(sumCuadX * sumCuadY);
  const r = raiz === 0 ? NaN : sumMult / raiz;

  return { promX, promY, difX, difY, mult, cuadX, cuadY, sumMult, sumCuadX, sumCuadY, raiz, r };
}

export function interpretarR(r) {
  if (Number.isNaN(r)) return 'No se puede calcular R: todos los valores de X o de Y son iguales.';
  if (r > 0.8) return 'Correlación positiva fuerte. Significa que a medida que aumenta X, también aumenta Y de manera proporcional.';
  if (r < -0.8) return 'Correlación negativa fuerte.';
  if (r >= -0.5 && r <= 0.5) return 'Correlación débil o nula.';
  return r > 0 ? 'Correlación positiva moderada.' : 'Correlación negativa moderada.'; // zona intermedia (0.5 a 0.8)
}

/* ---------- VISTA ---------- */
const $p = s => document.querySelector(s);
const fmt = n => String(+n.toFixed(4)); // máx. 4 decimales, sin ceros sobrantes

function pintarTabla(x, y, c) {
  const filas = x.map((_, i) => `
    <tr>
      <td class="data-cell">${x[i]}</td>
      <td class="data-cell">${y[i]}</td>
      <td class="data-cell">${fmt(c.difX[i])}</td>
      <td class="data-cell">${fmt(c.difY[i])}</td>
      <td class="data-cell">${fmt(c.mult[i])}</td>
      <td class="data-cell">${fmt(c.cuadX[i])}</td>
      <td class="data-cell">${fmt(c.cuadY[i])}</td>
    </tr>`).join('');

  $p('#pearson-tabla').innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>X</th><th>Y</th><th>X - PROMEDIO X</th><th>Y - PROMEDIO Y</th>
          <th>Multiplicación</th><th>Cuadrado X</th><th>Cuadrado Y</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
        <tr class="sum-row">
          <td class="data-cell" colspan="4">Sumatoria</td>
          <td class="data-cell">${fmt(c.sumMult)}</td>
          <td class="data-cell">${fmt(c.sumCuadX)}</td>
          <td class="data-cell">${fmt(c.sumCuadY)}</td>
        </tr>
      </tbody>
    </table>`;
}

function pintarResultados(c) {
  const item = (label, valor, extra = '') =>
    `<div class="result-item ${extra}"><span class="muted">${label}</span><b>${valor}</b></div>`;
  $p('#pearson-resultados').innerHTML = [
    item('Promedio X', fmt(c.promX)),
    item('Promedio Y', fmt(c.promY)),
    item('Sumatoria Multiplicación', fmt(c.sumMult)),
    item('Sumatoria Cuadrado X', fmt(c.sumCuadX)),
    item('Sumatoria Cuadrado Y', fmt(c.sumCuadY)),
    item('Raíz √(ΣX² × ΣY²)', fmt(c.raiz)),
    item('R', Number.isNaN(c.r) ? 'N/A' : fmt(c.r), 'result-r'),
  ].join('');
}

export function mostrarEjercicioPearson(id) {
  const ej = EJERCICIOS_PEARSON[id];
  const c = calcularPearson(ej.x, ej.y);

  $p('#pearson-vacio').hidden = true;
  $p('#pearson-contenido').hidden = false;
  $p('#pearson-titulo').textContent = ej.titulo;
  $p('#pearson-datos-x').textContent = `[${ej.x.join(', ')}]`;
  $p('#pearson-datos-y').textContent = `[${ej.y.join(', ')}]`;
  pintarTabla(ej.x, ej.y, c);
  pintarResultados(c);
  $p('#pearson-interpretacion').textContent = interpretarR(c.r);

  // Marca el botón activo
  document.querySelectorAll('[data-pearson]').forEach(b =>
    b.classList.toggle('active', b.dataset.pearson === String(id)));
}

/* Llama a esta función una sola vez al arrancar (en main.js) */
export function iniciarPearson() {
  document.querySelectorAll('[data-pearson]').forEach(btn =>
    btn.addEventListener('click', () => mostrarEjercicioPearson(btn.dataset.pearson)));
}