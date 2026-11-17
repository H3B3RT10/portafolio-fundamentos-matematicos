/* =========================================================
   TEMA 4: INTERÉS COMPUESTO (datos editables en tiempo real)
   Guarda este archivo como src/interesCompuesto.js
   ========================================================= */

const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 });
const nfMoneda = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  return nf.format(n).replace('-', '−');
}

export function fmtDinero(n) {
  if (!Number.isFinite(n)) return '—';
  const signo = n < 0 ? '−' : '';
  return `${signo}$${nfMoneda.format(Math.abs(n))}`;
}

const limpiar = x => Number(x.toPrecision(15));
const cerca = (a, b) => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));
const chk = (a, b) => (cerca(a, b) ? ' ✓' : '');

/* =========================================================
   LÓGICA MATEMÁTICA (método de clase)
   ========================================================= */
// M = C · (1 + i)^N
export const montoCompuesto = (C, i, N) => C * Math.pow(1 + i, N);
// C = M / (1 + i)^N
export const valorPresente = (M, i, N) => M / Math.pow(1 + i, N);

/* =========================================================
   DATOS ORIGINALES DEL PORTAFOLIO
   ========================================================= */
export const SECCIONES = [
  {
    id: 1,
    corto: 'Ejercicio 1',
    titulo: 'Ejercicio 1',
    tema: 'Monto que se acumula al invertir un capital',
    enunciado: 'Obtenga el monto que se acumula en tres años, si un capital de $65,000 se invierte al 10% compuesto por semestres.',
    problemas: [
      {
        tipo: 'monto-capital',
        capital: 65000,
        tasaAnual: 10,
        anios: 3,
        frecuencia: 2,
      },
    ],
  },
  {
    id: 2,
    corto: 'Ejercicio 2 (a–c)',
    titulo: 'Ejercicio 2',
    tema: 'Valor presente de un crédito e intereses',
    enunciado: 'El 25% del precio de un mueble de sala se paga con un documento con valor nominal de $4,000 y vencimiento a 30 días. Un 30% se liquida mediante un pago a 60 días de plazo, otro 30% con un documento a 90 días de la compra y el 15% restante se deja como anticipo. Suponga que la mueblería carga el 22.20% anual compuesto por meses en sus ventas a crédito.',
    problemas: [
      {
        etiqueta: 'a',
        tipo: 'credito-mueble',
        subtitulo: 'Obtenga el precio de contado del mueble.',
        valorDoc1: 4000,
        pctDoc1: 25,
        plazo1: 30,
        pctPago2: 30,
        plazo2: 60,
        pctDoc3: 30,
        plazo3: 90,
        pctAnticipo: 15,
        tasaAnual: 22.2,
        frecuencia: 12,
      },
      {
        etiqueta: 'b',
        tipo: 'credito-mueble',
        subtitulo: 'Obtenga el anticipo y los otros dos pagos (a 60 y 90 días).',
        valorDoc1: 4000,
        pctDoc1: 25,
        plazo1: 30,
        pctPago2: 30,
        plazo2: 60,
        pctDoc3: 30,
        plazo3: 90,
        pctAnticipo: 15,
        tasaAnual: 22.2,
        frecuencia: 12,
      },
      {
        etiqueta: 'c',
        tipo: 'credito-mueble',
        subtitulo: 'Obtenga el cargo total por intereses.',
        valorDoc1: 4000,
        pctDoc1: 25,
        plazo1: 30,
        pctPago2: 30,
        plazo2: 60,
        pctDoc3: 30,
        plazo3: 90,
        pctAnticipo: 15,
        tasaAnual: 22.2,
        frecuencia: 12,
      },
    ],
  },
];

