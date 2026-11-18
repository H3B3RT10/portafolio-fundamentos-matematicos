/* =========================================================
   TEMA 6: TASAS EQUIVALENTES (datos editables en tiempo real)
   Guarda este archivo como src/tasasEquivalentes.js
   ========================================================= */

const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 });
const nfPct4 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
const nfPct2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nfMoneda = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  return nf.format(n).replace('-', '−');
}

export function fmtPct(n) {
  if (!Number.isFinite(n)) return '—';
  const s = n < 0 ? '−' : '';
  const a = Math.abs(n);
  return `${s}${nfPct4.format(a)}% (≈ ${s}${nfPct2.format(a)}%)`;
}

export function fmtDinero(n) {
  if (!Number.isFinite(n)) return '—';
  const s = n < 0 ? '−' : '';
  return `${s}$${nfMoneda.format(Math.abs(n))}`;
}

const limpiar = x => Number(x.toPrecision(15));
const cerca = (a, b) => Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));
const chk = (a, b) => (cerca(a, b) ? ' ✓' : '');

/* =========================================================
   LÓGICA MATEMÁTICA (métodos de clase)
   ========================================================= */
// Tasa efectiva anual: e = (1 + i / p)^p - 1
export const tasaEfectiva = (iDec, p) => Math.pow(1 + iDec / p, p) - 1;

// Tasa nominal a partir de efectiva: i = p * [ (1 + e)^(1 / p) - 1 ]
export const tasaNominalDesdeEfectiva = (eDec, p) => p * (Math.pow(1 + eDec, 1 / p) - 1);

// Método de igualación: i_eq = p_dest * [ (1 + i_orig / p_orig)^(p_orig / p_dest) - 1 ]
export const tasaIgualada = (iOrigDec, pOrig, pDest) =>
  pDest * (Math.pow(1 + iOrigDec / pOrig, pOrig / pDest) - 1);

/* =========================================================
   DATOS ORIGINALES DEL PORTAFOLIO
   ========================================================= */
export const SECCIONES = [
  {
    id: 1,
    corto: 'Ejercicio 1',
    titulo: 'Ejercicio 1',
    tema: 'Tasa efectiva equivalente a tasa nominal',
    enunciado: '¿Cuál es la tasa efectiva equivalente al 11.8% anual compuesto por trimestres?',
    problemas: [
      {
        tipo: 'efectiva-desde-nominal',
        tasaNominal: 11.8,
        frecuencia: 4,
      },
    ],
  },
  {
    id: 2,
    corto: 'Ejercicio 2',
    titulo: 'Ejercicio 2',
    tema: 'Tasa más productiva para una institución bancaria',
    enunciado: '¿Qué conviene más a los propósitos de una institución bancaria: prestar su dinero con intereses del 12.48% anual compuesto por semanas, o prestarlo con el 12.85% capitalizable por semestres?',
    problemas: [
      {
        tipo: 'comparar-tasas-banco',
        tasa1: 12.48,
        freq1: 52,
        tasa2: 12.85,
        freq2: 2,
      },
    ],
  },
];

function camposDe(o) {
  if (o.tipo === 'efectiva-desde-nominal') {
    return [
      { k: 'tasaNominal', sim: 'i (%)', nota: 'tasa nominal anual (%)' },
      { k: 'frecuencia', sim: 'p', nota: 'capitalizaciones por año (4 = trimestral)' },
    ];
  }
  return [
    { k: 'tasa1', sim: 'i<sub>1</sub> (%)', nota: 'Opción A · tasa nominal anual (%)' },
    { k: 'freq1', sim: 'p<sub>1</sub>', nota: 'Opción A · capitalizaciones/año (52 = semanal)' },
    { k: 'tasa2', sim: 'i<sub>2</sub> (%)', nota: 'Opción B · tasa nominal anual (%)' },
    { k: 'freq2', sim: 'p<sub>2</sub>', nota: 'Opción B · capitalizaciones/año (2 = semestral)' },
  ];
}

export const valoresIniciales = o => Object.fromEntries(camposDe(o).map(c => [c.k, o[c.k]]));

/* =========================================================
   RESOLUTORES
   ========================================================= */
