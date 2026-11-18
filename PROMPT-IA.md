# Prompt para IA de código · Taller "Construyendo nuestro mejor equipo"

Copia todo este archivo en tu IA de código. Si la IA puede ver archivos, ábrela dentro de la carpeta `taller-en-vivo`, que tiene el código actual.

---

## Contexto

Necesito una aplicación web para facilitar un taller de integración de equipo de 60 minutos. El taller usa la analogía de un vehículo:

1. El equipo vota **qué vehículo es hoy**.
2. Vota **qué piezas de ese vehículo hay que arreglar**.
3. Propone cómo arreglarlas.
4. Sale con **acuerdos concretos**.

La app tiene dos pantallas:

- **Pantalla del facilitador**: se proyecta en la sala y guía el taller.
- **Página de votación**: los participantes la abren en su celular escaneando un QR y votan de forma anónima. Los resultados aparecen en vivo en la pantalla proyectada.

Ya existe una versión funcional en esta carpeta (ver "Estado actual"). Úsala como base. No la reescribas desde cero salvo que te lo pida.

## Estado actual del código

```
taller-en-vivo/
├── server.js            Servidor Node.js sin dependencias (http + SSE)
├── iniciar-taller.bat   Arranca el servidor en Windows y abre la pantalla
├── LEEME.md             Instrucciones de uso
└── public/
    ├── index.html       Pantalla del facilitador (HTML + CSS + JS en un solo archivo)
    ├── votar.html       Página de votación para celulares
    └── qrcode.js        Librería qrcode-generator (MIT), servida localmente
```

- **Requisitos:** Node.js 18 o superior. Sin npm install.
- **Ejecutar:** `node server.js`. Con `ABRIR=1`, abre el navegador.
- **Variables de entorno:**
  - `PORT` (por defecto 3000)
  - `ADMIN_KEY` (clave del facilitador; si no se define, se genera al azar)
  - `PUBLIC_URL` (para el QR cuando se usa un túnel)
- **Datos:** se guardan en `votos.json` junto a `server.js`.

## Flujo del taller (4 misiones, 60 min)

| # | Misión | Min | Qué pasa |
|---|---|---|---|
| 1 | Bienvenida y acuerdos | 5 | Se leen 6 reglas para conversar |
| 2 | ¿Qué vehículo somos? | 10 | Votación: cada persona elige 1 vehículo |
| 3 | ¿Qué piezas cambiamos? | 25 | Votación: cada persona elige hasta 3 piezas. Las 3 más votadas se arreglan. Un grupo por pieza propone ideas y marca su favorita |
| 4 | Acuerdos y cierre | 20 | Un acuerdo por pieza (qué, quién, cuándo) + última pregunta abierta anónima |
| ✓ | Resumen | – | Todo en una vista, con botón para copiar como texto |

### Reglas de la sesión (misión 1)

1. Hablamos de situaciones, no de personas.
2. Confidencialidad.
3. Todas las voces cuentan.
4. Escuchar para entender.
5. Problema + propuesta.
6. Presencia total.

### Vehículos (misión 2)

| id | Nombre | Lo bueno | Lo que falla |
|---|---|---|---|
| remo | Barco de remos | Todos ponemos esfuerzo | Cada quien rema a su ritmo |
| bus | Autobús | Vamos todos juntos | Solo el chofer decide la ruta |
| carrera | Carro de carreras | Rápidos, damos resultados | Nos cansamos y chocamos |
| bici | Bicicleta tándem | Coordinados avanzamos fácil | Si uno no pedalea, el otro carga todo |
| tren | Tren | Ordenados y puntuales | Nos cuesta cambiar de vía |
| carreta | Carreta | Cumplimos, aguantamos peso | Vamos muy despacio |

- El facilitador puede agregar vehículos propuestos por el grupo.
- El más votado se muestra como "Hoy somos un ___".
- Se incluye un recuadro "¿Por qué hablamos de vehículos?" con 4 razones:
  - Todos lo entendemos.
  - Hablamos sin señalar.
  - Vemos el todo.
  - Se recuerda.

### Piezas (misión 3)

| id | Pieza | Qué representa |
|---|---|---|
| comp | Motor | Cumplimos lo que acordamos |
| conf | Combustible | Confiamos unos en otros |
| org | Volante | Sabemos hacia dónde vamos y quién hace qué |
| com | Radio | Nos avisamos a tiempo lo importante |
| col | Ruedas | Nos ayudamos para avanzar juntos |
| res | Frenos | Resolvemos los desacuerdos sin chocar |
| apr | Manual | Compartimos lo que sabemos |
| amb | Asientos | Nos sentimos a gusto en el viaje |

- Un dibujo SVG de un carro muestra cada pieza coloreada según su estado:
  - **A arreglar** (top 3 más votadas): rojo.
  - **Algunos votos**: dorado.
  - **Funciona bien** (0 votos): cian.
  - **Neutral** (antes de votar): punteado.
- Debajo hay un "taller mecánico" con una tarjeta por cada pieza del top 3. Cada grupo anota ideas y marca una favorita con ★.
- La idea favorita pasa automáticamente al campo "¿Qué vamos a hacer?" del acuerdo de esa pieza.

### Acuerdos y cierre (misión 4)

- Un acuerdo por cada pieza del top 3, con tres campos:
  - ¿Qué vamos a hacer?
  - ¿Quién da seguimiento?
  - ¿Cuándo lo revisamos?