function camposDe(o) {
  if (o.tipo === 'monto-capital') {
    return [
      { k: 'capital', sim: 'C', nota: 'capital inicial invertido ($)' },
      { k: 'tasaAnual', sim: 'r (%)', nota: 'tasa nominal anual (%)' },
      { k: 'anios', sim: 't', nota: 'tiempo de la inversión (años)' },
      { k: 'frecuencia', sim: 'p', nota: 'capitalizaciones por año (2 = semestral)' },
    ];
  }
  return [
    { k: 'valorDoc1', sim: 'M<sub>1</sub>', nota: 'valor nominal documento 1 ($)' },
    { k: 'pctDoc1', sim: '%<sub>1</sub>', nota: 'porcentaje documento 1 (%)' },
    { k: 'plazo1', sim: 'd<sub>1</sub>', nota: 'vencimiento doc. 1 (días)' },
    { k: 'pctPago2', sim: '%<sub>2</sub>', nota: 'porcentaje pago 2 (%)' },
    { k: 'plazo2', sim: 'd<sub>2</sub>', nota: 'plazo pago 2 (días)' },
    { k: 'pctDoc3', sim: '%<sub>3</sub>', nota: 'porcentaje documento 3 (%)' },
    { k: 'plazo3', sim: 'd<sub>3</sub>', nota: 'vencimiento doc. 3 (días)' },
    { k: 'pctAnticipo', sim: '%<sub>ant</sub>', nota: 'porcentaje de anticipo (%)' },
    { k: 'tasaAnual', sim: 'r (%)', nota: 'tasa nominal anual (%)' },
    { k: 'frecuencia', sim: 'p', nota: 'capitalizaciones por año (12 = mensual)' },
  ];
}

export const valoresIniciales = o => Object.fromEntries(camposDe(o).map(c => [c.k, o[c.k]]));

/* =========================================================
   RESOLUTORES
   ========================================================= */
function resolverMontoCapital(o, v) {
  const { capital: C, tasaAnual, anios: t, frecuencia: p } = v;
  if (C <= 0) return { error: 'El capital inicial C debe ser mayor que 0.' };
  if (p <= 0) return { error: 'La frecuencia de capitalización p debe ser mayor que 0.' };
  if (t <= 0) return { error: 'El tiempo t debe ser mayor que 0.' };
  if (tasaAnual <= -100) return { error: 'La tasa anual debe ser mayor que −100%.' };

  const r = limpiar(tasaAnual / 100);
  const i = limpiar(r / p);
  const N = limpiar(t * p);
  const factor = Math.pow(1 + i, N);
  const M = montoCompuesto(C, i, N);
  const interes = M - C;

  if (!Number.isFinite(M)) {
    return { error: 'El monto calculado excede el rango numérico representable.' };
  }

  return {
    incognitas: [
      { sim: 'i', nota: 'tasa efectiva por periodo' },
      { sim: 'N', nota: 'número total de periodos' },
      { sim: 'M', nota: 'monto acumulado final' },
    ],
    pasos: [
      {
        titulo: 'Fórmula del monto compuesto',
        lineas: ['M = C · (1 + i)<sup>N</sup>'],
      },
      {
        titulo: 'Calcular tasa efectiva por periodo (i) y total de periodos (N)',
        explicacion: `Con tasa nominal r = ${fmt(tasaAnual)}% (${fmt(r)}) y p = ${fmt(p)} capitalizaciones al año:`,
        lineas: [
          `i = r / p = ${fmt(r)} / ${fmt(p)} = ${fmt(i)} (${fmt(i * 100)}% por periodo)`,
          `N = t · p = ${fmt(t)} · ${fmt(p)} = ${fmt(N)} periodos`,
        ],
      },
      {
        titulo: 'Sustituir en la fórmula y calcular el monto (M)',
        lineas: [
          `M = ${fmt(C)} · (1 + ${fmt(i)})<sup>${fmt(N)}</sup>`,
          `M = ${fmt(C)} · (${fmt(1 + i)})<sup>${fmt(N)}</sup>`,
          `M = ${fmt(C)} · ${fmt(factor)}`,
          `M = ${fmtDinero(M)}`,
        ],
      },
      {
        titulo: 'Comprobación (despejando el capital inicial C)',
        lineas: [
          `C = M / (1 + i)<sup>N</sup> = ${fmtDinero(M)} / ${fmt(factor)} = ${fmtDinero(valorPresente(M, i, N))}${chk(valorPresente(M, i, N), C)}`,
        ],
      },
    ],
    resultado: {
      principal: `M = ${fmtDinero(M)}`,
      texto: `Al cabo de ${fmt(t)} años se acumula un monto total de ${fmtDinero(M)}.`,
      interpretacion: `El capital inicial de ${fmtDinero(C)} generó ${fmtDinero(interes)} de intereses compuestos en ${fmt(N)} periodos a una tasa efectiva de ${fmt(i * 100)}% por periodo.`,
    },
  };
}

