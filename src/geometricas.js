/* =========================================================
   TEMA 3: PROGRESIONES GEOMÉTRICAS (datos editables)
   Guarda este archivo como src/geometricas.js
   ========================================================= */

/* ---------- Formato de números ---------- */
const A = s => `a<sub>${s}</sub>`;
const T = s => `t<sub>${s}</sub>`;
const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 });

/* Miles con coma, hasta 6 decimales sin ceros sobrantes; notación científica si es enorme o diminuto */
export function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e15 || abs < 1e-6) {
    const [m, e] = n.toExponential(6).split('e');
    return `${String(+m).replace('-', '−')} × 10<sup>${String(+e).replace('-', '−')}</sup>`;
  }
  return nf.format(n).replace('-', '−');
}

/* Fracción exacta [p, q] si el número es (casi) una fracción simple; null si no */
function fraccionPar(x, maxDen = 1000, tol = 1e-9) {
  if (!Number.isFinite(x) || Number.isInteger(x) || Math.abs(x) > 1e6) return null;
  const v = Math.abs(x);
  let h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = v;
  for (let i = 0; i < 24; i++) {
    const a = Math.floor(b);
    const h2 = a * h1 + h0, k2 = a * k1 + k0;
    if (k2 > maxDen) return null;
    h0 = h1; h1 = h2; k0 = k1; k1 = k2;
    if (Math.abs(v - h1 / k1) <= tol * Math.max(1, v)) return k1 > 1 ? [Math.sign(x) * h1, k1] : null;
    const resto = b - a;
    if (resto < 1e-12) return null;
    b = 1 / resto;
  }
  return null;
}
export const fracStr = x => {
  const f = fraccionPar(x);
  return f ? `${f[0] < 0 ? '−' : ''}${Math.abs(f[0])}/${f[1]}` : null;
};
const snap = x => { const f = fraccionPar(x); return f ? f[0] / f[1] : x; };   // 1.3333333333 -> 4/3 exacto

const decimalCorto = n => Math.abs(n * 1e4 - Math.round(n * 1e4)) < 1e-6;
const esFrac = s => /^−?\d+\/\d+$/.test(s);
const lit = n => { const f = fracStr(n); return f && !decimalCorto(n) ? f : fmt(n); };      // valor "tal como se escribe"
const op = n => { const s = lit(n); return esFrac(s) || n < 0 ? `(${s})` : s; };           // operando con paréntesis si hace falta
const fmtF = n => { const f = fracStr(n); return f ? `${fmt(n)} (${f})` : fmt(n); };       // decimal + fracción exacta

const limpiar = x => Number(x.toPrecision(15));                  // quita ruido de coma flotante (2.0000000000000004 -> 2)
const esPos = n => Number.isInteger(n) && n >= 1;
const cerca = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const chk = (a, b) => (cerca(a, b) ? ' ✓' : '');
const ERR_POS = nombre => `${nombre} debe ser un entero mayor o igual a 1.`;
const ERR_RANGO = 'El resultado excede el rango numérico representable. Usa una posición n menor.';
const errCero = (nombre, donde) => `${nombre} no puede ser 0: ${donde} implicaría dividir entre cero.`;
const nombreTermino = (n, ordinal0, n0) => (n === n0 ? `${ordinal0} término` : `término ${n}`);
const unir = l => (l.length < 2 ? l.join('') : `${l.slice(0, -1).join(', ')} y ${l.at(-1)}`);
const describirRazon = r =>
  r < 0 ? `alterna de signo en cada término (r = ${fmtF(r)})`
  : r === 1 ? 'es constante (r = 1)'
  : r > 1 ? `crece multiplicándose por ${fmtF(r)} en cada término`
  : `decrece multiplicándose por ${fmtF(r)} en cada término`;
const log2e = x => { const e = Math.log2(x); return Math.abs(e - Math.round(e)) < 1e-9 ? Math.round(e) : null; };

/* =========================================================
   LÓGICA MATEMÁTICA (método de los apuntes de clase)
   ========================================================= */
// a_n = a_{n-1} · r  -->  r = a_n / a_{n-1}
export const razonConsecutiva = (an, an1) => an / an1;
// r = (a_k / a_1)^(1 / (k - 1))   (NaN si el radicando es negativo y el índice es par)
export function razonDosTerminos(a1, ak, k) {
  const base = ak / a1, idx = k - 1;
  if (base < 0 && idx % 2 === 0) return NaN;
  return limpiar(base >= 0 ? Math.pow(base, 1 / idx) : -Math.pow(-base, 1 / idx));
}
// a_n = a_1 · r^(n - 1)
export const terminoGeneral = (a1, r, n) => a1 * Math.pow(r, n - 1);

/* =========================================================
   DATOS ORIGINALES DEL PORTAFOLIO (hardcodeados)
   <<< AQUÍ AGREGAS NUEVOS EJERCICIOS O INCISOS >>>
   ========================================================= */