function resolverEfectivaDesdeNominal(o, v) {
  const { tasaNominal, frecuencia: p } = v;
  if (p <= 0) return { error: 'La frecuencia de capitalización p debe ser mayor que 0.' };

  const iDec = limpiar(tasaNominal / 100);
  const tasaPeriodo = limpiar(iDec / p);
  if (1 + tasaPeriodo <= 0) return { error: 'El factor (1 + i / p) debe ser mayor que 0.' };

  const factor = Math.pow(1 + tasaPeriodo, p);
  const eDec = limpiar(tasaEfectiva(iDec, p));
  const ePct = limpiar(eDec * 100);

  if (!Number.isFinite(eDec)) {
    return { error: 'El resultado excede el rango numérico representable.' };
  }

  const iComprobada = limpiar(tasaNominalDesdeEfectiva(eDec, p) * 100);

  return {
    incognitas: [
      { sim: 'i / p', nota: 'tasa efectiva por periodo' },
      { sim: 'e', nota: 'tasa efectiva anual equivalente' },
    ],
    pasos: [
      {
        titulo: 'Fórmula de la tasa efectiva anual',
        lineas: ['e = (1 + i / p)<sup>p</sup> − 1'],
      },
      {
        titulo: 'Convertir la tasa nominal y calcular la tasa por periodo (i / p)',
        explicacion: `Con tasa nominal i = ${fmt(tasaNominal)}% (${fmt(iDec)}) y p = ${fmt(p)} capitalizaciones por año:`,
        lineas: [
          `i / p = ${fmt(iDec)} / ${fmt(p)} = ${fmt(tasaPeriodo)} (${fmt(tasaPeriodo * 100)}% por periodo)`,
        ],
      },
      {
        titulo: 'Sustituir en la fórmula y calcular la tasa efectiva (e)',
        lineas: [
          `e = (1 + ${fmt(tasaPeriodo)})<sup>${fmt(p)}</sup> − 1`,
          `e = (${fmt(1 + tasaPeriodo)})<sup>${fmt(p)}</sup> − 1 = ${fmt(factor)} − 1 = ${fmt(eDec)}`,
          `e = ${fmtPct(ePct)} anual`,
        ],
      },
      {
        titulo: 'Comprobación (fórmula de tasa nominal de clase)',
        lineas: [
          `i = p · [ (1 + e)<sup>1/p</sup> − 1 ] = ${fmt(p)} · [ (1 + ${fmt(eDec)})<sup>1/${fmt(p)}</sup> − 1 ] = ${fmt(iComprobada)}%${chk(iComprobada, tasaNominal)}`,
        ],
      },
    ],
    resultado: {
      principal: `e = ${fmtPct(ePct)} anual`,
      texto: `La tasa efectiva anual equivalente al ${fmt(tasaNominal)}% nominal compuesto ${fmt(p)} veces al año es ${fmtPct(ePct)}.`,
      interpretacion: `Una tasa del ${fmt(tasaNominal)}% capitalizable ${fmt(p)} veces por año produce exactamente el mismo rendimiento anual que una tasa efectiva del ${nfPct4.format(ePct)}%.`,
    },
  };
}

