# Havanna · por qué cada decisión

Rediseño conceptual de Roda. Cada cambio responde a un error de havanna.com.ar (relevado el 20/10/2026).

## Concepto: la caja amarilla
La web toma todo de su propio packaging: el amarillo, las letras rojas huecas del logo y el filete doble del borde de la caja. No inventamos una marca nueva, ordenamos la que ya tienen.

## Error → solución

| En la web actual | Qué hicimos | Por qué |
|---|---|---|
| Todo metido en una caja de ~1000 px con fondo de patrón de logos | Secciones a todo el ancho, una por color | La caja angosta es de diseño de 2012; hoy la pantalla entera es el lienzo |
| El menú se ve en Times (la tipografía no carga) y "FRANQUICIAS" aparece cortado | Big Shoulders + Schibsted Grotesk desde Google Fonts, con respaldo | Si la letra no carga, la marca se ve rota en la primera impresión |
| "BIENVENIDOS / Conocé la experiencia Havanna" | "El alfajor de Mar del Plata" | El título tiene que decir qué venden y de dónde son en 5 palabras |
| Cuatro fotos con un ícono amarillo y la palabra HAVANNA repetida | El alfajor cortado, grande, con el dulce de leche a la vista | El producto se vende solo si se ve; los íconos tapaban las fotos |
| La tienda está en otro sitio y la home no muestra ni un producto | Tira con 9 productos reales, precio y botón de compra | Comprar a 1 click desde la portada |
| La campaña con Messi es un banner que rota | Sección propia, fondo chocolate y el pouch en un arco dorado | Es su mejor activo del año; no puede durar 4 segundos en un carrusel |
| La historia está escondida en Nosotros > Historia | "Dulce como la vida. Salado como el mar." con 4 datos | Usamos su propia frase; los datos son de su página de historia |
| Buscador de locales con 4 desplegables | Botones de país y zona que abren Google Maps | Menos pasos y funciona igual en el celu |
| El zoom bloqueado en celular (`maximum-scale=1`) | Zoom libre | Hay gente que necesita agrandar para leer |
| El título principal de la página es "Menu" | Un solo h1 con lo que la marca es | Google y los lectores de pantalla leen ese título primero |
| Fotos sin texto alternativo | Todas describen lo que muestran | Accesibilidad y búsqueda de imágenes |

## Efectos (v2) y su porqué

| Efecto | Qué pasa al bajar | Por qué va con Havanna |
|---|---|---|
| La caja se abre | La tapa amarilla con el logo se parte en dos y deja ver el alfajor | Havanna se regala en caja; abrirla es el ritual. La primera pantalla ya es la marca |
| El desarme | El alfajor se separa en capas con su nombre, salen volando los otros productos y la cámara entra al dulce de leche | Mostrar qué hay adentro en vez de contarlo; el dulce es el corazón del producto |
| Dulce de leche | La palabra llega desenfocada y se enfoca; adentro de las letras está la foto del relleno | La tipografía hecha del producto |
| Cinta | "Dulce como la vida · Salado como el mar" corre sola y acelera con el scroll | Su propia frase, como la cinta que cierra una caja |
| Cada caja, su color | Cuatro tarjetas con el color real de cada caja; cada una se abre a pantalla completa | Ubicarse por color, como en el mostrador del local |
| Havanna × Leo | El pouch sube girando y sigue al mouse | La campaña del año merece su momento |
| 1947 | El año en contorno se llena de amarillo de abajo hacia arriba; los números cuentan | El año que está en la caja, contado con datos de su historia |
| Órbita | Los 8 países giran alrededor del alfajor | De Mar del Plata al mundo, y abajo el buscador para encontrar uno |
| Regalos | En compu la caja sigue al cursor sobre cada opción | Ver qué te llevás sin hacer click |

Si el sistema tiene "reducir movimiento" activado, la página se muestra abierta y quieta, con todo el contenido.

## Auditoría v3 (prolijidad)