export const SECCIONES = [
  {
    id: 'base', corto: 'Ejercicio 1', titulo: 'Ejercicio 1', tema: '',
    enunciado: 'El señor Hernández realiza aportaciones semanales a un fondo de ahorro durante 12 meses, sin intereses. Inicia con depósitos semanales de $260 e incrementa el monto del depósito semanal en $20 cada 4 semanas. Determine el monto del último depósito semanal y el capital total acumulado.',
    problemas: [{ tipo: 'ahorro', depositoInicial: 260, incremento: 20, periodos: 12, pagosPorPeriodo: 4 }],
  },
  {
    id: 1, corto: 'Ejercicio 2', titulo: 'Ejercicio 2', tema: '',
    enunciado: 'Calcule el trigésimo término (n = 30) de una sucesión geométrica si el primer término es 3/4 y el cuarto término es 6.',
    problemas: [{ tipo: 'dato-posicion', a1: 0.75, posicionDato: 4, valorDato: 6, nObjetivo: 30, ordinal: 'trigésimo' }],
  },
  {
    id: 2, corto: 'Ejercicio 3', titulo: 'Ejercicio 3', tema: '',
    enunciado: 'El primer término de una sucesión geométrica es 64 y el sexto término es 2. Determine los términos intermedios (a₂, a₃, a₄ y a₅).',
    problemas: [{ tipo: 'interpolacion', a1: 64, posicionFinal: 6, valorFinal: 2 }],
  },
  {
    id: 3, corto: 'Ejercicio 4 (a–f)', titulo: 'Ejercicio 4', tema: '',
    enunciado: 'Halle el valor de x en cada progresión geométrica.',
    metodo: 'Método de clase: se iguala la razón común r = a₂ / a₁ = a₃ / a₂, de donde (a₂)² = a₁ · a₃.',
    problemas: [
      { etiqueta: 'a', tipo: 'x-medio',   inciso: 'Sucesión: 3, x, 48, …',        t1: 3, t3: 48 },
      { etiqueta: 'b', tipo: 'x-primero', inciso: 'Sucesión: x, 4, −4/3, …',      t2: 4, t3: -1.3333333333 },
      { etiqueta: 'c', tipo: 'x-ultimo',  inciso: 'Sucesión: 5, −1, x, …',        t1: 5, t2: -1 },
      { etiqueta: 'd', tipo: 'x-medio',   inciso: 'Sucesión: 3, (x − 3), 4/3, …', t1: 3, desp: -3, t3: 1.3333333333 },
      { etiqueta: 'e', tipo: 'x-primero', inciso: 'Sucesión: x, 2, 4/3, …',       t2: 2, t3: 1.3333333333 },
      { etiqueta: 'f', tipo: 'x-ultimo',  inciso: 'Sucesión: 10, 2.5, x, …',      t1: 10, t2: 2.5 },
    ],
  },
  {
    id: 4, corto: 'Ejercicio 5 (a–d)', titulo: 'Ejercicio 5', tema: '',
    enunciado: 'Obtenga el término indicado en cada progresión geométrica.',
    problemas: [
      { etiqueta: 'a', tipo: 'termino-dos-primeros', inciso: 'Sucesión: 2, 3, … → hallar el décimo término (n = 10).',       a1: 2,    a2: 3,            n: 10, ordinal: 'décimo' },
      { etiqueta: 'b', tipo: 'termino-dos-primeros', inciso: 'Sucesión: 5, 2, … → hallar el octavo término (n = 8).',        a1: 5,    a2: 2,            n: 8,  ordinal: 'octavo' },
      { etiqueta: 'c', tipo: 'termino-dos-primeros', inciso: 'Sucesión: 1/4, 1/3, … → hallar el vigésimo cuarto término (n = 24).', a1: 0.25, a2: 0.3333333333, n: 24, ordinal: 'vigésimo cuarto' },
      { etiqueta: 'd', tipo: 'termino-con-medio',    inciso: 'Sucesión: 1/4, x, 4, … → hallar el decimoquinto término (n = 15).',   a1: 0.25, a3: 4,            n: 15, ordinal: 'decimoquinto' },
    ],
  },
  {
    id: 5, corto: 'Ejercicio 6', titulo: 'Ejercicio 6', tema: '',
    enunciado: 'Calcule el vigésimo cuarto término (n = 24) de la progresión geométrica 2, 2<sup>3</sup>, …',
    problemas: [{ tipo: 'termino-dos-primeros', a1: 2, a2: 8, n: 24, ordinal: 'vigésimo cuarto' }],
  },
];

/* Campos editables de cada tipo (clave = nombre de la variable) */
function camposDe(o) {
  switch (o.tipo) {
    case 'ahorro': return [
      { k: 'depositoInicial', sim: A(1), nota: 'depósito semanal inicial ($)' },
      { k: 'incremento', sim: 'd', nota: 'incremento del depósito en cada periodo ($)' },
      { k: 'periodos', sim: 'n', nota: 'número de periodos (12 meses = 12 bloques de 4 semanas)' },
      { k: 'pagosPorPeriodo', sim: 'k', nota: 'depósitos semanales por periodo (4 semanas)' }];
    case 'dato-posicion': return [
      { k: 'a1', sim: A(1), nota: 'primer término' },
      { k: 'posicionDato', sim: 'k', nota: 'posición del término conocido' },
      { k: 'valorDato', sim: A('k'), nota: 'valor del término en la posición k' },
      { k: 'nObjetivo', sim: 'n', nota: 'posición del término buscado' }];
    case 'interpolacion': return [
      { k: 'a1', sim: A(1), nota: 'primer término' },
      { k: 'posicionFinal', sim: 'k', nota: 'posición del último término conocido' },
      { k: 'valorFinal', sim: A('k'), nota: 'valor del término en la posición k' }];
    case 'x-medio': return [
      { k: 't1', sim: T(1), nota: 'primer término' },
      ...(o.desp !== undefined ? [{ k: 'desp', sim: 's', nota: 'desplazamiento: el segundo término es (x + s)' }] : []),
      { k: 't3', sim: T(3), nota: 'tercer término' }];
    case 'x-primero': return [
      { k: 't2', sim: T(2), nota: 'segundo término' },
      { k: 't3', sim: T(3), nota: 'tercer término' }];
    case 'x-ultimo': return [
      { k: 't1', sim: T(1), nota: 'primer término' },
      { k: 't2', sim: T(2), nota: 'segundo término' }];
    case 'termino-dos-primeros': return [
      { k: 'a1', sim: A(1), nota: 'primer término' },
      { k: 'a2', sim: A(2), nota: 'segundo término' },
      { k: 'n', sim: 'n', nota: 'posición del término buscado' }];
    case 'termino-con-medio': return [
      { k: 'a1', sim: A(1), nota: 'primer término' },
      { k: 'a3', sim: A(3), nota: 'tercer término (x es el segundo)' },
      { k: 'n', sim: 'n', nota: 'posición del término buscado' }];
  }
}
export const valoresIniciales = o => Object.fromEntries(camposDe(o).map(c => [c.k, o[c.k]]));

