/* =========================================================
   TEMA 5: INTERÉS SIMPLE (datos editables)
   Guarda este archivo como src/interesSimple.js
   ========================================================= */

/* ---------- Formato de números y dinero ---------- */
const nfD = d => new Intl.NumberFormat('en-US', { maximumFractionDigits: d });
const nf6 = nfD(6), nf4 = nfD(4);
const nf2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmt = n => (!Number.isFinite(n) ? '—' : Math.abs(n) < 5e-7 ? '0' : nf6.format(n).replace('-', '−'));
const f4 = n => (!Number.isFinite(n) ? '—' : Math.abs(n) < 5e-5 ? '0' : nf4.format(n).replace('-', '−'));
const f2 = n => (!Number.isFinite(n) ? '—' : nf2.format(n).replace('-', '−'));
export const din = n => (!Number.isFinite(n) ? '—' : n < 0 ? `−$${nf2.format(-n)}` : `$${nf2.format(n)}`);
const cerca = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const chk = (a, b) => (cerca(a, b) ? ' ✓' : '');
const ERR_RANGO = 'El resultado excede el rango numérico representable. Revisa los datos.';

/* Unidades de tiempo: pa = periodos por año (año comercial de 360 días) */
const UNID = {
  anual:      { pa: 1,   plur: 'años',       sing: 'año',       adj: 'anual' },
  semestral:  { pa: 2,   plur: 'semestres',  sing: 'semestre',  adj: 'semestral' },
  trimestral: { pa: 4,   plur: 'trimestres', sing: 'trimestre', adj: 'trimestral' },
  mensual:    { pa: 12,  plur: 'meses',      sing: 'mes',       adj: 'mensual' },
  diaria:     { pa: 360, plur: 'días',       sing: 'día',       adj: 'diaria' },
};
// Convierte una duración de la unidad "de" a la unidad "a" (3 meses -> 0.25 años; 2 años -> 8 trimestres)
const convertir = (valor, de, a) => (valor * UNID[a].pa) / UNID[de].pa;
// Convierte una tasa (%) de la unidad dada a tasa anual (mensual × 12, trimestral × 4, ...)
const tasaAAnual = (pct, u) => pct * UNID[u].pa;

/* =========================================================
   LÓGICA MATEMÁTICA (método de los apuntes de clase)
   ========================================================= */
// I = C · i · n
export const interes = (C, i, n) => C * i * n;
// M = C · (1 + i · n)
export const montoSimple = (C, i, n) => C * (1 + i * n);
// C = M / (1 + i · n)
export const capitalSimple = (M, i, n) => M / (1 + i * n);
// n = I / (C · i)
export const plazoSimple = (I, C, i) => I / (C * i);
// i = I / (C · n)
export const tasaSimple = (I, C, n) => I / (C * n);

/* =========================================================
   DATOS ORIGINALES DEL PORTAFOLIO (hardcodeados)
   unidadPlazo / unidadTasa: unidades fijas de cada registro
   calc: dato faltante que se calcula (además del interés I)
   <<< AQUÍ AGREGAS NUEVOS REGISTROS >>>
   ========================================================= */
export const ENUNCIADO = 'Obtener los datos faltantes y calcular el interés en los seis registros.';

