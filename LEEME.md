# SCRUM CITY · tuneando el equipo SOLTI

Taller de integración de 60 minutos convertido en juego. No es una presentación: en la pantalla hay **un vehículo** que el equipo identifica, avería, desarma y vuelve a armar pieza por pieza hasta que arranca.

Dos pantallas:

- **La pantalla grande** (`/`) se proyecta en la sala. Es el tablero del juego.
- **El celular** (`/votar`) es el mando de cada participante. Escanean un QR, escriben su nombre y votan. El nombre es solo para los créditos: nadie puede ver qué votó cada quien.

Solo necesita **Node.js 18 o superior**. Sin `npm install`.

## Cómo arrancar

En Windows, doble clic en `iniciar-taller.bat`. O desde una terminal en esta carpeta:

```
node server.js
```

La consola muestra dos enlaces:

- **Pantalla:** `http://localhost:3000/?admin=xxxxxx` — ábrela **en la computadora que está corriendo el servidor** y proyéctala. La parte `admin=` es lo que te deja mover las rondas.

  > **El mando es solo tuyo.** Los controles únicamente funcionan desde esta misma computadora (`localhost`). Si alguien copia el enlace completo, con clave y todo, y lo abre desde su celular o desde otra laptop, el taller se le ve pero no se le mueve: el servidor le responde que no. Por eso la pantalla hay que abrirla con `localhost`, no con la dirección `192.168.x.x`.
- **Celulares:** `http://<tu-ip>:3000/votar` — es el QR que sale en la pantalla.

## ¿Y si hay gente fuera del Wi-Fi?

Se puede: lee `DESPLIEGUE.md`. Lo más sencillo es un túnel, que deja el taller corriendo en tu computadora y le pone una dirección pública; así el mando sigue siendo solo tuyo. También se puede publicar en un servidor, pero entonces hay que encenderlo con `ADMIN_REMOTO=1` y la clave pasa a ser lo único que te separa de que cualquiera mueva las rondas.

## Las 5 rondas

| # | Ronda | Min | Qué pasa en la pantalla |
|---|---|---|---|
| 1 | Entrada | 5 | QR grande, contador de mecánicos conectados y las 6 reglas del taller. El vehículo es un fantasma punteado. |
| 2 | Escáner | 10 | Cada celular elige un vehículo. La silueta en pantalla cambia según quién va ganando. Al cerrar queda la placa: "hoy somos un ___". |

Los seis vehículos son de Miami: **Convertible**, **Bus de South Beach**, **Scooter**, **Deportivo**, **Metromover** y **Trailer**. Cada uno tiene su propio dibujo con sus piezas montadas donde van: el bus lleva el motor atrás y filas de asientos; el scooter, motorcito y tanque; el Metromover va eléctrico sobre el riel; el trailer, cabina y plataforma de carga. Si el grupo propone un vehículo propio, se usa un chasis genérico. Cuando una pieza cambia de forma, la pantalla lo aclara abajo ("en el scooter, el Motor es el motorcito").

**Cada pieza se lee distinto según la ronda, y eso es a propósito.** En **Averías** la pieza aparece en negativo —lo que se ve cuando está rota: *"Siempre empujan los mismos"*— porque ahí se marca lo que de verdad está pasando, no lo que nos gustaría. En el **Taller**, esa misma pieza aparece en positivo —*"Empujamos todos, no siempre los mismos"*— porque ahí ya se está armando hacia dónde queremos llegar. Las dos frases cambian según el vehículo.

**Cada pieza se llama como se llama en ese vehículo.** El scooter no tiene Volante sino **Manillar**; el convertible no tiene Asientos sino **Capota**; el trailer no lleva **Gasolina** sino **Carga**, y lleva **Bitácora**, **Ejes** y **Freno de aire**. El Metromover va de **Corriente**, **Vagones** y **Anuncios**. Por dentro cuentan igual (el voto es el mismo), pero en pantalla cada quien ve su vehículo de verdad.

**Cada vehículo tiene sus propias piezas, y cada pieza significa otra cosa.** No son las mismas 8 para todos: un scooter no trae Radio, ni Manual, ni Asientos, y un Metromover no trae Volante porque la ruta ya venía puesta. Lo que al vehículo le falta sale escrito en la pantalla y en el celular, y suele ser lo más revelador de la ronda. Los significados también cambian: el Freno de un Deportivo es *"sabemos levantar el pie antes de reventar el motor"*, y el de un Metromover es *"se puede decir 'esto no va' sin descarrilar nada"*.

No son seis vehículos "buenos" y "malos": cada uno es **una fortaleza de equipo junto con la sombra de esa misma fortaleza**. El que se adapta a todo termina siendo impredecible; el que incluye a todos diluye el esfuerzo de cada quien; el que rinde al máximo se quema. Por eso ninguna opción es la correcta: lo que importa es qué reconoce el equipo de sí mismo.