/* =========================================================
   RESOLUTORES: devuelven { incognitas, pasos, resultado } o { error }
   ========================================================= */

/* Problema base: fondo de ahorro (serie aritmética S_n) */
function resolverAhorro(o, v) {
  const { depositoInicial: a1, incremento: d, periodos: n, pagosPorPeriodo: k } = v;
  if (!esPos(n)) return { error: ERR_POS('El número de periodos n') };
  if (!esPos(k)) return { error: ERR_POS('Los pagos por periodo k') };
  const an = a1 + (n - 1) * d;
  const sn = (n / 2) * (a1 + an);
  const total = k * sn;
  let directa = null;
  if (n <= 100000) { directa = 0; for (let i = 0; i < n; i++) directa += a1 + i * d; }
  const din = x => `$${fmt(x)}`;
  return {
    incognitas: [
      { sim: A(n), nota: 'depósito semanal del último periodo' },
      { sim: `S<sub>${n}</sub>`, nota: 'suma de un depósito representativo por periodo' },
      { sim: 'Total', nota: 'capital acumulado' }],
    pasos: [
      { titulo: 'Depósito semanal del último periodo',
        explicacion: 'El depósito crece una cantidad fija d en cada periodo; se usa el término general aritmético:',
        lineas: [
          `${A('n')} = ${A(1)} + (n − 1) · d`,
          `${A(n)} = ${fmt(a1)} + (${n} − 1) · ${op(d)}`,
          `${A(n)} = ${fmt(a1)} + ${op((n - 1) * d)}`,
          `${A(n)} = ${fmt(an)}`] },
      { titulo: 'Suma de un pago representativo por periodo',
        lineas: [
          `S<sub>n</sub> = (n / 2) · (${A(1)} + ${A('n')})`,
          `S<sub>${n}</sub> = (${n} / 2) · (${fmt(a1)} + ${op(an)})`,
          `S<sub>${n}</sub> = ${fmt(n / 2)} · ${fmt(a1 + an)}`,
          `S<sub>${n}</sub> = ${fmt(sn)}`] },
      { titulo: `Multiplicar por los k = ${k} depósitos semanales de cada periodo`,
        lineas: [
          'Acumulado total = k · S<sub>n</sub>',
          `Acumulado total = ${k} · ${fmt(sn)}`,
          `Acumulado total = ${fmt(total)}`] },
      ...(directa === null ? [] : [{ titulo: 'Comprobación', lineas: [
        `Sumando uno a uno los ${n} depósitos representativos: ${fmt(directa)}${chk(directa, sn)}`] }]),
    ],
    resultado: {
      principal: `Último depósito: ${din(an)}   ·   Capital total: ${din(total)}`,
      texto: `El último depósito semanal (periodo ${n}) es ${din(an)} y el capital acumulado en ${n * k} depósitos es ${din(total)}.`,
      interpretacion: `El depósito pasa de ${din(a1)} a ${din(an)} a lo largo de ${n} periodos de ${k} semanas.`,
      nota: `Nota aclaratoria: aunque este problema aparece en la sección de series S<sub>n</sub>, el incremento es aditivo constante (d = ${din(d)} cada ${k} semanas), por lo que los montos forman una progresión aritmética, no una geométrica.`,
    },
  };
}

/* Ejercicio 1: r a partir del 1.° y un término conocido, luego a_n */
function resolverDatoPosicion(o, v) {
  const { a1, posicionDato: k, valorDato: ak, nObjetivo: n } = v;
  if (a1 === 0) return { error: errCero(A(1), `r = (${A('k')} / ${A(1)})<sup>1/(k − 1)</sup>`) };
  if (ak === 0) return { error: `El término ${A('k')} no puede ser 0 en una progresión geométrica (la razón sería 0).` };
  if (!Number.isInteger(k) || k < 2) return { error: 'La posición del dato k debe ser un entero mayor o igual a 2 (con k = 1 no hay razón que despejar).' };
  if (!esPos(n)) return { error: ERR_POS('La posición objetivo n') };
  const ratio = ak / a1;
  if (ratio < 0 && (k - 1) % 2 === 0) {
    return { error: `Radicando negativo: ${A('k')} / ${A(1)} = ${fmt(ratio)} y el índice de la raíz (k − 1 = ${k - 1}) es par; no existe una razón real.` };
  }
  const r = razonDosTerminos(a1, ak, k);
  const an = terminoGeneral(a1, r, n);
  if (!Number.isFinite(an)) return { error: ERR_RANGO };
  const nom = nombreTermino(n, o.ordinal, o.nObjetivo);
  const compK = terminoGeneral(a1, r, k);
  return {
    incognitas: [{ sim: 'r', nota: 'razón común (se obtiene primero)' }, { sim: A(n), nota: `${nom} (incógnita)` }],
    pasos: [
      { titulo: 'Fórmula general', lineas: [`${A('n')} = ${A(1)} · r<sup>n − 1</sup>`] },
      { titulo: 'Despejar la razón común (r)',
        explicacion: `Con el término conocido ${A('k')} (k = ${k}):`,
        lineas: [
          `${A('k')} = ${A(1)} · r<sup>k − 1</sup>`,
          `r<sup>k − 1</sup> = ${A('k')} / ${A(1)}`,
          `r = (${A('k')} / ${A(1)})<sup>1/(k − 1)</sup>`] },
      { titulo: 'Sustituir y calcular r', lineas: [
        `r = (${op(ak)} / ${op(a1)})<sup>1/${k - 1}</sup>`,
        `r = (${lit(ratio)})<sup>1/${k - 1}</sup>`,
        `r = ${fmtF(r)}`] },
      { titulo: `Calcular el ${nom} (n = ${n})`, lineas: [
        `${A(n)} = ${op(a1)} · ${op(r)}<sup>${n - 1}</sup>`,
        `${A(n)} = ${op(a1)} · ${fmt(Math.pow(r, n - 1))}`,
        `${A(n)} = ${fmt(an)}`] },
      { titulo: 'Comprobación', lineas: [
        `${A(k)} = ${op(a1)} · ${op(r)}<sup>${k - 1}</sup> = ${fmt(compK)}${chk(compK, ak)}`] },
    ],
    resultado: {
      principal: `${A(n)} = ${fmt(an)}`,
      texto: `El ${nom} de la sucesión es ${fmtF(an)}.`,
      interpretacion: `La sucesión ${describirRazon(r)}; parte de ${fmtF(a1)} y llega a ${fmtF(an)} en la posición ${n}.` +
        (ratio > 0 && (k - 1) % 2 === 0 ? ` Como k − 1 = ${k - 1} es par, también r = ${fmtF(-r)} cumple ${A('k')} = ${fmt(ak)}; aquí se usa la raíz positiva.` : ''),
    },
  };
}

