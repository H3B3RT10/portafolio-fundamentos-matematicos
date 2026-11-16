/* =========================================================
   TEMA 1: COEFICIENTE DE CORRELACIÓN DE PEARSON (datos editables)
   Guarda este archivo como src/pearson.js
   ========================================================= */

/* Datos originales del portafolio (botones de carga rápida) */
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

/* =========================================================
   LÓGICA MATEMÁTICA
   ========================================================= */
const suma = arr => arr.reduce((acc, v) => acc + v, 0);

export function calcularPearson(x, y) {
  if (x.length !== y.length || x.length === 0) {
    throw new Error('X y Y deben tener la misma cantidad de datos (y al menos uno).');
  }
  const n = x.length;
  const promX = suma(x) / n;
  const promY = suma(y) / n;

  const difX = x.map(v => v - promX);               // X - PROMEDIO X
  const difY = y.map(v => v - promY);               // Y - PROMEDIO Y
  const mult = difX.map((d, i) => d * difY[i]);     // Multiplicación
  const cuadX = difX.map(d => d * d);               // Cuadrado X
  const cuadY = difY.map(d => d * d);               // Cuadrado Y

  const sumMult = suma(mult);
  const sumCuadX = suma(cuadX);
  const sumCuadY = suma(cuadY);

  // R = ΣMultiplicación / √(ΣCuadradoX × ΣCuadradoY)
  const raiz = Math.sqrt(sumCuadX * sumCuadY);
  const r = raiz === 0 ? NaN : sumMult / raiz;      // raíz = 0 -> varianza cero -> R no definido

  return { promX, promY, difX, difY, mult, cuadX, cuadY, sumMult, sumCuadX, sumCuadY, raiz, r };
}

export function interpretarR(r) {
  if (Number.isNaN(r)) return 'No se puede interpretar R: no está definido porque X o Y no varían.';
  if (r > 0.8) return 'Correlación positiva fuerte. Significa que a medida que aumenta X, también aumenta Y de manera proporcional.';
  if (r < -0.8) return 'Correlación negativa fuerte.';
  if (r >= -0.5 && r <= 0.5) return 'Correlación débil o nula.';
  return r > 0 ? 'Correlación positiva moderada.' : 'Correlación negativa moderada.'; // zona intermedia (0.5 a 0.8)
}

/* =========================================================
   VISTA EDITABLE
   ========================================================= */
const $p = s => document.querySelector(s);
const fmt = n => String(+n.toFixed(4)); // máx. 4 decimales, sin ceros sobrantes
const aNumero = s => (s.trim() === '' ? NaN : Number(s));
const COLS = ['difX', 'difY', 'mult', 'cuadX', 'cuadY'];
const SIN_DATO = '—';

let estadoPearson = { id: null };

const filasOriginales = id => {
  const ej = EJERCICIOS_PEARSON[id];
  return ej.x.map((v, i) => ({ x: String(v), y: String(ej.y[i]) }));
};

/* Lee las filas actuales desde los inputs de la tabla (texto crudo) */
function leerFilas() {
  return [...document.querySelectorAll('#pearson-tabla tr[data-fila]')].map(tr => ({
    x: tr.querySelector('[data-col="x"]').value,
    y: tr.querySelector('[data-col="y"]').value,
  }));
}

