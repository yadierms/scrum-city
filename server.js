// SCRUM CITY · tuneando el equipo SOLTI
// Sin dependencias: solo Node.js 18 o superior.   Uso:  node server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { spawn } = require("child_process");

const PORT = Number(process.env.PORT) || 3000;
// Con el taller publicado en internet el mando viaja con la clave, así que
// la clave es más larga. En local basta con una corta de teclear.
const REMOTO = process.env.ADMIN_REMOTO === "1";
const ADMIN = process.env.ADMIN_KEY || crypto.randomBytes(REMOTO ? 12 : 3).toString("hex");
const DATA = path.join(__dirname, "partida.json");
const PUBLIC = path.join(__dirname, "public");

/* ====================== contenido del taller ====================== */

const VEHICLES = [
  { id: "convertible", name: "Convertible", good: "Nos adaptamos: si llueve nos tapamos, si hay sol nos lucimos", bad: "Cambiamos tanto según el día que nadie sabe qué esperar", piezas: ["comp", "conf", "org", "com", "col", "res", "amb"], faltan: "Un convertible no trae Manual: lo que sabemos, lo sabemos de memoria." },
  { id: "bus", name: "Bus de South Beach", good: "Nadie se queda fuera: aquí todos tienen asiento y todos opinan", bad: "Somos tantos que es fácil esconderse y nadie nota quién no empujó", piezas: ["comp", "conf", "org", "com", "col", "res", "apr", "amb"], faltan: "" },
  { id: "scooter", name: "Scooter", good: "Cada quien arranca sin pedir permiso: sobra iniciativa", bad: "Solo cabe uno: lo que sabe cada quien no se comparte", piezas: ["comp", "conf", "org", "col", "res"], faltan: "Un scooter no trae Radio, Manual ni Asientos: se va solo y se resuelve solo." },
  { id: "deportivo", name: "Deportivo", good: "Cuando hay que rendir, rendimos, y se nota", bad: "Vivimos en revoluciones altas: así se quema la gente", piezas: ["comp", "conf", "org", "col", "res", "amb"], faltan: "Un deportivo no trae Radio ni Manual: a esa velocidad no se avisa ni se escribe." },
  { id: "metromover", name: "Metromover", good: "Somos previsibles: hay reglas claras y cada quien sabe qué viene", bad: "Fuera del riel no sabemos ir: proponer otra ruta cuesta", piezas: ["comp", "conf", "com", "col", "res", "apr", "amb"], faltan: "Un Metromover no trae Volante: la ruta ya venía puesta." },
  { id: "trailer", name: "Trailer", good: "Nos hacemos cargo de lo pesado y nadie suelta la carga", bad: "No sabemos decir que no: vamos sobrecargados", piezas: ["comp", "conf", "org", "col", "res", "apr"], faltan: "Un trailer no trae Radio ni Asientos: va solo en la cabina y lo demás es carga." },
];

const PIECES = [
  { id: "comp", name: "Motor", mean: "Cumplimos lo que acordamos" },
  { id: "conf", name: "Combustible", mean: "Confiamos unos en otros" },
  { id: "org", name: "Volante", mean: "Sabemos hacia dónde vamos y quién hace qué" },
  { id: "com", name: "Radio", mean: "Nos avisamos a tiempo lo importante" },
  { id: "col", name: "Ruedas", mean: "Nos ayudamos para avanzar juntos" },
  { id: "res", name: "Frenos", mean: "Resolvemos los desacuerdos sin chocar" },
  { id: "apr", name: "Manual", mean: "Compartimos lo que sabemos" },
  { id: "amb", name: "Asientos", mean: "Nos sentimos a gusto en el viaje" },
];

