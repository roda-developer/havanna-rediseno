// Havanna · rediseño conceptual de Roda (v3)

// Países y zonas tal como figuran en havanna.com.ar/nuestros-locales
const paises = ['Argentina', 'Bolivia', 'Brasil', 'Chile', 'España', 'Estados Unidos', 'Paraguay', 'Perú'];
const zonasArgentina = [
  'Capital Federal', 'Gran Buenos Aires', 'Buenos Aires', 'Costa Atlántica', 'Córdoba', 'Santa Fe', 'Mendoza',
  'Neuquén', 'Río Negro', 'Chubut', 'Entre Ríos', 'Corrientes', 'Misiones', 'Chaco', 'Formosa', 'Salta',
  'Jujuy', 'Tucumán', 'San Juan', 'San Luis', 'La Pampa',
];
const ZONAS_VISIBLES = 8;
const pin = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const conMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- buscador de cafés ---------- */

const mapa = (lugar) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Havanna café ${lugar}`)}`;
const cajaPaises = $('[data-paises]');
const cajaZonas = $('[data-zonas]');
const pasoZona = $('[data-paso-zona]');
const masZonas = $('[data-mas-zonas]');

cajaPaises.innerHTML = paises.map((p, i) => `<button type="button" aria-pressed="${i === 0}" data-pais="${p}">${p}</button>`).join('');

function mostrarZonas(pais) {
  const esArgentina = pais === 'Argentina';
  const zonas = esArgentina ? zonasArgentina : [pais];
  pasoZona.textContent = esArgentina ? 'Zona' : 'Ver en el mapa';
  // en el celu 21 zonas son una pared: se muestran las primeras y el resto a pedido
  cajaZonas.innerHTML = zonas.map((z, i) => {
    const lugar = esArgentina ? `${z === 'Capital Federal' ? 'Ciudad de Buenos Aires' : z}, Argentina` : z;
    return `<a href="${mapa(lugar)}" target="_blank" rel="noopener"${i >= ZONAS_VISIBLES ? ' hidden' : ''}>${pin}${z}</a>`;
  }).join('');
  masZonas.hidden = zonas.length <= ZONAS_VISIBLES;
  if (!sinMovimiento && window.gsap) gsap.from($$('a:not([hidden])', cajaZonas), { y: 10, opacity: 0, duration: .35, stagger: .02, ease: 'power2.out' });
}
cajaPaises.addEventListener('click', (e) => {
  const boton = e.target.closest('[data-pais]');
  if (!boton) return;
  $$('[data-pais]', cajaPaises).forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
  mostrarZonas(boton.dataset.pais);
});
masZonas.addEventListener('click', () => {
  const ocultas = $$('a[hidden]', cajaZonas);
  ocultas.forEach((a) => { a.hidden = false; });
  masZonas.hidden = true;
  ocultas[0]?.focus();
  if (!sinMovimiento && window.gsap) gsap.from(ocultas, { y: 10, opacity: 0, duration: .35, stagger: .02, ease: 'power2.out', onComplete: () => window.ScrollTrigger?.refresh() });
});
mostrarZonas('Argentina');

/* ---------- órbita de países ---------- */

const anillo = $('[data-anillo]');
anillo.innerHTML = paises.map((p, i) => `<span class="${i === 0 ? 'es-origen' : ''}" style="--a:${i * 45}deg">${p}</span>`).join('');
anillo.style.setProperty('--giro', '0deg');
$$('span', anillo).forEach((s) => {
  s.style.transform = 'rotate(calc(var(--a) + var(--giro))) translateY(calc(var(--radio-orbita) * -1)) rotate(calc((var(--a) + var(--giro)) * -1)) translate(-50%, -50%)';
});

/* ---------- cabecera y menú ---------- */

const cabecera = $('[data-cabecera]');
const botonMenu = $('[data-abrir-menu]');
const menu = $('[data-menu]');
let lenis;