| Vehículo | Lo bueno | Lo que falla |
|---|---|---|
| Convertible | Nos adaptamos: si llueve nos tapamos, si hay sol nos lucimos | Cambiamos tanto según el día que nadie sabe qué esperar |
| Bus de South Beach | Nadie se queda fuera: aquí todos tienen asiento y todos opinan | Somos tantos que es fácil esconderse y nadie nota quién no empujó |
| Scooter | Cada quien arranca sin pedir permiso: sobra iniciativa | Solo cabe uno: lo que sabe cada quien no se comparte |
| Deportivo | Cuando hay que rendir, rendimos, y se nota | Vivimos en revoluciones altas: así se quema la gente |
| Metromover | Somos previsibles: hay reglas claras y cada quien sabe qué viene | Fuera del riel no sabemos ir: proponer otra ruta cuesta |
| Trailer | Nos hacemos cargo de lo pesado y nadie suelta la carga | No sabemos decir que no: vamos sobrecargados |

### Chuleta del facilitador: qué hay detrás de cada vehículo

Esto **no sale en la pantalla** a propósito: el taller es un juego, no una clase. Pero si el equipo elige uno y quieres saber qué nombrar en la conversación, aquí está el concepto de psicología de equipos que hay debajo y la pregunta que lo abre.

| Vehículo | Piezas | No trae | Por qué |
|---|---|---|---|
| Convertible | 7 | Manual | Improvisamos: lo que sabemos, lo sabemos de memoria |
| Bus de South Beach | 8 | — | Es el vehículo completo |
| Scooter | 5 | Radio, Manual, Asientos | Se va solo y se resuelve solo |
| Deportivo | 6 | Radio, Manual | A esa velocidad no se avisa ni se escribe |
| Metromover | 7 | Volante | La ruta ya venía puesta: nadie la decide aquí |
| Trailer | 6 | Radio, Asientos | Va solo en la cabina y lo demás es carga |

| Vehículo | Fortaleza | Su sombra | Pregunta para abrir la conversación |
|---|---|---|---|
| Convertible | Adaptabilidad y flexibilidad de rol | Ambigüedad de rol: sin normas estables, nadie sabe qué esperar | ¿Nos adaptamos porque queremos, o porque nunca acordamos cómo trabajamos? |
| Bus de South Beach | Cohesión y pertenencia: nadie queda fuera | Holgazanería social (efecto Ringelmann) y decisión centralizada en el chofer | Cuando algo sale bien, ¿sabemos quién lo hizo? ¿Y cuando sale mal? |
| Scooter | Autonomía e iniciativa individual | Silos de conocimiento: baja interdependencia, todo depende de una persona | Si mañana falta cualquiera de nosotros, ¿qué se para? |
| Deportivo | Orientación al logro y exigencia alta | Desgaste y cultura del héroe: rendir se vuelve aparentar | ¿Cuándo fue la última vez que alguien dijo "no llego" sin sentirse mal? |
| Metromover | Previsibilidad y normas claras | Rigidez y poca seguridad psicológica para cuestionar la ruta | ¿Qué pasa aquí cuando alguien propone hacerlo distinto? |
| Trailer | Compromiso y responsabilidad compartida | Sobrecarga de rol: no sabemos decir que no | ¿Qué estamos cargando que ya no deberíamos estar cargando? |

| 3 | Averías | 12 | Cada celular marca hasta 2 frases. **Son frases en negativo**: lo que se ve cuando esa pieza está rota ("Siempre empujan los mismos"), no lo que nos gustaría. Las piezas se ponen cian (bien), doradas (algunos votos) o rojas y humeando (averiadas). |
| 4 | Taller | 25 | Las 2 piezas más votadas se **desmontan**: quedan huecos rojos en el vehículo. Cada persona, desde su celular, manda ideas para las piezas que quiera y apoya con ★ una idea en cada pieza. Al presionar *Instalar* en la más apoyada, la pieza vuelve al vehículo. |

El taller es **individual**, no por grupos: todos pueden opinar sobre las 2 piezas. El celular le va marcando a cada quien en cuáles ya mandó idea o ya apoyó una, y en la pantalla la idea con más ★ sale marcada como "la más apoyada" para que sepas cuál instalar.
| 5 | Arranque | — | El vehículo prende las luces, suenan aplausos y **los créditos ruedan solos**: el reparto con los nombres de la sala, el equipo técnico con la idea que ganó en cada pieza, los chistes y el mensaje final. Queda el resumen con un botón para copiarlo. |

El taller **termina en el diagnóstico**: señala qué piezas hay que mejorar y con qué ideas, y para ahí. No reparte tareas ni pide compromisos con nombre y fecha. Lee `REVISION-Y-GUIA.md` antes de facilitarlo: ahí está por qué esa decisión tiene consecuencias y qué conviene decir en voz alta al cerrar.

