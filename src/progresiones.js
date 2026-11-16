/* =========================================================
   TEMA 2: PROGRESIONES ARITMÉTICAS (datos editables)
   Guarda este archivo como src/progresiones.js
   ========================================================= */

/* ---------- Utilidades de formato ---------- */
const A = s => `a<sub>${s}</sub>`;                              // a con subíndice
const redondear = n => Math.round(n * 1e6) / 1e6;               // evita 25.000000000000004
const fmt = n => String(redondear(n)).replace('-', '−');        // máx. 6 decimales, sin ceros sobrantes
const par = n => (n < 0 ? `(${fmt(n)})` : fmt(n));              // negativos entre paréntesis
const tendencia = d =>
  d > 0 ? `crece ${fmt(d)} unidades en cada término`
  : d < 0 ? `decrece ${fmt(-d)} unidades en cada término`
  : 'es constante';
const esPosicion = n => Number.isInteger(n) && n >= 1;
const nombreTermino = (n, ordinal0, n0) => (n === n0 ? `${ordinal0} término` : `término ${n}`);
const ERR_POS = nombre => `${nombre} debe ser un número entero mayor o igual a 1.`;

/* =========================================================
   LÓGICA MATEMÁTICA (método de los apuntes de clase)
   ========================================================= */
// a_n = a_m + (n - m)d  -->  d = (a_n - a_m) / (n - m)
export const diferencia = (m, am, n, an) => (an - am) / (n - m);
// a_1 = a_m - (m - 1)d
export const primerTermino = (m, am, d) => am - (m - 1) * d;
// a_n = a_1 + (n - 1)d
export const termino = (a1, n, d) => a1 + (n - 1) * d;
// n = (a_n - a_1) / d + 1
export const posicion = (a1, an, d) => (an - a1) / d + 1;

const FORMULA_GENERAL = `${A('n')} = ${A(1)} + (n − 1) · d`;
const PASO_FORMULA = { titulo: 'Fórmula general', lineas: [FORMULA_GENERAL] };

/* =========================================================
   DATOS ORIGINALES DEL PORTAFOLIO (hardcodeados)
   tipo 'posicion'     -> se busca n (Ejercicio 1)
   tipo 'sucesion'     -> se dan a1 y a2, se busca a_n (Ejercicio 2)
   tipo 'dos-terminos' -> se dan dos términos (p = posición, v = valor)
                          objetivo: 'primeros3' | 'a1' | { termino, ordinal }
   <<< AQUÍ AGREGAS NUEVOS EJERCICIOS O INCISOS >>>
   ========================================================= */
export const EJERCICIOS = [
  {
    id: 1, titulo: 'Ejercicio 1', corto: 'UDIS', tema: 'Cotización futura de las UDIS',
    enunciado: 'Suponiendo que las unidades de inversión, UDIS, aumentan su cotización en 475 millonésimas de pesos por día, ¿qué día estarán a $4.203193, si el primer día del mes valieron $4.191318?',
    problemas: [{ tipo: 'posicion', a1: 4.191318, d: 0.000475, an: 4.203193 }],
  },
  {
    id: 2, titulo: 'Ejercicio 2', corto: 'Término indicado', tema: 'Obtenga el término indicado',
    enunciado: 'Obtenga el término indicado en las progresiones aritméticas.',
    problemas: [
      { etiqueta: 'a', a1: 1,   a2: -3, n: 10, ordinal: 'décimo' },
      { etiqueta: 'b', a1: 4,   a2: 1,  n: 20, ordinal: 'vigésimo' },
      { etiqueta: 'c', a1: -10, a2: -5, n: 8,  ordinal: 'octavo' },
      { etiqueta: 'd', a1: 4,   a2: 7,  n: 30, ordinal: 'trigésimo' },
      { etiqueta: 'e', a1: 100, a2: 80, n: 9,  ordinal: 'noveno' },
      { etiqueta: 'f', a1: -5,  a2: 3,  n: 12, ordinal: 'duodécimo' },
    ].map(p => ({ tipo: 'sucesion', ...p })),
  },
  {
    id: 3, titulo: 'Ejercicio 3', corto: 'Primeros tres términos', tema: 'Primeros tres términos',
    enunciado: 'Encuentre los primeros tres términos de la progresión aritmética si:',
    problemas: [
      { etiqueta: 'a', p1: 12, v1: -13, p2: 15, v2: -28 },
      { etiqueta: 'b', p1: 5,  v1: -3,  p2: 6,  v2: 4 },
      { etiqueta: 'c', p1: 10, v1: -2,  p2: 20, v2: 8 },
      { etiqueta: 'd', p1: 6,  v1: 10,  p2: 10, v2: 6 },
    ].map(p => ({ tipo: 'dos-terminos', objetivo: 'primeros3', ...p })),
  },
  {
    id: 4, titulo: 'Ejercicio 4', corto: 'Primer término', tema: 'Primer término de la sucesión',
    enunciado: 'Calcule el primer término de la sucesión aritmética, donde el quinto sea 20 y el undécimo 23.',
    problemas: [{ tipo: 'dos-terminos', objetivo: 'a1', p1: 5, v1: 20, p2: 11, v2: 23 }],
  },
  {
    id: 5, titulo: 'Ejercicio 5', corto: 'Cuarto término', tema: 'Cuarto término de la progresión',
    enunciado: '¿Cuál es el cuarto término de la progresión aritmética si el que está en el lugar 49 es 25 y en el lugar 50 es 21?',
    problemas: [{ tipo: 'dos-terminos', objetivo: { termino: 4, ordinal: 'cuarto' }, p1: 49, v1: 25, p2: 50, v2: 21 }],
  },
];

