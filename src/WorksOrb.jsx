import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import "./worksorb.css";

/* ------------------------------------------------------------------
   YOUR PROJECTS
   img  -> put screenshots in /public/projects/ (any size, 16:10 looks best).
           If a file is missing, a generated placeholder card is drawn instead.
   Add / remove entries freely: the orbits re-balance themselves.
   { sealed: true } makes a locked "classified" card.
------------------------------------------------------------------- */
export const PROJECTS = [
  {
    title: "SPAEMS_ESP32",
    tag: "IoT",
    img: "/projects/spaems.jpg",
    href: "https://github.com/MRA810/SPAEMS_ESP32-whole-project",
    desc: "Smart poultry environment: an ESP32 monitors temperature and gas levels and automates control to help keep a safer poultry environment.",
    stack: ["ESP32", "MQTT", "Flask"],
  },
  {
    title: "PerseCraftCD",
    tag: "Algorithm",
    img: "/projects/persecraftcd.jpg",
    href: "https://github.com/MRA810/PerseCraftCD",
    desc: "An algorithm project.",
    stack: ["C / C++"],
  },
  {
    title: "SmartGate",
    tag: "Cybersecurity",
    img: "/projects/smartgate.jpg",
    href: "https://github.com/MRA810/SmartGate",
    desc: "A proxy server with a simple web interface, built with Flask.",
    stack: ["Proxy", "Flask", "Python"],
  },
  {
    title: "pronoy",
    tag: "Production",
    img: "/projects/pronoy.jpg",
    href: "https://github.com/MRA810/pronoy",
    desc: "A production project that is still on going.",
    stack: ["On going"],
  },
  {
    title: "CampusGO",
    tag: "Concept",
    img: "/projects/campusgo.jpg",
    href: "https://github.com/MRA810/CampusGO",
    desc: "A concept for university transport.",
    stack: ["Concept", "University transport"],
  },
  {
    title: "DBMS-Project-Air-Ticket",
    tag: "Concept",
    img: "/projects/air-ticket.jpg",
    href: "https://github.com/MRA810/DBMS-Project-Air-Ticket",
    desc: "An airline ticket booking system built as a database (DBMS) project.",
    stack: ["DBMS", "MySQL"],
  },
  {
    title: "Shuriken: Undead Hunt",
    tag: "Game",
    img: "/projects/shuriken.jpg",
    href: "",
    desc: "A ninja-versus-zombie shooter written in C++ with OpenGL and GLUT. It began as a graphics assignment and kept growing into a personal project.",
    stack: ["C++", "OpenGL", "GLUT"],
  },
  {
    title: "Rock-Paper-Scissor Sorting",
    tag: "Algorithm",
    img: "/projects/rps-sorting.jpg",
    href: "https://github.com/MRA810/Rock-Paper_scissor-sorting",
    desc: "A sorting project built around rock, paper and scissors.",
    stack: ["Sorting", "Algorithm"],
  },
];

const RINGS = [
  { R: 3.3, tx: 0.28, tz: 0.1, sp: 0.17 },
  { R: 4.1, tx: -0.46, tz: 0.36, sp: -0.12 },
  { R: 4.9, tx: 0.6, tz: -0.32, sp: 0.09 },
];
const CW = 1.9,
  CH = 1.19,
  CUT = 0.09,
  SPHERE_R = 1.5;
const SW = 800,
  SH = 500;