/* Estructura de la tabla: se redibuja solo al cargar, agregar o eliminar filas */
function tablaHTML(filas) {
  const puedeBorrar = filas.length > 1;
  const cuerpo = filas.map((f, i) => `
    <tr data-fila="${i}">
      <td class="data-cell"><input type="number" step="any" class="input-num" data-col="x" value="${f.x}" aria-label="X, fila ${i + 1}"></td>
      <td class="data-cell"><input type="number" step="any" class="input-num" data-col="y" value="${f.y}" aria-label="Y, fila ${i + 1}"></td>
      ${COLS.map(c => `<td class="data-cell" data-calc="${c}">${SIN_DATO}</td>`).join('')}
      <td class="data-cell col-accion">
        <button type="button" class="btn-del" data-pearson-del="${i}" ${puedeBorrar ? '' : 'disabled'} aria-label="Eliminar fila ${i + 1}">×</button>
      </td>
    </tr>`).join('');

  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>X</th><th>Y</th><th>X - PROMEDIO X</th><th>Y - PROMEDIO Y</th>
          <th>Multiplicación</th><th>Cuadrado X</th><th>Cuadrado Y</th><th class="col-accion"></th>
        </tr>
      </thead>
      <tbody>
        ${cuerpo}
        <tr class="sum-row">
          <td class="data-cell" colspan="4">Sumatoria</td>
          <td class="data-cell" data-sum="mult">${SIN_DATO}</td>
          <td class="data-cell" data-sum="cuadX">${SIN_DATO}</td>
          <td class="data-cell" data-sum="cuadY">${SIN_DATO}</td>
          <td class="data-cell"></td>
        </tr>
      </tbody>
    </table>`;
}

function mostrarAviso(msg) {
  const a = $p('#pearson-aviso');
  a.hidden = !msg;
  a.innerHTML = msg ? `<span class="aviso-icono">⚠</span><span>${msg}</span>` : '';
}

function pintarResultados(c) {
  const dato = k => (c ? fmt(c[k]) : SIN_DATO);
  const rTxt = !c ? SIN_DATO : Number.isNaN(c.r) ? 'No definido' : fmt(c.r);
  const item = (label, valor, extra = '') =>
    `<div class="result-item ${extra}"><span class="muted">${label}</span><b>${valor}</b></div>`;
  $p('#pearson-resultados').innerHTML = [
    item('Promedio X', dato('promX')),
    item('Promedio Y', dato('promY')),
    item('Sumatoria Multiplicación', dato('sumMult')),
    item('Sumatoria Cuadrado X', dato('sumCuadX')),
    item('Sumatoria Cuadrado Y', dato('sumCuadY')),
    item('Raíz √(ΣX² × ΣY²)', dato('raiz')),
    item('R', rTxt, 'result-r'),
  ].join('');
}

/* Recalcula TODO a partir de los valores actuales de los inputs */
export function recalcularPearson() {
  const filas = leerFilas();
  const x = filas.map(f => aNumero(f.x));
  const y = filas.map(f => aNumero(f.y));

  // Marca los inputs vacíos o inválidos
  document.querySelectorAll('#pearson-tabla .input-num').forEach(inp =>
    inp.classList.toggle('invalido', !Number.isFinite(aNumero(inp.value))));

  const sinCalculo = aviso => {
    document.querySelectorAll('#pearson-tabla [data-calc], #pearson-tabla [data-sum]')
      .forEach(td => (td.textContent = SIN_DATO));
    pintarResultados(null);
    mostrarAviso(aviso);
    $p('#pearson-interpretacion').textContent = 'Corrige los datos para obtener la interpretación.';
  };

  // Validaciones
  if (filas.length < 2) return sinCalculo('Se necesitan al menos 2 filas de datos para calcular R. Usa «+ Agregar fila».');
  if ([...x, ...y].some(v => !Number.isFinite(v))) {
    return sinCalculo('Hay celdas vacías o con valores no válidos. Completa todos los valores de X y Y.');
  }

  // Cálculo y actualización de celdas (sin tocar los inputs, para no perder el foco)
  const c = calcularPearson(x, y);
  document.querySelectorAll('#pearson-tabla tr[data-fila]').forEach((tr, i) => {
    COLS.forEach(col => (tr.querySelector(`[data-calc="${col}"]`).textContent = fmt(c[col][i])));
  });
  $p('[data-sum="mult"]').textContent = fmt(c.sumMult);
  $p('[data-sum="cuadX"]').textContent = fmt(c.sumCuadX);
  $p('[data-sum="cuadY"]').textContent = fmt(c.sumCuadY);

  pintarResultados(c);
  mostrarAviso(Number.isNaN(c.r)
    ? 'Varianza cero: todos los valores de X (o de Y) son iguales, la raíz vale 0 y R no se puede calcular.'
    : '');
  $p('#pearson-interpretacion').textContent = interpretarR(c.r);
}

/* Redibuja la tabla con las filas dadas y recalcula */
function cargarFilas(filas, enfocarUltima = false) {
  $p('#pearson-tabla').innerHTML = tablaHTML(filas);
  recalcularPearson();
  if (enfocarUltima) {
    const trs = document.querySelectorAll('#pearson-tabla tr[data-fila]');
    trs[trs.length - 1].querySelector('.input-num').focus();
  }
}

function agregarFila() {
  const filas = leerFilas();
  filas.push({ x: '', y: '' });
  cargarFilas(filas, true);
}

function eliminarFila(i) {
  const filas = leerFilas();
  if (filas.length <= 1) return;
  filas.splice(i, 1);
  cargarFilas(filas);
}

export function mostrarEjercicioPearson(id) {
  const ej = EJERCICIOS_PEARSON[id];
  estadoPearson.id = id;

  $p('#pearson-vacio').hidden = true;
  $p('#pearson-contenido').hidden = false;
  $p('#pearson-titulo').textContent = ej.titulo;
  // La tarjeta "Datos originales" queda como referencia del portafolio
  $p('#pearson-datos-x').textContent = `[${ej.x.join(', ')}]`;
  $p('#pearson-datos-y').textContent = `[${ej.y.join(', ')}]`;

  cargarFilas(filasOriginales(id));   // carga los valores originales y los resuelve al instante

  document.querySelectorAll('[data-pearson]').forEach(b =>
    b.classList.toggle('active', b.dataset.pearson === String(id)));
}

/* Llama a esta función una sola vez al arrancar (en main.js) */
export function iniciarPearson() {
  // Barra de controles y aviso: se inyectan desde JS (index.html no cambia)
  if (!$p('#pearson-acciones')) {
    $p('#pearson-tabla').insertAdjacentHTML('beforebegin', `
      <div class="acciones" id="pearson-acciones">
        <button type="button" class="btn-mini" data-pearson-accion="agregar">+ Agregar fila</button>
        <button type="button" class="btn-recalcular" data-pearson-accion="recalcular">Recalcular</button>
        <button type="button" class="btn-secundario" data-pearson-accion="restaurar">Restaurar originales</button>
      </div>
      <div class="aviso" id="pearson-aviso" role="alert" hidden></div>`);
  }

  // Botones de ejercicio (los del HTML original)
  document.querySelectorAll('[data-pearson]').forEach(btn =>
    btn.addEventListener('click', () => mostrarEjercicioPearson(btn.dataset.pearson)));

  const vista = $p('#view-pearson');
  vista.addEventListener('click', e => {
    const acc = e.target.closest('[data-pearson-accion]');
    const del = e.target.closest('[data-pearson-del]');
    if (acc) {
      const a = acc.dataset.pearsonAccion;
      if (a === 'recalcular') recalcularPearson();
      if (a === 'agregar') agregarFila();
      if (a === 'restaurar') cargarFilas(filasOriginales(estadoPearson.id));
    } else if (del) {
      eliminarFila(Number(del.dataset.pearsonDel));
    }
  });
  // Tiempo real: recalcula mientras el usuario escribe
  vista.addEventListener('input', e => {
    if (e.target.matches('#pearson-tabla .input-num')) recalcularPearson();
  });
  // Enter dentro de cualquier input también recalcula
  vista.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('#pearson-tabla .input-num')) {
      e.preventDefault();
      recalcularPearson();
    }
  });
}