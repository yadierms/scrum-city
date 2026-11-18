# Sacar el taller fuera del Wi-Fi

Por defecto el taller vive en tu computadora y solo entran los celulares que estén en el mismo Wi-Fi. Si tienes gente conectada desde fuera, hay dos caminos. **El primero es el que te recomiendo.**

---

## Opción 1 · Un túnel (lo más fácil, y lo más seguro)

El servidor se queda corriendo en tu computadora, igual que siempre, y un túnel le pone una dirección pública de internet. Nadie tiene que instalar nada del otro lado: les llega un enlace `https://…` normal.

**Lo mejor de esto:** el mando del taller sigue atado a tu computadora. Tú abres la pantalla con `localhost` y nadie más puede mover las rondas, aunque le pasen el enlace a medio mundo.

### Cómo

1. Descarga `cloudflared` (gratis, no pide cuenta): <https://developers.cloudflare.com/cloudflare-tunnel/get-started/downloads/>
2. Enciende el taller como siempre, en una terminal:

   ```powershell
   node server.js
   ```

3. En **otra** terminal, abre el túnel:

   ```powershell
   cloudflared tunnel --url http://localhost:3000
   ```

4. Te imprime una dirección tipo `https://algo-raro.trycloudflare.com`. Apágalo todo y vuelve a encender el taller pasándole esa dirección, para que el QR apunte ahí:

   ```powershell
   $env:PUBLIC_URL = "https://algo-raro.trycloudflare.com"; node server.js
   ```

5. Abre tu pantalla con el enlace de `localhost` que sale en la consola y proyéctala. El QR ya lleva la dirección pública.

**Ojo:** mientras dure el taller, tu computadora tiene que seguir encendida y con las dos terminales abiertas. La dirección gratuita cambia cada vez que abres el túnel.

---

## Opción 2 · Publicarlo en un servidor

Si prefieres que viva en internet sin depender de tu máquina. Aquí **sí** tienes que tocar la seguridad: como tú también entras desde fuera, el mando ya no puede estar atado a `localhost`.

### Lo que cambia

Se enciende con `ADMIN_REMOTO=1`. Entonces:

- El mando viaja con la clave: quien tenga el enlace con `?admin=…` manda.
- La clave pasa a ser de 24 caracteres al azar en vez de 6.
- Quien falle la clave 10 veces se queda fuera 10 minutos.

**Lo que compartes con el equipo es el enlace de los celulares, el que termina en `/votar`. Nunca el tuyo con `?admin=`.** Ese es tuyo y de nadie más.

### Variables

| Variable | Para qué | Ejemplo |
|---|---|---|
| `PUBLIC_URL` | La dirección pública, para que el QR apunte bien | `https://taller-solti.onrender.com` |
| `ADMIN_REMOTO` | Deja mover el taller desde fuera, solo con la clave | `1` |
| `ADMIN_KEY` | Tu clave fija. Si no la pones, se genera sola y sale en los registros | algo largo e inventado |
| `PORT` | El puerto. Casi todos los servidores lo ponen solos | `3000` |

### En Render (gratis)

1. Sube la carpeta a un repositorio de GitHub.
2. En <https://render.com> → **New** → **Web Service** → elige el repositorio.
3. Render detecta Node solo (por el `package.json`). Si te pregunta:
   - Build command: *déjalo vacío* (no hay dependencias que instalar)
   - Start command: `node server.js`
4. En **Environment**, agrega:
   - `ADMIN_REMOTO` = `1`
   - `ADMIN_KEY` = una clave larga que te inventes
   - `PUBLIC_URL` = la dirección que te dé Render, en cuanto la sepas
5. Tu pantalla: `https://loquesea.onrender.com/?admin=TU_CLAVE`

**Dos avisos del plan gratuito de Render:** el servicio se duerme a los 15 minutos sin visitas y tarda cerca de un minuto en despertar, así que ábrelo **10 minutos antes** del taller y déjalo abierto. Y si el servicio se reinicia a mitad del taller, se pierden los votos: el `partida.json` no sobrevive. Para una hora seguida no suele pasar, pero si te preocupa, usa la opción 1.

### Otros

En **Fly.io**, **Railway** o cualquier VPS funciona igual: Node 18 o superior, `node server.js`, y las mismas variables. No hay nada que instalar.

---

## Un detalle que importa

El taller usa una conexión abierta para que las pantallas se actualicen solas. Algunos servidores la cortan o la retienen. Si ves que los votos no aparecen en la pantalla grande pero sí al recargar, es eso. El servidor ya manda la cabecera que lo evita en la mayoría de los casos; si aun así pasa, usa la opción 1, que nunca da ese problema.

---

## Si el taller es a distancia, cambia la actividad

Esto no es un detalle técnico. En persona el taller se apoya en la conversación alrededor del vehículo, y la pantalla es solo el tablero. Por videollamada:

- Comparte tu pantalla con el proyector del taller, no mandes el enlace de la pantalla grande a todos. Si cada quien mira su propia pantalla, se pierde el momento de verlo juntos.
- El celular lo usan igual, en paralelo a la llamada.
- Deja más tiempo en el Taller: por videollamada la gente habla menos y más despacio.
- El aplauso del final no funciona por videollamada con los micrófonos cerrados. Avísales antes de que abran el micrófono para esa parte, o se queda en nada.