export const REGISTROS = [
  { id: 1, tipo: 'monto-interes', calc: 'monto', titulo: 'Monto (M) e interés (I)',
    unidadPlazo: 'mensual', unidadTasa: 'anual',
    inciso: 'Obtener el monto (M) y el interés (I). Datos: C = $15,000, plazo = 3 meses, tasa = 9% anual.',
    capital: 15000, plazo: 3, tasa: 9 },
  { id: 2, tipo: 'capital-interes', calc: 'capital', titulo: 'Capital (C) e interés (I)',
    unidadPlazo: 'anual', unidadTasa: 'trimestral',
    inciso: 'Obtener el capital (C) y el interés (I). Datos: M = $1,000,000, plazo = 2 años, tasa = 11% trimestral.',
    monto: 1000000, plazo: 2, tasa: 11 },
  { id: 3, tipo: 'plazo-interes', calc: 'plazo', titulo: 'Plazo (n) e interés (I)',
    unidadPlazo: 'diaria', unidadTasa: 'diaria', equiv: { unidad: 'mensual', etiqueta: 'meses comerciales' },
    inciso: 'Obtener el plazo (n) y el interés (I). Datos: C = $23,800, M = $25,000, tasa = 0.12% diaria.',
    capital: 23800, monto: 25000, tasa: 0.12 },
  { id: 4, tipo: 'tasa-interes', calc: 'tasa', titulo: 'Tipo de interés (i) e interés (I)',
    unidadPlazo: 'mensual', unidadTasa: 'mensual',
    inciso: 'Obtener el tipo de interés (i) y el interés (I). Datos: C = $2,000, M = $3,200, plazo = 32 meses.',
    capital: 2000, monto: 3200, plazo: 32 },
  { id: 5, tipo: 'plazo-interes', calc: 'plazo', titulo: 'Plazo (n) e interés (I)',
    unidadPlazo: 'semestral', unidadTasa: 'semestral', equiv: { unidad: 'mensual', etiqueta: 'meses' },
    inciso: 'Obtener el plazo (n) y el interés (I). Datos: C = $5,200, M = $6,000, tasa = 6.5% semestral.',
    capital: 5200, monto: 6000, tasa: 6.5 },
  { id: 6, tipo: 'capital-interes', calc: 'capital', titulo: 'Capital (C) e interés (I)',
    unidadPlazo: 'mensual', unidadTasa: 'anual',
    inciso: 'Obtener el capital (C) y el interés (I). Datos: M = $5,000,000, plazo = 3 meses, tasa = 13.6% anual.',
    monto: 5000000, plazo: 3, tasa: 13.6 },
];

/* Campos editables de cada registro (solo los datos conocidos) */
function camposDe(o) {
  const todos = [
    { k: 'capital', sim: 'C', nota: 'capital ($)' },
    { k: 'monto', sim: 'M', nota: 'monto ($)' },
    { k: 'plazo', sim: 'n', nota: `plazo (${UNID[o.unidadPlazo].plur})` },
    { k: 'tasa', sim: 'i', nota: `tasa de interés ${UNID[o.unidadTasa].adj} (%)` },
  ];
  return todos.filter(c => c.k in o);
}
export const valoresIniciales = o => Object.fromEntries(camposDe(o).map(c => [c.k, o[c.k]]));

/* =========================================================
   VALIDACIONES
   ========================================================= */
function validar(o, v) {
  const { capital: C, monto: M, plazo: n, tasa: t } = v;
  if ('capital' in v && !(C > 0)) return 'El capital C debe ser mayor que 0.';
  if ('monto' in v && !(M > 0)) return 'El monto M debe ser mayor que 0.';
  if ('capital' in v && 'monto' in v && M < C) {
    return `El monto M (${din(M)}) no puede ser menor que el capital C (${din(C)}): el interés I = M − C saldría negativo.`;
  }
  if ('tasa' in v && !(t > 0)) {
    return o.tipo === 'plazo-interes'
      ? 'La tasa de interés i debe ser mayor que 0: con i = 0, n = I / (C · i) implicaría dividir entre cero.'
      : 'La tasa de interés i debe ser mayor que 0: sin tasa no hay interés.';
  }
  if ('plazo' in v && !(n > 0)) {
    return o.tipo === 'tasa-interes'
      ? 'El plazo n debe ser mayor que 0: con n = 0, i = I / (C · n) implicaría dividir entre cero.'
      : 'El plazo n debe ser mayor que 0: sin plazo no hay interés.';
  }
  return null;
}

/* =========================================================
   PASOS COMPARTIDOS
   ========================================================= */
