/* =========================================================
   TEMA 2: PROGRESIONES ARITMÉTICAS
   Guarda este archivo como src/progresiones.js
   ========================================================= */

/* ---------- Utilidades de formato ---------- */
const A = s => `a<sub>${s}</sub>`;                              // a con subíndice
const redondear = n => Math.round(n * 1e6) / 1e6;               // evita 25.000000000000004
const fmt = n => String(redondear(n)).replace('-', '−');        // número con signo menos tipográfico
const par = n => (n < 0 ? `(${fmt(n)})` : fmt(n));              // negativos entre paréntesis
const tendencia = d =>
  d > 0 ? `crece ${fmt(d)} unidades en cada término`
  : d < 0 ? `decrece ${fmt(-d)} unidades en cada término`
  : 'es constante';

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
   DATOS DE LOS EJERCICIOS (hardcodeados)
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
    problemas: [{ tipo: 'posicion', a1: 4.191318, d: 0.000475, an: 4.203193, notaD: '475 millonésimas de peso por día' }],
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

/* =========================================================
   RESOLUTORES: devuelven { datos, pasos, resultado }
   ========================================================= */

/* Ejercicio 1: se busca la posición n */
function resolverPosicion({ a1, d, an, notaD }) {
  const dif = an - a1;
  const n = redondear(posicion(a1, an, d));
  const comp = termino(a1, n, d);
  const ok = redondear(comp) === redondear(an) ? ' ✓' : '';
  return {
    datos: [
      { sim: A(1), valor: fmt(a1), nota: 'cotización el primer día del mes' },
      { sim: 'd', valor: fmt(d), nota: notaD },
      { sim: A('n'), valor: fmt(an), nota: 'cotización que se quiere alcanzar' },
      { sim: 'n', valor: '?', nota: 'día del mes (incógnita)', incognita: true },
    ],
    pasos: [
      PASO_FORMULA,
      { titulo: 'Despejar n', lineas: [
        `${A('n')} − ${A(1)} = (n − 1) · d`,
        `n − 1 = (${A('n')} − ${A(1)}) / d`,
        `n = (${A('n')} − ${A(1)}) / d + 1`] },
      { titulo: 'Sustituir valores', lineas: [`n = (${fmt(an)} − ${fmt(a1)}) / ${fmt(d)} + 1`] },
      { titulo: 'Operaciones', lineas: [
        `n = ${fmt(dif)} / ${fmt(d)} + 1`,
        `n = ${fmt(dif / d)} + 1`,
        `n = ${fmt(n)}`] },
      { titulo: 'Comprobación', lineas: [`${A(fmt(n))} = ${fmt(a1)} + (${fmt(n)} − 1) · ${fmt(d)} = ${fmt(comp)}${ok}`] },
    ],
    resultado: {
      principal: `n = ${fmt(n)}`,
      texto: `Las UDIS estarán a $${fmt(an)} el día ${fmt(n)} del mes.`,
      interpretacion: `Se necesitan ${fmt(n - 1)} aumentos diarios de $${fmt(d)} para pasar de $${fmt(a1)} a $${fmt(an)}.`,
    },
  };
}

/* Ejercicio 2: se dan a1 y a2, se busca a_n */
function resolverSucesion({ a1, a2, n, ordinal }) {
  const d = diferencia(1, a1, 2, a2);
  const an = termino(a1, n, d);
  return {
    datos: [
      { sim: A(1), valor: fmt(a1), nota: 'primer término' },
      { sim: A(2), valor: fmt(a2), nota: 'segundo término' },
      { sim: 'n', valor: String(n), nota: `posición buscada (${ordinal} término)` },
      { sim: 'd', valor: '?', nota: 'diferencia común (se obtiene primero)', incognita: true },
      { sim: A(n), valor: '?', nota: `${ordinal} término (incógnita)`, incognita: true },
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
      { titulo: `Calcular el ${ordinal} término (n = ${n})`, lineas: [
        `${A(n)} = ${A(1)} + (${n} − 1) · d`,
        `${A(n)} = ${fmt(a1)} + ${n - 1} · ${par(d)}`,
        `${A(n)} = ${fmt(a1)} + ${par((n - 1) * d)}`,
        `${A(n)} = ${fmt(an)}`] },
    ],
    resultado: {
      principal: `${A(n)} = ${fmt(an)}`,
      texto: `El ${ordinal} término de la progresión es ${fmt(an)}.`,
      interpretacion: `Con d = ${fmt(d)}, la progresión ${tendencia(d)}; por eso pasa de ${fmt(a1)} en la posición 1 a ${fmt(an)} en la posición ${n}.`,
    },
  };
}