/* Valores editables de cada problema (lo que el usuario puede cambiar) */
export function valoresIniciales(p) {
  if (p.tipo === 'posicion') return { a1: p.a1, d: p.d, an: p.an };
  if (p.tipo === 'sucesion') return { a1: p.a1, a2: p.a2, n: p.n };
  const v = { p1: p.p1, v1: p.v1, p2: p.p2, v2: p.v2 };
  if (typeof p.objetivo === 'object') v.k = p.objetivo.termino;
  return v;
}

/* Etiquetas de los inputs de cada tipo de problema */
function camposDe(p) {
  if (p.tipo === 'posicion') return [
    { k: 'a1', sim: A(1), nota: 'cotización el primer día del mes' },
    { k: 'd', sim: 'd', nota: 'aumento por día (diferencia común)' },
    { k: 'an', sim: A('n'), nota: 'cotización que se quiere alcanzar' },
  ];
  if (p.tipo === 'sucesion') return [
    { k: 'a1', sim: A(1), nota: 'primer término' },
    { k: 'a2', sim: A(2), nota: 'segundo término' },
    { k: 'n', sim: 'n', nota: 'posición del término buscado' },
  ];
  const c = [
    { k: 'p1', sim: 'm', nota: 'posición del primer término conocido' },
    { k: 'v1', sim: A('m'), nota: 'valor del término en la posición m' },
    { k: 'p2', sim: 'n', nota: 'posición del segundo término conocido' },
    { k: 'v2', sim: A('n'), nota: 'valor del término en la posición n' },
  ];
  if (typeof p.objetivo === 'object') c.push({ k: 'k', sim: 'k', nota: 'posición del término buscado' });
  return c;
}

/* =========================================================
   RESOLUTORES: devuelven { incognitas, pasos, resultado } o { error }
   ========================================================= */