function resolverCreditoMueble(o, v) {
  const {
    valorDoc1: M1,
    pctDoc1,
    plazo1,
    pctPago2,
    plazo2,
    pctDoc3,
    plazo3,
    pctAnticipo,
    tasaAnual,
    frecuencia: p,
  } = v;

  if (M1 <= 0) return { error: 'El valor nominal del documento 1 (M₁) debe ser mayor que 0.' };
  if (pctDoc1 <= 0 || pctDoc1 >= 100) return { error: 'El porcentaje del documento 1 debe estar entre 0% y 100%.' };
  if (pctPago2 < 0 || pctDoc3 < 0 || pctAnticipo < 0) return { error: 'Los porcentajes no pueden ser negativos.' };
  const sumaPct = limpiar(pctAnticipo + pctDoc1 + pctPago2 + pctDoc3);
  if (!cerca(sumaPct, 100)) {
    return { error: `La suma de porcentajes es ${fmt(sumaPct)}% y debe ser exactamente 100% (${fmt(pctAnticipo)}% + ${fmt(pctDoc1)}% + ${fmt(pctPago2)}% + ${fmt(pctDoc3)}%).` };
  }
  if (p <= 0) return { error: 'La frecuencia de capitalización p debe ser mayor que 0.' };
  if (plazo1 < 0 || plazo2 < 0 || plazo3 < 0) return { error: 'Los plazos en días no pueden ser negativos.' };

  const diasPeriodo = 360 / p;
  const r = limpiar(tasaAnual / 100);
  const i = limpiar(r / p);

  const n1 = limpiar(plazo1 / diasPeriodo);
  const n2 = limpiar(plazo2 / diasPeriodo);
  const n3 = limpiar(plazo3 / diasPeriodo);

  const C1 = valorPresente(M1, i, n1);
  const precio = C1 / (pctDoc1 / 100);

  const anticipo = precio * (pctAnticipo / 100);
  const C2 = precio * (pctPago2 / 100);
  const C3 = precio * (pctDoc3 / 100);

  const M2 = montoCompuesto(C2, i, n2);
  const M3 = montoCompuesto(C3, i, n3);

  const totalPagado = anticipo + M1 + M2 + M3;
  const interesesTotales = totalPagado - precio;

  const pasoBasePrecio = [
    {
      titulo: 'Tasa efectiva por periodo y tiempo del primer documento',
      explicacion: `Con tasa anual de ${fmt(tasaAnual)}% compuesta ${fmt(p)} veces al año (periodos de ${fmt(diasPeriodo)} días):`,
      lineas: [
        `i = ${fmt(r)} / ${fmt(p)} = ${fmt(i)} (${fmt(i * 100)}% por periodo)`,
        `n<sub>1</sub> = ${fmt(plazo1)} / ${fmt(diasPeriodo)} = ${fmt(n1)} ${n1 === 1 ? 'periodo' : 'periodos'}`,
      ],
    },
    {
      titulo: 'Valor presente del Documento 1 y Precio de contado del mueble',
      explicacion: `El documento 1 (M₁ = ${fmtDinero(M1)}) equivale al ${fmt(pctDoc1)}% del precio de contado:`,
      lineas: [
        `C<sub>1</sub> = M<sub>1</sub> / (1 + i)<sup>n₁</sup> = ${fmt(M1)} / (1 + ${fmt(i)})<sup>${fmt(n1)}</sup> = ${fmtDinero(C1)}`,
        `Precio de contado = C<sub>1</sub> / ${fmt(pctDoc1 / 100)} = ${fmt(C1)} / ${fmt(pctDoc1 / 100)} = ${fmtDinero(precio)}`,
      ],
    },
  ];

  if (o.etiqueta === 'a') {
    return {
      incognitas: [
        { sim: 'C<sub>1</sub>', nota: 'valor presente del primer documento' },
        { sim: 'Precio', nota: 'precio de contado del mueble (100%)' },
      ],
      pasos: [
        ...pasoBasePrecio,
        {
          titulo: 'Comprobación',
          lineas: [
            `25% del precio: ${fmt(pctDoc1 / 100)} · ${fmtDinero(precio)} = ${fmtDinero(precio * (pctDoc1 / 100))}${chk(precio * (pctDoc1 / 100), C1)}`,
          ],
        },
      ],
      resultado: {
        principal: `Precio = ${fmtDinero(precio)}`,
        texto: `El precio de contado del mueble de sala es ${fmtDinero(precio)}.`,
        interpretacion: `Descontando un periodo de interés al documento de ${fmtDinero(M1)} se obtiene su valor presente de ${fmtDinero(C1)}, que representa el ${fmt(pctDoc1)}% del valor total.`,
      },
    };
  }

  if (o.etiqueta === 'b') {
    return {
      incognitas: [
        { sim: 'Anticipo', nota: `${fmt(pctAnticipo)}% de contado` },
        { sim: 'M<sub>2</sub>', nota: `pago a ${fmt(plazo2)} días (${fmt(pctPago2)}%)` },
        { sim: 'M<sub>3</sub>', nota: `documento a ${fmt(plazo3)} días (${fmt(pctDoc3)}%)` },
      ],
      pasos: [
        ...pasoBasePrecio,
        {
          titulo: `Calcular el anticipo (${fmt(pctAnticipo)}% del precio)`,
          lineas: [
            `Anticipo = ${fmt(pctAnticipo / 100)} · ${fmtDinero(precio)} = ${fmtDinero(anticipo)}`,
          ],
        },
        {
          titulo: `Calcular el pago a ${fmt(plazo2)} días (n₂ = ${fmt(n2)} periodos)`,
          explicacion: `Capital financiado C₂ = ${fmt(pctPago2)}% de ${fmtDinero(precio)} = ${fmtDinero(C2)}:`,
          lineas: [
            `M<sub>2</sub> = C<sub>2</sub> · (1 + i)<sup>n₂</sup> = ${fmt(C2)} · (${fmt(1 + i)})<sup>${fmt(n2)}</sup> = ${fmtDinero(M2)}`,
          ],
        },
        {
          titulo: `Calcular el documento a ${fmt(plazo3)} días (n₃ = ${fmt(n3)} periodos)`,
          explicacion: `Capital financiado C₃ = ${fmt(pctDoc3)}% de ${fmtDinero(precio)} = ${fmtDinero(C3)}:`,
          lineas: [
            `M<sub>3</sub> = C<sub>3</sub> · (1 + i)<sup>n₃</sup> = ${fmt(C3)} · (${fmt(1 + i)})<sup>${fmt(n3)}</sup> = ${fmtDinero(M3)}`,
          ],
        },
      ],
      resultado: {
        principal: `Anticipo: ${fmtDinero(anticipo)}  ·  Pago 60d: ${fmtDinero(M2)}  ·  Doc. 90d: ${fmtDinero(M3)}`,
        texto: `El anticipo es de ${fmtDinero(anticipo)}, el pago a ${fmt(plazo2)} días es de ${fmtDinero(M2)} y el documento a ${fmt(plazo3)} días es de ${fmtDinero(M3)}.`,
        interpretacion: `Cada pago futuro incorpora el interés compuesto correspondiente a los periodos transcurridos desde la fecha de compra.`,
      },
    };
  }

  return {
    incognitas: [
      { sim: 'Total', nota: 'suma de los 4 desembolsos realizados' },
      { sim: 'I', nota: 'cargo total por intereses' },
    ],
    pasos: [
      ...pasoBasePrecio,
      {
        titulo: 'Determinar los cuatro desembolsos del cliente',
        lineas: [
          `Anticipo (${fmt(pctAnticipo)}%): ${fmtDinero(anticipo)}`,
          `Documento 1 a ${fmt(plazo1)} días (${fmt(pctDoc1)}%): ${fmtDinero(M1)}`,
          `Pago 2 a ${fmt(plazo2)} días (${fmt(pctPago2)}%): ${fmt(C2)} · (${fmt(1 + i)})<sup>${fmt(n2)}</sup> = ${fmtDinero(M2)}`,
          `Documento 3 a ${fmt(plazo3)} días (${fmt(pctDoc3)}%): ${fmt(C3)} · (${fmt(1 + i)})<sup>${fmt(n3)}</sup> = ${fmtDinero(M3)}`,
        ],
      },
      {
        titulo: 'Sumar el total pagado y restar el precio de contado',
        lineas: [
          `Total pagado = ${fmtDinero(anticipo)} + ${fmtDinero(M1)} + ${fmtDinero(M2)} + ${fmtDinero(M3)} = ${fmtDinero(totalPagado)}`,
          `Intereses (I) = Total pagado − Precio de contado`,
          `I = ${fmtDinero(totalPagado)} − ${fmtDinero(precio)} = ${fmtDinero(interesesTotales)}`,
        ],
      },
      {
        titulo: 'Comprobación (suma de intereses individuales por documento)',
        lineas: [
          `I = (M<sub>1</sub> − C<sub>1</sub>) + (M<sub>2</sub> − C<sub>2</sub>) + (M<sub>3</sub> − C<sub>3</sub>) = ${fmtDinero(M1 - C1)} + ${fmtDinero(M2 - C2)} + ${fmtDinero(M3 - C3)} = ${fmtDinero((M1 - C1) + (M2 - C2) + (M3 - C3))}${chk((M1 - C1) + (M2 - C2) + (M3 - C3), interesesTotales)}`,
        ],
      },
    ],
    resultado: {
      principal: `Intereses totales = ${fmtDinero(interesesTotales)}`,
      texto: `El cargo total por concepto de intereses es de ${fmtDinero(interesesTotales)}.`,
      interpretacion: `El cliente desembolsa un total de ${fmtDinero(totalPagado)} por un mueble cuyo valor de contado es ${fmtDinero(precio)}.`,
    },
  };
}