/* Ejercicio 2: interpolar términos intermedios */
function resolverInterpolacion(o, v) {
  const { a1, posicionFinal: k, valorFinal: ak } = v;
  if (a1 === 0) return { error: errCero(A(1), `r = (${A('k')} / ${A(1)})<sup>1/(k − 1)</sup>`) };
  if (ak === 0) return { error: `El término ${A('k')} no puede ser 0 en una progresión geométrica (la razón sería 0).` };
  if (!Number.isInteger(k) || k < 2) return { error: 'La posición final k debe ser un entero mayor o igual a 2.' };
  if (k > 60) return { error: 'Para listar los términos intermedios usa una posición final k de 60 o menos.' };
  const ratio = ak / a1;
  if (ratio < 0 && (k - 1) % 2 === 0) {
    return { error: `Radicando negativo: ${A('k')} / ${A(1)} = ${fmt(ratio)} y el índice de la raíz (k − 1 = ${k - 1}) es par; no existe una razón real.` };
  }
  const r = razonDosTerminos(a1, ak, k);
  const t = [a1];
  for (let i = 2; i <= k; i++) t.push(t[i - 2] * r);          // t[i-1] = a_i
  if (!t.every(Number.isFinite)) return { error: ERR_RANGO };
  const inter = t.slice(1, k - 1);                              // a_2 ... a_{k-1}
  return {
    incognitas: [{ sim: 'r', nota: 'razón común (se obtiene primero)' },
      ...inter.map((_, j) => ({ sim: A(j + 2), nota: 'término intermedio' }))],
    pasos: [
      { titulo: 'Despejar la razón común (r)',
        explicacion: `Con el primer término y el término ${A('k')} (k = ${k}):`,
        lineas: [
          `${A('k')} = ${A(1)} · r<sup>k − 1</sup>`,
          `r = (${A('k')} / ${A(1)})<sup>1/(k − 1)</sup>`,
          `r = (${op(ak)} / ${op(a1)})<sup>1/(${k} − 1)</sup>`,
          `r = (${lit(ratio)})<sup>1/${k - 1}</sup>`,
          `r = ${fmtF(r)}`] },
      { titulo: 'Regla recursiva para los términos intermedios',
        explicacion: `${A('n')} = ${A('n − 1')} · r`,
        lineas: inter.length
          ? inter.map((_, j) => { const i = j + 2; return `${A(i)} = ${A(i - 1)} · r = ${fmt(t[i - 2])} · ${op(r)} = ${fmt(t[i - 1])}`; })
          : ['No hay términos intermedios (k = 2).'] },
      { titulo: 'Comprobación', lineas: [
        `${A(k)} = ${A(k - 1)} · r = ${fmt(t[k - 2])} · ${op(r)} = ${fmt(t[k - 1])}${chk(t[k - 1], ak)}`] },
    ],
    resultado: {
      principal: inter.length ? inter.map((x, j) => `${A(j + 2)} = ${fmt(x)}`).join(',  ') : 'Sin términos intermedios',
      texto: inter.length ? `Los términos intermedios son ${unir(inter.map(fmtF))}.` : 'Con k = 2 no existen términos entre el primero y el último.',
      interpretacion: `La sucesión ${describirRazon(r)}, de ${fmtF(a1)} (posición 1) a ${fmtF(ak)} (posición ${k}).`,
    },
  };
}