/* Ejercicio 1: se busca la posición n */
function resolverPosicion(orig, { a1, d, an }) {
  if (d === 0) {
    return { error: `La diferencia común d no puede ser 0: n = (${A('n')} − ${A(1)}) / d implicaría dividir entre cero.` };
  }
  const dif = an - a1;
  const n = redondear(posicion(a1, an, d));
  const comp = termino(a1, n, d);
  const ok = redondear(comp) === redondear(an) ? ' ✓' : '';

  let texto, interpretacion;
  if (Number.isInteger(n) && n >= 1) {
    texto = `Las UDIS estarán a $${fmt(an)} el día ${fmt(n)} del mes.`;
    interpretacion = `Se necesitan ${fmt(n - 1)} aumentos diarios de $${fmt(d)} para pasar de $${fmt(a1)} a $${fmt(an)}.`;
  } else if (n < 1) {
    texto = `n = ${fmt(n)} es menor que 1: la cotización $${fmt(an)} correspondería a un momento anterior al primer día del mes.`;
    interpretacion = `Con d = ${fmt(d)} la cotización no llega a $${fmt(an)} avanzando desde el primer día.`;
  } else {
    texto = `n = ${fmt(n)} no es entero: la cotización $${fmt(an)} no coincide exactamente con ningún día del mes.`;
    interpretacion = `Se alcanza entre el día ${Math.floor(n)} y el día ${Math.ceil(n)}.`;
  }

  return {
    incognitas: [{ sim: 'n', nota: 'día del mes (incógnita)' }],
    pasos: [
      PASO_FORMULA,
      { titulo: 'Despejar n', lineas: [
        `${A('n')} − ${A(1)} = (n − 1) · d`,
        `n − 1 = (${A('n')} − ${A(1)}) / d`,
        `n = (${A('n')} − ${A(1)}) / d + 1`] },
      { titulo: 'Sustituir valores', lineas: [`n = (${fmt(an)} − ${par(a1)}) / ${par(d)} + 1`] },
      { titulo: 'Operaciones', lineas: [
        `n = ${fmt(dif)} / ${par(d)} + 1`,
        `n = ${fmt(dif / d)} + 1`,
        `n = ${fmt(n)}`] },
      { titulo: 'Comprobación', lineas: [`${A(fmt(n))} = ${fmt(a1)} + (${fmt(n)} − 1) · ${par(d)} = ${fmt(comp)}${ok}`] },
    ],
    resultado: { principal: `n = ${fmt(n)}`, texto, interpretacion },
  };
}

/* Ejercicio 2: se dan a1 y a2, se busca a_n */
function resolverSucesion(orig, { a1, a2, n }) {
  if (!esPosicion(n)) return { error: ERR_POS('La posición n') };
  const nom = nombreTermino(n, orig.ordinal, orig.n);
  const d = diferencia(1, a1, 2, a2);
  const an = termino(a1, n, d);
  return {
    incognitas: [
      { sim: 'd', nota: 'diferencia común (se obtiene primero)' },
      { sim: A(n), nota: `${nom} (incógnita)` },
    ],
    pasos: [
      PASO_FORMULA,
      { titulo: 'Obtener la diferencia común (d)',
        explicacion: `Con los términos conocidos ${A(1)} y ${A(2)} (m = 1, n = 2) se plantea la relación de saltos:`,
        lineas: [
          `${A('n')} = ${A('m')} + (n − m) · d`,
          `(n − m) · d = ${A('n')} − ${A('m')}`,
          `d = (${A('n')} − ${A('m')}) / (n − m)`] },
      { titulo: 'Sustituir y calcular d', lineas: [
        `d = (${fmt(a2)} − ${par(a1)}) / (2 − 1)`,
        `d = ${fmt(a2 - a1)} / 1`,
        `d = ${fmt(d)}`] },
      { titulo: `Calcular el ${nom} (n = ${n})`, lineas: [
        `${A(n)} = ${A(1)} + (${n} − 1) · d`,
        `${A(n)} = ${fmt(a1)} + ${n - 1} · ${par(d)}`,
        `${A(n)} = ${fmt(a1)} + ${par((n - 1) * d)}`,
        `${A(n)} = ${fmt(an)}`] },
    ],
    resultado: {
      principal: `${A(n)} = ${fmt(an)}`,
      texto: `El ${nom} de la progresión es ${fmt(an)}.`,
      interpretacion: `Con d = ${fmt(d)}, la progresión ${tendencia(d)}; por eso pasa de ${fmt(a1)} en la posición 1 a ${fmt(an)} en la posición ${n}.`,
    },
  };
}

