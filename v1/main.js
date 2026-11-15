// Havanna · rediseño conceptual de Roda

const CDN = 'https://acdn-us.mitiendanube.com/stores/006/675/094/products/';
const TIENDA = 'https://www.tienda.havanna.com.ar/productos/';

// Productos y precios reales de tienda.havanna.com.ar (octubre 2026)
const productos = [
  { tipo: 'alfajores', nombre: 'Mixtos clásicos', detalle: '12 unidades', precio: 27000, slug: 'alfajores-mixtos-x-12-uds', foto: 'cod-1-alfajores-mixtos-x12-a80efe01db8147526417816311413214' },
  { tipo: 'alfajores', nombre: 'Mar del Plata', detalle: '8 unidades', precio: 33000, slug: 'alfajores-mar-del-plata-x-8un', foto: '18_alfajoresmdp8-122d8f56e5686fa34c17580317435753' },
  { tipo: 'alfajores', nombre: '70% cacao puro', detalle: '9 unidades', precio: 35000, slug: 'alfajores-70-cacao-puro-x-9-uds', foto: 'cod-25-alfajores-70-6c41e5d0e95fa0533917845996870064' },
  { tipo: 'alfajores', nombre: 'Súper dulce de leche', detalle: '9 unidades', precio: 36000, slug: 'alfajores-super-dulce-de-leche-x-9uds', foto: '19calfajoressiddl9-935151fe3f29cf238c17593318004901' },
  { tipo: 'havannets', nombre: 'Havannets de chocolate', detalle: '12 unidades', precio: 24000, slug: 'havannets-x-12-uds', foto: 'cod-21-2x1-9321e257f5fb43434317925115559169' },
  { tipo: 'alfajores', nombre: 'Dubái', detalle: '4 unidades', precio: 23500, slug: 'alfajores-dubai-x4un', foto: '30_alfajoresdubai4-f6c61a4bc1d71c449917580351075093' },
  { tipo: 'chocolates', nombre: 'Coronitas 70% cacao', detalle: '10 unidades', precio: 23000, slug: 'coronitas-70-cacao-puro-x-10-uds', foto: '34_coronitas70cacao10u-33a9f4d86846be8dc417593311638077' },
  { tipo: 'chocolates', nombre: 'Tableta 70% cacao', detalle: '80 gramos', precio: 12000, slug: 'tabletas-de-chocolate-70-cacao-x-80g', foto: '22tabletachocolate70cacao-f9c6604e566265dc9617580314208147' },
  { tipo: 'galletitas', nombre: 'Galletitas de limón', detalle: '12 unidades', precio: 17000, slug: 'galletitas-de-limon-x-12-uds', foto: '10_galletitaslimon12-e7e98e5f070cead37a17580311196753' },
];

// Países y zonas tal como figuran en havanna.com.ar/nuestros-locales
const paises = ['Argentina', 'Bolivia', 'Brasil', 'Chile', 'España', 'Estados Unidos', 'Paraguay', 'Perú'];
const zonasArgentina = [
  'Capital Federal', 'Gran Buenos Aires', 'Buenos Aires', 'Costa Atlántica', 'Córdoba', 'Santa Fe', 'Mendoza',
  'Neuquén', 'Río Negro', 'Chubut', 'Entre Ríos', 'Corrientes', 'Misiones', 'Chaco', 'Formosa', 'Salta',
  'Jujuy', 'Tucumán', 'San Juan', 'San Luis', 'La Pampa',
];

const pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const icono = {
  flecha: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  pin: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
};
const etiquetaTipo = { alfajores: 'Alfajores', havannets: 'Havannets', chocolates: 'Chocolates', galletitas: 'Galletitas' };

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- productos ---------- */

