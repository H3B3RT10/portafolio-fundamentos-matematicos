import { iniciarPearson } from './pearson.js';
/* =========================================================
   DATOS: temas y ejercicios (cámbialos por los reales)
   ========================================================= */
const TEMAS = [
  { id: 1, icono: '∑', titulo: 'Tema 1', descripcion: 'Descripción breve del tema 1.' },
  { id: 2, icono: '∫', titulo: 'Tema 2', descripcion: 'Descripción breve del tema 2.' },
  { id: 3, icono: 'π', titulo: 'Tema 3', descripcion: 'Descripción breve del tema 3.' },
  { id: 4, icono: 'Δ', titulo: 'Tema 4', descripcion: 'Descripción breve del tema 4.' },
  { id: 5, icono: '≈', titulo: 'Tema 5', descripcion: 'Descripción breve del tema 5.' },
].map(t => ({
  ...t,
  // Ejercicios de ejemplo: 4 por tema. Ajusta la cantidad o los nombres aquí.
  ejercicios: Array.from({ length: 4 }, (_, i) => ({ id: i + 1, titulo: `Ejercicio ${i + 1}` })),
}));

/* =========================================================
   LÓGICA MATEMÁTICA POR EJERCICIO  (AQUÍ VAN LOS CÁLCULOS)
   Clave: "t<tema>-e<ejercicio>". Cada ejercicio define:
     - instrucciones: texto que se muestra en la tarjeta de instrucciones
     - inputs: campos que captura el usuario
     - calcular(valores): recibe { id: número } y devuelve [{ label, valor }]
   Ejemplo (descomenta y adapta):
   ========================================================= */
const LOGICA = {
  // 't1-e1': {
  //   instrucciones: 'Ingresa los datos y calcula el resultado.',
  //   inputs: [
  //     { id: 'a', label: 'Valor de a', placeholder: '0' },
  //     { id: 'b', label: 'Valor de b', placeholder: '0' },
  //   ],
  //   calcular({ a, b }) {
  //     // <<< LÓGICA MATEMÁTICA DEL EJERCICIO >>>
  //     return [{ label: 'a + b', valor: a + b }];
  //   },
  // },
};

/* Configuración por defecto para ejercicios que aún no tienen lógica */
const configPorDefecto = {
  instrucciones: 'Aquí irán las instrucciones del ejercicio: qué se pide, qué datos capturar y cómo interpretar el resultado.',
  inputs: [
    { id: 'dato1', label: 'Dato 1', placeholder: 'Ingresa un valor' },
    { id: 'dato2', label: 'Dato 2', placeholder: 'Ingresa un valor' },
  ],
  calcular(valores) {
    // <<< LÓGICA MATEMÁTICA PENDIENTE: este ejercicio aún no tiene calcular() propio >>>
    return [{ label: 'Estado', valor: 'Sin lógica implementada' }];
  },
};

/* =========================================================
   NAVEGACIÓN ENTRE VISTAS
   ========================================================= */
const $ = s => document.querySelector(s);
const vistas = { dashboard: $('#view-dashboard'), tema: $('#view-tema'), ejercicio: $('#view-ejercicio'), pearson: $('#view-pearson') };
let estado = { vista: 'dashboard', tema: null, ejercicio: null };

function irA(vista, tema = null, ejercicio = null) {
  if (vista === 'tema' && tema === 1) vista = 'pearson';
  estado = { vista, tema, ejercicio };
  render();
  window.scrollTo({ top: 0 });
}

function render() {
  Object.entries(vistas).forEach(([nombre, el]) => (el.hidden = nombre !== estado.vista));
  renderNav();
  renderBreadcrumb();
  if (estado.vista === 'tema') renderTema();
  if (estado.vista === 'ejercicio') renderEjercicio();
}

const temaActual = () => TEMAS.find(t => t.id === estado.tema);

/* ----- Sidebar ----- */
function renderNav() {
  $('#nav-inicio').classList.toggle('active', estado.vista === 'dashboard');
  $('#nav-temas').innerHTML = TEMAS.map(t => `
    <button class="nav-item ${t.id === estado.tema ? 'active' : ''}" data-tema="${t.id}">
      <span class="nav-icon">${t.icono}</span>${t.titulo}
    </button>`).join('');
}