- **Fotos recortadas de verdad**: todas las fotos de la tienda venían con fondo blanco. Ahora cada producto está recortado con fondo transparente y su sombra real (img/). Así se apoya en cualquier color sin trucos.
- **El desarme ya no es una foto cortada en franjas**: el alfajor se separó en 3 piezas siguiendo sus uniones reales; las de abajo quedan juntas porque se apoyan una en la otra.
- **Portada**: adentro de la caja, el alfajor va al centro, entre "El alfajor" y "de Mar del Plata", y se leen las dos líneas.
- **Productos alrededor del desarme**: cada uno en un lugar libre de texto; en el celu solo tres, en las esquinas.
- **Del dulce al chocolate**: en vez de un zoom borroso, un círculo de chocolate nace del dulce de leche y cubre la pantalla.
- **"Dulce de leche"**: la textura de las letras está hecha con degradés, nítida en cualquier pantalla, sobre fondo chocolate para que contraste.
- **Tarjetas de color**: cada una muestra su caja, que crece con la tarjeta al abrirse; los paneles llevan contador 01/04.
- **Letras huecas**: el contorno va detrás del relleno, así no se ven los trazos internos que cruzan la M.
- **Buscador**: se muestran 8 zonas y el resto a pedido; en el celu ya no es una pared de botones.

## v4: la portada es la caja

- **Portada = el frente de la caja amarilla**: filete doble rojo como marco, el logo, el alfajor apoyado y los cantos impresos ("Mar del Plata", "Desde 1947") como en el packaging real. Es la imagen que cualquiera reconoce de Havanna.
- **Al bajar, la tapa se levanta** (gira sobre su borde superior y se oscurece como un cartón contra la luz) y adentro el alfajor se desarma. Caja y desarme son una sola escena: la apertura tiene sentido porque muestra lo que hay adentro.
- **Desarme sin cortes rectos**: cada pieza se separa siguiendo el hueco real entre ellas, columna por columna.
- **Fotos sin restos de fondo**: sin sombras grises; las cajas y el pouch se rellenan por dentro de su contorno para que los blancos impresos (la remera de Messi) no queden como agujeros.
- **Fuera la sección "Dulce de leche" y el telón marrón**: no aportaban y dejaban una línea blanca en la transición.

## Auditoría desde el cliente (v3.1)

Quién entra a la web de Havanna y qué viene a buscar:

| Quién | Qué busca | Qué hicimos |
|---|---|---|
| El que compra (casi siempre para regalar) | Qué hay, cuánto sale, si le llega | Cada línea muestra sus productos con precio real y compra en un toque; "Envíos a CABA y GBA" junto a cada compra y en la portada |
| El que sabe lo que quiere | Ir directo a galletitas sin ver todo | Índice de líneas fijo abajo; tocar una tarjeta lleva a esa línea |
| Celíacos y diabéticos | Productos aptos | "Sin TACC" en el índice y en el pie; los alfajores sin azúcar en la lista |
| El que busca promos | Promociones vigentes | "Promos" en el menú principal |
| El que va al café | El local más cercano y la carta | Botón "Buscar cerca mío" (abre el mapa en su ubicación) y "Ver la carta del café" |
| Todos en el celu | No scrollear de más | Secciones ancladas más cortas (desarme 180%, cada línea 85%) |

Precios y links verificados en tienda.havanna.com.ar el 21/10/2026. El link de empleo que tiene su web (Bumeran) no responde, por eso no lo pusimos.

## Decisiones de diseño
- **Producto sobre crema, no sobre amarillo**: probamos el alfajor sobre el amarillo y el chocolate se veía verdoso. El amarillo queda para la marca y el texto.
- **Chocolate en vez de negro**: todos los fondos oscuros son marrón chocolate, no negro.
- **Letras huecas**: el mismo recurso del logo (contorno con relleno interno), usado en "del Plata" y "Salado como el mar".
- **Un solo azul**: el mar aparece solo en la historia, para que "salado como el mar" se sienta distinto al resto.
- **Movimiento con motivo**: el título sube línea por línea; en el corte, cada etiqueta aparece como alguien que señala (punto, línea, texto).

## Datos usados (todos de sus sitios)
- Historia: 1947, fundadores, 6/1/1948 primer día de venta, 50 sucursales en la Costa. (havanna.com.ar/nosotros/historia)
- 8 países y 21 zonas: selector de havanna.com.ar/nuestros-locales.
- Productos, fotos y precios: tienda.havanna.com.ar, octubre 2026.

## Para el video
Abrir con la web actual: la letra en Times y "FRANQUICIAS" cortado. Después mostrar la portada nueva y bajar despacio hasta el corte del alfajor; es el momento que más se nota.