// Las mismas 8 piezas, leidas desde cada vehiculo. Si el equipo se reconoce
// como Scooter, su Radio no significa lo mismo que el Radio de un Metromover.
// Lo que no esta aqui se queda con el significado general de arriba.
const SENTIDOS = {
  convertible: {
    comp: "Cumplimos aunque el plan cambie a mitad de camino",
    conf: "Confiamos sin necesitar que todo esté escrito",
    org: "Cada cambio de rumbo lo decidimos, no nos pasa por encima",
    com: "Avisamos a tiempo cuando el plan cambió",
    col: "Nos cubrimos entre todos cuando toca cambiar",
    res: "Sabemos parar antes de cambiar otra vez",
    apr: "Lo que aprendimos improvisando queda escrito",
    amb: "Se viaja a gusto aunque el día venga raro",
  },
  bus: {
    comp: "Cada quien cumple su parte, no solo el chofer",
    conf: "Nos fiamos del que va al lado sin tener que comprobarlo",
    org: "La ruta no la decide uno solo",
    com: "Lo importante llega hasta el último asiento",
    col: "Empujamos todos, no siempre los mismos",
    res: "Se puede decir \"por ahí no\" sin que sea un problema",
    apr: "Lo que sabe el de alante lo sabe el de atrás",
    amb: "Nadie va de pie ni va aguantando el viaje",
  },
  scooter: {
    comp: "Cada quien responde por lo suyo, sin que le recuerden",
    conf: "Confiamos sin ir mirando por encima del hombro",
    org: "Aunque vayamos sueltos, vamos al mismo sitio",
    com: "Avisamos dónde andamos sin que nos lo pidan",
    col: "Paramos lo nuestro para empujar lo del otro",
    res: "Frenamos antes de salir cada quien por su lado",
    apr: "Lo que resolvió uno no se queda en su cabeza",
    amb: "Ir solo no es lo mismo que ir solitario",
  },
  deportivo: {
    comp: "Cumplimos sin tener que ir siempre al máximo",
    conf: "Confiamos aunque alguien tenga un mal día",
    org: "Sabemos para qué corremos, no solo cuánto",
    com: "Avisamos cuando ya no damos más",
    col: "El que va en cabeza no deja atrás al resto",
    res: "Sabemos levantar el pie antes de reventar el motor",
    apr: "Lo que sale bien no es secreto del que lo hizo",
    amb: "Se puede ir cómodo sin que parezca flojera",
  },
  metromover: {
    comp: "Cumplimos porque lo acordamos, no porque toca",
    conf: "Confiamos en la gente, no solo en el procedimiento",
    org: "Alguien decide la ruta, y se le puede discutir",
    com: "Se avisa lo que pasa, no solo lo que estaba previsto",
    col: "Nos ayudamos aunque no esté puesto en el riel",
    res: "Se puede decir \"esto no va\" sin descarrilar nada",
    apr: "El manual se actualiza, no solo se cumple",
    amb: "Se viaja cómodo, no solo puntual",
  },
  trailer: {
    comp: "Cumplimos lo que acordamos, no todo lo que nos piden",
    conf: "Confiamos lo bastante para soltar parte de la carga",
    org: "Sabemos qué llevamos y para qué lo llevamos",
    com: "Avisamos cuando la carga ya no cabe",
    col: "El peso se reparte, no se queda en los mismos",
    res: "Sabemos decir que no sin sentirnos mal",
    apr: "Lo que cargamos por costumbre lo revisamos",
    amb: "Aguantar no es lo mismo que ir a gusto",
  },
};

// Como se llama cada pieza en cada vehiculo. El id no cambia (los votos
// siguen contando igual), solo el nombre que ve la gente en la pantalla.
const NOMBRES = {
  convertible: { comp: "Motor", conf: "Gasolina", org: "Volante", com: "Antena", col: "Gomas", res: "Frenos", amb: "Capota" },
  bus:         { comp: "Motor", conf: "Gasolina", org: "Letrero", com: "Timbre", col: "Gomas", res: "Frenos", apr: "Mapa", amb: "Asientos" },
  scooter:     { comp: "Motorcito", conf: "Gasolina", org: "Manillar", col: "Gomas", res: "Frenos" },
  deportivo:   { comp: "Turbo", conf: "Gasolina", org: "Tablero", col: "Neumáticos", res: "Discos", amb: "Butacas" },
  metromover:  { comp: "Motor", conf: "Corriente", com: "Anuncios", col: "Vagones", res: "Frenos", apr: "Manual", amb: "Asientos" },
  trailer:     { comp: "Motor", conf: "Carga", org: "Volante", col: "Ejes", res: "Freno de aire", apr: "Bitácora" },
};