/* Convierte la tasa a decimal y el plazo a la unidad de la tasa */
function pasoUnidades(o, v) {
  const uP = o.unidadPlazo, uT = o.unidadTasa;
  const i = v.tasa / 100;
  const n = convertir(v.plazo, uP, uT);
  const plT = UNID[uT].plur;
  let lineaN;
  if (uP === uT) {
    lineaN = `n = ${fmt(v.plazo)} ${plT}   (ya está en la unidad de la tasa)`;
  } else if (UNID[uT].pa < UNID[uP].pa) {
    lineaN = `n = ${fmt(v.plazo)} / ${fmt(UNID[uP].pa / UNID[uT].pa)} = ${f4(n)} ${plT}`;
  } else {
    lineaN = `n = ${fmt(v.plazo)} · ${fmt(UNID[uT].pa / UNID[uP].pa)} = ${f4(n)} ${plT}`;
  }
  const reglaClase = uT === 'anual' && uP === 'mensual' ? ' Regla de clase: con tasa anual y plazo en meses, n = meses / 12.' : '';
  return {
    i, n,
    paso: {
      titulo: `Convertir tasa y plazo a la misma unidad (${UNID[uT].adj})`,
      explicacion: `El plazo (${UNID[uP].plur}) se expresa en la unidad de la tasa (${plT}).${reglaClase}`,
      lineas: [`i = ${fmt(v.tasa)} / 100 = ${fmt(i)} ${UNID[uT].adj}`, lineaN],
    },
  };
}

const pasoInteresDiferencia = (C, M, I) => ({
  titulo: 'Interés', lineas: ['I = M − C', `I = ${fmt(M)} − ${fmt(C)}`, `I = ${din(I)}`],
});

/* =========================================================
   RESOLUTORES: devuelven { incognitas, pasos, resultado, resumen } o { error }
   resumen = { C, M, plazo, tasa, I } en las unidades del registro (alimenta la tabla)
   ========================================================= */

/* Registro 1: monto e interés */
function resolverMonto(o, v) {
  const { i, n, paso } = pasoUnidades(o, v);
  const C = v.capital, I = interes(C, i, n), M = C + I;
  if (![I, M].every(Number.isFinite)) return { error: ERR_RANGO };
  const factor = 1 + i * n;
  const uT = UNID[o.unidadTasa], uP = UNID[o.unidadPlazo];
  return {
    incognitas: [{ sim: 'I', nota: 'interés simple' }, { sim: 'M', nota: 'monto' }],
    pasos: [
      paso,
      { titulo: 'Interés simple', lineas: ['I = C · i · n', `I = ${fmt(C)} · ${fmt(i)} · ${f4(n)}`, `I = ${din(I)}`] },
      { titulo: 'Monto', lineas: ['M = C + I', `M = ${fmt(C)} + ${f2(I)}`, `M = ${din(M)}`] },
      { titulo: 'Comprobación', lineas: [
        `M = C · (1 + i · n) = ${fmt(C)} · (1 + ${fmt(i)} · ${f4(n)}) = ${fmt(C)} · ${fmt(factor)} = ${f2(C * factor)}${chk(C * factor, M)}`] },
    ],
    resultado: {
      principal: `M = ${din(M)}   ·   I = ${din(I)}`,
      texto: `El interés ganado es ${din(I)} y el monto acumulado es ${din(M)}.`,
      interpretacion: `Con una tasa de ${fmt(v.tasa)}% ${uT.adj} durante ${fmt(v.plazo)} ${uP.plur} (n = ${f4(n)} ${uT.plur}), el capital de ${din(C)} gana ${din(I)} de interés y se convierte en ${din(M)}.`,
    },
    resumen: { C, M, plazo: v.plazo, tasa: v.tasa, I },
  };
}