/* Ejercicio 3: x es el término medio (3a y 3d, con desplazamiento opcional) */
function resolverXMedio(o, v) {
  const { t1, t3 } = v;
  const s = v.desp ?? 0;
  if (t1 === 0) return { error: errCero(T(1), `r = ${T(2)} / ${T(1)}`) };
  if (t3 === 0) return { error: errCero(T(3), `${T(3)} / ${T(2)} (el término medio sería 0)`) };
  const prod = t1 * t3;
  if (prod < 0) {
    return { error: `Radicando negativo: ${T(1)} · ${T(3)} = ${fmt(prod)} es menor que 0 y la raíz cuadrada no es real; no existe x real.` };
  }
  const y = limpiar(Math.sqrt(prod));
  const tm = s === 0 ? 'x' : `(x ${s < 0 ? '−' : '+'} ${fmt(Math.abs(s))})`;
  const sols = [y, -y].map((m, i) => ({ i: i + 1, m, x: limpiar(m - s), r: limpiar(m / t1) }));
  const [s1, s2] = sols;
  return {
    incognitas: sols.map(q => ({ sim: `x<sub>${q.i}</sub>`, nota: `solución ${q.i}` })),
    pasos: [
      { titulo: 'Condición de la progresión geométrica',
        explicacion: 'La razón común es la misma entre términos consecutivos:',
        lineas: [`r = ${A(2)} / ${A(1)} = ${A(3)} / ${A(2)}`, `(${A(2)})² = ${A(1)} · ${A(3)}`] },
      { titulo: 'Plantear la igualdad de razones', lineas: [
        `${tm} / ${op(t1)} = ${op(t3)} / ${tm}`,
        `${tm}² = ${op(t1)} · ${op(t3)}`,
        `${tm}² = ${fmt(prod)}`] },
      { titulo: 'Extraer la raíz cuadrada', lineas: [`${tm} = ±√${fmt(prod)}`, `${tm} = ±${fmt(y)}`] },
      ...(s !== 0 ? [{ titulo: 'Despejar x', explicacion: `Como el segundo término es (x ${s < 0 ? '−' : '+'} ${fmt(Math.abs(s))}), x = ${tm} − (${fmt(s)}):`,
        lineas: sols.map(q => `x<sub>${q.i}</sub> = ${op(q.m)} − ${op(s)} = ${fmt(q.x)}`) }] : []),
      { titulo: 'Razón de cada solución', lineas: sols.map(q =>
        `${tm} = ${fmt(q.m)} → r = ${fmt(q.m)} / ${op(t1)} = ${fmtF(q.r)}`) },
      { titulo: 'Comprobación', lineas: sols.map(q =>
        `${lit(t1)}, ${fmt(q.m)}, ${lit(t3)}: ${fmt(q.m)} / ${op(t1)} = ${fmtF(q.r)} y ${op(t3)} / ${op(q.m)} = ${fmtF(limpiar(t3 / q.m))}${chk(q.r, t3 / q.m)}`) },
    ],
    resultado: {
      principal: `x = ${fmt(s1.x)}   o   x = ${fmt(s2.x)}`,
      texto: `Hay dos soluciones reales: x = ${fmtF(s1.x)} (razón r = ${fmtF(s1.r)}) y x = ${fmtF(s2.x)} (razón r = ${fmtF(s2.r)}).`,
      interpretacion: `Ambas cumplen (${A(2)})² = ${A(1)} · ${A(3)}: una sucesión conserva el signo de sus términos (r > 0) y la otra los alterna (r < 0).`,
    },
  };
}

/* Ejercicio 3: x es el primer término (3b y 3e) */
function resolverXPrimero(o, v) {
  const { t2, t3 } = v;
  if (t2 === 0) return { error: errCero(T(2), `r = ${T(3)} / ${T(2)}`) };
  if (t3 === 0) return { error: errCero(T(3), `x = ${T(2)}² / ${T(3)}`) };
  const r = limpiar(t3 / t2);
  const x = limpiar((t2 * t2) / t3);
  return {
    incognitas: [{ sim: 'x', nota: 'primer término' }, { sim: 'r', nota: 'razón común' }],
    pasos: [
      { titulo: 'Condición de la progresión geométrica',
        explicacion: 'La razón común es la misma entre términos consecutivos:',
        lineas: [`r = ${A(2)} / ${A(1)} = ${A(3)} / ${A(2)}`, `(${A(2)})² = ${A(1)} · ${A(3)}`] },
      { titulo: 'Plantear la igualdad de razones', lineas: [`${op(t2)} / x = ${op(t3)} / ${op(t2)}`] },
      { titulo: 'Despejar x', lineas: [
        `x = ${op(t2)}² / ${op(t3)}`,
        `x = ${fmt(t2 * t2)} / ${op(t3)}`,
        `x = ${fmt(x)}`] },
      { titulo: 'Razón común', lineas: [`r = ${op(t3)} / ${op(t2)} = ${fmtF(r)}`] },
      { titulo: 'Comprobación', lineas: [
        `x · r = ${fmt(x)} · ${op(r)} = ${fmt(x * r)}${chk(x * r, t2)}  (debe ser ${lit(t2)})`,
        `${lit(t2)} · r = ${fmt(t2 * r)}${chk(t2 * r, t3)}  (debe ser ${lit(t3)})`] },
    ],
    resultado: {
      principal: `x = ${fmt(x)}`,
      texto: `El primer término es x = ${fmtF(x)}, con razón común r = ${fmtF(r)}.`,
      interpretacion: `La sucesión ${fmtF(x)}, ${lit(t2)}, ${lit(t3)}, … ${describirRazon(r)}.`,
    },
  };
}