const RESOLUTORES = {
  'monto-capital': resolverMontoCapital,
  'credito-mueble': resolverCreditoMueble,
};

export function resolver(orig, v = valoresIniciales(orig)) {
  if (Object.values(v).some(x => !Number.isFinite(x))) {
    return { error: 'Hay campos vacíos o con valores no válidos. Completa todos los datos para continuar.' };
  }
  return RESOLUTORES[orig.tipo](orig, v);
}

/* =========================================================
   VISTA INTERACTIVA (#view-interes-compuesto)
   ========================================================= */
const $q = s => document.querySelector(s);
let estadoIC = { sec: null, inciso: 0 };
const seccionActual = () => SECCIONES.find(s => String(s.id) === estadoIC.sec);
const problemaActual = () => seccionActual().problemas[estadoIC.inciso];

function pintarSelectores() {
  $q('#ic-ejercicios').innerHTML = SECCIONES.map(s => `
    <button type="button" class="btn-primary ${String(s.id) === estadoIC.sec ? 'active' : ''}" data-ic-sec="${s.id}">${s.corto}</button>`).join('');
  const sec = seccionActual();
  const tabs = $q('#ic-incisos');
  tabs.hidden = !sec || sec.problemas.length < 2;
  tabs.innerHTML = tabs.hidden ? '' : sec.problemas.map((p, i) => `
    <button type="button" class="btn-tab ${i === estadoIC.inciso ? 'active' : ''}" data-ic-inciso="${i}">Inciso ${p.etiqueta})</button>`).join('');
}