/* Registros 2 y 6: capital (valor presente) e interés */
function resolverCapital(o, v) {
  const { i, n, paso } = pasoUnidades(o, v);
  const M = v.monto, factor = 1 + i * n;
  if (!(factor > 0)) return { error: `El factor (1 + i · n) = ${fmt(factor)} debe ser positivo para calcular C = M / (1 + i · n).` };
  const C = capitalSimple(M, i, n), I = M - C;
  if (![C, I].every(Number.isFinite)) return { error: ERR_RANGO };
  const uT = UNID[o.unidadTasa], uP = UNID[o.unidadPlazo];
  return {
    incognitas: [{ sim: 'C', nota: 'capital (valor presente)' }, { sim: 'I', nota: 'interés simple' }],
    pasos: [
      paso,
      { titulo: 'Capital (valor presente)', lineas: [
        'C = M / (1 + i · n)',
        `C = ${fmt(M)} / (1 + ${fmt(i)} · ${f4(n)})`,
        `C = ${fmt(M)} / ${fmt(factor)}`,
        `C = ${din(C)}`] },
      pasoInteresDiferencia(C, M, I),
      { titulo: 'Comprobación', lineas: [
        `C · (1 + i · n) = ${f2(C)} · ${fmt(factor)} = ${f2(C * factor)}${chk(C * factor, M)}  (debe ser ${fmt(M)})`] },
    ],
    resultado: {
      principal: `C = ${din(C)}   ·   I = ${din(I)}`,
      texto: `El capital que hoy equivale a ${din(M)} es ${din(C)}, con un interés de ${din(I)}.`,
      interpretacion: `Para obtener ${din(M)} con una tasa de ${fmt(v.tasa)}% ${uT.adj} en ${fmt(v.plazo)} ${uP.plur} se necesita invertir ${din(C)}; la diferencia, ${din(I)}, es el interés.`,
    },
    resumen: { C, M, plazo: v.plazo, tasa: v.tasa, I },
  };
}

/* Registros 3 y 5: plazo e interés */
function resolverPlazo(o, v) {
  const C = v.capital, M = v.monto, I = M - C, i = v.tasa / 100;
  const n = plazoSimple(I, C, i);
  if (![I, n].every(Number.isFinite)) return { error: ERR_RANGO };
  const uT = UNID[o.unidadTasa], eq = o.equiv, uE = UNID[eq.unidad];
  const nEq = convertir(n, o.unidadPlazo, eq.unidad);
  const lineaEq = uE.pa < uT.pa
    ? `${f4(n)} / ${fmt(uT.pa / uE.pa)} = ${f4(nEq)} ${eq.etiqueta}`
    : `${f4(n)} · ${fmt(uE.pa / uT.pa)} = ${f4(nEq)} ${eq.etiqueta}`;
  return {
    incognitas: [{ sim: 'I', nota: 'interés simple' }, { sim: 'n', nota: `plazo (${uT.plur})` }],
    pasos: [
      pasoInteresDiferencia(C, M, I),
      { titulo: `Tasa en decimal (${uT.adj})`, lineas: [`i = ${fmt(v.tasa)} / 100`, `i = ${fmt(i)} ${uT.adj}`] },
      { titulo: 'Plazo', lineas: [
        'n = I / (C · i)',
        `n = ${fmt(I)} / (${fmt(C)} · ${fmt(i)})`,
        `n = ${fmt(I)} / ${fmt(C * i)}`,
        `n = ${f4(n)} ${uT.plur}`] },
      { titulo: `Equivalencia en ${eq.etiqueta}`, lineas: [lineaEq] },
      { titulo: 'Comprobación', lineas: [
        `I = C · i · n = ${fmt(C)} · ${fmt(i)} · ${f4(n)} = ${f2(C * i * n)}${chk(C * i * n, I)}  (debe ser ${f2(I)})`] },
    ],
    resultado: {
      principal: `n = ${f2(n)} ${uT.plur}   ·   I = ${din(I)}`,
      texto: `El plazo es de ${f2(n)} ${uT.plur} (${f4(n)}), equivalente a ${f2(nEq)} ${eq.etiqueta}.`,
      interpretacion: I === 0
        ? `Como M = C no hay interés: el plazo es 0 ${uT.plur}.`
        : `Para que ${din(C)} se conviertan en ${din(M)} (interés de ${din(I)}) con ${fmt(v.tasa)}% ${uT.adj} se necesitan ${f2(n)} ${uT.plur}, cerca de ${f2(nEq)} ${eq.etiqueta}.`,
    },
    resumen: { C, M, plazo: n, tasa: v.tasa, I },
  };
}