/* Ejercicios 3, 4 y 5: se dan dos términos (a_m y a_n) */
function resolverDosTerminos(orig, v) {
  const { p1: m, v1: am, p2: n, v2: an } = v;
  const obj = orig.objetivo;
  const k = typeof obj === 'object' ? v.k : null;

  if (!esPosicion(m) || !esPosicion(n)) return { error: ERR_POS('Las posiciones m y n') };
  if (m === n) {
    return { error: `Las posiciones m y n deben ser distintas: d = (${A('n')} − ${A('m')}) / (n − m) implicaría dividir entre cero.` };
  }
  if (k !== null && !esPosicion(k)) return { error: ERR_POS('La posición k') };

  const d = diferencia(m, am, n, an);
  const a1 = primerTermino(m, am, d);
  const comp = termino(a1, n, d);
  const ok = redondear(comp) === redondear(an) ? ' ✓' : '';

  const incognitas = [
    { sim: 'd', nota: 'diferencia común (se obtiene primero)' },
    { sim: A(1), nota: 'primer término' },
  ];
  if (obj === 'primeros3') incognitas.push({ sim: A(2), nota: 'segundo término' }, { sim: A(3), nota: 'tercer término' });
  const nomK = k !== null ? nombreTermino(k, obj.ordinal, obj.termino) : '';
  if (k !== null) incognitas.push({ sim: A(k), nota: nomK });

  const pasos = [
    PASO_FORMULA,
    { titulo: 'Obtener la diferencia común (d)',
      explicacion: `Con los términos conocidos ${A(m)} y ${A(n)} (m = ${m}, n = ${n}) se plantea la relación de saltos:`,
      lineas: [
        `${A('n')} = ${A('m')} + (n − m) · d`,
        `(n − m) · d = ${A('n')} − ${A('m')}`,
        `d = (${A('n')} − ${A('m')}) / (n − m)`] },
    { titulo: 'Sustituir y calcular d', lineas: [
      `d = (${fmt(an)} − ${par(am)}) / (${n} − ${m})`,
      `d = ${fmt(an - am)} / ${par(n - m)}`,
      `d = ${fmt(d)}`] },
    { titulo: 'Obtener el primer término',
      explicacion: `Se despeja ${A(1)} desde un término conocido (${A(m)}):`,
      lineas: [
        `${A(1)} = ${A('m')} − (m − 1) · d`,
        `${A(1)} = ${fmt(am)} − (${m} − 1) · ${par(d)}`,
        `${A(1)} = ${fmt(am)} − ${par((m - 1) * d)}`,
        `${A(1)} = ${fmt(a1)}`] },
  ];

  let resultado;
  if (obj === 'primeros3') {
    const a2 = a1 + d, a3 = a1 + 2 * d;
    pasos.push({ titulo: 'Calcular los primeros tres términos', lineas: [
      `${A(1)} = ${fmt(a1)}`,
      `${A(2)} = ${A(1)} + d = ${fmt(a1)} + ${par(d)} = ${fmt(a2)}`,
      `${A(3)} = ${A(1)} + 2d = ${fmt(a1)} + 2 · ${par(d)} = ${fmt(a3)}`] });
    resultado = {
      principal: `${A(1)} = ${fmt(a1)},  ${A(2)} = ${fmt(a2)},  ${A(3)} = ${fmt(a3)}`,
      texto: `Los primeros tres términos son ${fmt(a1)}, ${fmt(a2)} y ${fmt(a3)}.`,
      interpretacion: `La progresión ${tendencia(d)} (d = ${fmt(d)}): ${fmt(a1)}, ${fmt(a2)}, ${fmt(a3)}, …`,
    };
  } else if (k !== null) {
    const ak = termino(a1, k, d);
    pasos.push({ titulo: `Calcular el ${nomK}`, lineas: [
      `${A(k)} = ${A(1)} + (${k} − 1) · d`,
      `${A(k)} = ${fmt(a1)} + ${k - 1} · ${par(d)}`,
      `${A(k)} = ${fmt(a1)} + ${par((k - 1) * d)}`,
      `${A(k)} = ${fmt(ak)}`] });
    resultado = {
      principal: `${A(k)} = ${fmt(ak)}`,
      texto: `El ${nomK} de la progresión es ${fmt(ak)}.`,
      interpretacion: `La progresión parte de ${A(1)} = ${fmt(a1)} y ${tendencia(d)}; en la posición ${k} llega a ${fmt(ak)}.`,
    };
  } else {
    resultado = {
      principal: `${A(1)} = ${fmt(a1)}`,
      texto: `El primer término de la sucesión es ${fmt(a1)}.`,
      interpretacion: `Con d = ${fmt(d)}, la sucesión ${tendencia(d)} y pasa por ${A(m)} = ${fmt(am)} y ${A(n)} = ${fmt(an)}.`,
    };
  }
  pasos.push({ titulo: 'Comprobación', lineas: [
    `${A(n)} = ${fmt(a1)} + (${n} − 1) · ${par(d)} = ${fmt(comp)}${ok}`] });

  return { incognitas, pasos, resultado };
}