- Un acuerdo cuenta como completo cuando los tres campos tienen texto.
- Última pregunta abierta: **"¿Qué otra pieza cambiarías o qué más deberíamos hacer?"**. Las respuestas son anónimas desde el celular y se revisan a los 30 días.
- Seguimiento:
  - 30 días: revisar arreglos.
  - 60 días: ajustar.
  - 90 días: volver a votar qué vehículo somos.

## API del servidor (`server.js`)

Lecturas públicas:

- `GET /`: pantalla del facilitador.
- `GET /votar`: página de votación.
- `GET /api/state`: estado público.
- `GET /api/stream`: Server-Sent Events con el estado completo en cada cambio, más un ping cada 25 s.

Votos desde el celular. Cada uno envía `{ token, ... }`; el token es aleatorio y se guarda en el `localStorage` del celular. Solo funcionan si la fase correspondiente está abierta:

- `POST /api/vehiculo {token, id}`: un voto por token; se puede cambiar.
- `POST /api/piezas {token, ids:[1..3]}`: hasta 3 piezas por token; se puede cambiar.
- `POST /api/otra {token, text}`: máximo 200 caracteres y 10 ideas por token.

Facilitador. Requiere el header `x-admin: <ADMIN_KEY>`:

- `POST /api/admin/phase {phase}`: `espera | vehiculo | piezas | otras | cerrado`.
- `POST /api/admin/custom {name}`: agrega un vehículo propuesto.
- `POST /api/admin/adjust {kind:"vehiculo"|"pieza", id, d:±1}`: ajuste manual de votos.
- `POST /api/admin/otra {text}` y `POST /api/admin/otra-delete {id}`.
- `POST /api/admin/reset`.

La pantalla del facilitador recibe la clave por `?admin=` en la URL, la guarda en `sessionStorage` y la quita de la URL.

## Pantalla del facilitador (`public/index.html`)

- **Navegación:** por hash (`#bienvenida`, `#vehiculo`, `#piezas`, `#acuerdos`, `#resumen`).
- **Cronómetro por etapa:** iniciar, pausar y reiniciar. Se pone dorado en el último minuto.
- **Modo sin servidor:** si `/api/state` no responde, funciona sola. Los votos se ingresan con botones +/− y los datos se guardan en `localStorage`. Abre con datos de ejemplo y un aviso "Empezar el taller en blanco".
- **Modo en vivo:** si el servidor responde, muestra una barra con:
  - el QR al enlace de votación;
  - el estado de la fase;
  - un contador de votantes;
  - el botón para abrir o cerrar cada votación.

  Las actualizaciones llegan por SSE. Al refrescar la vista, conserva el foco y el texto del input que se está escribiendo.
- **Misiones:**
  - Cada paso dice "Misión N de 4".
  - El botón "Completar misión" muestra a pantalla completa "¡MISIÓN COMPLETADA!" por unos 2 segundos y luego pasa a la siguiente misión.
  - 4 estrellas en el encabezado se encienden según las misiones completadas.
- **Datos:** botones "Copiar datos" (JSON), "Cargar datos" y "Copiar resumen como texto".

## Estilo visual

Estética de ciudad costera de noche con neón (estilo retro synthwave / Miami):

- **Colores:**
  - Fondo `#110724`; paneles `#1C0F3A`; bordes `#3A2763`; texto `#F5EEFF`; texto secundario `#B7A5D6`.
  - Rosa neón `#FF2E88`, naranja `#FF8A3D`, dorado `#FFC857`, morado `#C26BFF` / `#7A3BFF`, cian `#2EE6D6`, rojo `#FF4D6A`.
- **Degradado de atardecer:** `#1A0B33 → #3D1466 → #A3207A → #F2643A`.
- **Tipografías (Google Fonts):**
  - **Anton** para títulos en mayúsculas, con degradado dorado → naranja → rosa → morado.
  - **Yellowtail** para el nombre del taller, con brillo neón rosa.
  - **Rubik** para el texto.
- **Portada:** sol de atardecer con franjas horizontales, palmeras y siluetas de edificios, dibujados en SVG propio.
- **Cronómetro:** monoespaciado verde `#7CFFB2` con brillo.
- **Importante:** no usar el logo, la tipografía oficial, los personajes ni el nombre de ningún videojuego. Es una estética inspirada, no una copia de marca.

## Requisitos no funcionales

- Todo en español, con tono directo y sencillo.
- Sin dependencias de npm. Si propones agregar alguna, justifícala.
- Pantalla legible en proyector (texto base de 17 px o más) y página de votación pensada para celular (botones grandes).
- Accesibilidad básica: foco visible, `aria-label` en botones de ícono, respetar `prefers-reduced-motion`.
- Anonimato: nunca pedir nombres. Solo se muestran totales.
- El servidor debe escuchar en `0.0.0.0` para que los celulares de la misma red Wi-Fi puedan entrar.

## Qué quiero que hagas ahora

<!-- Escribe aquí lo que quieres que cambie o agregue la IA. Ejemplos: -->
<!-- - Migrar a Express + Socket.IO y dividir index.html en componentes. -->
<!-- - Agregar exportación a PDF del resumen. -->
<!-- - Desplegarlo en Azure App Service con un dominio propio. -->
<!-- - Agregar autenticación con cuentas de Microsoft para el facilitador. -->