/* Registro 4: tasa de interés e interés */
function resolverTasa(o, v) {
  const C = v.capital, M = v.monto, n = v.plazo, I = M - C;
  const i = tasaSimple(I, C, n), pct = i * 100;
  if (![I, i].every(Number.isFinite)) return { error: ERR_RANGO };
  const uT = UNID[o.unidadTasa];
  const anual = tasaAAnual(pct, o.unidadTasa);
  const lineasAnual = o.unidadTasa === 'anual' ? [] : [{ titulo: 'Equivalencia anual (método de clase)', lineas: [
    `i<sub>anual</sub> = ${fmt(pct)}% · ${fmt(uT.pa)}`, `i<sub>anual</sub> = ${fmt(anual)}% anual`] }];
  return {
    incognitas: [{ sim: 'I', nota: 'interés simple' }, { sim: 'i', nota: `tasa de interés ${uT.adj}` }],
    pasos: [
      pasoInteresDiferencia(C, M, I),
      { titulo: `Tasa de interés ${uT.adj}`, lineas: [
        'i = I / (C · n)',
        `i = ${fmt(I)} / (${fmt(C)} · ${fmt(n)})`,
        `i = ${fmt(I)} / ${fmt(C * n)}`,
        `i = ${fmt(i)}   (${fmt(pct)}% ${uT.adj})`] },
      ...lineasAnual,
      { titulo: 'Comprobación', lineas: [
        `I = C · i · n = ${fmt(C)} · ${fmt(i)} · ${fmt(n)} = ${f2(C * i * n)}${chk(C * i * n, I)}  (debe ser ${f2(I)})`] },
    ],
    resultado: {
      principal: `i = ${fmt(pct)}% ${uT.adj}${o.unidadTasa === 'anual' ? '' : ` (${fmt(anual)}% anual)`}   ·   I = ${din(I)}`,
      texto: `El tipo de interés es ${fmt(pct)}% ${uT.adj}${o.unidadTasa === 'anual' ? '' : `, es decir, ${fmt(anual)}% anual`}.`,
      interpretacion: `Para convertir ${din(C)} en ${din(M)} en ${fmt(n)} ${UNID[o.unidadPlazo].plur} se gana ${din(I)} de interés, lo que equivale a ${fmt(pct)}% ${uT.adj} sobre el capital.`,
    },
    resumen: { C, M, plazo: n, tasa: pct, I },
  };
}

const RESOLUTORES = {
  'monto-interes': resolverMonto, 'capital-interes': resolverCapital,
  'plazo-interes': resolverPlazo, 'tasa-interes': resolverTasa,
};

/* Resuelve un registro con los valores dados (por defecto, los originales) */
export function resolver(orig, v = valoresIniciales(orig)) {
  if (Object.values(v).some(x => !Number.isFinite(x))) {
    return { error: 'Hay campos vacíos o con valores no válidos. Completa todos los datos para continuar.' };
  }
  const e = validar(orig, v);
  if (e) return { error: e };
  return RESOLUTORES[orig.tipo](orig, v);
}

/* =========================================================
   VISTA EDITABLE (todo se genera dentro de #view-interes-simple)
   ========================================================= */
const $q = s => document.querySelector(s);
let estadoIS = { reg: null };
const valores = {};                                   // ediciones por registro (persisten al cambiar de pestaña)
const registroPorId = id => REGISTROS.find(r => r.id === Number(id));
const registroActual = () => registroPorId(estadoIS.reg);
const valoresDe = reg => valores[reg.id] ?? valoresIniciales(reg);

const txtDin = x => (Number.isFinite(x) ? din(x) : '—');
const txtPlazo = (x, u) => (Number.isFinite(x) ? `${fmt(x)} ${UNID[u].plur}` : '—');
const txtTasa = (x, u) => (Number.isFinite(x) ? `${fmt(x)}% ${UNID[u].adj}` : '—');