// Lo que se ve cuando esa pieza esta rota, en cada vehiculo. Es lo que lee
// la gente en la ronda de averias: se marca lo que de verdad esta pasando.
const FALLAS = {
  convertible: {
    comp: "Acordamos algo y al otro día ya cambió",
    conf: "Si no está escrito, no nos fiamos",
    org: "El rumbo cambia sin que nadie lo decida",
    com: "El plan cambió y nos enteramos tarde",
    col: "Cuando toca cambiar, cada quien se las arregla",
    res: "Cambiamos otra vez antes de terminar lo anterior",
    amb: "Si el día viene malo, nos moja a todos",
  },
  bus: {
    comp: "Empuja el chofer y los demás van sentados",
    conf: "Andamos con la reserva: hay que comprobarlo todo",
    org: "Nadie sabe bien para dónde va esto",
    com: "Lo que se dice alante no llega atrás",
    col: "Siempre empujan los mismos",
    res: "Decir \"por ahí no\" se vuelve un problema",
    apr: "Lo que aprendió uno no lo sabe nadie más",
    amb: "Hay quien va de pie todo el viaje",
  },
  scooter: {
    comp: "Hay que estarle recordando a cada quien lo suyo",
    conf: "Nos revisamos el trabajo unos a otros",
    org: "Cada quien va para un sitio distinto",
    col: "Nadie para lo suyo para ayudar al otro",
    res: "Ante un choque, cada quien arranca por su lado",
  },
  deportivo: {
    comp: "Solo cumplimos si vamos a toda",
    conf: "Un mal día de alguien se cobra caro",
    org: "Corremos sin saber para qué",
    col: "El que va alante deja atrás al resto",
    res: "No levantamos el pie hasta que algo revienta",
    amb: "Ir cómodo aquí parece flojera",
  },
  metromover: {
    comp: "Cumplimos porque toca, no porque lo acordamos",
    conf: "Confiamos en el procedimiento, no en la gente",
    com: "Solo se avisa lo que ya estaba previsto",
    col: "Si no está puesto en el riel, no nos ayudamos",
    res: "Decir \"esto no va\" descarrila la reunión",
    apr: "El manual se cumple, pero nunca se actualiza",
    amb: "Llegamos puntuales y molidos",
  },
  trailer: {
    comp: "Cumplimos todo lo que nos piden, acordado o no",
    conf: "No soltamos la carga ni cuando nos ofrecen ayuda",
    org: "Cargamos cosas sin saber para qué",
    col: "El peso se queda siempre en los mismos",
    res: "Decir que no nos hace sentir mal",
    apr: "Cargamos por costumbre y nadie lo revisa",
  },
};

// Si el grupo propone su propio vehiculo, se usan estas.
const FALLA_BASE = {
  comp: "Acordamos cosas que después no pasan",
  conf: "No nos fiamos del todo unos de otros",
  org: "No está claro para dónde vamos ni quién hace qué",
  com: "Lo importante nos llega tarde",
  col: "Cada quien va con lo suyo",
  res: "Los desacuerdos se evitan, o terminan en choque",
  apr: "Lo que sabe uno no lo sabe nadie más",
  amb: "No se viaja a gusto",
};

// Orden estable para desempatar y para dibujar.
const PIECE_ORDER = ["col", "res", "amb", "org", "apr", "comp", "conf", "com"];

// Rondas del juego. El celular y la pantalla usan las mismas.
const PHASES = ["lobby", "escaner", "diagnostico", "taller", "arranque"];

const MAX_IDEAS_POR_PIEZA = 40;
const MAX_IDEAS_POR_PERSONA = 3;
const MAX_NOMBRES = 80;

/* ====================== estado de la partida ====================== */