const lista = $('[data-lista]');
lista.innerHTML = productos.map((p) => `
  <li class="producto" data-tipo="${p.tipo}">
    <div class="producto__foto">
      <img src="${CDN}${p.foto}-1024-1024.webp" alt="Caja de ${p.nombre}, ${p.detalle}" width="1024" height="1024" loading="lazy">
    </div>
    <div class="producto__datos">
      <p class="producto__tipo">${etiquetaTipo[p.tipo]} · ${p.detalle}</p>
      <h3 class="producto__nombre">${p.nombre}</h3>
      <div class="producto__pie">
        <p class="precio">${pesos.format(p.precio)}</p>
        <a class="producto__comprar" href="${TIENDA}${p.slug}/" aria-label="Comprar ${p.nombre}">${icono.flecha}</a>
      </div>
    </div>
  </li>`).join('');

const tira = $('[data-tira]');
const flechas = $$('[data-mover]');

function actualizarFlechas() {
  const fin = tira.scrollWidth - tira.clientWidth - 4;
  flechas[0].disabled = tira.scrollLeft <= 4;
  flechas[1].disabled = tira.scrollLeft >= fin;
}
flechas.forEach((b) => b.addEventListener('click', () => {
  const paso = ($('.producto:not([hidden])', tira)?.offsetWidth || 300) + 14;
  tira.scrollBy({ left: paso * Number(b.dataset.mover), behavior: sinMovimiento ? 'auto' : 'smooth' });
}));
tira.addEventListener('scroll', actualizarFlechas, { passive: true });
addEventListener('resize', actualizarFlechas);
actualizarFlechas();

$$('[data-filtro]').forEach((boton) => boton.addEventListener('click', () => {
  const filtro = boton.dataset.filtro;
  $$('[data-filtro]').forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
  const tarjetas = $$('.producto', lista);
  tarjetas.forEach((t) => { t.hidden = filtro !== 'todo' && t.dataset.tipo !== filtro; });
  tira.scrollTo({ left: 0 });
  actualizarFlechas();
  if (!sinMovimiento && window.gsap) {
    gsap.fromTo(tarjetas.filter((t) => !t.hidden), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .05, ease: 'power3.out' });
  }
}));

/* ---------- buscador de cafés ---------- */

const mapa = (lugar) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Havanna café ${lugar}`)}`;
const cajaPaises = $('[data-paises]');
const cajaZonas = $('[data-zonas]');
const pasoZona = $('[data-paso-zona]');

cajaPaises.innerHTML = paises.map((p, i) => `<button type="button" aria-pressed="${i === 0}" data-pais="${p}">${p}</button>`).join('');

function mostrarZonas(pais) {
  const zonas = pais === 'Argentina' ? zonasArgentina : [pais];
  pasoZona.textContent = pais === 'Argentina' ? 'Zona' : 'Ver en el mapa';
  cajaZonas.innerHTML = zonas.map((z) => {
    const lugar = pais === 'Argentina' ? `${z === 'Capital Federal' ? 'Ciudad de Buenos Aires' : z}, Argentina` : z;
    return `<a href="${mapa(lugar)}" target="_blank" rel="noopener">${icono.pin}${z}</a>`;
  }).join('');
  if (!sinMovimiento && window.gsap) gsap.from($$('a', cajaZonas), { y: 10, opacity: 0, duration: .35, stagger: .015, ease: 'power2.out' });
}
cajaPaises.addEventListener('click', (e) => {
  const boton = e.target.closest('[data-pais]');
  if (!boton) return;
  $$('[data-pais]', cajaPaises).forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
  mostrarZonas(boton.dataset.pais);
});
mostrarZonas('Argentina');

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
  if (abrir && !sinMovimiento && window.gsap) {
    gsap.from($$('nav a', menu), { yPercent: 60, opacity: 0, duration: .5, stagger: .06, ease: 'power3.out' });
  }
}
botonMenu.addEventListener('click', () => abrirMenu(menu.hidden));
$$('[data-cerrar-menu]', menu).forEach((a) => a.addEventListener('click', () => abrirMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { abrirMenu(false); botonMenu.focus(); } });