function leerValores() {
  const v = {};
  document.querySelectorAll('#ic-b2 [data-campo]').forEach(inp => {
    v[inp.dataset.campo] = inp.value.trim() === '' ? NaN : Number(inp.value);
  });
  return v;
}

export function recalcularInteresCompuesto() {
  const v = leerValores();
  document.querySelectorAll('#ic-b2 [data-campo]').forEach(inp => {
    const x = v[inp.dataset.campo];
    inp.classList.toggle('invalido', !Number.isFinite(x));
  });

  const r = resolver(problemaActual(), v);
  const aviso = $q('#ic-aviso');
  if (r.error) {
    aviso.hidden = false;
    aviso.innerHTML = `<span class="aviso-icono">⚠</span><span>${r.error}</span>`;
    $q('#ic-incognitas').innerHTML = '';
    $q('#ic-b3').innerHTML = '<p class="muted">Corrige los datos para ver el procedimiento.</p>';
    $q('#ic-b4').innerHTML = '<p class="muted">Sin resultado: revisa el aviso del Bloque 2.</p>';
    return;
  }
  aviso.hidden = true;

  $q('#ic-incognitas').innerHTML = r.incognitas.map(d => `
    <li class="incognita">
      <span class="data-var">${d.sim}</span><span class="data-val">= ?</span>
      <span class="data-nota">${d.nota}</span>
    </li>`).join('');

  $q('#ic-b3').innerHTML = `<ol class="pasos">${r.pasos.map(s => `
    <li class="paso">
      <p class="paso-titulo">${s.titulo}</p>
      ${s.explicacion ? `<p class="paso-expl">${s.explicacion}</p>` : ''}
      ${s.lineas.map(l => `<div class="formula">${l}</div>`).join('')}
    </li>`).join('')}</ol>`;

  $q('#ic-b4').innerHTML = `
    <div class="answer">
      <p class="answer-valor">${r.resultado.principal}</p>
      <p>${r.resultado.texto}</p>
      <p class="muted">${r.resultado.interpretacion}</p>
    </div>`;
}