function fresh() {
  return {
    phase: "lobby",
    custom: [],        // vehículos propuestos por el grupo
    vVotes: {},        // token -> idVehiculo
    pVotes: {},        // token -> [idPieza]
    vManual: {},       // ajustes a mano del facilitador
    pManual: {},
    ideas: [],         // { id, piece, text, token, favs: { token: 1 } }
    installed: {},     // idPieza -> idIdea instalada
    top: [],           // piezas averiadas, se congelan al entrar al taller
    // Los nombres para los créditos. A propósito NO guardan el token del
    // celular: así el servidor no puede saber qué votó cada nombre.
    nombres: [],       // { id, name }
    seq: 0,
  };
}

let st = fresh();
try {
  const disk = JSON.parse(fs.readFileSync(DATA, "utf8"));
  if (disk && PHASES.includes(disk.phase)) st = Object.assign(fresh(), disk);
} catch (e) { /* primer arranque */ }

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => fs.writeFile(DATA, JSON.stringify(st), () => {}), 200);
}

/* ====================== utilidades ====================== */

function lanIp() {
  for (const list of Object.values(os.networkInterfaces())) {
    for (const a of list || []) if (a.family === "IPv4" && !a.internal) return a.address;
  }
  return "localhost";
}
// Render y otros publican su direccion en una variable: si esta, el QR va ahi.
const BASE_PUBLICA = (process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || "").replace(/\/$/, "");
const JOIN = BASE_PUBLICA
  ? BASE_PUBLICA + "/votar"
  : `http://${lanIp()}:${PORT}/votar`;

const clean = (t, max) => String(t == null ? "" : t).replace(/\s+/g, " ").trim().slice(0, max);
const validToken = (t) => typeof t === "string" && /^[a-z0-9-]{8,64}$/i.test(t);
const vehicleIds = () => VEHICLES.map((v) => v.id).concat(st.custom.map((c) => c.id));
const pieceIds = PIECES.map((p) => p.id);
const newId = () => crypto.randomBytes(4).toString("hex");

function tally() {
  const vehicles = {}, pieces = {};
  for (const id of Object.values(st.vVotes)) vehicles[id] = (vehicles[id] || 0) + 1;
  for (const ids of Object.values(st.pVotes)) for (const id of ids) pieces[id] = (pieces[id] || 0) + 1;
  for (const [id, n] of Object.entries(st.vManual)) vehicles[id] = Math.max(0, (vehicles[id] || 0) + n);
  for (const [id, n] of Object.entries(st.pManual)) pieces[id] = Math.max(0, (pieces[id] || 0) + n);
  for (const o of [vehicles, pieces]) for (const k of Object.keys(o)) if (!o[k]) delete o[k];
  return { vehicles, pieces };
}

// Cada vehiculo trae solo las piezas que de verdad tiene. Lo que le falta
// tambien es un diagnostico: un Metromover sin Volante no decide su ruta.
function piezasDe(winner) {
  const v = VEHICLES.find((x) => x.id === winner);
  return v && v.piezas ? v.piezas : pieceIds;
}

// Las 2 piezas mas votadas (solo con al menos un voto). Desempata por PIECE_ORDER.
function computeTop(pieces, hay) {
  return (hay || pieceIds)
    .filter((id) => (pieces[id] || 0) > 0)
    .sort((a, b) => (pieces[b] || 0) - (pieces[a] || 0) || PIECE_ORDER.indexOf(a) - PIECE_ORDER.indexOf(b))
    .slice(0, 2);
}

function winnerVehicle(vehicles) {
  let best = null, bestN = -1;
  for (const v of VEHICLES.concat(st.custom)) {
    const n = vehicles[v.id] || 0;
    if (n > bestN) { bestN = n; best = v.id; }
  }
  return bestN > 0 ? best : null;
}