const RESOLUTORES = { posicion: resolverPosicion, sucesion: resolverSucesion, 'dos-terminos': resolverDosTerminos };

/* Resuelve un problema con los valores dados (por defecto, los originales) */
export function resolver(orig, v = valoresIniciales(orig)) {
  if (Object.values(v).some(x => !Number.isFinite(x))) {
    return { error: 'Hay campos vacíos o con valores no válidos. Completa todos los datos para continuar.' };
  }
  return RESOLUTORES[orig.tipo](orig, v);
}

/* =========================================================
   VISTA EDITABLE
   ========================================================= */
const $q = s => document.querySelector(s);
let estadoProg = { ej: null, inciso: 0 };

const problemaActual = () => EJERCICIOS.find(e => e.id === estadoProg.ej).problemas[estadoProg.inciso];

function textoInciso(p) {
  if (p.tipo === 'sucesion') return `Sucesión: ${fmt(p.a1)}, ${fmt(p.a2)}, … → obtener el ${p.ordinal} término (n = ${p.n}).`;
  return `${A(p.p1)} = ${fmt(p.v1)} y ${A(p.p2)} = ${fmt(p.v2)}`;
}

function pintarSelectores() {
  $q('#prog-ejercicios').innerHTML = EJERCICIOS.map(e => `
    <button type="button" class="btn-primary ${e.id === estadoProg.ej ? 'active' : ''}" data-prog-ej="${e.id}">
      Ejercicio ${e.id} (${e.corto})
    </button>`).join('');

  const ej = EJERCICIOS.find(e => e.id === estadoProg.ej);
  const tabs = $q('#prog-incisos');
  tabs.hidden = !ej || ej.problemas.length < 2;
  tabs.innerHTML = tabs.hidden ? '' : ej.problemas.map((p, i) => `
    <button type="button" class="btn-tab ${i === estadoProg.inciso ? 'active' : ''}" data-prog-inciso="${i}">
      Inciso ${p.etiqueta})
    </button>`).join('');
}

/* Lee los inputs del Bloque 2: { a1: 1, d: -4, ... } (NaN si está vacío) */
function leerValores() {
  const v = {};
  document.querySelectorAll('#prog-b2 [data-campo]').forEach(inp => {
    v[inp.dataset.campo] = inp.value.trim() === '' ? NaN : Number(inp.value);
  });
  return v;
}

/* Recalcula Bloque 3 y Bloque 4 (y las incógnitas) con los valores actuales */
export function recalcularProgresion() {
  const orig = problemaActual();
  const v = leerValores();
  document.querySelectorAll('#prog-b2 [data-campo]').forEach(inp =>
    inp.classList.toggle('invalido', !Number.isFinite(v[inp.dataset.campo])));

  const r = resolver(orig, v);   // <<< AQUÍ SE EJECUTA LA LÓGICA MATEMÁTICA CON LOS DATOS EDITADOS >>>
  const aviso = $q('#prog-aviso');

  if (r.error) {
    aviso.hidden = false;
    aviso.innerHTML = `<span class="aviso-icono">⚠</span><span>${r.error}</span>`;
    $q('#prog-incognitas').innerHTML = '';
    $q('#prog-b3').innerHTML = '<p class="muted">Corrige los datos para ver el procedimiento.</p>';
    $q('#prog-b4').innerHTML = '<p class="muted">Sin resultado: revisa el aviso del Bloque 2.</p>';
    return;
  }
  aviso.hidden = true;

  $q('#prog-incognitas').innerHTML = r.incognitas.map(d => `
    <li class="incognita">
      <span class="data-var">${d.sim}</span><span class="data-val">= ?</span>
      <span class="data-nota">${d.nota}</span>
    </li>`).join('');

  $q('#prog-b3').innerHTML = `<ol class="pasos">${r.pasos.map(s => `
    <li class="paso">
      <p class="paso-titulo">${s.titulo}</p>
      ${s.explicacion ? `<p class="paso-expl">${s.explicacion}</p>` : ''}
      ${s.lineas.map(l => `<div class="formula">${l}</div>`).join('')}
    </li>`).join('')}</ol>`;

  $q('#prog-b4').innerHTML = `
    <div class="answer">
      <p class="answer-valor">${r.resultado.principal}</p>
      <p>${r.resultado.texto}</p>
      <p class="muted">${r.resultado.interpretacion}</p>
    </div>`;
}