Los celulares cambian solos de pantalla cuando mueves la ronda.

## Los nombres y los créditos

El nombre es **obligatorio para entrar**: es lo primero que pide el celular al escanear el QR, antes de poder votar nada. Aparece en "EN LA SALA" en la pantalla y sale en los créditos del final. Hay un campo en la pantalla para anotar a quien no tenga celular.

Que sea obligatorio no rompe el anonimato. Los nombres **se guardan aparte de los votos y sin el identificador del celular**, y además **en posición al azar dentro de la lista**: si se guardaran en orden de llegada, ese orden delataría quién votó primero, porque los votos se guardan en ese mismo orden. Ni el archivo `partida.json` permite atar un nombre a un voto.

Los créditos ruedan solos al llegar al cierre, **en la pantalla grande y en el celular de cada quien a la vez**, con la misma duración (unos 30 segundos) para que terminen juntos. En el celular sale además un **👏 ¡APLAUDE!** parpadeando y el teléfono vibra al entrar al cierre. Quien quiera leerlos con calma toca la pantalla y los créditos se quedan quietos.

En la pantalla grande puedes volver a lanzarlos con el botón 🎬 y disparar aplausos cuando quieras con el botón 👏.

## Empezar de nuevo

El botón **⟲** rojo, arriba a la derecha, borra la partida y la deja en blanco: votos, ideas y nombres. Funciona en cualquier ronda, cuando quieras. Pide **dos toques** para que no se vaya todo por un roce: el primero lo pone en rojo y avisa, el segundo borra. Si tardas más de 8 segundos, se desarma solo.

## Controles del facilitador

- **SIGUIENTE / ◀** abajo a la derecha, o las flechas **→** y **←** del teclado (sirve un clicker de presentación).
- **Barra espaciadora** o el botón ▶ inicia y pausa el cronómetro de la ronda. Se pone dorado en el último minuto.
- **🔊** silencia los sonidos (son sintetizados, no hay archivos).
- **⚙** abre el menú: saltar a una ronda, recalcular las piezas averiadas, copiar el resumen, copiar los datos o empezar un taller nuevo.
- Los botones **+ / −** junto a cada barra suman o quitan votos a mano, para quien no tenga celular.
- En el taller puedes escribir una idea dictada en voz alta y borrar las que no sirvan.

## Si los celulares no pueden entrar

- **Misma red:** tienen que estar en el mismo Wi-Fi que la laptop. Con datos móviles no funciona.
- **Firewall:** la primera vez Windows pregunta si permite que Node.js acepte conexiones. Marca **Redes privadas** y acepta.
- **Wi-Fi corporativo:** muchas redes de empresa no dejan que los equipos se vean entre sí. Dos salidas:
  - Levanta un hotspot desde la laptop o un celular y conecta a todos ahí.
  - Usa un túnel. En VS Code: pestaña **Ports** → **Forward a Port** → `3000` → visibilidad **Public**. Luego arranca indicando esa dirección para que el QR la use:

    ```
    $env:PUBLIC_URL="https://tu-tunel.devtunnels.ms"; node server.js
    ```

## Opciones

| Variable | Para qué sirve | Por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `ADMIN_KEY` | Clave fija del facilitador | Se genera al azar |
| `PUBLIC_URL` | Dirección pública para el QR (túnel) | La IP local |
| `ABRIR` | Con `ABRIR=1` abre el navegador solo | apagado |

## Los datos

Todo se guarda en `partida.json`, junto a `server.js`. Si cierras el servidor y lo vuelves a abrir, el taller sigue donde estaba. Para empezar de cero: menú **⚙ → 5**, o borra ese archivo con el servidor apagado.

En el arranque hay botones para **copiar el resumen** como texto plano (para pegarlo en un correo o un chat) y **copiar los datos** en JSON.

## Si no hay servidor

Si abres `public/index.html` directo en el navegador, sin Node, el tablero funciona solo: no hay QR ni celulares, y los votos se ponen con los botones **+ / −**. Sirve para ensayar el taller o para una sala sin red. Lo que escribas se guarda en el navegador.

## Sobre el anonimato

El nombre y el voto nunca se tocan. A cada celular le toca un identificador al azar, guardado en su navegador, para que pueda cambiar su voto sin votar dos veces. En pantalla solo salen totales. Quien borre los datos de su navegador podría votar otra vez: para un taller interno alcanza, pero no es un sistema de votación formal.

## Nota de estilo

La estética es de ciudad costera de noche con neón: atardecer, palmeras y letras de taller. Está dibujada aquí mismo en SVG y CSS. No usa el nombre, el logo, la tipografía ni los personajes de ningún videojuego; es una estética inspirada, no una copia.