function resolverCompararTasasBanco(o, v) {
  const { tasa1, freq1: p1, tasa2, freq2: p2 } = v;
  if (p1 <= 0 || p2 <= 0) {
    return { error: 'Las frecuencias de capitalización p₁ y p₂ deben ser mayores que 0.' };
  }

  const i1Dec = limpiar(tasa1 / 100);
  const i2Dec = limpiar(tasa2 / 100);
  const tp1 = limpiar(i1Dec / p1);
  const tp2 = limpiar(i2Dec / p2);

  if (1 + tp1 <= 0 || 1 + tp2 <= 0) {
    return { error: 'El factor (1 + i / p) debe ser mayor que 0 en ambas opciones.' };
  }

  const e1Dec = limpiar(tasaEfectiva(i1Dec, p1));
  const e2Dec = limpiar(tasaEfectiva(i2Dec, p2));
  if (!Number.isFinite(e1Dec) || !Number.isFinite(e2Dec)) {
    return { error: 'El resultado excede el rango numérico representable.' };
  }

  const e1Pct = limpiar(e1Dec * 100);
  const e2Pct = limpiar(e2Dec * 100);
  const diffPp = Math.abs(e1Pct - e2Pct);
  const extra100k = Math.abs(e1Dec - e2Dec) * 100000;

  // Método de igualación: llevar Opción A a la capitalización p2 de la Opción B
  const iEqDec = limpiar(tasaIgualada(i1Dec, p1, p2));
  const iEqPct = limpiar(iEqDec * 100);

  const iguales = cerca(e1Pct, e2Pct);
  const ganaA = !iguales && e1Pct > e2Pct;

  let principal = '';
  let texto = '';
  let interpretacion = '';

  if (iguales) {
    principal = `Ambas opciones son equivalentes (e = ${nfPct4.format(e1Pct)}% anual)`;
    texto = `Tanto la Opción A (${fmt(tasa1)}%, p₁ = ${fmt(p1)}) como la Opción B (${fmt(tasa2)}%, p₂ = ${fmt(p2)}) generan la misma tasa efectiva anual de ${nfPct4.format(e1Pct)}%.`;
    interpretacion = 'Para la institución bancaria es indiferente elegir cualquiera de las dos tasas, ya que ambas producen exactamente el mismo rendimiento anual.';
  } else if (ganaA) {
    principal = `Conviene Opción A: ${fmt(tasa1)}% con p₁ = ${fmt(p1)} (e₁ = ${nfPct4.format(e1Pct)}%)`;
    texto = `A la institución bancaria le conviene prestar su dinero al ${fmt(tasa1)}% anual (p₁ = ${fmt(p1)}), ya que ofrece una tasa efectiva de ${nfPct4.format(e1Pct)}% frente al ${nfPct4.format(e2Pct)}% de la Opción B.`;
    interpretacion = `Al tratarse de un préstamo bancario (el banco cobra intereses), conviene la tasa efectiva mayor: supera a la Opción B por ${nfPct4.format(diffPp)} puntos porcentuales (${fmtDinero(extra100k)} extra al año por cada $100,000 prestados).`;
  } else {
    principal = `Conviene Opción B: ${fmt(tasa2)}% con p₂ = ${fmt(p2)} (e₂ = ${nfPct4.format(e2Pct)}%)`;
    texto = `A la institución bancaria le conviene prestar su dinero al ${fmt(tasa2)}% anual (p₂ = ${fmt(p2)}), ya que ofrece una tasa efectiva de ${nfPct4.format(e2Pct)}% frente al ${nfPct4.format(e1Pct)}% de la Opción A.`;
    interpretacion = `Al tratarse de un préstamo bancario (el banco cobra intereses), conviene la tasa efectiva mayor: supera a la Opción A por ${nfPct4.format(diffPp)} puntos porcentuales (${fmtDinero(extra100k)} extra al año por cada $100,000 prestados).`;
  }

  return {
    incognitas: [
      { sim: 'e<sub>1</sub>', nota: 'tasa efectiva anual · Opción A' },
      { sim: 'e<sub>2</sub>', nota: 'tasa efectiva anual · Opción B' },
      { sim: 'i<sub>eq</sub>', nota: 'tasa equivalente (igualación)' },
    ],
    pasos: [
      {
        titulo: `Calcular la tasa efectiva anual de la Opción A (p₁ = ${fmt(p1)})`,
        explicacion: `Con tasa nominal i₁ = ${fmt(tasa1)}% (${fmt(i1Dec)}):`,
        lineas: [
          `i<sub>1</sub> / p<sub>1</sub> = ${fmt(i1Dec)} / ${fmt(p1)} = ${fmt(tp1)}`,
          `e<sub>1</sub> = (1 + ${fmt(tp1)})<sup>${fmt(p1)}</sup> − 1 = ${fmt(1 + e1Dec)} − 1 = ${fmt(e1Dec)}`,
          `e<sub>1</sub> = ${fmtPct(e1Pct)} anual`,
        ],
      },
      {
        titulo: `Calcular la tasa efectiva anual de la Opción B (p₂ = ${fmt(p2)})`,
        explicacion: `Con tasa nominal i₂ = ${fmt(tasa2)}% (${fmt(i2Dec)}):`,
        lineas: [
          `i<sub>2</sub> / p<sub>2</sub> = ${fmt(i2Dec)} / ${fmt(p2)} = ${fmt(tp2)}`,
          `e<sub>2</sub> = (1 + ${fmt(tp2)})<sup>${fmt(p2)}</sup> − 1 = ${fmt(1 + e2Dec)} − 1 = ${fmt(e2Dec)}`,
          `e<sub>2</sub> = ${fmtPct(e2Pct)} anual`,
        ],
      },
      {
        titulo: 'Comparar ambas tasas efectivas anuales',
        lineas: [
          iguales
            ? `e<sub>1</sub> (${nfPct4.format(e1Pct)}%) = e<sub>2</sub> (${nfPct4.format(e2Pct)}%) → diferencia: 0.0000 pp`
            : ganaA
              ? `e<sub>1</sub> (${nfPct4.format(e1Pct)}%) > e<sub>2</sub> (${nfPct4.format(e2Pct)}%) → diferencia: +${nfPct4.format(diffPp)} puntos porcentuales`
              : `e<sub>2</sub> (${nfPct4.format(e2Pct)}%) > e<sub>1</sub> (${nfPct4.format(e1Pct)}%) → diferencia: +${nfPct4.format(diffPp)} puntos porcentuales`,
          `Impacto por cada $100,000 prestados a 1 año: ${fmtDinero(extra100k)} de intereses adicionales.`,
        ],
      },
      {
        titulo: `Comprobación por método de igualación (llevando Opción A a p₂ = ${fmt(p2)})`,
        explicacion: 'Se igualan los montos compuestos a 1 año para comparar ambas tasas bajo la misma frecuencia:',
        lineas: [
          `(1 + i<sub>eq</sub> / ${fmt(p2)})<sup>${fmt(p2)}</sup> = (1 + ${fmt(tp1)})<sup>${fmt(p1)}</sup>`,
          `i<sub>eq</sub> = ${fmt(p2)} · [ (1 + ${fmt(tp1)})<sup>${fmt(p1)}/${fmt(p2)}</sup> − 1 ] = ${nfPct4.format(iEqPct)}% vs ${nfPct4.format(tasa2)}%${chk(tasaEfectiva(iEqDec, p2), e1Dec)}`,
        ],
      },
    ],
    resultado: { principal, texto, interpretacion },
  };
}