/* Vuelve a los datos del portafolio */
function restaurarOriginales() {
  const vals = valoresIniciales(problemaActual());
  document.querySelectorAll('#prog-b2 [data-campo]').forEach(inp => (inp.value = String(vals[inp.dataset.campo])));
  recalcularProgresion();
}

export function mostrarProgresion(ejId, incisoIdx = 0) {
  const ej = EJERCICIOS.find(e => e.id === ejId);
  const p = ej.problemas[incisoIdx];
  estadoProg = { ej: ejId, inciso: incisoIdx };

  pintarSelectores();
  $q('#prog-vacio').hidden = true;
  $q('#prog-contenido').hidden = false;
  $q('#prog-titulo').textContent = `${ej.titulo}: ${ej.tema}${p.etiqueta ? ` · Inciso ${p.etiqueta})` : ''}`;

  // Bloque 1: enunciado original (referencia, no cambia al editar)
  $q('#prog-b1').innerHTML = `<p class="enunciado">${ej.enunciado}</p>` +
    (p.etiqueta ? `<p class="inciso"><b>Inciso ${p.etiqueta})</b> ${textoInciso(p)}</p>` : '');

  // Bloque 2: inputs editables con los valores originales + controles
  const vals = valoresIniciales(p);
  $q('#prog-b2').innerHTML = `
    <div class="campos-grid">${camposDe(p).map(c => `
      <label class="campo">
        <span class="campo-sim">${c.sim}</span>
        <input type="number" step="any" class="input-num" data-campo="${c.k}" value="${vals[c.k]}">
        <span class="campo-nota">${c.nota}</span>
      </label>`).join('')}
    </div>
    <div class="acciones">
      <button type="button" class="btn-recalcular" data-prog-accion="recalcular">Recalcular</button>
      <button type="button" class="btn-secundario" data-prog-accion="restaurar">Restaurar originales</button>
    </div>
    <div class="aviso" id="prog-aviso" role="alert" hidden></div>
    <p class="bloque-subtitulo">Incógnitas a obtener</p>
    <ul class="data-list" id="prog-incognitas"></ul>`;

  recalcularProgresion();   // se ve resuelto desde el primer instante
}

/* Llama a esta función una sola vez al arrancar (en main.js) */
export function iniciarProgresiones() {
  const vista = $q('#view-progresiones');
  vista.addEventListener('click', e => {
    const ej = e.target.closest('[data-prog-ej]');
    const inc = e.target.closest('[data-prog-inciso]');
    const acc = e.target.closest('[data-prog-accion]');
    if (ej) mostrarProgresion(Number(ej.dataset.progEj), 0);            // al elegir ejercicio abre el inciso a
    else if (inc) mostrarProgresion(estadoProg.ej, Number(inc.dataset.progInciso));
    else if (acc) acc.dataset.progAccion === 'restaurar' ? restaurarOriginales() : recalcularProgresion();
  });
  // Tiempo real: recalcula mientras el usuario escribe
  vista.addEventListener('input', e => { if (e.target.matches('[data-campo]')) recalcularProgresion(); });
  // Enter dentro de cualquier input también recalcula
  vista.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('[data-campo]')) { e.preventDefault(); recalcularProgresion(); }
  });
  pintarSelectores();
}