/* Ejercicio 3: x es el tercer término (3c y 3f) */
function resolverXUltimo(o, v) {
  const { t1, t2 } = v;
  if (t1 === 0) return { error: errCero(T(1), `r = ${T(2)} / ${T(1)}`) };
  if (t2 === 0) return { error: errCero(T(2), `x / ${T(2)} = ${T(2)} / ${T(1)}`) };
  const r = limpiar(t2 / t1);
  const x = limpiar((t2 * t2) / t1);
  return {
    incognitas: [{ sim: 'x', nota: 'tercer término' }, { sim: 'r', nota: 'razón común' }],
    pasos: [
      { titulo: 'Condición de la progresión geométrica',
        explicacion: 'La razón común es la misma entre términos consecutivos:',
        lineas: [`r = ${A(2)} / ${A(1)} = ${A(3)} / ${A(2)}`, `(${A(2)})² = ${A(1)} · ${A(3)}`] },
      { titulo: 'Plantear la igualdad de razones', lineas: [`${op(t2)} / ${op(t1)} = x / ${op(t2)}`] },
      { titulo: 'Despejar x', lineas: [
        `x = ${op(t2)}² / ${op(t1)}`,
        `x = ${fmt(t2 * t2)} / ${op(t1)}`,
        `x = ${fmtF(x)}`] },
      { titulo: 'Razón común', lineas: [`r = ${op(t2)} / ${op(t1)} = ${fmtF(r)}`] },
      { titulo: 'Comprobación', lineas: [
        `${lit(t1)} · r = ${fmt(t1 * r)}${chk(t1 * r, t2)}  (debe ser ${lit(t2)})`,
        `${lit(t2)} · r = ${fmt(t2 * r)}${chk(t2 * r, x)}  (debe ser x = ${fmt(x)})`] },
    ],
    resultado: {
      principal: `x = ${fmt(x)}`,
      texto: `El tercer término es x = ${fmtF(x)}, con razón común r = ${fmtF(r)}.`,
      interpretacion: `La sucesión ${lit(t1)}, ${lit(t2)}, ${fmtF(x)}, … ${describirRazon(r)}.`,
    },
  };
}

/* Ejercicio 4 (a-c) y Ejercicio 5: se dan a_1 y a_2, se busca a_n */
function resolverDosPrimeros(o, v) {
  const { a1, a2, n } = v;
  if (a1 === 0) return { error: errCero(A(1), `r = ${A(2)} / ${A(1)}`) };
  if (a2 === 0) return { error: `El término ${A(2)} no puede ser 0 en una progresión geométrica (la razón sería 0 y todos los términos siguientes se anularían).` };
  if (!esPos(n)) return { error: ERR_POS('La posición n') };
  const r = limpiar(a2 / a1);
  const pw = Math.pow(r, n - 1);
  const an = a1 * pw;
  if (!Number.isFinite(an)) return { error: ERR_RANGO };
  const nom = nombreTermino(n, o.ordinal, o.n);
  const prev = n >= 2 ? a1 * Math.pow(r, n - 2) : null;
  const e1 = a1 > 0 ? log2e(a1) : null, e2 = r > 0 ? log2e(r) : null;
  const exponencial = e1 >= 1 && e2 >= 1 && n >= 2
    ? [`${A(n)} = 2<sup>${e1}</sup> · (2<sup>${e2}</sup>)<sup>${n - 1}</sup> = 2<sup>${e1} + ${e2 * (n - 1)}</sup> = 2<sup>${e1 + e2 * (n - 1)}</sup>`] : [];
  return {
    incognitas: [{ sim: 'r', nota: 'razón común (se obtiene primero)' }, { sim: A(n), nota: `${nom} (incógnita)` }],
    pasos: [
      { titulo: 'Despejar la razón común (r)',
        explicacion: 'De la definición recursiva:',
        lineas: [
          `${A('n')} = ${A('n − 1')} · r`,
          `r = ${A('n')} / ${A('n − 1')}`,
          `r = ${A(2)} / ${A(1)} = ${op(a2)} / ${op(a1)}`,
          `r = ${fmtF(r)}`] },
      { titulo: `Calcular el ${nom} (n = ${n})`, lineas: [
        `${A('n')} = ${A(1)} · r<sup>n − 1</sup>`,
        `${A(n)} = ${op(a1)} · ${op(r)}<sup>${n - 1}</sup>`,
        `${A(n)} = ${op(a1)} · ${fmt(pw)}`,
        ...exponencial,
        `${A(n)} = ${fmt(an)}`] },
      ...(prev === null ? [] : [{ titulo: 'Comprobación', lineas: [
        `${A(n)} = ${A(n - 1)} · r = ${fmt(prev)} · ${op(r)} = ${fmt(prev * r)}${chk(prev * r, an)}`] }]),
    ],
    resultado: {
      principal: `${A(n)} = ${fmt(an)}`,
      texto: `El ${nom} es ${fmtF(an)}.`,
      interpretacion: `La sucesión ${describirRazon(r)}; pasa de ${fmtF(a1)} en la posición 1 a ${fmtF(an)} en la posición ${n}.`,
    },
  };
}