function restaurarOriginales() {
  const vals = valoresIniciales(problemaActual());
  document.querySelectorAll('#ic-b2 [data-campo]').forEach(inp => (inp.value = String(vals[inp.dataset.campo])));
  recalcularInteresCompuesto();
}

export function mostrarInteresCompuesto(secId, incisoIdx = 0) {
  estadoIC = { sec: String(secId), inciso: incisoIdx };
  const sec = seccionActual();
  const p = sec.problemas[incisoIdx];

  pintarSelectores();
  $q('#ic-vacio').hidden = true;
  $q('#ic-contenido').hidden = false;
  $q('#ic-titulo').textContent = `${sec.titulo}: ${sec.tema}${p.etiqueta ? ` · Inciso ${p.etiqueta})` : ''}`;

  $q('#ic-b1').innerHTML = `<p class="enunciado">${sec.enunciado}</p>` +
    (p.etiqueta ? `<p class="inciso"><b>Inciso ${p.etiqueta})</b> ${p.subtitulo}</p>` : '');

  const vals = valoresIniciales(p);
  $q('#ic-b2').innerHTML = `
    <div class="campos-grid">${camposDe(p).map(c => `
      <label class="campo">
        <span class="campo-sim">${c.sim}</span>
        <input type="number" step="any" class="input-num" data-campo="${c.k}" value="${vals[c.k]}">
        <span class="campo-nota">${c.nota}</span>
      </label>`).join('')}
    </div>
    <div class="acciones">
      <button type="button" class="btn-recalcular" data-ic-accion="recalcular">Recalcular</button>
      <button type="button" class="btn-secundario" data-ic-accion="restaurar">Restaurar datos originales</button>
    </div>
    <div class="aviso" id="ic-aviso" role="alert" hidden></div>
    <p class="bloque-subtitulo">Incógnitas a obtener</p>
    <ul class="data-list" id="ic-incognitas"></ul>`;

  recalcularInteresCompuesto();
}

export function iniciarInteresCompuesto() {
  const vista = $q('#view-interes-compuesto');
  if (!vista) return;
  if (!vista.querySelector('#ic-ejercicios')) {
    vista.innerHTML = `
      <header class="page-head">
        <span class="chip">Tema 4</span>
        <h1>Interés compuesto</h1>
      </header>
      <div class="btn-group" id="ic-ejercicios"></div>
      <div class="tabs" id="ic-incisos" hidden></div>
      <p class="muted" id="ic-vacio">Elige un ejercicio para ver el problema resuelto.</p>
      <div id="ic-contenido" hidden>
        <article class="card prob-card">
          <h2 class="prob-titulo" id="ic-titulo"></h2>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">1</span>Instrucción del problema</h3><div id="ic-b1"></div></section>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">2</span>Desglose de datos identificados</h3><div id="ic-b2"></div></section>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">3</span>Procedimiento paso a paso</h3><div id="ic-b3"></div></section>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">4</span>Resultado final</h3><div id="ic-b4"></div></section>
        </article>
      </div>`;

    vista.addEventListener('click', e => {
      const sec = e.target.closest('[data-ic-sec]');
      const inc = e.target.closest('[data-ic-inciso]');
      const acc = e.target.closest('[data-ic-accion]');
      if (sec) mostrarInteresCompuesto(sec.dataset.icSec, 0);
      else if (inc) mostrarInteresCompuesto(estadoIC.sec, Number(inc.dataset.icInciso));
      else if (acc) acc.dataset.icAccion === 'restaurar' ? restaurarOriginales() : recalcularInteresCompuesto();
    });
    vista.addEventListener('input', e => {
      if (e.target.matches('[data-campo]')) recalcularInteresCompuesto();
    });
    vista.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.matches('[data-campo]')) {
        e.preventDefault();
        recalcularInteresCompuesto();
      }
    });
  }
  pintarSelectores();
}