function abrirMenu(abrir) {
  botonMenu.setAttribute('aria-expanded', String(abrir));
  $('.sr', botonMenu).textContent = abrir ? 'Cerrar menú' : 'Abrir menú';
  menu.hidden = !abrir;
  document.body.style.overflow = abrir ? 'hidden' : '';
  if (lenis) abrir ? lenis.stop() : lenis.start();
  if (abrir && !sinMovimiento && window.gsap) gsap.from($$('nav a', menu), { yPercent: 60, opacity: 0, duration: .5, stagger: .06, ease: 'power3.out' });
}
botonMenu.addEventListener('click', () => abrirMenu(menu.hidden));
$$('[data-cerrar-menu]', menu).forEach((a) => a.addEventListener('click', () => abrirMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { abrirMenu(false); botonMenu.focus(); } });

let cajaAbierta = sinMovimiento;
const marcarCabecera = () => {
  cabecera.classList.toggle('con-fondo', cajaAbierta && scrollY > 40);
  cabecera.classList.toggle('en-tapa', !cajaAbierta);
};
addEventListener('scroll', marcarCabecera, { passive: true });
marcarCabecera();

/* ---------- movimiento ---------- */
// Dentro de timelines con invalidateOnRefresh se usa fromTo, nunca from:
// un from toma su propio inicio como final cuando se recalcula y queda quieto.