const RESOLUTORES = {
  'efectiva-desde-nominal': resolverEfectivaDesdeNominal,
  'comparar-tasas-banco': resolverCompararTasasBanco,
};

export function resolver(orig, v = valoresIniciales(orig)) {
  if (Object.values(v).some(x => !Number.isFinite(x))) {
    return { error: 'Hay campos vacíos o con valores no válidos. Completa todos los datos para continuar.' };
  }
  return RESOLUTORES[orig.tipo](orig, v);
}

/* =========================================================
   VISTA INTERACTIVA (#view-tasas-equivalentes)
   ========================================================= */
const $q = s => document.querySelector(s);
let estadoTE = { sec: '1' };
const seccionActual = () => SECCIONES.find(s => String(s.id) === estadoTE.sec) || SECCIONES[0];
const problemaActual = () => seccionActual().problemas[0];

function pintarSelectores() {
  const cont = $q('#te-ejercicios');
  if (!cont) return;
  cont.innerHTML = SECCIONES.map(s => `
    <button type="button" class="btn-primary ${String(s.id) === estadoTE.sec ? 'active' : ''}" data-te-sec="${s.id}">${s.corto}</button>`).join('');
}

function leerValores() {
  const v = {};
  document.querySelectorAll('#te-b2 [data-campo]').forEach(inp => {
    v[inp.dataset.campo] = inp.value.trim() === '' ? NaN : Number(inp.value);
  });
  return v;
}

