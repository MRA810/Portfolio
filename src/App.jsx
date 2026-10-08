import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { createPixels } from "./pixels.js";

const SOCIALS = [
  // TODO: replace with real profile URLs
  { name: "LINKEDIN", href: "#", color: "#0a66c2" },
  { name: "GITHUB", href: "#", color: "#c9c9c9" },
  { name: "FACEBOOK", href: "#", color: "#1877f2" },
];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const e = (x) => x * x * (3 - 2 * x);
const lerp = (a, b, t) => a + (b - a) * t;
const GL = "#*@%&$+/<>=~?";
const glyphs = (n, k) => {
  let s = "";
  for (let i = 0; i < n; i++)
    s +=
      GL[
        Math.floor(Math.abs(Math.sin((i + 1) * 12.9898 + k * 78.233)) * 43758) %
          GL.length
      ];
  return s;
};
const morph = (from, to, t, k, toHtml) =>
  t < 0.3
    ? from
    : t > 0.72
      ? (toHtml ?? to)
      : `<span class="o">${glyphs(Math.round(lerp(from.length, to.length, (t - 0.3) / 0.42)), k)}</span>`;
// loading line keyframes: [progress, v1, v2, h1, h2]
const KF = [
  [0, 0.05, 0.95, 0.06, 0.94],
  [0.45, 0.22, 0.78, 0.235, 0.79],
  [0.9, 0.39, 0.607, 0.395, 0.62],
  [0.99, 0.44, 0.56, 0.43, 0.57],
  [1, 0.43, 0.57, 0.42, 0.58],
];
function lines(p) {
  let i = 0;
  while (i < KF.length - 2 && p > KF[i + 1][0]) i++;
  const a = KF[i],
    b = KF[i + 1],
    t = e(clamp((p - a[0]) / (b[0] - a[0])));
  return [1, 2, 3, 4].map((j) => lerp(a[j], b[j], t));
}
function downloadVcf() {
  const v =
    "BEGIN:VCARD\nVERSION:3.0\nFN:Md. Ashraful Alam Shuvo\nN:Shuvo;Md. Ashraful Alam;;;\nTEL;TYPE=CELL:+8801841995394\nEMAIL:ashshuvo1222.prof@gmail.com\nADR;TYPE=HOME:;;;Dhaka;;;Bangladesh\nEND:VCARD";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([v], { type: "text/vcard" }));
  a.download = "ashraful-alam.vcf";
  a.click();
}
const DOTS = [
  [17.8, 17, "#6306CA", 6],
  [2.6, 54, "#FF3A00", 9],
  [39.7, 51, "#FF3A00", -7],
  [65.2, 62, "#6306CA", 5],
  [87.2, 28, "#FF3A00", -8],
];
const WORKS = [
  // TODO: replace placeholder desc with real write-ups
  {
    id: "bb",
    title: "Beautiful Bangladesh",
    tag: "Travel & tourism site",
    desc: "Description coming soon.",
  },
  {
    id: "fifa",
    title: "FIFA 2026 Fan Site",
    tag: "Fan site",
    desc: "Description coming soon.",
  },
  {
    id: "nest",
    title: "NestAdmin",
    tag: "Home rent management",
    desc: "Description coming soon.",
  },
  {
    id: "keepme",
    title: "KeepMe",
    tag: "Shopping list app",
    desc: "Description coming soon.",
  },
  {
    id: "attar",
    title: "Maison Sufia Attar",
    tag: "Fragrance e-commerce",
    desc: "Description coming soon.",
  },
  {
    id: "sem",
    title: "Smart Environment Monitor",
    tag: "IoT dashboard",
    desc: "Description coming soon.",
  },
  {
    id: "gate",
    title: "SmartGate",
    tag: "Lab proxy system",
    desc: "Description coming soon.",
  },
  {
    id: "vdisp",
    title: "Virtual Display",
    tag: "Windows \u2194 Ubuntu monitor",
    desc: "Description coming soon.",
  },
];
// card slots: [x (vw, before spread), y (dvh), row]
const POS = [
  [6.5, 19, 0], [36.5, 19, 0], [66.5, 19, 0],
  [18, 44, 1], [47, 44, 1], [76, 44, 1],
  [28, 69, 2], [58, 69, 2],
];
// scroll lengths in vh. HERO_VH keeps the hero exactly as long as before.
const HERO_VH = 824,
  WORKS_VH = 2050,
  HERO_FRAC = HERO_VH / (HERO_VH + WORKS_VH),
  DOTK = 0.6338 / HERO_FRAC;
// black-section traces, taken from the Figma frame (absolute frame coords)
const BTR = [
  ["p", "M12 223 H612"], ["p", "M290 223 L352 288"], ["p", "M122 288 H578"],
  ["p", "M470 252 H1236"], ["p", "M545 252 L662 370 H1521"], ["p", "M585 248 L630 203 H1505"],
  ["p", "M915 370 L975 312 H1521"], ["p", "M12 333 H945"],
  ["o", "M1374 417 H1521"], ["o", "M470 558 H855 L925 488 H1420 L1490 417"],
  ["o", "M1228 488 L1366 627 H1521"], ["o", "M12 502 H862"], ["o", "M413 502 L470 558"],
  ["o", "M97 628 H398 L470 558"], ["o", "M298 702 H1521"], ["o", "M545 563 L683 702"],
  ["p", "M12 813 H520 L570 858"], ["p", "M392 858 H1303"], ["p", "M665 858 L722 799 H1228"],
  ["p", "M1170 858 L1284 741 H1521"],
];