const marcarCabecera = () => cabecera.classList.toggle('con-fondo', scrollY > 40);
addEventListener('scroll', marcarCabecera, { passive: true });
marcarCabecera();

/* ---------- movimiento ---------- */

if (!sinMovimiento && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const destino = $(a.getAttribute('href'));
      if (!destino) return;
      e.preventDefault();
      lenis.start();
      lenis.scrollTo(destino, { offset: a.getAttribute('href') === '#inicio' ? 0 : -60 });
    }));
  }

  // portada: el título sube línea por línea y el alfajor se apoya en la mesa
  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro
    .from('.portada__titulo .linea > span', { yPercent: 110, duration: 1.1, stagger: .09 })
    .from('.portada__alfajor', { y: 60, scale: .92, opacity: 0, duration: 1.3 }, '<.1')
    .from('.portada .volanta, .portada__bajada, .portada__acciones', { y: 18, opacity: 0, duration: .8, stagger: .08 }, '<.3')
    .from('.portada__sello', { scale: .6, opacity: 0, duration: .9, ease: 'back.out(1.6)' }, '<.2');

  gsap.to('[data-parallax]', {
    yPercent: -10, rotate: -3, ease: 'none',
    scrollTrigger: { trigger: '.portada', start: 'top top', end: 'bottom top', scrub: true },
  });

  // el corte: punto, línea y texto, en ese orden, como quien señala
  const etiquetas = $$('.corte__etiqueta');
  gsap.set(etiquetas, { '--punto': 0, '--trazo': 0, '--texto-op': 0 });
  const corte = gsap.timeline({ scrollTrigger: { trigger: '[data-corte]', start: 'top 70%' } });
  corte.from('.corte__figura img', { scale: .9, opacity: 0, duration: 1, ease: 'power3.out' });
  etiquetas.forEach((et, i) => {
    corte
      .to(et, { '--punto': 1, duration: .35, ease: 'back.out(3)' }, .5 + i * .3)
      .to(et, { '--trazo': 1, duration: .45, ease: 'power2.out' }, '>-.1')
      .to(et, { '--texto-op': 1, duration: .3 }, '>-.15');
  });

  // títulos de sección
  $$('.titulo, .leo__titulo').forEach((t) => {
    gsap.from(t, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 85%' } });
  });

  gsap.fromTo('.producto', { x: 60, opacity: 0 }, {
    x: 0, opacity: 1, duration: .9, stagger: .07, ease: 'power3.out',
    scrollTrigger: { trigger: '.tira', start: 'top 80%' },
  });

  gsap.from('.leo__vitrina', {
    y: 80, opacity: 0, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.leo', start: 'top 70%' },
  });

  // historia: el lema entra línea por línea
  gsap.from('.historia__lema .linea > span', {
    yPercent: 110, duration: 1.1, stagger: .1, ease: 'power4.out',
    scrollTrigger: { trigger: '.historia__lema', start: 'top 75%' },
  });

  // en compu los capítulos se recorren de costado, anclados; en el celu se deslizan con el dedo
  ScrollTrigger.matchMedia({
    '(min-width: 64rem)': () => {
      const pista = $('[data-pista]');
      const distancia = () => Math.max(0, pista.scrollWidth - innerWidth);
      gsap.to(pista, {
        x: () => -distancia(), ease: 'none',
        scrollTrigger: { trigger: '[data-capitulos]', start: 'center center', end: () => `+=${distancia()}`, pin: '.historia', pinSpacing: true, scrub: .6, invalidateOnRefresh: true },
      });
    },
  });

  gsap.from('.capitulo', {
    y: 40, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out',
    scrollTrigger: { trigger: '.capitulos', start: 'top 85%' },
  });

  gsap.from('.regalos__lista li', {
    x: -40, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out',
    scrollTrigger: { trigger: '.regalos', start: 'top 80%' },
  });

  addEventListener('load', () => ScrollTrigger.refresh());
}