const GLY = "#*@%&$+/<>=~?";
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- screenshot canvas (real image if present, else a generated card) ---------- */
function makeShot(p, i, onUpdate) {
  const c = document.createElement("canvas");
  c.width = SW;
  c.height = SH;
  const g = c.getContext("2d");
  const font = (w, s) => `${w} ${s}px Oxanium, "WDXL Lubrifont TC", sans-serif`;

  const sealed = () => {
    g.fillStyle = "#07050b";
    g.fillRect(0, 0, SW, SH);
    for (let y = 0; y < 25; y++)
      for (let x = 0; x < 40; x++) {
        const r =
          Math.abs(Math.sin((x + 1) * 12.9898 + (y + 1) * 78.233 + i * 5.1)) *
          43758;
        g.fillStyle = `rgba(99,6,202,${(r % 1) * 0.28})`;
        g.fillRect(x * 20 + 2, y * 20 + 2, 16, 16);
      }
    g.fillStyle = "#000";
    [
      [60, 120, 520, 34],
      [60, 176, 360, 34],
      [60, 232, 440, 34],
      [60, 330, 300, 34],
    ].forEach(([x, y, w, h]) => {
      g.fillRect(x, y, w, h);
      g.strokeStyle = "rgba(255,58,0,.55)";
      g.strokeRect(x + 0.5, y + 0.5, w, h);
    });
    g.fillStyle = "#ff3a00";
    g.font = font(700, 30);
    g.fillText("SEALED", 60, 450);
    g.fillStyle = "rgba(255,255,255,.4)";
    g.font = font(400, 18);
    g.fillText("ACCESS PENDING", 220, 450);
  };

  const placeholder = () => {
    const bg = g.createLinearGradient(0, 0, SW, SH);
    bg.addColorStop(0, "#0e0819");
    bg.addColorStop(1, "#1d0800");
    g.fillStyle = bg;
    g.fillRect(0, 0, SW, SH);
    g.strokeStyle = "rgba(255,255,255,.06)";
    for (let x = 0; x < SW; x += 40) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, SH);
      g.stroke();
    }
    g.fillStyle = "rgba(255,255,255,.08)";
    g.fillRect(0, 0, SW, 44);
    ["#ff3a00", "#fff0a4", "#6306ca"].forEach((col, k) => {
      g.fillStyle = col;
      g.beginPath();
      g.arc(26 + k * 24, 22, 7, 0, 7);
      g.fill();
    });
    g.fillStyle = "rgba(99,6,202,.55)";
    g.fillRect(60, 270, 300, 140);
    g.fillStyle = "rgba(255,58,0,.35)";
    g.fillRect(380, 270, 360, 64);
    g.fillRect(380, 346, 240, 64);
  };

  const label = () => {
    const sh = g.createLinearGradient(0, SH - 190, 0, SH);
    sh.addColorStop(0, "rgba(5,5,5,0)");
    sh.addColorStop(1, "rgba(5,5,5,.92)");
    g.fillStyle = sh;
    g.fillRect(0, SH - 190, SW, 190);
    let s = 64;
    g.font = font(700, s);
    while (g.measureText(p.title).width > SW - 100 && s > 24)
      g.font = font(700, (s -= 4));
    g.fillStyle = "#fff0a4";
    g.fillText(p.title, 50, SH - 70);
    g.fillStyle = "#ff3a00";
    g.font = font(400, 22);
    g.fillText(p.tag.toUpperCase(), 52, SH - 30);
  };

  if (p.sealed) {
    sealed();
    return c;
  }
  placeholder();
  label();
  if (p.img) {
    const im = new Image();
    im.onload = () => {
      const k = Math.max(SW / im.width, SH / im.height);
      g.drawImage(
        im,
        (SW - im.width * k) / 2,
        (SH - im.height * k) / 2,
        im.width * k,
        im.height * k,
      );
      label();
      onUpdate();
    };
    im.src = p.img;
  }
  return c;
}

/* ---------- shaders ---------- */
const POINT_VS = `
attribute float aSeed;
uniform float uTime, uSize, uPR;
varying float vRim, vSeed, vY;
void main(){
  vec3 dir = normalize(position);
  float pulse = 1. + .03*sin(uTime*1.2 + aSeed*30. + dir.y*4.) + .02*sin(uTime*.7 + dir.x*5.);
  vec4 mv = modelViewMatrix * vec4(dir * ${SPHERE_R.toFixed(2)} * pulse, 1.);
  vec3 n = normalize(normalMatrix * dir);
  vRim = 1. - abs(n.z);
  vSeed = aSeed;
  vY = dir.y;
  gl_PointSize = uSize * uPR * (1. + aSeed*.9) * (7. / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const POINT_FS = `