// Solo la computadora que presenta (la que corre este servidor) puede mandar.
// Un celular del Wi-Fi llega con otra direccion: aunque alguien escriba la
// clave en la URL, el servidor no le acepta ni un control.
// Quien falle la clave muchas veces se queda fuera un rato. Solo hace falta
// cuando el taller está publicado, pero no estorba en local.
const intentos = new Map();
function ipDe(req) {
  // publicado, el servidor ve la IP del proxy: la de verdad viene en la cabecera
  if (REMOTO) {
    const h = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (h) return h;
  }
  return String(req.socket.remoteAddress || "").replace(/^::ffff:/, "");
}
function olvidaFallos(req) { intentos.delete(ipDe(req)); }
function bloqueado(req) {
  const x = intentos.get(ipDe(req));
  return !!(x && x.fallos >= 10 && Date.now() < x.hasta);
}
function apuntaFallo(req) {
  const ip = ipDe(req);
  const x = intentos.get(ip) || { fallos: 0, hasta: 0 };
  if (Date.now() > x.hasta) x.fallos = 0;
  x.fallos++;
  x.hasta = Date.now() + 10 * 60 * 1000;
  intentos.set(ip, x);
}

function esLocal(req) {
  const ip = String(req.socket.remoteAddress || "").replace(/^::ffff:/, "");
  return ip === "127.0.0.1" || ip === "::1";
}

function publicState() {
  const t = tally();
  // El vehículo ganador le presta su propio sentido a las 8 piezas.
  const win = winnerVehicle(t.vehicles);
  const sent = SENTIDOS[win] || {};
  const nom = NOMBRES[win] || {};
  const fall = FALLAS[win] || {};
  const hay = piezasDe(win);
  const vdef = VEHICLES.find((v) => v.id === win);
  // Antes del taller el top se calcula en vivo; después queda congelado.
  const top = st.top.length ? st.top : computeTop(t.pieces, piezasDe(winnerVehicle(t.vehicles)));
  return {
    phase: st.phase,
    joinUrl: JOIN,
    vehiclesDef: VEHICLES.concat(st.custom.map((c) => ({ ...c, good: "Propuesta del equipo", bad: "" }))),
    piecesDef: PIECES.filter((p) => hay.includes(p.id)).map((p) => ({ ...p, name: nom[p.id] || p.name, mean: sent[p.id] || p.mean, falla: fall[p.id] || FALLA_BASE[p.id] || "" })),
    piezasFaltan: PIECES.filter((p) => !hay.includes(p.id)).map((p) => p.name),
    faltanNota: (vdef && vdef.faltan) || "",
    pieceOrder: PIECE_ORDER,
    custom: st.custom,
    vehicles: t.vehicles,
    pieces: t.pieces,
    winner: win,
    top,
    topFrozen: st.top.length > 0,
    votersVehiculo: Object.keys(st.vVotes).length,
    votersPiezas: Object.keys(st.pVotes).length,
    phones: phoneCount(),
    ideas: st.ideas.map((i) => ({ id: i.id, piece: i.piece, text: i.text, favs: Object.keys(i.favs || {}).length })),
    installed: st.installed,
    nombres: (st.nombres || []).map((n) => ({ id: n.id, name: n.name })),
    limites: { idea: 140, ideasPorPersona: MAX_IDEAS_POR_PERSONA },
    seq: st.seq,
  };
}

/* ====================== flujo de eventos (SSE) ====================== */

const clients = new Set(); // { res, role }
const phoneCount = () => {
  let n = 0;
  for (const c of clients) if (c.role === "phone") n++;
  return n;
};

function broadcast() {
  st.seq++;
  save();
  const msg = `data: ${JSON.stringify(publicState())}\n\n`;
  for (const c of clients) { try { c.res.write(msg); } catch (e) { /* cliente caido */ } }
}
let soft = null;
function softBroadcast() { // para cambios cosméticos (alguien se conecta o se va)
  clearTimeout(soft);
  soft = setTimeout(broadcast, 400);
}
setInterval(() => { for (const c of clients) { try { c.res.write(": ping\n\n"); } catch (e) {} } }, 25000);

/* ====================== http ====================== */