/* Ejercicios 3, 4 y 5: se dan dos términos (a_m y a_n) */
function resolverDosTerminos({ p1: m, v1: am, p2: n, v2: an, objetivo }) {
  const d = diferencia(m, am, n, an);
  const a1 = primerTermino(m, am, d);
  const k = typeof objetivo === 'object' ? objetivo.termino : null;
  const ak = k ? termino(a1, k, d) : null;
  const comp = termino(a1, n, d);
  const ok = redondear(comp) === redondear(an) ? ' ✓' : '';

  const incog = [{ sim: 'd', nota: 'diferencia común (se obtiene primero)' }, { sim: A(1), nota: 'primer término' }];
  if (objetivo === 'primeros3') incog.push({ sim: A(2), nota: 'segundo término' }, { sim: A(3), nota: 'tercer término' });
  if (k) incog.push({ sim: A(k), nota: `${objetivo.ordinal} término` });

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
      `d = ${fmt(an - am)} / ${n - m}`,
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
  if (objetivo === 'primeros3') {
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
  } else if (k) {
    pasos.push({ titulo: `Calcular el ${objetivo.ordinal} término`, lineas: [
      `${A(k)} = ${A(1)} + (${k} − 1) · d`,
      `${A(k)} = ${fmt(a1)} + ${k - 1} · ${par(d)}`,
      `${A(k)} = ${fmt(a1)} + ${par((k - 1) * d)}`,
      `${A(k)} = ${fmt(ak)}`] });
    resultado = {
      principal: `${A(k)} = ${fmt(ak)}`,
      texto: `El ${objetivo.ordinal} término de la progresión es ${fmt(ak)}.`,
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

  return {
    datos: [
      { sim: A(m), valor: fmt(am), nota: `término en la posición ${m}` },
      { sim: A(n), valor: fmt(an), nota: `término en la posición ${n}` },
      ...incog.map(i => ({ ...i, valor: '?', incognita: true })),
    ],
    pasos,
    resultado,
  };
}

const RESOLUTORES = { posicion: resolverPosicion, sucesion: resolverSucesion, 'dos-terminos': resolverDosTerminos };
export const resolver = problema => RESOLUTORES[problema.tipo](problema);

/* =========================================================
   VISTA
   ========================================================= */
const $q = s => document.querySelector(s);
let estadoProg = { ej: null, inciso: 0 };

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

export function mostrarProgresion(ejId, incisoIdx = 0) {
  const ej = EJERCICIOS.find(e => e.id === ejId);
  const p = ej.problemas[incisoIdx];
  const r = resolver(p);                       // <<< AQUÍ SE EJECUTA LA LÓGICA MATEMÁTICA >>>
  estadoProg = { ej: ejId, inciso: incisoIdx };

  pintarSelectores();
  $q('#prog-vacio').hidden = true;
  $q('#prog-contenido').hidden = false;
  $q('#prog-titulo').textContent = `${ej.titulo}: ${ej.tema}${p.etiqueta ? ` · Inciso ${p.etiqueta})` : ''}`;

  // Bloque 1: instrucción
  $q('#prog-b1').innerHTML = `<p class="enunciado">${ej.enunciado}</p>` +
    (p.etiqueta ? `<p class="inciso"><b>Inciso ${p.etiqueta})</b> ${textoInciso(p)}</p>` : '');

  // Bloque 2: datos identificados
  $q('#prog-b2').innerHTML = `<ul class="data-list">${r.datos.map(d => `
    <li class="${d.incognita ? 'incognita' : ''}">
      <span class="data-var">${d.sim}</span><span class="data-val">= ${d.valor}</span>
      <span class="data-nota">${d.nota}</span>
    </li>`).join('')}</ul>`;

  // Bloque 3: procedimiento
  $q('#prog-b3').innerHTML = `<ol class="pasos">${r.pasos.map(s => `
    <li class="paso">
      <p class="paso-titulo">${s.titulo}</p>
      ${s.explicacion ? `<p class="paso-expl">${s.explicacion}</p>` : ''}
      ${s.lineas.map(l => `<div class="formula">${l}</div>`).join('')}
    </li>`).join('')}</ol>`;

  // Bloque 4: resultado final
  $q('#prog-b4').innerHTML = `
    <div class="answer">
      <p class="answer-valor">${r.resultado.principal}</p>
      <p>${r.resultado.texto}</p>
      <p class="muted">${r.resultado.interpretacion}</p>
    </div>`;
}

/* Llama a esta función una sola vez al arrancar (en main.js) */
export function iniciarProgresiones() {
  $q('#view-progresiones').addEventListener('click', e => {
    const ej = e.target.closest('[data-prog-ej]');
    const inc = e.target.closest('[data-prog-inciso]');
    if (ej) mostrarProgresion(Number(ej.dataset.progEj), 0);       // al elegir ejercicio, abre el inciso a
    else if (inc) mostrarProgresion(estadoProg.ej, Number(inc.dataset.progInciso));
  });
  pintarSelectores();
}