if (!sinMovimiento && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // posición de scroll de una etiqueta de un timeline anclado (labelToScroll devolvía 0 con scrub)
  const aScroll = (tl, etiqueta) => { const st = tl.scrollTrigger; return st.start + (st.end - st.start) * (tl.labels[etiqueta] / tl.duration()); };
  const irA = (destino) => (lenis ? lenis.scrollTo(destino) : scrollTo({ top: typeof destino === 'number' ? destino : destino.offsetTop, behavior: 'smooth' }));
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const destino = $(a.getAttribute('href'));
    if (!destino) return;
    e.preventDefault();
    if (lenis) lenis.start();
    irA(a.getAttribute('href') === '#inicio' ? 0 : destino);
  }));

  /* 1 · la caja: al llegar, el producto se apoya en el frente ----------------- */
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('[data-frente-logo]', { yPercent: 30, opacity: 0, duration: 1 }, .1)
    .from('[data-frente-lema]', { y: 16, opacity: 0, duration: .8 }, .35)
    .from('[data-frente-alfajor]', { y: 90, rotation: -8, opacity: 0, duration: 1.2, ease: 'back.out(1.3)' }, .3)
    .from('[data-frente-pie]', { y: 20, opacity: 0, duration: .8 }, .6);

  /* al bajar, la tapa se levanta; adentro caen los alfajores y se apilan, y uno partido se apoya */
  const alfajores = $$('[data-alfajor]');
  const notas = $$('[data-nota]');
  const voladores = $$('[data-voladores] img');
  // cada producto tiene su lugar libre de texto; en el celu (--xm, --ym) van a las esquinas
  const lugar = (img, eje) => {
    const movil = innerWidth < 1024 && img.style.getPropertyValue(`--${eje}m`);
    return parseFloat(movil || img.style.getPropertyValue(`--${eje}`)) / 100;
  };

  const caja = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '[data-caja]', start: 'top top', end: '+=240%', pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: () => { const abierta = caja.time() > .7; if (abierta !== cajaAbierta) { cajaAbierta = abierta; marcarCabecera(); } },
    },
  });
  caja
    // la tapa gira hacia arriba sobre su borde superior y se oscurece al darse vuelta
    .fromTo('[data-frente]', { rotationX: 0, '--sombra-tapa': 0 }, { rotationX: -96, '--sombra-tapa': .55, duration: 1, ease: 'power2.in' }, 0)
    .set('[data-frente]', { autoAlpha: 0 }, 1)
    // el borde amarillo de arriba de la bisagra se va recién con la tapa abierta: no asoma el fondo crema
    .fromTo('.caja__escena', { '--tira': 1 }, { '--tira': 0, duration: .25 }, .9)
    .fromTo('[data-adentro-titulo] span', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .1, duration: .5, ease: 'power2.out' }, .7)
    .addLabel('abierta', 1.1);
  // los alfajores caen uno por uno y rebotan al apoyarse
  alfajores.forEach((al, i) => {
    caja.fromTo(al, { y: () => -innerHeight, opacity: 0 }, { y: 0, opacity: 1, duration: .55, ease: 'bounce.out' }, 1.1 + i * .3);
  });
  caja
    // el partido entra desde el costado y se apoya contra la pila
    .fromTo('[data-partido]', { x: () => innerWidth * .4, rotation: 28, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: .6, ease: 'back.out(1.4)' }, 2.1)
    .fromTo(notas, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, stagger: .12, duration: .3, ease: 'back.out(2)' }, 2.6)
    .fromTo('[data-leyenda] li', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: .1, duration: .3 }, 2.7);
  voladores.forEach((img, i) => {
    const g = parseFloat(img.style.getPropertyValue('--g'));
    caja.fromTo(img,
      { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: .3, rotation: 0, opacity: 0 },
      { x: () => innerWidth * lugar(img, 'x'), y: () => innerHeight * lugar(img, 'y'), scale: 1, rotation: g, opacity: 1, duration: .8, ease: 'power3.out' },
      3 + i * .08);
  });
  caja.to({}, { duration: .6 });

  /* cinta: corre sola y acelera con la velocidad del scroll */
  const cinta = gsap.to('[data-cinta]', { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });
  let sentido = 1;
  ScrollTrigger.create({
    trigger: '.cinta', start: 'top bottom', end: 'bottom top',
    onUpdate: (st) => {
      const v = st.getVelocity();
      if (Math.abs(v) > 10) sentido = v > 0 ? 1 : -1;
      gsap.to(cinta, { timeScale: sentido * (1 + Math.min(Math.abs(v) / 300, 6)), duration: .25, overwrite: true });
      gsap.to(cinta, { timeScale: sentido, duration: 1.2, delay: .25, ease: 'power2.out' });
    },
  });

  /* 4 · cada caja se abre a pantalla completa ----------------------------- */
  const paneles = $$('[data-panel]');
  gsap.fromTo(paneles, { yPercent: 8, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .08, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '[data-lineas]', start: 'top 75%' } });

  const botonesIndice = $$('[data-indice] [data-ir-panel]');
  const inicios = paneles.map((_, i) => .5 + i * 1.4);
  const lineas = gsap.timeline({
    // el índice marca la línea que está a la vista; va en el timeline (no en el scroll) porque
    // con scrub la animación llega después que el scroll y el índice quedaba un panel atrás
    onUpdate: () => {
      const ahora = lineas.time();
      const activa = inicios.reduce((a, t, i) => (ahora >= t + .5 ? i : a), -1);
      botonesIndice.forEach((b, i) => {
        const era = b.getAttribute('aria-current') === 'true';
        if (era === (i === activa)) return;
        b.setAttribute('aria-current', String(i === activa));
        // en el celu el índice se desliza: la línea activa queda siempre a la vista
        if (i === activa) b.parentElement.scrollTo({ left: b.offsetLeft - (b.parentElement.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' });
      });
    },
    scrollTrigger: {
      trigger: '[data-lineas]', start: 'top top', end: () => `+=${paneles.length * 140}%`, pin: true, scrub: 1.4, anticipatePin: 1, invalidateOnRefresh: true,
    },
  });
  paneles.forEach((panel, i) => {
    const t = .5 + i * 1.4;
    const contenido = $('.panel__contenido', panel);
    // a partir del segundo, cada caja sube desde abajo y tapa a la anterior
    if (i > 0) lineas.set(panel, { '--t': () => `${panel.offsetHeight}px`, '--r': '0%', '--b': '0px', '--l': '0%', '--radio': '0rem' }, t - .01);
    lineas
      .set(panel, { zIndex: 10 + i }, t - .01)
      .to(panel, { '--t': '0px', '--r': '0%', '--b': '0px', '--l': '0%', '--radio': '0rem', duration: 1, ease: 'power3.inOut' }, t)
      .to($('.panel__tarjeta', panel), { opacity: 0, duration: .25 }, t + .45)
      .fromTo(contenido, { autoAlpha: 0 }, { autoAlpha: 1, duration: .25 }, t + .6)
      .fromTo($('.panel__nombre', panel), { yPercent: 40 }, { yPercent: 0, duration: .5, ease: 'power3.out' }, t + .6)
      .fromTo($$('.panel__fotos img', panel), { y: 90, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .5, ease: 'back.out(1.5)' }, t + .7);
    if (i === 0) lineas.to('[data-lineas-titulo]', { opacity: 0, duration: .3 }, t);
    lineas.addLabel(`linea${i}`, t + 1.1);
  });
  lineas.to({}, { duration: .5 });

  // el índice y las tarjetas llevan directo a cada línea, sin pasar por las anteriores
  $$('[data-ir-panel]').forEach((b) => b.addEventListener('click', () => {
    irA(aScroll(lineas, `linea${b.dataset.irPanel}`));
  }));

  /* 5 · leo: el pouch sube y sigue al mouse ------------------------------ */
  gsap.fromTo('[data-pouch]', { y: 140, rotationY: -35, rotation: -6, opacity: 0 }, {
    y: 0, rotationY: 0, rotation: 0, opacity: 1, transformPerspective: 900, ease: 'power3.out', duration: 1.4,
    scrollTrigger: { trigger: '[data-leo]', start: 'top 70%' },
  });
  gsap.fromTo('.leo__luz', { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '[data-leo]', start: 'top 70%' } });
  gsap.from('.leo__texto > *', { y: 40, opacity: 0, stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '[data-leo]', start: 'top 70%' } });
  if (conMouse) {
    const giroY = gsap.quickTo('[data-pouch]', 'rotationY', { duration: .6, ease: 'power3.out' });
    const giroX = gsap.quickTo('[data-pouch]', 'rotationX', { duration: .6, ease: 'power3.out' });
    $('[data-vitrina]').addEventListener('pointermove', (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      giroY(((e.clientX - r.left) / r.width - .5) * 24);
      giroX(((e.clientY - r.top) / r.height - .5) * -18);
    });
    $('[data-vitrina]').addEventListener('pointerleave', () => { giroY(0); giroX(0); });
  }

  /* 6 · la receta: la ficha se apoya y cada renglón se tilda al pasar --------- */
  gsap.fromTo('[data-ficha]', { y: 120, rotation: 4, opacity: 0 }, {
    y: 0, rotation: -1.2, opacity: 1, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '[data-receta]', start: 'top 70%' },
  });
  $$('[data-paso]').forEach((paso) => {
    gsap.timeline({ scrollTrigger: { trigger: paso, start: 'top 82%' } })
      .fromTo(paso.querySelector('.receta__cant'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power3.out' })
      .fromTo(paso.querySelector('.receta__txt'), { opacity: 0 }, { opacity: 1, duration: .5 }, '<.1')
      .fromTo(paso.querySelector('.receta__tilde'), { '--trazo': 60 }, { '--trazo': 0, duration: .45, ease: 'power2.inOut' }, '>-.1');
  });

  /* 7 · los países giran alrededor del alfajor ------------------------------ */
  gsap.fromTo(anillo, { '--giro': '-60deg' }, {
    '--giro': '150deg', ease: 'none',
    scrollTrigger: { trigger: '[data-mundo]', start: 'top bottom', end: 'bottom top', scrub: .8 },
  });
  gsap.from('.orbita__centro', { scale: .6, rotation: -20, opacity: 0, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: '[data-mundo]', start: 'top 70%' } });

  /* 8 · regalos: las etiquetas caen colgadas y se acomodan ------------------ */
  gsap.fromTo('[data-etiqueta]', { y: -60, opacity: 0, rotation: (i) => (i % 2 ? 10 : -10) }, {
    y: 0, opacity: 1, rotation: (i, el) => (innerWidth >= 896 ? parseFloat(el.style.getPropertyValue('--g')) : parseFloat(el.style.getPropertyValue('--g')) * .4),
    duration: 1.1, stagger: .12, ease: 'elastic.out(1, .55)', clearProps: 'transform',
    scrollTrigger: { trigger: '[data-regalos]', start: 'top 70%' },
  });

  /* pie: la marca sube desde abajo, como al sacarla de la caja */
  gsap.fromTo('[data-pie-marca] img', { yPercent: 100 }, { yPercent: 0, ease: 'power3.out', duration: 1.2, scrollTrigger: { trigger: '[data-pie-marca]', start: 'top 95%' } });

  addEventListener('load', () => ScrollTrigger.refresh());
  window.havanna = { aScroll, caja, lineas };
} else {
  cajaAbierta = true;
  marcarCabecera();
  $$('[data-ir-panel]').forEach((b) => b.addEventListener('click', () => $$('[data-panel]')[b.dataset.irPanel].scrollIntoView()));
}