export function recalcularTasasEquivalentes() {
  const v = leerValores();
  document.querySelectorAll('#te-b2 [data-campo]').forEach(inp => {
    const x = v[inp.dataset.campo];
    inp.classList.toggle('invalido', !Number.isFinite(x));
  });

  const r = resolver(problemaActual(), v);
  const aviso = $q('#te-aviso');
  if (r.error) {
    aviso.hidden = false;
    aviso.innerHTML = `<span class="aviso-icono">⚠</span><span>${r.error}</span>`;
    $q('#te-incognitas').innerHTML = '';
    $q('#te-b3').innerHTML = '<p class="muted">Corrige los datos para ver el procedimiento.</p>';
    $q('#te-b4').innerHTML = '<p class="muted">Sin resultado: revisa el aviso del Bloque 2.</p>';
    return;
  }
  aviso.hidden = true;

  $q('#te-incognitas').innerHTML = r.incognitas.map(d => `
    <li class="incognita">
      <span class="data-var">${d.sim}</span><span class="data-val">= ?</span>
      <span class="data-nota">${d.nota}</span>
    </li>`).join('');

  $q('#te-b3').innerHTML = `<ol class="pasos">${r.pasos.map(s => `
    <li class="paso">
      <p class="paso-titulo">${s.titulo}</p>
      ${s.explicacion ? `<p class="paso-expl">${s.explicacion}</p>` : ''}
      ${s.lineas.map(l => `<div class="formula">${l}</div>`).join('')}
    </li>`).join('')}</ol>`;

  $q('#te-b4').innerHTML = `
    <div class="answer">
      <p class="answer-valor">${r.resultado.principal}</p>
      <p>${r.resultado.texto}</p>
      <p class="muted">${r.resultado.interpretacion}</p>
    </div>`;
}

function restaurarOriginales() {
  const vals = valoresIniciales(problemaActual());
  document.querySelectorAll('#te-b2 [data-campo]').forEach(inp => (inp.value = String(vals[inp.dataset.campo])));
  recalcularTasasEquivalentes();
}

export function mostrarTasasEquivalentes(secId) {
  estadoTE = { sec: String(secId) };
  const sec = seccionActual();
  const p = sec.problemas[0];

  pintarSelectores();
  $q('#te-titulo').textContent = `${sec.titulo}: ${sec.tema}`;
  $q('#te-b1').innerHTML = `<p class="enunciado">${sec.enunciado}</p>`;

  const vals = valoresIniciales(p);
  $q('#te-b2').innerHTML = `
    <div class="campos-grid">${camposDe(p).map(c => `
      <label class="campo">
        <span class="campo-sim">${c.sim}</span>
        <input type="number" step="any" class="input-num" data-campo="${c.k}" value="${vals[c.k]}">
        <span class="campo-nota">${c.nota}</span>
      </label>`).join('')}
    </div>
    <div class="acciones">
      <button type="button" class="btn-recalcular" data-te-accion="recalcular">Recalcular</button>
      <button type="button" class="btn-secundario" data-te-accion="restaurar">Restaurar datos originales</button>
    </div>
    <div class="aviso" id="te-aviso" role="alert" hidden></div>
    <p class="bloque-subtitulo">Incógnitas a obtener</p>
    <ul class="data-list" id="te-incognitas"></ul>`;

  recalcularTasasEquivalentes();
}

export function iniciarTasasEquivalentes() {
  const vista = $q('#view-tasas-equivalentes');
  if (!vista) return;
  if (!vista.querySelector('#te-ejercicios')) {
    vista.innerHTML = `
      <header class="page-head">
        <span class="chip">Tema 6</span>
        <h1>Tasas equivalentes</h1>
      </header>
      <div class="btn-group" id="te-ejercicios"></div>
      <article class="card prob-card">
        <h2 class="prob-titulo" id="te-titulo"></h2>
        <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">1</span>Instrucción del problema</h3><div id="te-b1"></div></section>
        <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">2</span>Desglose de datos identificados</h3><div id="te-b2"></div></section>
        <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">3</span>Procedimiento paso a paso</h3><div id="te-b3"></div></section>
        <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">4</span>Resultado final</h3><div id="te-b4"></div></section>
      </article>`;

    vista.addEventListener('click', e => {
      const sec = e.target.closest('[data-te-sec]');
      const acc = e.target.closest('[data-te-accion]');
      if (sec) mostrarTasasEquivalentes(sec.dataset.teSec);
      else if (acc) acc.dataset.teAccion === 'restaurar' ? restaurarOriginales() : recalcularTasasEquivalentes();
    });
    vista.addEventListener('input', e => {
      if (e.target.matches('[data-campo]')) recalcularTasasEquivalentes();
    });
    vista.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.matches('[data-campo]')) {
        e.preventDefault();
        recalcularTasasEquivalentes();
      }
    });
  }
  mostrarTasasEquivalentes('1');
}