/* Ejercicio 4d: a_1, x, a_3 -> término medio ±, razones ± y a_n */
function resolverConMedio(o, v) {
  const { a1, a3, n } = v;
  if (a1 === 0) return { error: errCero(A(1), `r = x / ${A(1)}`) };
  if (a3 === 0) return { error: `El término ${A(3)} no puede ser 0 en una progresión geométrica (el término medio x sería 0 y la razón también).` };
  const prod = a1 * a3;
  if (prod < 0) return { error: `Radicando negativo: ${A(1)} · ${A(3)} = ${fmt(prod)} es menor que 0 y la raíz cuadrada no es real; no existe x real.` };
  if (!esPos(n)) return { error: ERR_POS('La posición n') };
  const y = limpiar(Math.sqrt(prod));
  const rs = [limpiar(y / a1), limpiar(-y / a1)];
  const as = rs.map(r => terminoGeneral(a1, r, n));
  if (!as.every(Number.isFinite)) return { error: ERR_RANGO };
  const mismo = cerca(as[0], as[1]);
  const nom = nombreTermino(n, o.ordinal, o.n);
  return {
    incognitas: [{ sim: 'x', nota: 'término medio (dos soluciones)' }, { sim: 'r', nota: 'razón común (dos valores)' }, { sim: A(n), nota: `${nom} (incógnita)` }],
    pasos: [
      { titulo: 'Hallar el término medio x',
        explicacion: `En la progresión ${A(1)}, x, ${A(3)}: (x)² = ${A(1)} · ${A(3)}`,
        lineas: [`x² = ${op(a1)} · ${op(a3)} = ${fmt(prod)}`, `x = ±√${fmt(prod)} = ±${fmt(y)}`] },
      { titulo: 'Razón común para cada x', lineas: [
        `r = x / ${A(1)}`,
        `x = ${fmt(y)}: r = ${fmt(y)} / ${op(a1)} = ${fmtF(rs[0])}`,
        `x = ${fmt(-y)}: r = ${op(-y)} / ${op(a1)} = ${fmtF(rs[1])}`] },
      { titulo: `Calcular el ${nom} (n = ${n})`,
        explicacion: `${A('n')} = ${A(1)} · r<sup>n − 1</sup>`,
        lineas: rs.map((r, i) => `r = ${fmtF(r)}: ${A(n)} = ${op(a1)} · ${op(r)}<sup>${n - 1}</sup> = ${fmt(as[i])}`) },
      { titulo: 'Comprobación', lineas: rs.map(r =>
        `r = ${fmtF(r)}: ${A(3)} = ${A(1)} · r² = ${op(a1)} · ${fmt(r * r)} = ${fmt(a1 * r * r)}${chk(a1 * r * r, a3)}`) },
    ],
    resultado: {
      principal: mismo ? `${A(n)} = ${fmt(as[0])}` : `${A(n)} = ${fmt(as[0])}   o   ${A(n)} = ${fmt(as[1])}`,
      texto: mismo
        ? `El ${nom} es ${fmtF(as[0])}, tanto con r = ${fmtF(rs[0])} como con r = ${fmtF(rs[1])}.`
        : `El ${nom} es ${fmtF(as[0])} (con r = ${fmtF(rs[0])}) o ${fmtF(as[1])} (con r = ${fmtF(rs[1])}).`,
      interpretacion: mismo
        ? `Como el exponente n − 1 = ${n - 1} es par, el signo de la razón no cambia el resultado: ambas razones dan el mismo término.`
        : `Como el exponente n − 1 = ${n - 1} es impar, el signo de la razón sí cambia el signo del término.`,
    },
  };
}

const RESOLUTORES = {
  ahorro: resolverAhorro, 'dato-posicion': resolverDatoPosicion, interpolacion: resolverInterpolacion,
  'x-medio': resolverXMedio, 'x-primero': resolverXPrimero, 'x-ultimo': resolverXUltimo,
  'termino-dos-primeros': resolverDosPrimeros, 'termino-con-medio': resolverConMedio,
};

/* Resuelve un problema con los valores dados (por defecto, los originales) */
export function resolver(orig, v = valoresIniciales(orig)) {
  if (Object.values(v).some(x => !Number.isFinite(x))) {
    return { error: 'Hay campos vacíos o con valores no válidos. Completa todos los datos para continuar.' };
  }
  const exactos = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, snap(x)]));
  return RESOLUTORES[orig.tipo](orig, exactos);
}

/* =========================================================
   VISTA EDITABLE (todo se genera dentro de #view-geometricas)
   ========================================================= */
const $q = s => document.querySelector(s);
let estadoGeo = { sec: null, inciso: 0 };
const seccionActual = () => SECCIONES.find(s => String(s.id) === estadoGeo.sec);
const problemaActual = () => seccionActual().problemas[estadoGeo.inciso];

function pintarSelectores() {
  $q('#geo-ejercicios').innerHTML = SECCIONES.map(s => `
    <button type="button" class="btn-primary ${String(s.id) === estadoGeo.sec ? 'active' : ''}" data-geo-sec="${s.id}">${s.corto}</button>`).join('');
  const sec = seccionActual();
  const tabs = $q('#geo-incisos');
  tabs.hidden = !sec || sec.problemas.length < 2;
  tabs.innerHTML = tabs.hidden ? '' : sec.problemas.map((p, i) => `
    <button type="button" class="btn-tab ${i === estadoGeo.inciso ? 'active' : ''}" data-geo-inciso="${i}">Inciso ${p.etiqueta})</button>`).join('');
}

function leerValores() {
  const v = {};
  document.querySelectorAll('#geo-b2 [data-campo]').forEach(inp => {
    v[inp.dataset.campo] = inp.value.trim() === '' ? NaN : Number(inp.value);
  });
  return v;
}