/* Tabla resumen de los 6 registros (se redibuja en cada cambio; no contiene inputs) */
function pintarResumen() {
  const filas = REGISTROS.map(reg => {
    const v = valoresDe(reg);
    const r = resolver(reg, v);
    const s = r.error ? { C: v.capital, M: v.monto, plazo: v.plazo, tasa: v.tasa } : r.resumen;
    const res = k => (!r.error && reg.calc === k ? ' celda-res' : '');
    const aviso = r.error ? ` <span class="celda-aviso" title="${r.error.replace(/<[^>]+>/g, '')}">⚠</span>` : '';
    return `
      <tr class="fila-reg ${reg.id === Number(estadoIS.reg) ? 'activa' : ''}" data-is-reg="${reg.id}">
        <td class="data-cell">Registro ${reg.id}${aviso}</td>
        <td class="data-cell${res('capital')}">${txtDin(s.C)}</td>
        <td class="data-cell${res('monto')}">${txtDin(s.M)}</td>
        <td class="data-cell${res('plazo')}">${txtPlazo(s.plazo, reg.unidadPlazo)}</td>
        <td class="data-cell${res('tasa')}">${txtTasa(s.tasa, reg.unidadTasa)}</td>
        <td class="data-cell ${r.error ? '' : 'celda-res'}">${r.error ? '—' : din(s.I)}</td>
      </tr>`;
  }).join('');
  $q('#is-resumen').innerHTML = `
    <table class="data-table">
      <thead><tr><th>Registro</th><th>Capital (C)</th><th>Monto (M)</th><th>Plazo (n)</th><th>Tasa (i)</th><th>Interés (I)</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>`;
}

function pintarSelectores() {
  $q('#is-registros').innerHTML = REGISTROS.map(r => `
    <button type="button" class="btn-primary ${r.id === Number(estadoIS.reg) ? 'active' : ''}" data-is-reg="${r.id}">Registro ${r.id}</button>`).join('');
}

function leerValores() {
  const v = {};
  document.querySelectorAll('#is-b2 [data-campo]').forEach(inp => {
    v[inp.dataset.campo] = inp.value.trim() === '' ? NaN : Number(inp.value);
  });
  return v;
}

/* Recalcula Bloque 3, Bloque 4 y la tabla resumen (sin tocar los inputs: no se pierde el foco) */
export function recalcularInteresSimple() {
  const reg = registroActual();
  const v = leerValores();
  valores[reg.id] = v;                                // guarda lo editado para la tabla resumen
  document.querySelectorAll('#is-b2 [data-campo]').forEach(inp =>
    inp.classList.toggle('invalido', !Number.isFinite(v[inp.dataset.campo])));

  const r = resolver(reg, v);   // <<< AQUÍ SE EJECUTA LA LÓGICA MATEMÁTICA CON LOS DATOS EDITADOS >>>
  const aviso = $q('#is-aviso');
  if (r.error) {
    aviso.hidden = false;
    aviso.innerHTML = `<span class="aviso-icono">⚠</span><span>${r.error}</span>`;
    $q('#is-incognitas').innerHTML = '';
    $q('#is-b3').innerHTML = '<p class="muted">Corrige los datos para ver el procedimiento.</p>';
    $q('#is-b4').innerHTML = '<p class="muted">Sin resultado: revisa el aviso del Bloque 2.</p>';
  } else {
    aviso.hidden = true;
    $q('#is-incognitas').innerHTML = r.incognitas.map(d => `
      <li class="incognita">
        <span class="data-var">${d.sim}</span><span class="data-val">= ?</span>
        <span class="data-nota">${d.nota}</span>
      </li>`).join('');
    $q('#is-b3').innerHTML = `<ol class="pasos">${r.pasos.map(s => `
      <li class="paso">
        <p class="paso-titulo">${s.titulo}</p>
        ${s.explicacion ? `<p class="paso-expl">${s.explicacion}</p>` : ''}
        ${s.lineas.map(l => `<div class="formula">${l}</div>`).join('')}
      </li>`).join('')}</ol>`;
    $q('#is-b4').innerHTML = `
      <div class="answer">
        <p class="answer-valor">${r.resultado.principal}</p>
        <p>${r.resultado.texto}</p>
        <p class="muted">${r.resultado.interpretacion}</p>
      </div>`;
  }
  pintarResumen();
}

function restaurarOriginales() {
  const reg = registroActual();
  const vals = valoresIniciales(reg);
  document.querySelectorAll('#is-b2 [data-campo]').forEach(inp => (inp.value = String(vals[inp.dataset.campo])));
  recalcularInteresSimple();
}