uniform vec3 uA, uB;
varying float vRim, vSeed, vY;
void main(){
  float r = length(gl_PointCoord - .5);
  if(r > .5) discard;
  float a = smoothstep(.5, .1, r);
  vec3 col = mix(uB, uA, smoothstep(-.6, .8, vY + (vSeed-.5)*.5));
  col *= .55 + 1.1*vRim;
  gl_FragColor = vec4(col, a*(.45 + .55*vRim + .2*vSeed));
  #include <colorspace_fragment>
}`;
const ATMO_VS = `
varying vec3 vN;
void main(){
  vN = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;
const ATMO_FS = `
varying vec3 vN;
void main(){
  float i = pow(max(0., -vN.z), 2.2);
  vec3 col = vec3(.39,.024,.79)*i*1.7 + vec3(1.,.23,0.)*pow(i,3.)*.7;
  gl_FragColor = vec4(col, i);
  #include <colorspace_fragment>
}`;
const CARD_VS = `
varying vec2 vUv;
varying float vDepth;
void main(){
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;
const CARD_FS = `
uniform sampler2D uMap;
uniform vec3 uTint;
uniform float uReveal, uTime, uAlpha, uGlitch;
varying vec2 vUv;
varying float vDepth;
const vec2 CUT = vec2(${(CUT / CW).toFixed(4)}, ${(CUT / CH).toFixed(4)});
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec2 uv = vUv;
  if(!gl_FrontFacing) uv.x = 1. - uv.x;
  vec2 q = min(uv, 1. - uv);
  if(q.x/CUT.x + q.y/CUT.y < 1.) discard;
  float band = step(.985, h(vec2(floor(uv.y*28.), floor(uTime*4.))));
  uv.x += band * uGlitch * .04;
  vec3 c = texture2D(uMap, uv).rgb;
  float g = dot(c, vec3(.299,.587,.114));
  vec3 mono = vec3(g) * uTint * 1.5;
  mono *= .78 + .22*(.5 + .5*sin(uv.y*520. + uTime*3.));
  mono += (h(floor(uv*vec2(90.,56.)) + floor(uTime*10.)) - .5) * .07;
  vec3 col = mix(mono*.55, c, uReveal);
  if(!gl_FrontFacing) col *= .4;
  col = mix(col, vec3(.02,.016,.03), smoothstep(11.5, 17., vDepth)*.75);
  gl_FragColor = vec4(col, uAlpha);
  #include <colorspace_fragment>
}`;

/* ---------- text that decodes out of noise ---------- */
function Decode({ text }) {
  const [s, setS] = useState("");
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setS(text);
      return;
    }
    let n = 0;
    const total = text.length + 6;
    const id = setInterval(() => {
      n++;
      const shown = Math.floor((n / total) * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++)
        out +=
          text[i] === " " || i < shown
            ? text[i]
            : GLY[Math.floor(Math.random() * GLY.length)];
      setS(out);
      if (n >= total) {
        clearInterval(id);
        setS(text);
      }
    }, 28);
    return () => clearInterval(id);
  }, [text]);
  return <>{s}</>;
}

export default function WorksOrb({ onClose, time }) {
  const mount = useRef();
  const shots = useRef([]);
  const pickRef = useRef(() => {});
  const openRef = useRef(null);
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = useState(null); // { i, url }
  const [leaving, setLeaving] = useState(false);
  const [fail, setFail] = useState(false);
  const unsealed = useMemo(() => PROJECTS.filter((p) => !p.sealed).length, []);

  const openAt = (i) =>
    setOpen({
      i,
      url: PROJECTS[i].sealed
        ? ""
        : shots.current[i]?.toDataURL("image/jpeg", 0.85) || "",
    });
  pickRef.current = openAt;
  openRef.current = open;

  const close = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onClose, 550);
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    const k = (ev) => {
      if (ev.key !== "Escape") return;
      if (openRef.current) setOpen(null);
      else closeRef.current();
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  useEffect(() => {
    const host = mount.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
      setFail(true);
      return;
    }
    const PR = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(PR);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    const el = renderer.domElement;
    el.style.cursor = "grab";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const world = new THREE.Group();
    scene.add(world);
    const disposables = [];
    const track = (o) => (disposables.push(o), o);

    const ORANGE = new THREE.Color(0xff3a00),
      PURPLE = new THREE.Color(0x6306ca),
      CREAM = new THREE.Color(0xfff0a4);
    const uTime = { value: 0 };

    /* the ball */
    const occ = new THREE.Mesh(
      track(new THREE.SphereGeometry(SPHERE_R * 0.965, 48, 32)),
      track(new THREE.MeshBasicMaterial({ color: 0x07050b })),
    );
    world.add(occ);
    const N = 2800,
      pos = new Float32Array(N * 3),
      seed = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2,
        r = Math.sqrt(1 - y * y),
        th = i * 2.399963;
      pos.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3);
      seed[i] = Math.abs(Math.sin(i * 91.7)) % 1;
    }
    const pg = track(new THREE.BufferGeometry());
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pg.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const pts = new THREE.Points(
      pg,
      track(
        new THREE.ShaderMaterial({
          uniforms: {
            uTime,
            uSize: { value: 2.4 },
            uPR: { value: PR },
            uA: { value: ORANGE },
            uB: { value: PURPLE },
          },
          vertexShader: POINT_VS,
          fragmentShader: POINT_FS,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );
    world.add(pts);
    const atmo = new THREE.Mesh(
      track(new THREE.SphereGeometry(SPHERE_R * 1.28, 48, 32)),
      track(
        new THREE.ShaderMaterial({
          vertexShader: ATMO_VS,
          fragmentShader: ATMO_FS,
          side: THREE.BackSide,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );
    scene.add(atmo);

    const circle = (r, n = 160) => {
      const a = new Float32Array((n + 1) * 3);
      for (let i = 0; i <= n; i++)
        a.set(
          [Math.cos((i / n) * 6.2832) * r, 0, Math.sin((i / n) * 6.2832) * r],
          i * 3,
        );
      const g = track(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.BufferAttribute(a, 3));
      return g;
    };
    const thin = (r, color, op, tx, tz) => {
      const l = new THREE.Line(
        circle(r),
        track(
          new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: op,
          }),
        ),
      );
      l.rotation.set(tx, 0, tz);
      world.add(l);
      return l;
    };
    const w1 = thin(SPHERE_R * 1.42, ORANGE, 0.45, 1.2, 0.2);
    const w2 = thin(SPHERE_R * 1.62, PURPLE, 0.7, -0.5, 0.9);

    /* drifting dust */
    const DN = 700,
      dp = new Float32Array(DN * 3);
    for (let i = 0; i < DN; i++) {
      const r = 6 + Math.random() * 12,
        a = Math.random() * 6.2832,
        b = Math.acos(2 * Math.random() - 1);
      dp.set(
        [
          r * Math.sin(b) * Math.cos(a),
          r * Math.cos(b) * 0.7,
          r * Math.sin(b) * Math.sin(a),
        ],
        i * 3,
      );
    }
    const dg = track(new THREE.BufferGeometry());
    dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
    const dust = new THREE.Points(
      dg,
      track(
        new THREE.PointsMaterial({
          color: 0xc9b8ff,
          size: 0.045,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
        }),
      ),
    );
    scene.add(dust);

    /* orbits + cards */
    const groups = RINGS.map((rg) => {
      const g = new THREE.Group();
      g.rotation.set(rg.tx, 0, rg.tz);
      world.add(g);
      const l = new THREE.Line(
        circle(rg.R),
        track(
          new THREE.LineDashedMaterial({
            color: 0xffffff,
            dashSize: 0.1,
            gapSize: 0.22,
            transparent: true,
            opacity: 0.2,
          }),
        ),
      );
      l.computeLineDistances();
      g.add(l);
      return g;
    });
    const cardGeo = track(new THREE.PlaneGeometry(CW, CH));
    const hx = CW / 2,
      hy = CH / 2;
    const edgeGeo = track(new THREE.BufferGeometry());
    edgeGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([
          -hx + CUT,
          -hy,
          0,
          hx - CUT,
          -hy,
          0,
          hx,
          -hy + CUT,
          0,
          hx,
          hy - CUT,
          0,
          hx - CUT,
          hy,
          0,
          -hx + CUT,
          hy,
          0,
          -hx,
          hy - CUT,
          0,
          -hx,
          -hy + CUT,
          0,
        ]),
        3,
      ),
    );
    const perRing = [0, 0, 0];
    PROJECTS.forEach((_, i) => perRing[i % 3]++);
    const seen = [0, 0, 0];
    const cards = PROJECTS.map((p, i) => {
      const ri = i % 3,
        rg = RINGS[ri],
        k = seen[ri]++;
      const canvas = makeShot(p, i, () => (tex.needsUpdate = true));
      shots.current[i] = canvas;
      const tex = track(new THREE.CanvasTexture(canvas));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const mat = track(
        new THREE.ShaderMaterial({
          uniforms: {
            uMap: { value: tex },
            uTint: {
              value:
                p.sealed || i % 2
                  ? PURPLE.clone().lerp(new THREE.Color(1, 1, 1), 0.35)
                  : ORANGE.clone().lerp(new THREE.Color(1, 1, 1), 0.2),
            },
            uReveal: { value: 0 },
            uAlpha: { value: 0 },
            uGlitch: { value: 0 },
            uTime,
          },
          vertexShader: CARD_VS,
          fragmentShader: CARD_FS,
          transparent: true,
          side: THREE.DoubleSide,
        }),
      );
      const mesh = new THREE.Mesh(cardGeo, mat);
      const em = track(
        new THREE.LineBasicMaterial({
          color: ORANGE,
          transparent: true,
          opacity: 0.5,
        }),
      );
      [0.004, -0.004].forEach((z) => {
        const l = new THREE.LineLoop(edgeGeo, em);
        l.position.z = z;
        mesh.add(l);
      });
      mesh.userData.card = i;
      groups[ri].add(mesh);
      return {
        mesh,
        mat,
        em,
        ring: rg,
        a: (k / perRing[ri]) * 6.2832 + ri * 1.1,
        ph: i * 1.7,
        rv: 0,
        delay: 0.5 + i * 0.16,
      };
    });
    const hitList = [occ, ...cards.map((c) => c.mesh)];

    /* sizing */
    let baseZ = 10.2;
    const resize = () => {
      const w = host.clientWidth || 1,
        h = host.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      baseZ =
        camera.aspect >= 1.2 ? 10.2 : 10.2 * Math.pow(1.2 / camera.aspect, 0.9);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* input */
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const mouse = { x: 0, y: 0, in: false, cx: 0, cy: 0 };
    const drag = { on: false, vy: 0, rx: 0, moved: 0, lx: 0, ly: 0 };
    let zoom = 1,
      zoomT = 1,
      hov = -1;
    const pick = (cx, cy) => {
      const r = el.getBoundingClientRect();
      ndc.set(
        ((cx - r.left) / r.width) * 2 - 1,
        -((cy - r.top) / r.height) * 2 + 1,
      );
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(hitList, false)[0];
      return hit && hit.object.userData.card !== undefined
        ? hit.object.userData.card
        : -1;
    };
    const onDown = (e) => {
      drag.on = true;
      drag.moved = 0;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      mouse.cx = e.clientX;
      mouse.cy = e.clientY;
      mouse.in = true;
      if (!drag.on) return;
      const dx = e.clientX - drag.lx,
        dy = e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      world.rotation.y += dx * 0.006;
      drag.vy = dx * 0.006;
      drag.rx = clamp(drag.rx + dy * 0.004, -0.7, 0.7);
    };
    const onUp = (e) => {
      if (!drag.on) return;
      drag.on = false;
      el.style.cursor = hov >= 0 ? "pointer" : "grab";
      if (drag.moved < 6) {
        const i = pick(e.clientX, e.clientY);
        if (i >= 0) pickRef.current(i);
      }
    };
    const onLeave = () => (mouse.in = false);
    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      zoomT = clamp(zoomT + e.deltaY * 0.0006, 0.72, 1.25);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onLeave);
    const wheelHost = host.parentElement;
    wheelHost.addEventListener("wheel", onWheel, { passive: false });

    /* loop */
    let raf,
      t = 0,
      slow = 1,
      last = performance.now();
    const spd = reduce ? 0.3 : 1;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      uTime.value = t;

      if (!drag.on && mouse.in) {
        const h = pick(mouse.cx, mouse.cy);
        if (h !== hov) {
          hov = h;
          setHover(h);
          el.style.cursor = h >= 0 ? "pointer" : "grab";
        }
      } else if (!mouse.in && hov !== -1 && !drag.on) {
        hov = -1;
        setHover(-1);
      }

      const calm = hov >= 0 || openRef.current ? 0.07 : 1;
      slow += (calm - slow) * Math.min(1, dt * 3);
      if (!drag.on) {
        world.rotation.y += drag.vy + dt * 0.05 * spd * slow;
        drag.vy *= 0.93;
      }
      world.rotation.x +=
        (drag.rx + mouse.y * 0.1 - world.rotation.x) * Math.min(1, dt * 3);
      zoom += (zoomT - zoom) * Math.min(1, dt * 4);
      camera.position.set(mouse.x * 0.45, -mouse.y * 0.3, baseZ * zoom);
      camera.lookAt(0, 0, 0);

      const sp = clamp((t - 0.1) / 1.6);
      pts.scale.setScalar(0.72 + 0.28 * (1 - Math.pow(1 - sp, 3)));
      w1.rotation.y += dt * 0.25 * spd;
      w2.rotation.y -= dt * 0.18 * spd;
      dust.rotation.y += dt * 0.012 * spd;
      atmo.scale.setScalar(1 + Math.sin(t * 0.9) * 0.015);

      cards.forEach((c, i) => {
        const p = clamp((t - c.delay) / 1.8),
          ease = 1 - Math.pow(1 - p, 3);
        c.a += c.ring.sp * dt * spd * slow;
        const r = lerp(c.ring.R * 2.6, c.ring.R, ease);
        c.mesh.position.set(
          Math.cos(c.a) * r,
          Math.sin(t * 0.8 + c.ph) * 0.12,
          Math.sin(c.a) * r,
        );
        c.mesh.rotation.set(
          0,
          Math.PI / 2 - c.a,
          Math.sin(t * 0.5 + c.ph) * 0.04,
        );
        const want = hov === i || openRef.current?.i === i ? 1 : 0;
        c.rv += (want - c.rv) * Math.min(1, dt * 6);
        c.mesh.scale.setScalar(1 + 0.22 * c.rv);
        c.mat.uniforms.uReveal.value = c.rv;
        c.mat.uniforms.uAlpha.value = ease;
        c.mat.uniforms.uGlitch.value = reduce ? 0 : c.rv * (1 - c.rv) * 4;
        c.em.opacity = (0.35 + 0.65 * c.rv) * ease;
        c.em.color.copy(ORANGE).lerp(CREAM, c.rv);
      });
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onLeave);
      wheelHost.removeEventListener("wheel", onWheel);
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
      el.remove();
    };
  }, []);

  const hp = hover >= 0 ? PROJECTS[hover] : null;
  const op = open ? PROJECTS[open.i] : null;

  return (
    <div
      className={"orb" + (leaving ? " leaving" : "")}
      role="region"
      aria-label="Works archive"
    >
      <div className="orb-bg" />
      <div className="orb-word" aria-hidden="true">
        WORKS
      </div>
      <div className="orb-stage">
        <div ref={mount} className="orb-canvas" aria-hidden="true" />
      </div>
      <div className="orb-vig" />
      <div className="orb-grain" />

      <header className="orb-head">
        <p className="orb-name">MD. ASHRAFUL ALAM SHUVO</p>
        <div className="orb-city">
          <p>DHAKA, BANGLADESH</p>
          <small>{time}</small>
        </div>
        <button className="orb-x" aria-label="Close works" onClick={close}>
          <i />
          <i />
        </button>
      </header>

      <div
        className={"orb-ro" + (hp && !open ? " show" : "")}
        aria-hidden="true"
      >
        {hp && (
          <>
            <p className="orb-ro-t">
              <Decode text={hp.sealed ? "SEALED" : hp.title.toUpperCase()} />
            </p>
            <p className="orb-ro-s">
              {hp.sealed
                ? "ACCESS PENDING"
                : `${hp.tag.toUpperCase()}   /   ${hp.stack.join("   ")}`}
            </p>
          </>
        )}
      </div>

      <footer className="orb-foot">
        <p className="orb-hint">
          DRAG TO ROTATE
          <br />
          HOVER TO DECRYPT
          <br />
          CLICK TO OPEN
        </p>
        <p className="orb-count">
          {String(unsealed).padStart(2, "0")} OF{" "}
          {String(PROJECTS.length).padStart(2, "0")} FILES UNSEALED
        </p>
      </footer>

      {op && (
        <aside
          className="orb-panel"
          key={open.i}
          role="dialog"
          aria-label={op.sealed ? "Sealed file" : op.title}
        >
          <div className="orb-panel-in">
            {op.sealed ? (
              <>
                <p className="orb-p-tag">SEALED</p>
                <h3 className="orb-p-title">Nothing here yet</h3>
                <div className="orb-bars">
                  <b style={{ width: "92%" }} />
                  <b style={{ width: "68%" }} />
                  <b style={{ width: "81%" }} />
                </div>
                <p className="orb-p-desc">
                  This file opens when the next project ships.
                </p>
              </>
            ) : (
              <>
                <p className="orb-p-tag">{op.tag.toUpperCase()}</p>
                <h3 className="orb-p-title">{op.title}</h3>
                {open.url && (
                  <img
                    className="orb-p-shot"
                    src={open.url}
                    alt={op.title + " screenshot"}
                  />
                )}
                <p className="orb-p-desc">{op.desc}</p>
                <div className="orb-chips">
                  {op.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </>
            )}
            <div className="orb-p-act">
              {op.href && (
                <a
                  className="orb-btn"
                  href={op.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  View project
                </a>
              )}
              <button className="orb-btn ghost" onClick={() => setOpen(null)}>
                Close file
              </button>
            </div>
          </div>
        </aside>
      )}

      <ul className={fail ? "orb-list" : "orb-sr"}>
        {PROJECTS.map((p, i) => (
          <li key={i}>
            <button onClick={() => openAt(i)}>
              {p.sealed ? "Sealed file" : p.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