export default function App() {
  const stage = useRef(),
    cv = useRef(),
    pct = useRef(),
    lenisRef = useRef();
  const [menu, setMenu] = useState(false);
  const [time, setTime] = useState("");
  const [wMode, setWMode] = useState("click");
  const cardRefs = useRef([]),
    boxRefs = useRef([]);
  const activeRef = useRef(null);
  const ctl = useRef(null),
    modeRef = useRef("click"),
    menuRef = useRef(false);
  useEffect(() => {
    menuRef.current = menu;
  }, [menu]);
  const pickMode = (m) => {
    modeRef.current = m;
    setWMode(m);
    ctl.current?.close();
  };
  useEffect(() => {
    const t = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Dhaka",
        })
          .format(new Date())
          .toUpperCase(),
      );
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    lenisRef.current?.[menu ? "stop" : "start"]();
    if (!menu && phase.current !== "ready") lenisRef.current?.stop();
  }, [menu]);
  const phase = useRef("load");

  useEffect(() => {
    const px = createPixels(cv.current),
      S = stage.current;
    const $ = (id) => S.querySelector(`[data-id=${id}]`);
    const el = Object.fromEntries(
      [
        "portrait",
        "ash",
        "more",
        "bd",
        "n1",
        "n2",
        "bio",
        "wifey",
        "add",
        "tag",
        "contact",
        "dots",
        "works",
        "wgrid",
        "wlines",
        "wtoggle",
        "whead",
        "wpwrap",
        "wdim",
        "wpoly",
        "wedgeb",
        "wedges",
        "wcontent",
        "wnum",
        "wtag",
        "wtitle",
        "wrule",
        "wdesc",
        "wx",
        "whub",
        "bsec",
        "btr",
        "bfoot",
      ].map((k) => [k, $(k)]),
    );
    const lenis = new Lenis({
      lerp: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0.2
        : 0.055,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      gestureOrientation: "vertical",
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.stop();
    scrollTo(0, 0);
    let disp = 0,
      over = false,
      mxp = -1e4,
      myp = -1e4,
      power = 0,
      lensDirty = false,
      target = 0,
      cur = 0,
      mx = 0,
      my = 0,
      tx = 0,
      ty = 0,
      ready = false,
      t0 = performance.now(),
      rT = 0,
      ent = 0,
      last = performance.now(),
      raf;
    lenis.on("scroll", () => {
      target = lenis.limit ? lenis.scroll / lenis.limit : 0;
    });
    const onOut = (ev) => {
      if (!ev.relatedTarget) over = false;
    };
    const onMove = (ev) => {
      if (ev.pointerType !== "mouse") return;
      over = true;
      mxp = ev.clientX;
      myp = ev.clientY;
      tx = ev.clientX / innerWidth - 0.5;
      ty = ev.clientY / innerHeight - 0.5;
    };
    addEventListener("pointermove", onMove);
    document.addEventListener("mouseout", onOut);
    let port = innerWidth / innerHeight < 1;
    let panEnd = 0,
      geo = [],
      lineList = [];
    const NSVG = "http://www.w3.org/2000/svg";
    // g = 0: draws with the first scroll; g = 1: draws as it scrolls into view
    const addLine = (d, cls, x0, x1, g) => {
      const p = document.createElementNS(NSVG, "path");
      p.setAttribute("d", d);
      p.setAttribute("class", cls);
      p.setAttribute("pathLength", "1");
      p.style.strokeDasharray = "1";
      p.style.strokeDashoffset = "1";
      el.wlines.appendChild(p);
      lineList.push({ p, x0, x1, g });
    };
    const buildLines = () => {
      const W = innerWidth, H = innerHeight, por = W < H;
      const box = cardRefs.current.filter(Boolean).map((c) => ({
        l: c.offsetLeft, t: c.offsetTop, w: c.offsetWidth, h: c.offsetHeight,
      }));
      geo = box.map((b) => ({ l: b.l / W, r: (b.l + b.w) / W }));
      el.wlines.innerHTML = "";
      lineList = [];
      const rows = [0, 1, 2].map((r) => box.filter((_, i) => POS[i][2] === r));
      // pink traces between the cards of a row
      rows.forEach((row, r) => {
        const below = r === 1; // row 2 routes its bus underneath, others above
        for (let i = 0; i < row.length - 1; i++) {
          const A = row[i], B = row[i + 1], h = A.h, sg = below ? 1 : -1;
          const y0 = A.t + h * 0.5,
            bus = below ? A.t + h * 1.06 : A.t - h * 0.04,
            xe = B.l + B.w + h * 0.33,
            yv = B.t + h * 0.5 + sg * h * 0.33;
          addLine(
            `M${A.l + A.w} ${y0} L${A.l + A.w + Math.abs(bus - y0)} ${bus} L${xe} ${bus} L${xe} ${yv} L${B.l + B.w} ${B.t + h * 0.5}`,
            "wln", A.l + A.w, xe, 0,
          );
        }
      });
      // hub + dark boxes continue the board to the right
      const pinkR = Math.max(...box.map((b) => b.l + b.w));
      const R = (por ? 0.17 : 0.0825) * W,
        hcx = pinkR + 0.255 * W,
        hcy = (por ? 0.5 : 0.538) * H;
      const bw = (por ? 0.64 : 0.29) * W, bh = (por ? 0.2 : 0.33) * H, gx = 0.031 * W;
      const yT = (por ? 0.16 : 0.165) * H, yM = (por ? 0.4 : 0.355) * H, yB = (por ? 0.64 : 0.547) * H;
      const an = (38 * Math.PI) / 180, sa = Math.sin(an), ca = Math.cos(an);
      const dyd = hcy - (yT + bh / 2) - R * sa;
      const aL = hcx + Math.max(0.135 * W, R * ca + Math.abs(dyd) + 0.02 * W);
      const cx3 = [aL, aL + bw + gx, aL + 2 * (bw + gx)];
      const bx = [
        { l: cx3[0], t: yT }, { l: cx3[0], t: yB }, { l: cx3[1], t: yM },
        { l: cx3[2], t: yT }, { l: cx3[2], t: yB },
      ].map((b) => ({ ...b, w: bw, h: bh }));
      boxRefs.current.forEach((n, i) => {
        if (!n) return;
        Object.assign(n.style, {
          left: bx[i].l + "px", top: bx[i].t + "px", width: bw + "px", height: bh + "px",
        });
      });
      Object.assign(el.whub.style, {
        left: hcx - R + "px", top: hcy - R + "px", width: 2 * R + "px", height: 2 * R + "px",
      });
      panEnd = Math.max(0, cx3[2] + bw - 0.68 * W);
      const cy = (b) => b.t + b.h / 2,
        rr = (b) => b.l + b.w;
      // purple: last card of every row -> hub
      rows.forEach((row, r) => {
        const L = row[row.length - 1];
        if (!L) return;
        const yr = hcy + (r - 1) * 0.055 * H,
          hx = hcx - Math.sqrt(Math.max(0, R * R - (yr - hcy) ** 2)),
          xs = hx - 0.05 * W;
        addLine(
          `M${rr(L)} ${cy(L)} H${xs - Math.abs(yr - cy(L))} L${xs} ${yr} H${hx}`,
          "wln", rr(L), hx, 1,
        );
      });
      // black: hub -> first column, then box to box
      [[bx[0], -1], [bx[1], 1]].forEach(([b, sg]) => {
        const sx = hcx + R * ca, sy = hcy + sg * R * sa, ty = cy(b);
        addLine(`M${sx} ${sy} L${sx + Math.abs(ty - sy)} ${ty} H${b.l}`, "wln k", sx, b.l, 1);
      });
      const into = (S, D, edge, f) => {
        const sy = cy(S), ex = D.l + f * D.w, ey = edge === "top" ? D.t : D.t + D.h;
        addLine(`M${rr(S)} ${sy} H${ex - Math.abs(ey - sy)} L${ex} ${ey}`, "wln k", rr(S), ex, 1);
      };
      into(bx[0], bx[2], "top", 0.77);
      into(bx[1], bx[2], "bottom", 0.23);
      into(bx[2], bx[3], "bottom", 0.63);
      into(bx[2], bx[4], "top", 0.31);
    };
    const onRz = () => {
      port = innerWidth / innerHeight < 1;
      clearTimeout(onRz.t);
      onRz.t = setTimeout(buildLines, 120);
    };
    addEventListener("resize", onRz);
    setTimeout(buildLines, 300);
    const img = new Image();
    img.src = "/portrait.webp";
    const lensC = S.querySelector("[data-id=plens]"),
      blurEl = S.querySelector("[data-id=blur]"),
      lctx = lensC.getContext("2d"),
      COLS = 60,
      K = 8;
    let cells = null,
      rows = 0;
    const buildCells = () => {
      const w = img.naturalWidth || 1082,
        h = img.naturalHeight || 1400;
      rows = Math.round((COLS * h) / w);
      const o = document.createElement("canvas");
      o.width = COLS;
      o.height = rows;
      const c = o.getContext("2d", { willReadFrequently: true });
      c.drawImage(img, 0, 0, COLS, rows);
      cells = c.getImageData(0, 0, COLS, rows).data;
      lensC.width = COLS * K;
      lensC.height = rows * K;
    };
    Promise.all([document.fonts.ready, img.decode().catch(() => {})]).then(
      () => {
        ready = true;
        buildCells();
      },
    );
    setTimeout(() => {
      ready = true;
    }, 6500);
    const S_ = (n, x, y, o, s = 1) => {
      if (!n) return;
      n.style.transform = `translate3d(${x}vw,${y}dvh,0) scale(${s})`;
      n.style.opacity = o;
      n.style.visibility = o < 0.003 ? "hidden" : "visible";
    };

    // ---- twisted box opening ----
    const coarse = matchMedia("(pointer:coarse)").matches,
      reduce = matchMedia("(prefers-reduced-motion: reduce)").matches,
      OPEN_S = reduce ? 0.01 : 1.3,
      CLOSE_S = reduce ? 0.01 : 0.95;
    const pan = { t: 0, open: false, i: -1, s: null, shown: false, hto: 0, out: 0, pending: -1 };
    const clickish = () => coarse || modeRef.current === "click";
    const eRect = () => {
      const W = innerWidth, H = innerHeight;
      return { x: 0.036 * W, y: 0.121 * H, w: 0.922 * W, h: 0.82 * H };
    };
    const openBox = (i) => {
      const cd = cardRefs.current[i];
      if (!cd) return;
      if (pan.t > 0 && pan.i !== i) {
        if (!pan.open) pan.pending = i; // closing: open the new one afterwards
        return;
      }
      if (pan.t === 0) {
        const r = cd.getBoundingClientRect();
        pan.s = { x: r.left, y: r.top, w: r.width, h: r.height };
      }
      pan.i = i;
      pan.open = true;
      pan.pending = -1;
      pan.shown = true;
      activeRef.current = WORKS[i].id;
      pan.tag = `0${i + 1}  \u2014  ${WORKS[i].tag.toUpperCase()}`;
      pan.title = WORKS[i].title;
      el.wnum.textContent = `0${i + 1}`;
      el.wdesc.textContent = WORKS[i].desc;
      el.wpwrap.style.visibility = "visible";
      lenis.stop();
    };
    const closeBox = () => {
      clearTimeout(pan.hto);
      pan.pending = -1;
      pan.open = false;
    };
    ctl.current = {
      click: (i) => clickish() && !pan.open && openBox(i),
      enter: (i) => {
        if (clickish() || pan.t > 0) return;
        clearTimeout(pan.hto);
        pan.hto = setTimeout(() => {
          if (Math.abs(lenis.velocity || 0) < 0.4) openBox(i);
        }, 110);
      },
      leave: () => clearTimeout(pan.hto),
      close: closeBox,
    };
    const onKey = (ev) => ev.key === "Escape" && closeBox();
    addEventListener("keydown", onKey);
    // ---- helpers for the new opening ----
    const GLY = "#*@%&$+/<>=~?";
    const decode = (str, p, k) => {
      if (p <= 0) return "";
      const n = Math.floor(p * str.length);
      let out = "";
      for (let i = 0; i < str.length; i++)
        out +=
          str[i] === " " || i < n || p >= 1
            ? str[i]
            : GLY[Math.floor(Math.abs(Math.sin((i + 1) * 12.9898 + k * 78.233)) * 43758) % GLY.length];
      return out;
    };
    const eoExpo = (x) => (x >= 1 ? 1 : (1 - Math.pow(2, -10 * x)) / (1 - Math.pow(2, -10)));
    const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const wxPaths = [...el.wx.querySelectorAll("path")];
    // the card stretches sideways into a bar (fast, expo-out), then rises into the
    // full panel (soft in-out); a small skew gives the lunge some life
    const shape = (t) => {
      const s = pan.s, E = eRect();
      const pw = eoExpo(seg(t, 0, 0.6)), ph = eio(seg(t, 0.13, 0.95));
      const x = lerp(s.x, E.x, pw), w = lerp(s.w, E.w, pw),
        y = lerp(s.y, E.y, ph), h = lerp(s.h, E.h, ph);
      const cEnd = Math.min(0.186 * innerHeight, 0.24 * E.w, 0.4 * E.h);
      const c = Math.min(lerp(22, cEnd, (pw + ph) / 2), w * 0.4, h * 0.4);
      const sh = 0.16 * Math.sin(Math.PI * seg(t, 0, 0.75));
      return [[0, 0], [w - c, 0], [w, c], [w, h], [c, h], [0, h - c]].map(
        ([lx, ly]) => [x + lx + sh * (ly - h / 2), y + ly],
      );
    };
    const stepPanel = (dt, now) => {
      if (pan.open && pan.t > 0.6 && !clickish()) {
        // hover mode: leaving the full box closes it
        const E = eRect(), m = 8,
          inside =
            over &&
            mxp >= E.x - m && mxp <= E.x + E.w + m &&
            myp >= E.y - m && myp <= E.y + E.h + m;
        if (inside) pan.out = 0;
        else if (!pan.out) pan.out = now;
        else if (now - pan.out > 120) closeBox();
      } else pan.out = 0;
      pan.t = pan.open
        ? Math.min(1, pan.t + dt / OPEN_S)
        : Math.max(0, pan.t - dt / CLOSE_S);
      if (!pan.shown) return;
      if (pan.t <= 0 && !pan.open) {
        pan.shown = false;
        el.wpwrap.style.visibility = "hidden";
        el.wpoly.style.pointerEvents = "none";
        el.wx.style.pointerEvents = "none";
        activeRef.current = null;
        if (pan.pending >= 0) openBox(pan.pending);
        else if (!menuRef.current && phase.current === "ready") lenis.start();
        return;
      }
      const t = pan.t, E = eRect(), kk = Math.floor(now / 45);
      const pts = shape(t);
      el.wpoly.style.clipPath = `polygon(${pts.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(",")})`;
      const ps = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
      el.wedgeb.setAttribute("points", ps);
      el.wedges.setAttribute("points", ps);
      el.wpoly.style.opacity = lerp(0.8, 1, e(seg(t, 0.2, 0.6)));
      el.wpoly.style.filter = `brightness(${1 + 0.4 * (1 - e(seg(t, 0, 0.55)))})`;
      el.wpoly.style.setProperty("--sx", lerp(100, 0, e(seg(t, 0.25, 0.92))) + "%");
      el.wpoly.style.pointerEvents = "auto";
      // edge: a steady border + one bright streak that runs around it
      el.wedgeb.style.opacity = e(seg(t, 0.02, 0.2));
      el.wedges.setAttribute("stroke-dashoffset", -100 * e(seg(t, 0.12, 0.92)));
      el.wedges.style.opacity = Math.sin(Math.PI * seg(t, 0.1, 0.95));
      // backdrop: purple tint + soft blur of everything behind
      const dm = e(seg(t, 0.3, 0.95));
      el.wdim.style.opacity = dm;
      el.wdim.style.backdropFilter = el.wdim.style.webkitBackdropFilter = `blur(${(dm * 7).toFixed(2)}px)`;
      // text: decodes in with the same glyph scramble as the hero name
      Object.assign(el.wcontent.style, {
        left: E.x + "px", top: E.y + "px", width: E.w + "px", height: E.h + "px",
      });
      el.wtag.textContent = decode(pan.tag || "", e(seg(t, 0.6, 0.8)), kk);
      el.wtitle.textContent = decode(pan.title || "", e(seg(t, 0.66, 0.93)), kk + 5);
      el.wrule.style.transform = `scaleX(${e(seg(t, 0.72, 0.95))})`;
      const dd = e(seg(t, 0.8, 1));
      el.wdesc.style.opacity = dd;
      el.wdesc.style.transform = `translateY(${(1 - dd) * 16}px)`;
      const nn = e(seg(t, 0.7, 1));
      el.wnum.style.opacity = nn;
      el.wnum.style.transform = `translateY(${(1 - nn) * 40}px)`;
      // close button: slides out of the corner, then its cross draws itself
      const L = Math.min(0.186 * innerHeight, 0.24 * E.w, 0.4 * E.h) * 0.86,
        xo = e(seg(t, 0.82, 1));
      Object.assign(el.wx.style, {
        left: E.x + E.w - L + "px", top: E.y + "px", width: L + "px", height: L + "px",
        opacity: Math.min(1, xo * 3),
        transform: `translate(${(1 - xo) * L * 0.4}px,${-(1 - xo) * L * 0.4}px)`,
        pointerEvents: xo > 0.6 ? "auto" : "none",
      });
      wxPaths.forEach((pp, n) =>
        pp.setAttribute("stroke-dashoffset", 20 * (1 - e(seg(t, 0.9 + n * 0.03, 1)))),
      );
    };

    // black overlay = a clip-path made of the pixel cells that have turned black.
    // Same cell grid as the orange wipe (22 columns); hash lives in JS so it is exact.
    const fr = (x) => x - Math.floor(x);
    let bKey = "";
    const btrP = [...el.btr.querySelectorAll("path")];
    btrP.forEach((p) => {
      p.setAttribute("pathLength", "1");
      p.style.strokeDasharray = "1";
      p.style.strokeDashoffset = "1";
    });
    const setBlack = (ww) => {
      const W = innerWidth, H = innerHeight;
      if (ww <= 0.0005) {
        el.bsec.style.visibility = "hidden";
        bKey = "";
        return;
      }
      el.bsec.style.visibility = "visible";
      const key = ww.toFixed(4) + "|" + W + "|" + H;
      if (key === bKey) return;
      bKey = key;
      if (ww >= 0.9999) {
        el.bsec.style.clipPath = "none";
        return;
      }
      const cell = W / 22, rows = Math.ceil(H / cell);
      let d = "";
      for (let ry = 0; ry < rows; ry++) {
        const y0 = Math.round(ry * cell), y1 = Math.min(H, Math.round((ry + 1) * cell));
        let run = -1;
        for (let cx = 0; cx <= 22; cx++) {
          let blk = false;
          if (cx < 22) {
            const h = fr(Math.sin(cx * 127.1 + ry * 311.7) * 43758.5453);
            blk = (1 - (cx + 0.5) / 22) * 0.72 + h * 0.28 <= ww * 1.0002;
          }
          if (blk && run < 0) run = cx;
          if (!blk && run >= 0) {
            const x0 = Math.round(run * cell), x1 = Math.round(cx * cell);
            d += `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;
            run = -1;
          }
        }
      }
      el.bsec.style.clipPath = d ? `path('${d}')` : "path('M0 0')";
    };
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      lenis.raf(now);
      cur += (target - cur) * (1 - Math.exp(-dt * 7));
      mx += (tx - mx) * (1 - Math.exp(-dt * 3));
      my += (ty - my) * (1 - Math.exp(-dt * 3));
      const u = px.u;
      if (phase.current === "load") {
        const tt = clamp((now - t0) / 3600),
          base = tt < 0.5 ? 2 * tt * tt : 1 - Math.pow(-2 * tt + 2, 2) / 2;
        const goal = ready
          ? base
          : Math.min(base, 0.95 + clamp((now - t0 - 3600) / 6000) * 0.04);
        disp += (goal - disp) * (1 - Math.exp(-dt * 6));
        if (goal >= 1 && disp > 0.996) disp = 1;
        const v = disp;
        const l = lines(v);
        u.uV.value.set(l[0], l[1]);
        u.uH.value.set(l[2], l[3]);
        u.uMode.value = 0;
        pct.current.textContent = Math.floor(v * 100) + "%";
        if (v >= 1) {
          phase.current = "hold";
          rT = now;
        }
      } else if (phase.current === "hold" && now - rT > 220) {
        phase.current = "reveal";
        rT = now;
        u.uMode.value = 1;
        pct.current.style.opacity = 0;
      } else if (phase.current === "reveal") {
        const k = clamp((now - rT) / 3000);
        u.uP.value = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        ent = e(seg(k, 0.35, 1));
        if (k >= 1) {
          phase.current = "ready";
          u.uMode.value = 2;
          u.uP.value = 0;
          ent = 1;
          if (!menu) lenis.start();
        }
      }
      const heroCur = clamp(cur / HERO_FRAC),
        worksCur = clamp((cur - HERO_FRAC) / (1 - HERO_FRAC));
      if (phase.current === "ready") {
        const wipeP = clamp(seg(heroCur, 0.62, 1));
        // the orange wipe ends as solid orange and STAYS: it is the works background
        u.uMode.value = 2;
        u.uP.value = wipeP;
        u.uLen.value = 1;
      }
      if (phase.current !== "load" && phase.current !== "hold")
        S.classList.add("live");
      if (
        phase.current !== "ready" ||
        u.uP.value > 0 ||
        u.uP.value < 1 ||
        cur < 0.01
      )
        px.render();

      // ---- scroll choreography (hero) ----
      const a = seg(heroCur, 0, 0.12),
        b = seg(heroCur, 0.12, 0.38),
        c = seg(heroCur, 0.38, 0.62),
        x = seg(heroCur, 0.6, 0.8);
      const ea = e(a),
        eb = e(b),
        ec = e(c),
        ex = e(x),
        k = Math.floor(now / 70),
        rise = (1 - ent) * 4;
      S_(
        el.portrait,
        port
          ? mx * 1.4
          : 3 +
              (47 - 35.5 / (innerWidth / innerHeight)) *
                e(seg(heroCur, 0, 0.14)) +
              mx * 1.4,
        (port ? 24 : 33) * ec + 90 * ex + (1 - ent) * 10 + my * 0.8,
        ent,
        1 - 0.04 * ea + 0.1 * ec,
      );
      el.n1.innerHTML = morph(
        "ASHRAFUL",
        "#nFUL",
        a,
        k,
        '<span class="o">#n</span>FUL',
      );
      el.n2.innerHTML = morph(
        "ALAM",
        "5*0M",
        a,
        k + 3,
        '<span class="o">5*0</span>M',
      );
      const nameO = ent * (1 - e(seg(b, 0, 0.3)));
      S_(el.n1, 0, rise, nameO);
      S_(el.n2, 0, rise, nameO);
      el.bd.innerHTML = morph("BD", "LV", a, k + 7);
      S_(el.bd, 0, rise, ent * (1 - e(seg(b, 0, 0.25))));
      S_(el.bio, 0, rise, ent * (1 - e(seg(a, 0.15, 0.55))));
      const mid = e(seg(a, 0.5, 0.9)) * (1 - e(seg(b, 0, 0.3))) * ent;
      S_(el.wifey, 0, 0, mid);
      S_(el.tag, 0, 0, mid);
      S_(el.add, 0, rise, ent * (1 - e(seg(a, 0.15, 0.55))));
      S_(el.contact, 0, rise, ent * (1 - e(seg(b, 0, 0.25))));
      S_(el.more, 0, 0, ent);
      S_(
        el.ash,
        -mx * 1.2,
        14 * (1 - e(seg(b, 0.05, 0.5))),
        e(seg(b, 0.05, 0.45)) * (1 - ex),
        1 + ec * 0.55 + ex * 1.35,
      );
      el.ash.style.setProperty("--x", 0);
      S.style.setProperty(
        "--go",
        e(seg(b, 0.5, 0.9)) * (1 - e(seg(c, 0, 0.25))),
      );
      // hover lens: soft blur everywhere + lifted pixel cells on the portrait
      const live =
        phase.current === "ready" && over && !S.classList.contains("menu-open");
      power +=
        ((live ? 1 : 0) - power) * (1 - Math.exp(-dt * (live ? 2.2 : 3.5)));
      blurEl.style.opacity = power;
      blurEl.style.transform = `translate3d(${mxp - 85}px,${myp - 85}px,0)`;
      if (
        cells &&
        power > 0.01 &&
        ent > 0.99 &&
        el.portrait.style.visibility !== "hidden"
      ) {
        const r = lensC.getBoundingClientRect(),
          W = lensC.offsetWidth,
          H = lensC.offsetHeight,
          cs = Math.cos(0.02618),
          sn = Math.sin(0.02618),
          sc = r.width / (W * cs + H * sn);
        const dx = mxp - (r.left + r.width / 2),
          dy = myp - (r.top + r.height / 2);
        const ux = (((dx * cs + dy * sn) / sc + W / 2) / W) * COLS,
          uy = (((-dx * sn + dy * cs) / sc + H / 2) / H) * rows,
          R = 7;
        lctx.clearRect(0, 0, lensC.width, lensC.height);
        lensDirty = true;
        for (
          let gy = Math.max(0, Math.floor(uy - R - 1));
          gy <= Math.min(rows - 1, Math.ceil(uy + R + 1));
          gy++
        )
          for (
            let gx = Math.max(0, Math.floor(ux - R - 1));
            gx <= Math.min(COLS - 1, Math.ceil(ux + R + 1));
            gx++
          ) {
            const d = Math.hypot(gx + 0.5 - ux, gy + 0.5 - uy) / R;
            if (d >= 1) continue;
            const i = (gy * COLS + gx) * 4,
              al = cells[i + 3] / 255;
            if (al < 0.05) continue;
            const f = 1 - e(clamp((d - 0.45) / 0.55)),
              h = Math.abs(Math.sin(gx * 12.9 + gy * 78.2));
            const lift =
              f *
              power *
              (0.35 + 0.65 * h) *
              (0.7 + 0.3 * Math.sin(now / 900 + h * 6)) *
              K *
              0.9;
            lctx.fillStyle = `rgba(${Math.min(255, cells[i] + f * 20) | 0},${Math.min(255, cells[i + 1] + f * 20) | 0},${Math.min(255, cells[i + 2] + f * 20) | 0},${Math.min(1, f * 1.7) * al})`;
            lctx.fillRect(gx * K, gy * K - lift, K - 1, K - 1);
          }
      } else if (lensDirty) {
        lctx.clearRect(0, 0, lensC.width, lensC.height);
        lensDirty = false;
      }
      el.dots.querySelectorAll("i").forEach((d, i) => {
        d.style.transform = `translate3d(0,${(((DOTS[i][1] + cur * DOTK * DOTS[i][3] * 40) % 100) + 100) % 100}dvh,0)`;
      });
      // ---- works section: everything rides on the SAME progress as the orange wipe ----
      // wp = wipe progress (0 -> 1). The wipe front travels right -> left and a cell at
      // screen x turns orange at about wp = 1 - 0.72x - (0..0.28 noise), see pixels.js
      const wp = seg(heroCur, 0.62, 1),
        wv = worksCur * WORKS_VH; // scroll after the hero, in vh
      el.works.style.opacity = seg(wp, 0, 0.02);
      el.works.style.pointerEvents =
        wv > 26 || activeRef.current ? "auto" : "none";
      // dark header copy: shows on the orange cells, invisible on the black ones
      el.whead.style.opacity = e(seg(wp, 0.05, 0.3));
      // Click/Hover toggle: thin purple bar -> full switch while the wipe passes
      const tp = e(seg(wp, 0.12, 0.6));
      el.wtoggle.style.opacity = Math.min(1, tp * 8);
      el.wtoggle.style.clipPath = `inset(0 ${(1 - tp) * 88}% 0 0)`;
      // each card grows from a purple sliver at its left edge as the orange reaches it
      cardRefs.current.forEach((cd, i) => {
        if (!cd) return;
        const g = geo[i] || { l: 0, r: 0 },
          xr = Math.min(1, g.r),
          xl = Math.min(1, g.l),
          p = e(seg(wp, 1 - 0.72 * xr - 0.14, 1 - 0.72 * xl));
        const m = `${p * 100}% 100%`;
        cd.style.opacity = p > 0.002 ? 1 : 0;
        cd.style.webkitMaskSize = m;
        cd.style.maskSize = m;
        cd.style.filter = `brightness(${1 + (1 - p) * 0.5})`;
      });
      // traces draw in as the wipe finishes (first group), the rest draw as they scroll in
      const lineT = e(seg(wp + wv / 173.3, 0.9, 1.25));
      const pz = seg(wv, 60, 1160),
        panPx = panEnd * (0.35 * e(pz) + 0.65 * pz),
        vr = panPx + innerWidth - 0.05 * innerWidth;
      el.wgrid.style.transform = `translate3d(${-panPx}px,0,0)`;
      for (const L of lineList)
        L.p.style.strokeDashoffset =
          1 - (L.g === 0 ? lineT : e(clamp((vr - L.x0) / Math.max(1, L.x1 - L.x0))));
      // ---- orange -> black: pixel cells turn black from the right, over everything ----
      setBlack(e(seg(wv, 1000, 1350)));
      // black traces connect, then the footer rises and pushes them up (1:1)
      const bl = seg(wv, 1150, 1650);
      btrP.forEach((p, i) => {
        p.style.strokeDashoffset = 1 - e(clamp(bl * 1.6 - 0.6 * (i / (btrP.length - 1))));
      });
      const fp = e(seg(wv, 1700, 2050)),
        cov = 0.71 * fp;
      el.bfoot.style.transform = `translate3d(0,${(1 - cov) * 100}%,0)`;
      el.btr.style.transform = `translate3d(0,${-cov * innerHeight}px,0)`;
      stepPanel(dt, now);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      px.dispose();
      removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      removeEventListener("resize", onRz);
      removeEventListener("keydown", onKey);
      clearTimeout(pan.hto);
    };
  }, []);

  return (
    <>
      <div
        className="scroller"
        aria-hidden="true"
        style={{ height: HERO_VH + WORKS_VH + 100 + "svh" }}
      />
      <main className={"stage" + (menu ? " menu-open" : "")} ref={stage}>
        <div className="lines">
          {[2.6, 17.8, 39.7, 65.2, 87.2].map((l) => (
            <b key={l} style={{ left: l + "vw" }} />
          ))}
          <span data-id="dots">
            {DOTS.map((d, i) => (
              <i
                key={i}
                style={{ left: `calc(${d[0]}vw - 2px)`, background: d[2] }}
              />
            ))}
          </span>
        </div>
        <div className="layer">
          <div data-id="portrait" className="portrait">
            <img src="/portrait.webp" alt="Md. Ashraful Alam Shuvo" />
            <canvas data-id="plens" className="plens" />
          </div>
          <div data-id="ash" className="ash">
            ASH
          </div>
          <p className="tl">MD. ASHRAFUL ALAM SHUVO</p>
          <div className="city">
            <p>DHAKA, BANGLADESH</p>
            <small>{time}</small>
          </div>
          <button data-id="more" className="more" onClick={() => setMenu(true)}>
            EXPLORE MORE
          </button>
          <div data-id="bd" className="bd">
            BD
          </div>
          <div data-id="contact" className="contact">
            <p>+8801841995394</p>
            <p>ashshuvo1222.prof@gmail.com</p>
          </div>
          <p data-id="bio" className="bio">
            I’m a <em className="dev">developer</em> and{" "}
            <em className="bld">builder</em> who loves turning ideas into real
            things. From web experiences and software to electronics and
            robotics, I enjoy creating, experimenting, and learning along the
            way.
          </p>
          <p data-id="wifey" className="wifey">
            I LOVE MY WIFEY
          </p>
          <button data-id="add" className="add" onClick={downloadVcf}>
            ADD TO CONTACT
          </button>
          <div data-id="tag" className="tag">
            a#46
          </div>
          <h1 className="name">
            <span data-id="n1" className="n1">
              ASHRAFUL
            </span>
            <span data-id="n2" className="n2">
              ALAM
            </span>
          </h1>
          <p className="go">A LITTLE MORE TO GO --&gt;</p>
        </div>
        <div data-id="blur" className="lensblur" />
        <div
          className={"menu" + (menu ? " open" : "")}
          onClick={() => setMenu(false)}
        >
          <div className="panel" onClick={(ev) => ev.stopPropagation()}>
            <div className="in">
              <button
                className="x"
                aria-label="Close menu"
                onClick={() => setMenu(false)}
              >
                <i />
                <i />
              </button>
              <button className="mb" style={{ "--i": 0 }}>
                ABOUT
              </button>
              <button className="mb" style={{ "--i": 1 }}>
                WORKS
              </button>
              <h3>CONTACTS</h3>
              {SOCIALS.map((s, i) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ "--i": i + 2 }}
                >
                  <u style={{ background: s.color }} />
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div data-id="works" className="works">
          <div data-id="whead" className="whead">
            <p className="tl">MD. ASHRAFUL ALAM SHUVO</p>
            <div className="city">
              <p>DHAKA, BANGLADESH</p>
              <small>{time}</small>
            </div>
            <button className="more" onClick={() => setMenu(true)}>
              EXPLORE MORE
            </button>
          </div>
          <div data-id="wgrid" className="wgrid">
            <svg data-id="wlines" className="wlines"></svg>
            {WORKS.map((w, i) => (
              <div
                key={w.id}
                ref={(n) => (cardRefs.current[i] = n)}
                className="wcard"
                style={{ "--x": POS[i][0], "--y": POS[i][1] }}
                onClick={() => ctl.current?.click(i)}
                onMouseEnter={() => ctl.current?.enter(i)}
                onMouseLeave={() => ctl.current?.leave()}
              >
                <span className="wtag">{w.tag}</span>
                <b>{w.title}</b>
              </div>
            ))}
            <div data-id="whub" className="whub">
              <i className="hr hr1" />
              <i className="hr hr2" />
              <img className="chip" src="/Vector.png" alt="" draggable="false" />
            </div>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} ref={(n) => (boxRefs.current[i] = n)} className="wbox" />
            ))}
          </div>
          <div data-id="wpwrap" className="wpanel-wrap">
            <div data-id="wdim" className="wdim" />
            <div data-id="wpoly" className="wpoly" />
            <svg className="wedge">
              <polygon data-id="wedgeb" className="wedgeb" />
              <polygon data-id="wedges" className="wedges" pathLength="100" />
            </svg>
            <div data-id="wcontent" className="wcontent">
              <span data-id="wnum" className="wnum" />
              <small data-id="wtag" />
              <h4 data-id="wtitle" />
              <i data-id="wrule" className="wrule" />
              <p data-id="wdesc" />
            </div>
            <button
              data-id="wx"
              className="wx"
              aria-label="Close"
              onClick={() => ctl.current?.close()}
            >
              <svg viewBox="0 0 20 20">
                <path d="M3 3L17 17" strokeDasharray="20" strokeDashoffset="20" />
                <path d="M17 3L3 17" strokeDasharray="20" strokeDashoffset="20" />
              </svg>
            </button>
          </div>
        </div>
        <div data-id="bsec" className="bsec">
          <svg data-id="btr" className="btr" viewBox="0 0 1509 879" preserveAspectRatio="none">
            <g transform="translate(-12,-28)">
              {BTR.map(([c, d], i) => (
                <path key={i} d={d} className={c === "p" ? "bp" : "bo"} />
              ))}
            </g>
          </svg>
          <div data-id="bfoot" className="bfoot" />
          <div className="bhead">
            <p className="tl">MD. ASHRAFUL ALAM SHUVO</p>
            <div className="city">
              <p>DHAKA, BANGLADESH</p>
              <small>{time}</small>
            </div>
            <button className="more" onClick={() => setMenu(true)}>
              EXPLORE MORE
            </button>
          </div>
        </div>
        <div className="top">
          <div data-id="wtoggle" className="modesw" data-mode={wMode}>
            <button
              className={wMode === "click" ? "on" : ""}
              onClick={() => pickMode("click")}
            >
              Click
            </button>
            <button
              className={wMode === "hover" ? "on" : ""}
              onClick={() => pickMode("hover")}
            >
              Hover
            </button>
          </div>
        </div>
        <div className="grain" />
        <canvas ref={cv} className="gl" />
        <div ref={pct} className="pct">
          0%
        </div>
      </main>
    </>
  );
}