function restaurarTodos() {
  Object.keys(valores).forEach(k => delete valores[k]);
  if (estadoIS.reg !== null) mostrarRegistro(estadoIS.reg); else pintarResumen();
}

export function mostrarRegistro(id) {
  estadoIS = { reg: Number(id) };
  const reg = registroActual();

  pintarSelectores();
  $q('#is-vacio').hidden = true;
  $q('#is-contenido').hidden = false;
  $q('#is-titulo').textContent = `Registro ${reg.id}: ${reg.titulo}`;

  // Bloque 1: instrucción original (referencia, no cambia al editar)
  $q('#is-b1').innerHTML = `<p class="enunciado">${ENUNCIADO}</p>
    <p class="inciso"><b>Registro ${reg.id}.</b> ${reg.inciso}</p>`;

  // Bloque 2: inputs editables (con lo último que editó el usuario en este registro) + controles
  const vals = valoresDe(reg);
  $q('#is-b2').innerHTML = `
    <div class="campos-grid">${camposDe(reg).map(c => `
      <label class="campo">
        <span class="campo-sim">${c.sim}</span>
        <input type="number" step="any" class="input-num" data-campo="${c.k}" value="${Number.isFinite(vals[c.k]) ? vals[c.k] : ''}">
        <span class="campo-nota">${c.nota}</span>
      </label>`).join('')}
    </div>
    <div class="acciones">
      <button type="button" class="btn-recalcular" data-is-accion="recalcular">Recalcular</button>
      <button type="button" class="btn-secundario" data-is-accion="restaurar">Restaurar datos originales</button>
    </div>
    <div class="aviso" id="is-aviso" role="alert" hidden></div>
    <p class="bloque-subtitulo">Incógnitas a obtener</p>
    <ul class="data-list" id="is-incognitas"></ul>`;

  recalcularInteresSimple();   // se ve resuelto desde el primer instante
}

/* Llama a esta función una sola vez al arrancar (en main.js) */
export function iniciarInteresSimple() {
  const vista = $q('#view-interes-simple');
  if (!vista.querySelector('#is-registros')) {
    // El esqueleto se inyecta desde JS: index.html solo necesita la <section> vacía
    vista.innerHTML = `
      <header class="page-head">
        <span class="chip">Tema 5</span>
        <h1>Interés simple</h1>
      </header>
      <article class="card">
        <h2>Tabla resumen de los 6 registros</h2>
        <p class="muted">${ENUNCIADO} Las celdas resaltadas son las que se calculan; haz clic en una fila para ver su procedimiento.</p>
        <div class="table-container" id="is-resumen"></div>
        <div class="acciones">
          <button type="button" class="btn-secundario" data-is-accion="restaurar-todos">Restaurar los 6 registros</button>
        </div>
      </article>
      <div class="btn-group" id="is-registros"></div>
      <p class="muted" id="is-vacio"></p>
      <div id="is-contenido" hidden>
        <article class="card prob-card">
          <h2 class="prob-titulo" id="is-titulo"></h2>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">1</span>Instrucción</h3><div id="is-b1"></div></section>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">2</span>Datos</h3><div id="is-b2"></div></section>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">3</span>Procedimiento</h3><div id="is-b3"></div></section>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">4</span>Resultado</h3><div id="is-b4"></div></section>
        </article>
      </div>`;

    vista.addEventListener('click', e => {
      const reg = e.target.closest('[data-is-reg]');
      const acc = e.target.closest('[data-is-accion]');
      if (acc) {
        const a = acc.dataset.isAccion;
        if (a === 'restaurar') restaurarOriginales();
        else if (a === 'restaurar-todos') restaurarTodos();
        else recalcularInteresSimple();
      } else if (reg) {
        mostrarRegistro(reg.dataset.isReg);            // pestañas o filas de la tabla resumen
      }
    });
    // Tiempo real: recalcula mientras el usuario escribe
    vista.addEventListener('input', e => { if (e.target.matches('[data-campo]')) recalcularInteresSimple(); });
    // Enter dentro de cualquier input también recalcula
    vista.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.matches('[data-campo]')) { e.preventDefault(); recalcularInteresSimple(); }
    });
  }
  pintarSelectores();
  pintarResumen();
}