/* ----- Migas de pan ----- */
function renderBreadcrumb() {
  const partes = ['<button data-go="dashboard">Inicio</button>'];
if (estado.tema) {
    const t = temaActual();
    partes.push(estado.vista !== 'ejercicio'
      ? `<span class="current">${t.titulo}</span>`
      : `<button data-tema="${t.id}">${t.titulo}</button>`);
  }
  if (estado.vista === 'ejercicio') partes.push(`<span class="current">Ejercicio ${estado.ejercicio}</span>`);
  $('#breadcrumb').innerHTML = partes.join('<span>/</span>');
}

/* ----- Vista 1: dashboard ----- */
function renderDashboard() {
  $('#stat-temas').textContent = TEMAS.length;
  $('#stat-ejercicios').textContent = TEMAS.reduce((n, t) => n + t.ejercicios.length, 0);
  $('#grid-temas').innerHTML = TEMAS.map(t => `
    <button class="tarjeta" data-tema="${t.id}">
      <span class="tarjeta-icono">${t.icono}</span>
      <h3>${t.titulo}</h3><p>${t.descripcion}</p>
    </button>`).join('');
}

/* ----- Vista 2: ejercicios del tema ----- */
function renderTema() {
  const t = temaActual();
  $('#tema-chip').textContent = `${t.ejercicios.length} ejercicios`;
  $('#tema-titulo').textContent = t.titulo;
  $('#tema-desc').textContent = t.descripcion;
  $('#lista-ejercicios').innerHTML = t.ejercicios.map(e => `
    <button class="tarjeta" data-ej="${e.id}">
      <span class="tarjeta-icono">${t.icono}</span>
      <h3>${e.titulo}</h3><p>Abrir área de trabajo</p>
    </button>`).join('');
}

/* ----- Vista 3: área de trabajo ----- */
function renderEjercicio() {
  const t = temaActual();
  const cfg = LOGICA[`t${estado.tema}-e${estado.ejercicio}`] ?? configPorDefecto;
  $('#ej-chip').textContent = t.titulo;
  $('#ej-titulo').textContent = `Ejercicio ${estado.ejercicio}`;
  $('#ej-instrucciones').textContent = cfg.instrucciones;
  $('#ej-inputs').innerHTML = cfg.inputs.map(i => `
    <div class="field">
      <label for="${i.id}">${i.label}</label>
      <input id="${i.id}" name="${i.id}" type="number" step="any" placeholder="${i.placeholder ?? ''}" />
    </div>`).join('');
  $('#ej-resultado').innerHTML = '<p class="muted">Captura tus datos y presiona Calcular para ver el resultado aquí.</p>';
}

/* ----- Botón Calcular ----- */
$('#ej-form').addEventListener('submit', e => {
  e.preventDefault();
  const cfg = LOGICA[`t${estado.tema}-e${estado.ejercicio}`] ?? configPorDefecto;

  // Lee los inputs como números: { dato1: 5, dato2: 3, ... }
  const valores = {};
  cfg.inputs.forEach(i => (valores[i.id] = parseFloat($(`#${i.id}`).value)));

  // <<< AQUÍ SE EJECUTA LA LÓGICA MATEMÁTICA DEL EJERCICIO ACTIVO >>>
  const resultados = cfg.calcular(valores);

  // Pinta los resultados en la tarjeta
  $('#ej-resultado').innerHTML = resultados
    .map(r => `<div class="dato"><span>${r.label}</span><b>${r.valor}</b></div>`)
    .join('');
});

/* ----- Clics globales (delegación de eventos) ----- */
document.addEventListener('click', e => {
  const go = e.target.closest('[data-go]');
  const tema = e.target.closest('[data-tema]');
  const ej = e.target.closest('[data-ej]');
  if (ej) return irA('ejercicio', estado.tema, Number(ej.dataset.ej));
  if (tema) return irA('tema', Number(tema.dataset.tema));
  if (go) return irA(go.dataset.go);
});

renderDashboard();
iniciarPearson();
render();