function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}
function body(req) {
  return new Promise((resolve, reject) => {
    const parts = []; let size = 0;
    req.on("data", (c) => { size += c.length; parts.push(c); if (size > 20000) { reject(new Error("too big")); req.destroy(); } });
    // Se junta todo y se decodifica una sola vez: así no se parten las letras con tilde.
    req.on("end", () => { try { const t = Buffer.concat(parts).toString("utf8"); resolve(t ? JSON.parse(t) : {}); } catch (e) { reject(e); } });
  });
}

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon",
};
function serveFile(res, file) {
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("No encontrado"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(buf);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const p = url.pathname;
  try {
    if (req.method === "GET" && (p === "/" || p === "/index.html")) return serveFile(res, path.join(PUBLIC, "index.html"));
    if (req.method === "GET" && (p === "/votar" || p === "/votar.html")) return serveFile(res, path.join(PUBLIC, "votar.html"));
    if (req.method === "GET" && p === "/qrcode.js") return serveFile(res, path.join(PUBLIC, "qrcode.js"));
    if (req.method === "GET" && p === "/api/acceso") return send(res, 200, { puedeMandar: REMOTO || esLocal(req) });
    if (req.method === "GET" && p === "/api/state") return send(res, 200, publicState());
    if (req.method === "GET" && p === "/api/stream") {
      res.writeHead(200, { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store", Connection: "keep-alive", "X-Accel-Buffering": "no" });
      res.write(`data: ${JSON.stringify(publicState())}\n\n`);
      const c = { res, role: url.searchParams.get("r") === "phone" ? "phone" : "screen" };
      clients.add(c);
      if (c.role === "phone") softBroadcast();
      req.on("close", () => { clients.delete(c); if (c.role === "phone") softBroadcast(); });
      return;
    }
    if (req.method !== "POST") { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("No encontrado"); }
    const b = await body(req);

    /* ---------- lo que envian los celulares ---------- */

    if (p === "/api/vehiculo") {
      if (st.phase !== "escaner") return send(res, 409, { error: "El escáner no está abierto todavía." });
      if (!validToken(b.token) || !vehicleIds().includes(b.id)) return send(res, 400, { error: "Voto no válido." });
      st.vVotes[b.token] = b.id;
      broadcast(); return send(res, 200, { ok: true });
    }

    if (p === "/api/piezas") {
      if (st.phase !== "diagnostico") return send(res, 409, { error: "El diagnóstico no está abierto." });
      const hayAhora = piezasDe(winnerVehicle(tally().vehicles));
      const ids = Array.isArray(b.ids) ? [...new Set(b.ids)].filter((id) => hayAhora.includes(id)) : [];
      if (!validToken(b.token) || !ids.length || ids.length > 2) return send(res, 400, { error: "Elige 1 o 2 piezas." });
      st.pVotes[b.token] = ids;
      broadcast(); return send(res, 200, { ok: true });
    }

    if (p === "/api/idea") {
      if (st.phase !== "taller") return send(res, 409, { error: "El taller no está abierto." });
      const top = st.top.length ? st.top : computeTop(tally().pieces);
      const text = clean(b.text, 140);
      if (!validToken(b.token) || !top.includes(b.piece) || !text) return send(res, 400, { error: "Escribe tu idea para una pieza averiada." });
      if (st.ideas.filter((i) => i.piece === b.piece).length >= MAX_IDEAS_POR_PIEZA) return send(res, 429, { error: "Esa pieza ya tiene muchas ideas." });
      if (st.ideas.filter((i) => i.piece === b.piece && i.token === b.token).length >= MAX_IDEAS_POR_PERSONA) {
        return send(res, 429, { error: `Máximo ${MAX_IDEAS_POR_PERSONA} ideas por pieza. Apoya una idea existente.` });
      }
      st.ideas.push({ id: newId(), piece: b.piece, text, token: b.token, favs: {} });
      broadcast(); return send(res, 200, { ok: true });
    }

    if (p === "/api/idea-fav") {
      if (st.phase !== "taller") return send(res, 409, { error: "El taller no está abierto." });
      const idea = st.ideas.find((i) => i.id === b.id);
      if (!validToken(b.token) || !idea) return send(res, 400, { error: "Esa idea ya no existe." });
      const mine = st.ideas.filter((i) => i.piece === idea.piece && i.favs && i.favs[b.token]);
      const yaEra = mine.some((i) => i.id === idea.id);
      for (const i of mine) delete i.favs[b.token];       // un apoyo por pieza
      if (!yaEra) { idea.favs = idea.favs || {}; idea.favs[b.token] = 1; }
      broadcast(); return send(res, 200, { ok: true, on: !yaEra });
    }

    // El nombre es solo para los créditos del final. Se guarda aparte de los
    // votos y sin el token, para no poder atar un nombre a lo que votó.
    if (p === "/api/nombre") {
      const name = clean(b.name, 24);
      if (!name) return send(res, 400, { error: "Escribe tu nombre." });
      st.nombres = st.nombres || [];
      const mio = b.id ? st.nombres.find((n) => n.id === b.id) : null;
      if (mio) { mio.name = name; broadcast(); return send(res, 200, { ok: true, id: mio.id }); }
      if (st.nombres.length >= MAX_NOMBRES) return send(res, 429, { error: "Ya no caben más nombres en los créditos." });
      const nuevo = { id: newId(), name };
      // En posición al azar: si fueran en orden de llegada, ese orden diría
      // quién votó primero, y los votos se guardan en ese mismo orden.
      st.nombres.splice(crypto.randomInt(st.nombres.length + 1), 0, nuevo);
      broadcast(); return send(res, 200, { ok: true, id: nuevo.id });
    }

    /* ---------- controles del facilitador ---------- */

    if (p.startsWith("/api/admin/")) {
      if (!REMOTO && !esLocal(req)) return send(res, 403, { error: "Solo la computadora que presenta puede mover el taller." });
      // La clave buena pasa siempre: el freno nunca deja fuera a quien presenta.
      if ((req.headers["x-admin"] || "") !== ADMIN) {
        if (bloqueado(req)) return send(res, 429, { error: "Demasiados intentos. Espera 10 minutos." });
        apuntaFallo(req);
        return send(res, 403, { error: "Clave de facilitador incorrecta." });
      }
      olvidaFallos(req);
      const a = p.slice("/api/admin/".length);

      if (a === "phase") {
        if (!PHASES.includes(b.phase)) return send(res, 400, { error: "Ronda no válida." });
        st.phase = b.phase;
        // Al entrar al taller, las piezas averiadas quedan fijas.
        if (b.phase === "taller" && !st.top.length) st.top = computeTop(tally().pieces, piezasDe(winnerVehicle(tally().vehicles)));
      } else if (a === "custom") {
        const name = clean(b.name, 30);
        if (!name) return send(res, 400, { error: "Falta el nombre." });
        if (st.custom.length >= 6) return send(res, 429, { error: "Ya hay 6 vehículos propuestos." });
        st.custom.push({ id: "c" + crypto.randomBytes(3).toString("hex"), name });
      } else if (a === "adjust") {
        const map = b.kind === "pieza" ? st.pManual : st.vManual;
        const ids = b.kind === "pieza" ? pieceIds : vehicleIds();
        if (!ids.includes(b.id)) return send(res, 400, { error: "No existe." });
        const current = tally()[b.kind === "pieza" ? "pieces" : "vehicles"][b.id] || 0;
        if (Number(b.d) < 0 && current === 0) return send(res, 200, { ok: true });
        map[b.id] = (map[b.id] || 0) + (Number(b.d) > 0 ? 1 : -1);
      } else if (a === "retop") {
        st.top = computeTop(tally().pieces, piezasDe(winnerVehicle(tally().vehicles)));
        for (const k of Object.keys(st.installed)) if (!st.top.includes(k)) delete st.installed[k];
      } else if (a === "idea") {
        const top = st.top.length ? st.top : computeTop(tally().pieces);
        const text = clean(b.text, 140);
        if (!top.includes(b.piece) || !text) return send(res, 400, { error: "Falta la pieza o el texto." });
        st.ideas.push({ id: newId(), piece: b.piece, text, token: "facilitador", favs: {} });
      } else if (a === "idea-delete") {
        const idea = st.ideas.find((i) => i.id === b.id);
        st.ideas = st.ideas.filter((i) => i.id !== b.id);
        if (idea && st.installed[idea.piece] === b.id) delete st.installed[idea.piece];
      } else if (a === "install") {
        if (!pieceIds.includes(b.piece)) return send(res, 400, { error: "Esa pieza no existe." });
        if (b.idea === null || b.idea === "") { delete st.installed[b.piece]; }
        else {
          const idea = st.ideas.find((i) => i.id === b.idea && i.piece === b.piece);
          if (!idea) return send(res, 400, { error: "Esa idea no es de esa pieza." });
          st.installed[b.piece] = idea.id;
        }
      } else if (a === "nombre") {
        const name = clean(b.name, 24);
        if (!name) return send(res, 400, { error: "Escribe el nombre." });
        st.nombres = st.nombres || [];
        if (st.nombres.length >= MAX_NOMBRES) return send(res, 429, { error: "Ya no caben más nombres." });
        st.nombres.splice(crypto.randomInt(st.nombres.length + 1), 0, { id: newId(), name });
      } else if (a === "nombre-delete") {
        st.nombres = (st.nombres || []).filter((n) => n.id !== b.id);
      } else if (a === "reset") {
        st = fresh();
      } else {
        return send(res, 404, { error: "Acción desconocida." });
      }
      broadcast(); return send(res, 200, { ok: true });
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("No encontrado");
  } catch (e) {
    send(res, 400, { error: "Solicitud no válida." });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  const base = BASE_PUBLICA || `http://localhost:${PORT}`;
  const local = `${base}/?admin=${ADMIN}`;
  console.log("");
  console.log("  SCRUM CITY  ·  tuneando el equipo SOLTI");
  console.log("  ----------------------------------------------------------");
  console.log("");
  console.log(REMOTO
    ? "  PANTALLA (ábrela con este enlace y proyéctala; la clave es la que manda, no la compartas):"
    : "  PANTALLA (ábrela en ESTA computadora y proyéctala; solo desde aquí se mueve el taller):");
  console.log("    " + local);
  console.log("");
  console.log("  CELULARES (es el QR que sale en la pantalla):");
  console.log("    " + JOIN);
  console.log("");
  if (REMOTO) {
    console.log("  MODO REMOTO: el taller se mueve desde cualquier sitio con esa clave.");
    console.log("  Guárdala para ti. Lo que se comparte es el enlace de los celulares, sin ?admin=");
  } else {
    console.log("  Los celulares deben estar en la misma red Wi-Fi que esta computadora.");
    console.log("  Nadie más puede tomar el mando: desde otro equipo el taller se ve, pero no se toca.");
  }
  if (!REMOTO && BASE_PUBLICA) {
    console.log("");
    console.log("  AVISO: el taller está publicado en internet, pero el mando sigue atado a");
    console.log("  esta computadora, así que nadie podrá mover las rondas desde fuera.");
    console.log("  Para manejarlo a distancia, enciéndelo con ADMIN_REMOTO=1.");
  }
  console.log("  Para detener el servidor: Ctrl + C");
  console.log("");

  if (process.env.ABRIR === "1") {
    try {
      if (process.platform === "win32") spawn("cmd", ["/c", "start", "", local], { detached: true, stdio: "ignore" }).unref();
      else if (process.platform === "darwin") spawn("open", [local], { detached: true, stdio: "ignore" }).unref();
      else spawn("xdg-open", [local], { detached: true, stdio: "ignore" }).unref();
    } catch (e) { /* ábrelo a mano con el enlace de arriba */ }
  }
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`\n  El puerto ${PORT} ya está ocupado. Cierra el otro servidor o usa otro puerto:\n`);
    console.error(`    PowerShell:  $env:PORT="3001"; node server.js\n`);
  } else console.error(e);
  process.exit(1);
});