/* Recalcula Bloque 3 y Bloque 4 con los valores actuales (sin tocar los inputs: no se pierde el foco) */
export function recalcularGeometrica() {
  const v = leerValores();
  document.querySelectorAll('#geo-b2 [data-campo]').forEach(inp => {
    const x = v[inp.dataset.campo];
    inp.classList.toggle('invalido', !Number.isFinite(x));
    const f = Number.isFinite(x) ? fracStr(x) : null;          // equivalencia en fracción exacta
    inp.closest('.campo').querySelector('.campo-frac').textContent = f ? `= ${f}` : '';
  });

  const r = resolver(problemaActual(), v);   // <<< AQUÍ SE EJECUTA LA LÓGICA MATEMÁTICA CON LOS DATOS EDITADOS >>>
  const aviso = $q('#geo-aviso');
  if (r.error) {
    aviso.hidden = false;
    aviso.innerHTML = `<span class="aviso-icono">⚠</span><span>${r.error}</span>`;
    $q('#geo-incognitas').innerHTML = '';
    $q('#geo-b3').innerHTML = '<p class="muted">Corrige los datos para ver el procedimiento.</p>';
    $q('#geo-b4').innerHTML = '<p class="muted">Sin resultado: revisa el aviso del Bloque 2.</p>';
    return;
  }
  aviso.hidden = true;

  $q('#geo-incognitas').innerHTML = r.incognitas.map(d => `
    <li class="incognita">
      <span class="data-var">${d.sim}</span><span class="data-val">= ?</span>
      <span class="data-nota">${d.nota}</span>
    </li>`).join('');

  $q('#geo-b3').innerHTML = `<ol class="pasos">${r.pasos.map(s => `
    <li class="paso">
      <p class="paso-titulo">${s.titulo}</p>
      ${s.explicacion ? `<p class="paso-expl">${s.explicacion}</p>` : ''}
      ${s.lineas.map(l => `<div class="formula">${l}</div>`).join('')}
    </li>`).join('')}</ol>`;

  $q('#geo-b4').innerHTML = `
    <div class="answer">
      <p class="answer-valor">${r.resultado.principal}</p>
      <p>${r.resultado.texto}</p>
      <p class="muted">${r.resultado.interpretacion}</p>
      ${r.resultado.nota ? `<p class="nota-aclaratoria">${r.resultado.nota}</p>` : ''}
    </div>`;
}

function restaurarOriginales() {
  const vals = valoresIniciales(problemaActual());
  document.querySelectorAll('#geo-b2 [data-campo]').forEach(inp => (inp.value = String(vals[inp.dataset.campo])));
  recalcularGeometrica();
}

export function mostrarGeometrica(secId, incisoIdx = 0) {
  estadoGeo = { sec: String(secId), inciso: incisoIdx };
  const sec = seccionActual();
  const p = sec.problemas[incisoIdx];

  pintarSelectores();
  $q('#geo-vacio').hidden = true;
  $q('#geo-contenido').hidden = false;
  $q('#geo-titulo').textContent = `${sec.titulo}: ${sec.tema}${p.etiqueta ? ` · Inciso ${p.etiqueta})` : ''}`;

  // Bloque 1: enunciado original (referencia, no cambia al editar)
  $q('#geo-b1').innerHTML = `<p class="enunciado">${sec.enunciado}</p>` +
    (sec.metodo ? `<p class="muted">${sec.metodo}</p>` : '') +
    (p.etiqueta ? `<p class="inciso"><b>Inciso ${p.etiqueta})</b> ${p.inciso}</p>` : '');

  // Bloque 2: inputs editables con los valores originales + controles
  const vals = valoresIniciales(p);
  $q('#geo-b2').innerHTML = `
    <div class="campos-grid">${camposDe(p).map(c => `
      <label class="campo">
        <span class="campo-sim">${c.sim}</span>
        <input type="number" step="any" class="input-num" data-campo="${c.k}" value="${vals[c.k]}">
        <span class="campo-frac"></span>
        <span class="campo-nota">${c.nota}</span>
      </label>`).join('')}
    </div>
    <div class="acciones">
      <button type="button" class="btn-recalcular" data-geo-accion="recalcular">Recalcular</button>
      <button type="button" class="btn-secundario" data-geo-accion="restaurar">Restaurar datos originales</button>
    </div>
    <div class="aviso" id="geo-aviso" role="alert" hidden></div>
    <p class="bloque-subtitulo">Incógnitas a obtener</p>
    <ul class="data-list" id="geo-incognitas"></ul>`;

  recalcularGeometrica();   // se ve resuelto desde el primer instante
}

/* Llama a esta función una sola vez al arrancar (en main.js) */
export function iniciarGeometricas() {
  const vista = $q('#view-geometricas');
  if (!vista.querySelector('#geo-ejercicios')) {
    // El esqueleto se inyecta desde JS: index.html solo necesita la <section> vacía
    vista.innerHTML = `
      <header class="page-head">
        <span class="chip">Tema 3</span>
        <h1>Progresiones geométricas</h1>
      </header>
      <div class="btn-group" id="geo-ejercicios"></div>
      <div class="tabs" id="geo-incisos" hidden></div>
      <p class="muted" id="geo-vacio"></p>
      <div id="geo-contenido" hidden>
        <article class="card prob-card">
          <h2 class="prob-titulo" id="geo-titulo"></h2>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">1</span>Instrucción</h3><div id="geo-b1"></div></section>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">2</span>Datos</h3><div id="geo-b2"></div></section>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">3</span>Procedimiento</h3><div id="geo-b3"></div></section>
          <section class="bloque"><h3 class="bloque-titulo"><span class="bloque-num">4</span>Resultado</h3><div id="geo-b4"></div></section>
        </article>
      </div>`;

    vista.addEventListener('click', e => {
      const sec = e.target.closest('[data-geo-sec]');
      const inc = e.target.closest('[data-geo-inciso]');
      const acc = e.target.closest('[data-geo-accion]');
      if (sec) mostrarGeometrica(sec.dataset.geoSec, 0);                       // al elegir ejercicio abre el inciso a
      else if (inc) mostrarGeometrica(estadoGeo.sec, Number(inc.dataset.geoInciso));
      else if (acc) acc.dataset.geoAccion === 'restaurar' ? restaurarOriginales() : recalcularGeometrica();
    });
    // Tiempo real: recalcula mientras el usuario escribe
    vista.addEventListener('input', e => { if (e.target.matches('[data-campo]')) recalcularGeometrica(); });
    // Enter dentro de cualquier input también recalcula
    vista.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.matches('[data-campo]')) { e.preventDefault(); recalcularGeometrica(); }
    });
  }
  pintarSelectores();
}