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
  elegirEnOrbita(boton.dataset.pais);
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
anillo.style.setProperty('--eleccion', '0deg');
$$('span', anillo).forEach((s) => {
  s.style.transform = 'rotate(calc(var(--a) + var(--giro) + var(--eleccion))) translateY(calc(var(--radio-orbita) * -1)) rotate(calc((var(--a) + var(--giro) + var(--eleccion)) * -1)) translate(-50%, -50%)';
});
// al elegir un país se pinta de rojo y la órbita gira hasta dejarlo arriba, dando una vuelta de más
let eleccion = 0;
function elegirEnOrbita(pais) {
  const i = paises.indexOf(pais);
  if (i < 0) return;
  $$('span', anillo).forEach((s, k) => s.classList.toggle('es-origen', k === i));
  // a partir de la primera elección la órbita deja de girar con el scroll
  if (anillo.giroScroll) { anillo.giroScroll.scrollTrigger?.kill(); anillo.giroScroll.kill(); anillo.giroScroll = null; }
  const giro = parseFloat(anillo.style.getPropertyValue('--giro')) || 0;
  // ángulo que lleva al país a la cima, por el camino más corto (sin vueltas de más)
  let destino = -(i * 45 + giro);
  destino += Math.round((eleccion - destino) / 360) * 360;
  eleccion = destino;
  if (window.gsap && !sinMovimiento) {
    gsap.to(anillo, { '--eleccion': `${destino}deg`, duration: 2, ease: 'sine.inOut' });
  } else {
    anillo.style.setProperty('--eleccion', `${destino}deg`);
  }
}
// tocar un país en la órbita es lo mismo que elegirlo en los botones
anillo.addEventListener('click', (e) => {
  const s = e.target.closest('span');
  if (!s) return;
  $(`[data-pais="${s.textContent}"]`, cajaPaises)?.click();
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
  if (abrir) $('nav a', menu).focus({ preventScroll: true });
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

/* ---------- botones de tinta líquida ---------- */
// con mouse, la tinta entra por donde entra el cursor y sale por donde se va; al tocar, onda y rebote
if (!sinMovimiento) {
  const punto = (b, e) => { const r = b.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top, r]; };
  $$('.boton').forEach((b) => {
    if (conMouse) {
      const tinta = document.createElement('span');
      tinta.className = 'boton__liquido';
      tinta.setAttribute('aria-hidden', 'true');
      b.prepend(tinta);
      b.classList.add('es-liquido');
      const ubicar = (e) => {
        const [x, y, r] = punto(b, e);
        // el círculo tiene que tapar el botón entero desde cualquier punto de entrada
        b.style.setProperty('--d', `${Math.ceil(Math.hypot(r.width, r.height) * 2.3)}px`);
        b.style.setProperty('--x', `${x}px`);
        b.style.setProperty('--y', `${y}px`);
      };
      b.addEventListener('pointerenter', (e) => { ubicar(e); requestAnimationFrame(() => b.classList.add('lleno')); });
      b.addEventListener('pointerleave', (e) => { ubicar(e); b.classList.remove('lleno'); });
      b.addEventListener('focus', () => { if (b.matches(':focus-visible')) b.classList.add('lleno'); });
      b.addEventListener('blur', () => b.classList.remove('lleno'));
    }
    b.addEventListener('pointerdown', (e) => {
      const [x, y, r] = punto(b, e);
      const onda = document.createElement('span');
      onda.className = 'boton__onda';
      onda.setAttribute('aria-hidden', 'true');
      onda.style.cssText = `left:${x}px;top:${y}px;--hasta:${Math.ceil(Math.hypot(r.width, r.height) / 6)}`;
      b.append(onda);
      onda.addEventListener('animationend', () => onda.remove());
      b.classList.remove('rebote');
      void b.offsetWidth;
      b.classList.add('rebote');
    });
    b.addEventListener('animationend', (e) => { if (e.animationName === 'rebote') b.classList.remove('rebote'); });
  });
}

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
      trigger: '[data-lineas]', start: 'top top', end: () => `+=${paneles.length * 115}%`, pin: true, scrub: 1.4, anticipatePin: 1, invalidateOnRefresh: true,
      // al soltarse la sección el índice se va: si no, sube flotando sobre la tapa de Leo
      onLeave: () => gsap.to('[data-indice]', { autoAlpha: 0, duration: .2, ease: 'power2.out' }),
      onEnterBack: () => gsap.to('[data-indice]', { autoAlpha: 1, duration: .25, ease: 'power2.out' }),
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

  /* 5 · leo: una tapa amarilla se borra con un garabato y aparece la sección;
     después el pouch sube y sigue al mouse ---------------------------------- */
  const leo = $('[data-leo]');
  const tapa = $('[data-leo-tapa]');
  const garabato = $('[data-garabato]');
  // el garabato está dibujado en 1600×900: se estira al tamaño real de la tapa
  const ajustarGarabato = () => {
    const r = tapa.getBoundingClientRect();
    garabato.setAttribute('transform', `scale(${r.width / 1600} ${r.height / 900})`);
  };
  leo.classList.add('con-tapa');
  ajustarGarabato();
  addEventListener('resize', ajustarGarabato);
  gsap.set(garabato, { attr: { 'stroke-dasharray': '1 1', 'stroke-dashoffset': 0 } });

  // el pouch hace su coreografía con el scroll en todas las pantallas; en el celu el anclaje es un poco más corto
  const compu = matchMedia('(min-width: 64rem)').matches;
  const pouch = $('[data-pouch]');
  const mouse = $('[data-pouch-mouse]');
  const flotanAtras = $$('[data-flota="atras"]');
  const flotanAdelante = $$('[data-flota="adelante"]');

  // reflejo: la franja de luz corre por el dorado según cuánto está inclinado (scroll + mouse)
  let antes = '';
  gsap.ticker.add(() => {
    const ry = (gsap.getProperty(pouch, 'rotationY') || 0) + (gsap.getProperty(mouse, 'rotationY') || 0);
    const clave = ry.toFixed(1);
    if (clave === antes) return;
    antes = clave;
    pouch.style.setProperty('--brillo', `${(130 - (gsap.utils.clamp(-40, 40, ry) + 40) / 80 * 160).toFixed(1)}%`);
  });
  // en la mano nunca está quieto del todo: un vaivén lento y chico
  gsap.to(mouse, { y: -9, rotation: .8, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  const entradaLeo = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
    .fromTo('.leo__luz', { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, 0)
    .fromTo('.leo__texto > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: 1 }, .1);

  const leoTl = gsap.timeline({
    scrollTrigger: {
      trigger: leo, start: 'top top', end: compu ? '+=300%' : '+=240%', pin: true, scrub: 1, invalidateOnRefresh: true,
      onUpdate: (st) => { if (st.progress > .22 && !entradaLeo.isActive() && entradaLeo.progress() === 0) entradaLeo.play(); },
      onLeaveBack: () => entradaLeo.pause(0),
    },
  })
    .fromTo('[data-tapa-marca]', { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.12, duration: .3, ease: 'none' }, 0)
    // como en un garabato a mano: el trazo se afina y a la vez se va borrando desde donde empezó
    .fromTo(garabato, { attr: { 'stroke-width': 350 } }, { attr: { 'stroke-width': 0 }, duration: 1, ease: 'none' }, .1)
    .fromTo(garabato, { attr: { 'stroke-dashoffset': 0 } }, { attr: { 'stroke-dashoffset': -1 }, duration: 1, ease: 'sine.in' }, .1);

  {
    const vw = (n) => () => innerWidth * n / 100;
    const vh = (n) => () => innerHeight * n / 100;
    leoTl
      // los pouches suben como si alguien los levantara de la mesa: se inclinan hacia un lado,
      // se acercan un poco a la cámara y se acomodan en una pose de tres cuartos (nunca de perfil)
      .fromTo(pouch, { x: vw(-10), y: vh(70), rotationY: -38, rotationX: 22, rotation: -12, scale: 1.18 },
        { x: vw(-2), y: vh(-2), rotationY: 20, rotationX: -8, rotation: 3, scale: 1.06, duration: 1.4, ease: 'power2.out' }, .6)
      .to(pouch, { x: 0, y: 0, rotationY: -8, rotationX: 4, rotation: -1.5, scale: 1, duration: 1.2, ease: 'sine.inOut' }, 2)
      // paquetitos que suben y quedan flotando a distintas profundidades
      .fromTo(flotanAtras, { y: vh(55), z: (i) => [-140, -60, -100, -40][i] || -80, rotation: (i) => [-30, 24, -18, 28][i] || 0, rotationY: (i) => [-35, 30, -25, 35][i] || 0, opacity: 0 },
        { y: 0, rotation: (i) => [-10, 14, -6, 12][i] || 0, rotationY: (i) => [-14, 16, -10, 14][i] || 0, opacity: 1, duration: 1.4, stagger: .15, ease: 'power2.out' }, .8)
      .to(flotanAtras, { y: vh(-4), rotation: '+=6', rotationY: '+=10', duration: 1.1, ease: 'none' }, 2.3)
      // uno grande y desenfocado pasa por delante, cerca de la cámara
      .fromTo(flotanAdelante, { y: vh(90), z: 160, rotation: -20, rotationY: -25 },
        { y: vh(-120), rotation: 25, rotationY: 30, duration: 2.2, stagger: .45, ease: 'none' }, .7);
  }

  if (conMouse) {
    const giroY = gsap.quickTo(mouse, 'rotationY', { duration: .6, ease: 'power3.out' });
    const giroX = gsap.quickTo(mouse, 'rotationX', { duration: .6, ease: 'power3.out' });
    // se escucha en toda la sección: la vitrina deja pasar los clics para que se puedan tocar los de atrás
    const vitrina = $('[data-vitrina]');
    leo.addEventListener('pointermove', (e) => {
      const r = vitrina.getBoundingClientRect();
      giroY(gsap.utils.clamp(-11, 11, ((e.clientX - r.left) / r.width - .5) * 22));
      giroX(gsap.utils.clamp(-6, 6, ((e.clientY - r.top) / r.height - .5) * -12));
    });
    leo.addEventListener('pointerleave', () => { giroY(0); giroX(0); });
  }

  /* 7 · los países giran alrededor del alfajor ------------------------------ */
  // se guarda para frenarlo cuando alguien elige un país (si no, el elegido se iría de la cima al bajar)
  anillo.giroScroll = gsap.fromTo(anillo, { '--giro': '-60deg' }, {
    '--giro': '150deg', ease: 'none',
    scrollTrigger: { trigger: '[data-mundo]', start: 'top bottom', end: 'bottom top', scrub: .8 },
  });
  gsap.from('.orbita__centro', { scale: .6, rotation: -20, opacity: 0, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: '[data-mundo]', start: 'top 70%' } });

  /* 8 · regalos: la sección queda anclada. Sobre el crema del mundo aparece un muro de palabras tenue y en
     diagonal; gira hasta quedar vertical mientras el fondo se vuelve rojo y las filas corren en sentidos opuestos.
     Se acerca a la cámara y se va, vuelve muy tenue de fondo, y recién ahí pasan las tres piezas (regalar, empresas, franquicias),
     una por una, a medida que se baja -------------------------------------------------------------- */
  const regalos = $('[data-regalos]');
  const contenidoRegalos = $('[data-regalos-contenido]');
  const muro = $('[data-paso-muro]');
  const filasMuro = $$('p', muro);
  regalos.classList.add('con-escena');
  // si el contenido no entra en la pantalla (celus bajos), se achica lo justo para que entre
  const encajarRegalos = () => {
    contenidoRegalos.style.scale = '';
    const libre = innerHeight - $('.cabecera').offsetHeight - 32;
    const alto = contenidoRegalos.offsetHeight;
    if (alto > libre) contenidoRegalos.style.scale = (libre / alto).toFixed(3);
  };
  encajarRegalos();
  ScrollTrigger.addEventListener('refreshInit', encajarRegalos);

  // mientras la sección sube, el muro ya se asoma tenue: así no hay una pantalla crema vacía entre el mundo y los regalos
  gsap.fromTo(muro, { opacity: 0 }, { opacity: .3, ease: 'none', immediateRender: false, scrollTrigger: { trigger: regalos, start: 'top 85%', end: 'top top', scrub: true } });

  const escenaRegalos = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: regalos, start: 'top top', end: '+=300%', pin: true, scrub: 1, invalidateOnRefresh: true },
  })
    // 1 · las letras
    // el muro no existe hasta que la sección queda anclada: así no se ve el borde cortado al entrar
    .fromTo(muro, { xPercent: -50, yPercent: -50, rotation: -26, scale: .62 }, { rotation: -90, scale: 1.15, duration: 1, ease: 'power2.inOut' }, 0)
    .fromTo(muro, { opacity: .3 }, { opacity: 1, duration: .5, ease: 'power1.in' }, 0)
    .fromTo(regalos, { backgroundColor: '#FFF6DE' }, { backgroundColor: '#DA2A1C', duration: .6, ease: 'power1.inOut' }, .15)
    .fromTo(filasMuro, { xPercent: (i) => (i % 2 ? -12 : 12) }, { xPercent: (i) => (i % 2 ? 22 : -22), duration: 3.6 }, 0)
    .to(muro, { scale: 4.2, opacity: 0, duration: .6, ease: 'power2.in' }, 1)
    // 2 · el muro vuelve, chico y muy tenue, como fondo de los regalos
    .set(muro, { scale: .9, rotation: -90 }, 1.6)
    .to(muro, { opacity: .1, duration: .4 }, 1.6)
    // 3 · el índice aparece
    .fromTo('[data-regalos-indice]', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: 'power2.out' }, 1.55);
  // 4 · las piezas pasan de a una: el producto entra girando desde la derecha y el título sube desde abajo;
  //     al llegar la siguiente, la anterior se va hacia la izquierda y hacia arriba
  const piezas = $$('[data-regalo]');
  const llegadas = piezas.map((_, i) => 1.7 + i * 1.15);
  piezas.forEach((pieza, i) => {
    const t = llegadas[i];
    const foto = $('.regalo__foto', pieza);
    const titulo = $('.regalo__titulo', pieza);
    const resto = $$('.regalo__bajada, .regalo__ir', pieza);
    escenaRegalos
      .fromTo(pieza, { autoAlpha: 0 }, { autoAlpha: 1, duration: .01 }, t)
      .fromTo(foto, { xPercent: 45, rotation: 10, opacity: 0 }, { xPercent: 0, rotation: 0, opacity: 1, duration: .55, ease: 'power3.out' }, t)
      .fromTo(titulo, { yPercent: 35, clipPath: 'inset(0% 0% 100% 0%)' }, { yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: .5, ease: 'power3.out' }, t + .05)
      .fromTo(resto, { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: .06, duration: .35, ease: 'power2.out' }, t + .25);
    if (i === piezas.length - 1) return;
    const sale = llegadas[i + 1] - .3;
    escenaRegalos
      .to(foto, { xPercent: -40, rotation: -8, opacity: 0, duration: .3, ease: 'power2.in' }, sale)
      .to(titulo, { yPercent: -25, clipPath: 'inset(0% 0% 0% 0%)', opacity: 0, duration: .3, ease: 'power2.in' }, sale)
      .to(resto, { opacity: 0, duration: .2 }, sale)
      .to(pieza, { autoAlpha: 0, duration: .01 }, sale + .3);
  });
  escenaRegalos.to({}, { duration: .5 });

  // el índice marca la pieza a la vista y lleva directo a cada una
  const botonesRegalos = $$('[data-ir-regalo]');
  const marcarRegalo = () => {
    const ahora = escenaRegalos.time();
    const activa = llegadas.reduce((a, t, i) => (ahora >= t - .1 ? i : a), 0);
    botonesRegalos.forEach((b, i) => b.setAttribute('aria-current', String(i === activa)));
  };
  escenaRegalos.eventCallback('onUpdate', marcarRegalo);
  marcarRegalo();
  botonesRegalos.forEach((b, i) => b.addEventListener('click', () => {
    const st = escenaRegalos.scrollTrigger;
    irA(st.start + (st.end - st.start) * ((llegadas[i] + .6) / escenaRegalos.duration()));
  }));

  /* pie: la marca sube desde abajo, como al sacarla de la caja */
  gsap.fromTo('[data-pie-marca] img', { yPercent: 100 }, { yPercent: 0, ease: 'power3.out', duration: 1.2, scrollTrigger: { trigger: '[data-pie-marca]', start: 'top 95%' } });

  addEventListener('load', () => ScrollTrigger.refresh());
  window.havanna = { aScroll, caja, lineas, lenis };
} else {
  cajaAbierta = true;
  marcarCabecera();
  $$('[data-ir-panel]').forEach((b) => b.addEventListener('click', () => $$('[data-panel]')[b.dataset.irPanel].scrollIntoView()));
}

