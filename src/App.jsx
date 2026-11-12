import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { createPixels } from "./pixels.js";
import { SKILLS, SkillBody } from "./skills.jsx";
import { pixelText } from "./pixelfont.js";
import WorksOrb from "./WorksOrb.jsx";

const SOCIALS = [
  {
    name: "LINKEDIN",
    href: "https://linkedin.com/in/ashrafulalamshuvo1222/",
    color: "#0a66c2",
  },
  { name: "GITHUB", href: "https://github.com/mra810", color: "#c9c9c9" },
  {
    name: "FACEBOOK",
    href: "https://www.facebook.com/ashraful.alam.shuvo.16873",
    color: "#1877f2",
  },
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
  const v = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Ashraful Alam Shuvo",
    "N:Shuvo;Ashraful;;;",
    "TITLE:Developer",
    "EMAIL:ashshuvo1222.prof@gmail.com",
    "TEL;TYPE=CELL:+8801841995394",
    "URL:https://wa.me/8801841995394",
    "X-WHATSAPP: +8801841995394",
    "URL:https://t.me/@mrrelaxedash",
    "X-TELEGRAM: your_username",
    "URL:https://github.com/mra810",
    "URL:https://linkedin.com/in/ashrafulalamshuvo1222/",
    "END:VCARD",
  ].join("\r\n");
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
// card slots: [x (vw), y (dvh), row] (from the Figma frame)
const POS = [
  [8.3, 15, 0],
  [37.2, 15, 0],
  [63.7, 14, 0],
  [83.2, 14.3, 0],
  [19, 39.6, 1],
  [41.5, 39.6, 1],
  [67.8, 39.6, 1],
  [24.6, 64.6, 2],
  [51.6, 64.6, 2],
  [70.6, 64.6, 2],
];
// scroll lengths in vh. HERO_VH keeps the hero exactly as long as before.
const HERO_VH = 824,
  WORKS_VH = 2700,
  HERO_FRAC = HERO_VH / (HERO_VH + WORKS_VH),
  DOTK = 0.6338 / HERO_FRAC;
// experience slides (the arrows switch them; everything else follows the scroll)
const XP = [
  {
    title: "Worked at Computer Programming Club as a Graphics Designer",
    period: "Work period 2024-2025",
    lines: ["Assistant Graphics Designer"],
  },
  {
    title: "Worked at Mastermind Coding Academy as a Coding Instructor",
    period: "Work period 2025-2026",
    lines: [
      "Coding Instructor",
      "Python",
      "HTML & CSS",
      "Games with Scratch",
      "Mobile apps with MIT App Inventor",
    ],
  },
];
// footer contact links: put the real URLs here (empty = the label shows, no link yet)
const CONTACT = {
  name: "MD. ASHRAFUL ALAM SHUVO",
  address: "DHAKA, BANGLADESH",
  phone: "+8801841995394",
  portfolio: "",
  email: "ashshuvo1222.prof@gmail.com",
  linkedin: "https://linkedin.com/in/ashrafulalamshuvo1222/",
  github: "https://github.com/mra810",
  facebook: "https://www.facebook.com/ashraful.alam.shuvo.16873",
  cv: "",
  big: "PORTFOLIO/SHUVO",
};
// extra lines printed in the empty top-left of each skills card
const CARD_META = {
  react: ["JavaScript", "HTML / CSS", "Bootstrap"],
  django: ["Python", "MySQL", "since 2025"],
  flutter: ["Dart", "Mobile apps", "since 2024"],
  electron: ["Egg Timer", "JS · HTML · CSS", "since 2025"],
  express: ["Node.js", "REST APIs"],
  js: ["ES6+", "DOM", "since 2022"],
  iot: ["Sensors", "MQTT", "Dashboards"],
  esp32: ["S-SPAEMS", "PlatformIO", "C / C++"],
  ai: ["Machine Learning", "Computer Vision"],
  arduino: ["C / C++", "Soldering", "Digital Logic"],
};
const PIX = pixelText(CONTACT.big);
// black-section traces, taken from the Figma frame (absolute frame coords)
const DEVICON = (slug, variant) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-${variant}.svg`;
// About page content. Demo copy: replace the text arrays with your own.
// Picture files (put them in /public):
//   me-robot.jpg  -> "Me" row (slanted crop) + the big "Me" panel
//   campus.jpg    -> "Education" row + the "Education" panel
//   cert-aws.png  -> "Certificates" panel (the row itself is drawn in CSS: hex pattern + text)
// Toolbox icons load from the devicon CDN, no files needed.
// x / y = icon centre inside the row, in %.
const ABOUT = [
  {
    id: "me",
    title: "Me",
    kind: "photo",
    img: "/me-robot.jpg",
    text: [
      "I\u2019m Md. Ashraful Alam Shuvo, a Computer Science and Engineering student at Daffodil International University in Dhaka. I like building things that live between software and hardware: a small rover made from cardboard and motors, a dashboard that shows live sensor readings, an app that does one job well.",
      "I began with HTML and CSS in 2020, picked up Python in 2021 and JavaScript in 2022, then moved on to C and C++ for data structures and competitive programming. Since then I\u2019ve explored Flutter, Java with Spring Boot, Electron, Django and Flask \u2014 plus electronics, from digital logic to soldering. I enjoy taking a rough idea, making it work, and then breaking it on purpose to see how it can be improved.",
      "Away from my own projects I\u2019ve designed graphics for a programming club and taught kids how to code. Learn it. Build it. Break it. Improve it.",
      {
        h: "Video Games",
        p: "Video games have always been more than just entertainment for me they\u2019re a blend of art, storytelling, and technology. Each game I play inspires me to think about how worlds are built, how mechanics drive emotion, and how creativity meets code. My dream is to become a game developer who can create experiences that connect people, spark imagination, and leave a lasting impact just like the games that shaped my own journey.",
      },
      {
        h: "Travelling",
        p: "I love travelling because it opens my mind to new cultures, people, and ideas. Every trip teaches me something different whether it\u2019s how people live, how cities grow, or how nature inspires creativity. Travelling helps me see the world from new perspectives, which also fuels my imagination as a developer and designer.",
      },
    ],
  },
  {
    id: "toolbox",
    title: "Inside My Toolbox",
    kind: "icons",
    text: [
      "Languages \u2014 C / C++, Python, Java, JavaScript, HTML / CSS.",
      "Frameworks \u2014 Django, Flask, Spring Boot, Flutter, Bootstrap, Electron.",
      "Design tools \u2014 Figma, Adobe Illustrator, Photoshop, Canva.",
      "Electronics & circuits \u2014 Electronics, Digital Logic, Soldering.",
      "Dev tools \u2014 Git / GitHub, VS Code, IntelliJ, Linux CLI.",
      "Soft skills \u2014 Team Leadership, Teamwork, Project Mgmt, Problem Solving.",
    ],
    icons: [
      { name: "Arduino", src: DEVICON("arduino", "original"), x: 57.5, y: 30 },
      { name: "C / C++", src: DEVICON("cplusplus", "original"), x: 61.1, y: 68 },
      { name: "Python", src: DEVICON("python", "original"), x: 64.7, y: 32 },
      { name: "Java", src: DEVICON("java", "original"), x: 68.3, y: 70 },
      {
        name: "JavaScript",
        src: DEVICON("javascript", "original"),
        x: 71.9,
        y: 30,
      },
      { name: "HTML / CSS", src: DEVICON("html5", "original"), x: 75.5, y: 68 },
      { name: "Django", src: DEVICON("django", "plain"), x: 79.1, y: 32 },
      { name: "Flask", src: DEVICON("flask", "original"), x: 82.7, y: 70 },
      {
        name: "Spring Boot",
        src: DEVICON("spring", "original"),
        x: 86.3,
        y: 30,
      },
      { name: "Flutter", src: DEVICON("flutter", "original"), x: 89.9, y: 68 },
      { name: "Electron", src: DEVICON("electron", "original"), x: 93.5, y: 32 },
      { name: "Figma", src: DEVICON("figma", "original"), x: 97, y: 66 },
    ],
    // shown in the open panel only (the row has no room for them)
    more: [
      { name: "Illustrator", src: DEVICON("illustrator", "plain") },
      { name: "Git", src: DEVICON("git", "original") },
      { name: "VS Code", src: DEVICON("vscode", "original") },
      { name: "IntelliJ", src: DEVICON("intellij", "original") },
    ],
  },
  {
    id: "edu",
    title: "Education",
    kind: "photo",
    img: "/campus.jpg",
    items: [
      {
        logo: "/ssclogo.png",
        name: "SSC \u2014 Chapain New Model High School",
        rows: [
          "Board: Dhaka \u00b7 Subject: Science",
          "Result: 4.72 \u00b7 Year: 2020",
        ],
      },
      {
        logo: "/hsclogo.png",
        name: "HSC \u2014 Savar Laboratory College",
        rows: [
          "Board: Dhaka \u00b7 Subject: Science",
          "Result: 4.83 \u00b7 Year: 2022",
        ],
      },
      {
        logo: "/unilogo.png",
        name: "Daffodil International University",
        rows: [
          "Computer Science and Engineering (CSE)",
          "Batch 65 \u00b7 Session: Fall 2023 \u00b7 Started 2023",
          "Expected graduation: 2027",
        ],
      },
    ],
  },
  {
    id: "cert",
    title: "Certificates",
    kind: "cert",
    img: "/cert-aws.png",
    name: "MD. ASHRAFUL ALAM SHUVO",
    certA: "Certificate of Completion for",
    certB: "AWS Academy Graduate - AWS Academy Cloud Foundations",
    text: [
      "AWS Academy Graduate \u2014 AWS Academy Cloud Foundations. The course covers the core ideas of cloud computing: compute, storage, networking and databases, plus security, pricing and support on AWS.",
      "It gave me a working vocabulary for deploying and scaling the apps I build, and a base to grow into more advanced cloud certifications.",
    ],
  },
  { id: "works", title: "My Works", kind: "cta" },
];
const BTR = [
  ["p", "M12 223 H612"],
  ["p", "M290 223 L352 288"],
  ["p", "M122 288 H578"],
  ["p", "M470 252 H1236"],
  ["p", "M545 252 L662 370 H1521"],
  ["p", "M585 248 L630 203 H1505"],
  ["p", "M915 370 L975 312 H1521"],
  ["p", "M12 333 H945"],
  ["o", "M1374 417 H1521"],
  ["o", "M470 558 H855 L925 488 H1420 L1490 417"],
  ["o", "M1228 488 L1366 627 H1521"],
  ["o", "M12 502 H862"],
  ["o", "M413 502 L470 558"],
  ["o", "M97 628 H398 L470 558"],
  ["o", "M298 702 H1521"],
  ["o", "M545 563 L683 702"],
  ["p", "M12 813 H520 L570 858"],
  ["p", "M392 858 H1303"],
  ["p", "M665 858 L722 799 H1228"],
  ["p", "M1170 858 L1284 741 H1521"],
];

export default function App() {
  const stage = useRef(),
    cv = useRef(),
    pct = useRef(),
    lenisRef = useRef();
  const [menu, setMenu] = useState(false);
  const [orb, setOrb] = useState(false);
  const orbRef = useRef(false);
  useEffect(() => {
    orbRef.current = orb;
  }, [orb]);
  const [time, setTime] = useState("");
  const [wMode, setWMode] = useState("click");
  const [xp, setXp] = useState({ i: 0, p: -1, d: 1 });
  const xpOpen = useRef(false);
  const goXp = (d) =>
    setXp((s) => ({ i: (s.i + d + XP.length) % XP.length, p: s.i, d }));
  useEffect(() => {
    const k = (ev) => {
      if (!xpOpen.current) return;
      if (ev.key === "ArrowRight") goXp(1);
      if (ev.key === "ArrowLeft") goXp(-1);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);
  const [about, setAbout] = useState(false);
  const [openBlock, setOpenBlock] = useState(null);
  const [pulsing, setPulsing] = useState(null);
  const cv2 = useRef();
  const cardRefs = useRef([]),
    boxRefs = useRef([]),
    skRefs = useRef([]),
    picRefs = useRef([]);
  const activeRef = useRef(null);
  const ctl = useRef(null),
    modeRef = useRef("click"),
    menuRef = useRef(false),
    aboutRef = useRef(false);
  const aboutScrollRef = useRef(null);
  useEffect(() => {
    menuRef.current = menu;
  }, [menu]);
  useEffect(() => {
    aboutRef.current = about;
  }, [about]);
  // scroll-reveal: rows fade/slide in as they enter view while scrolling the about panel.
  // Tracked in React state (not classList mutation) so a click/hover re-render never wipes it.
  const [seenRows, setSeenRows] = useState(() => new Set());
  useEffect(() => {
    if (!about) {
      setSeenRows(new Set());
      return;
    }
    const root = aboutScrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (ents) => {
        const hit = ents
          .filter((en) => en.isIntersecting)
          .map((en) => en.target.dataset.rowId);
        if (hit.length) setSeenRows((prev) => new Set([...prev, ...hit]));
      },
      { root, threshold: 0.18 },
    );
    root.querySelectorAll(".arow").forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [about]);
  useEffect(() => {
    if (!openBlock) return;
    const k = (ev) => ev.key === "Escape" && setOpenBlock(null);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [openBlock]);
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
    lenisRef.current?.[menu || orb ? "stop" : "start"]();
    if (!menu && !orb && phase.current !== "ready") lenisRef.current?.stop();
  }, [menu, orb]);
  const phase = useRef("load");

  useEffect(() => {
    const px = createPixels(cv.current),
      px2 = createPixels(cv2.current),
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
        "wbody",
        "wpics",
        "wx",
        "whub",
        "bsec",
        "btr",
        "bfoot",
        "xp",
        "xpl",
        "xpr",
        "cbtn",
        "top",
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
    const onAboutWheel = (ev) => {
      if (!aboutRef.current || !aboutScrollRef.current) return;
      aboutScrollRef.current.scrollTop += ev.deltaY;
      ev.preventDefault();
    };
    addEventListener("wheel", onAboutWheel, { passive: false });
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
    // polyline path without zero-length segments (some browsers drop a dashed stroke
    // that contains them)
    const P = (pts) => {
      const q = [];
      pts.forEach((p) => {
        const l = q[q.length - 1];
        if (!l || Math.abs(p[0] - l[0]) > 0.01 || Math.abs(p[1] - l[1]) > 0.01)
          q.push(p);
      });
      return q.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
    };
    const addLine = (d, cls, x0, x1, g) => {
      const p = document.createElementNS(NSVG, "path");
      p.setAttribute("d", d);
      p.setAttribute("class", cls);
      el.wlines.appendChild(p);
      const len = p.getTotalLength() || 1; // real length, works in every browser
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      lineList.push({ p, len, x0, x1, g });
    };
    const buildLines = () => {
      const W = innerWidth,
        H = innerHeight,
        por = W < H;
      const box = cardRefs.current.filter(Boolean).map((c) => ({
        l: c.offsetLeft,
        t: c.offsetTop,
        w: c.offsetWidth,
        h: c.offsetHeight,
      }));
      geo = box.map((b) => ({ l: b.l / W, r: (b.l + b.w) / W }));
      el.wlines.innerHTML = "";
      lineList = [];
      // hub + dark boxes continue the board to the right
      const pinkR = Math.max(...box.map((b) => b.l + b.w));
      const R = (por ? 0.17 : 0.0825) * W,
        hcx = pinkR + 0.255 * W,
        hcy = (por ? 0.5 : 0.538) * H;
      const bw = (por ? 0.64 : 0.29) * W,
        bh = (por ? 0.2 : 0.33) * H,
        gx = 0.031 * W;
      const yT = (por ? 0.16 : 0.165) * H,
        yM = (por ? 0.4 : 0.355) * H,
        yB = (por ? 0.64 : 0.547) * H;
      const an = Math.PI / 4,
        sa = Math.sin(an),
        ca = Math.cos(an),
        rs = 0.87 * R; // black traces leave the inner ring at 45deg
      const dyd = hcy - (yT + bh / 2) - rs * sa;
      const aL = hcx + Math.max(0.135 * W, rs * ca + Math.abs(dyd) + 0.02 * W);
      const cx3 = [aL, aL + bw + gx, aL + 2 * (bw + gx)];
      const bx = [
        { l: cx3[0], t: yT },
        { l: cx3[0], t: yB },
        { l: cx3[1], t: yM },
        { l: cx3[2], t: yT },
        { l: cx3[2], t: yB },
      ].map((b) => ({ ...b, w: bw, h: bh }));
      boxRefs.current.forEach((n, i) => {
        if (!n) return;
        Object.assign(n.style, {
          left: bx[i].l + "px",
          top: bx[i].t + "px",
          width: bw + "px",
          height: bh + "px",
        });
      });
      Object.assign(el.whub.style, {
        left: hcx - R + "px",
        top: hcy - R + "px",
        width: 2 * R + "px",
        height: 2 * R + "px",
      });
      panEnd = Math.max(0, cx3[2] + bw - 0.68 * W);
      const cy = (b) => b.t + b.h / 2,
        rr = (b) => b.l + b.w;
      // ---- purple board traces, traced 1:1 from the reference screenshots ----
      // k = one reference pixel (a card is 226 reference px wide). Every vertex is built from
      // a card edge plus a fixed offset, so legs stay exactly 45deg / axis-aligned at any size.
      // box index: 0-3 = top row, 4-6 = middle row, 7-9 = bottom row.
      const k = box[0].w / 226;
      const rE = (i, dy) => [box[i].l + box[i].w, box[i].t + dy * k]; // point on card i's right edge
      const mv = (p, dx, dy) => [p[0] + dx * k, p[1] + dy * k];
      const dgY = (p, y) => [p[0] + Math.abs(y - p[1]), y]; // 45deg leg (heading right) to height y
      const yTop = box[0].t - 8 * k, // bus above the top row
        yAm = box[2].t + 188 * k, // bus between the top and middle rows
        yCm = box[9].t - 9 * k, // bus above the bottom row
        yBm = yCm - 14 * k, // bus under the middle row
        xV = box[6].l + box[6].w + 29 * k, // tall vertical right of the middle row
        yK = box[6].t + 62 * k; // top of that vertical
      const trace = (pts, x0, x1, g, cls = "wln") =>
        addLine(P(pts), cls, x0, x1, g);
      // hub-side anchors (the last leg of each trace ends on the hub ring)
      const rk = R / 117,
        hxAt = (yr) => hcx - Math.sqrt(Math.max(0, R * R - (yr - hcy) ** 2));
      const yrA = hcy - 0.496 * R,
        yrB = hcy - 0.034 * R,
        yrC = hcy + 0.419 * R;
      const hxA = hxAt(yrA),
        hxB = hxAt(yrB),
        hxC = hxAt(yrC);

      // top row: card 0 -> up to the top bus -> across -> down beside card 2 -> y-A bus -> hub
      {
        const s0 = rE(0, 76),
          p1 = dgY(s0, yTop),
          p2 = [box[2].l - 72 * k, yTop];
        const p3 = mv(p2, 27.5, 27),
          p4 = [p3[0], yAm - 75.5 * k],
          p5 = mv(p4, 80, 75.5);
        const xa = Math.max(p5[0] + 10, hxA - 195 * rk - Math.abs(yrA - yAm)),
          ea = [xa + Math.abs(yrA - yAm), yrA];
        trace([s0, p1, p2, p3, p4, p5, [xa, yAm]], s0[0], xa, 0);
        trace([[xa, yAm], ea, [hxA, yrA]], xa, hxA, 1);
      }
      // card 1 joins the top bus
      {
        const s0 = rE(1, 81),
          p1 = mv(s0, 58, -58);
        trace([s0, p1, [p1[0], yTop]], s0[0], p1[0], 0);
      }
      // cards 2 and 3 meet in a Y and drop to the y-A bus
      {
        const yJ = box[2].t + 106 * k,
          xJ = box[2].l + box[2].w + 28 * k;
        trace([rE(2, 80), [xJ, yJ], [xJ, yAm]], box[2].l + box[2].w, xJ, 0);
        trace(
          [
            [xJ + 21 * k, yJ - 19 * k],
            [xJ, yJ],
          ],
          xJ,
          xJ + 21 * k,
          0,
        );
      }
      // middle row: card 4 -> y-B bus -> tall vertical -> across to the hub
      {
        const s0 = rE(4, 86),
          p1 = dgY(s0, yBm);
        trace([s0, p1, [xV, yBm], [xV, yK]], s0[0], xV, 0);
        const eb = hxB - 37 * rk,
          xb = Math.max(xV + 10, eb - Math.abs(yrB - yK));
        trace(
          [
            [xV, yK],
            [xb, yK],
            [xb + Math.abs(yrB - yK), yrB],
            [hxB, yrB],
          ],
          xV,
          hxB,
          1,
        );
        // cards 5 and 6 join it
        const s1 = rE(5, 87),
          q1 = mv(s1, 58, 57);
        trace([s1, q1, [q1[0], yBm]], s1[0], q1[0], 0);
        const s2 = rE(6, 128);
        trace([s2, [xV, s2[1] - 27 * k]], s2[0], xV, 0);
      }
      // bottom row: card 7 -> y-C bus -> round card 9's corner (wraps back onto its edge)
      {
        const s0 = rE(7, 86),
          p1 = dgY(s0, yCm),
          p2 = [box[9].l + box[9].w - 20 * k, yCm];
        const p3 = mv(p2, 35, 35),
          p4 = [p3[0], box[9].t + 52 * k],
          p5 = mv(p4, -15, 15);
        trace([s0, p1, p2, p3, p4, p5], s0[0], p3[0], 0);
        // card 8 joins the y-C bus
        const s1 = rE(8, 82),
          q1 = mv(s1, 30.6, -28.6);
        trace([s1, q1, [q1[0], yCm]], s1[0], q1[0], 0);
        // branch off the corner leg -> y-B -> hub
        const b0 = mv(p2, 18, 18),
          b1 = mv(b0, 32, -32);
        trace([b0, b1], b0[0], b1[0], 0);
        const ec = hxC - 61 * rk,
          xc = Math.max(b1[0] + 10, ec - Math.abs(yrC - yBm));
        trace(
          [b1, [xc, yBm], [xc + Math.abs(yrC - yBm), yrC], [hxC, yrC]],
          b1[0],
          hxC,
          1,
        );
      }
      // black: hub -> first column, then box to box
      [
        [bx[0], -1],
        [bx[1], 1],
      ].forEach(([b, sg]) => {
        const sx = hcx + rs * ca,
          sy = hcy + sg * rs * sa,
          ty = cy(b);
        addLine(
          P([
            [sx, sy],
            [sx + Math.abs(ty - sy), ty],
            [b.l, ty],
          ]),
          "wln k",
          sx,
          b.l,
          1,
        );
      });
      const into = (S, D, edge, f) => {
        const sy = cy(S),
          ex = D.l + f * D.w,
          ey = edge === "top" ? D.t : D.t + D.h;
        addLine(
          P([
            [rr(S), sy],
            [ex - Math.abs(ey - sy), sy],
            [ex, ey],
          ]),
          "wln k",
          rr(S),
          ex,
          1,
        );
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
    const pan = {
      t: 0,
      open: false,
      i: -1,
      s: null,
      shown: false,
      hto: 0,
      out: 0,
      pending: -1,
    };
    // ---- about page: reuses the same radial pixel-dissolve as the intro reveal,
    // on its own canvas so it never fights the hero/works wipe's uMode/uP ----
    const abt = { phase: "idle", t: 0, dir: 1, jump: null };
    const openAbout = () => {
      if (abt.phase !== "idle") return;
      abt.phase = "cover";
      abt.t = 0;
      abt.dir = 1;
    };
    const closeAbout = (jumpPx) => {
      if (abt.phase !== "idle") return;
      abt.phase = "cover";
      abt.t = 0;
      abt.dir = 0;
      abt.jump = jumpPx ?? null;
    };
    const goWorks = () => {
      const target = lenis.limit ? lenis.limit * (HERO_FRAC + 0.03) : 0;
      closeAbout(target);
    };
    const clickish = () => coarse || modeRef.current === "click";
    const eRect = () => {
      const W = innerWidth,
        H = innerHeight;
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
      activeRef.current = SKILLS[i].id;
      pan.tag = `${String(i + 1).padStart(2, "0")}  \u2014  ${SKILLS[i].tag.toUpperCase()}`;
      pan.title = SKILLS[i].title;
      el.wnum.textContent = String(i + 1).padStart(2, "0");
      // show this skill's text + pictures, hide the others
      skRefs.current.forEach(
        (n, j) => n && (n.style.display = j === i ? "block" : "none"),
      );
      picRefs.current.forEach(
        (n, j) => n && (n.style.display = j === i ? "grid" : "none"),
      );
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
      openAbout,
      closeAbout,
      goWorks,
      toFooter: () => closeAbout(lenis.limit || 0),
      toTop: () => closeAbout(0),
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
    const onKey = (ev) => {
      if (ev.key !== "Escape" || orbRef.current) return;
      closeBox();
      ctl.current?.closeAbout();
    };
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
            : GLY[
                Math.floor(
                  Math.abs(Math.sin((i + 1) * 12.9898 + k * 78.233)) * 43758,
                ) % GLY.length
              ];
      return out;
    };
    const eoExpo = (x) =>
      x >= 1 ? 1 : (1 - Math.pow(2, -10 * x)) / (1 - Math.pow(2, -10));
    const eio = (x) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    // ---- about page transition: advances abt (declared earlier, before ctl.current
    // needed it) each frame; uses eio so it has to live after eio is defined ----
    const stepAbout = (dt) => {
      if (abt.phase === "idle") return;
      abt.t = Math.min(1, abt.t + dt / 0.65);
      const k = eio(abt.t),
        u2 = px2.u;
      u2.uMode.value = 1;
      if (abt.phase === "cover") {
        u2.uP.value = 1 - k;
        if (abt.t >= 1) {
          abt.phase = "swap";
          abt.t = 0;
        }
      } else if (abt.phase === "swap") {
        if (abt.dir === 1) {
          setAbout(true);
          lenis.stop();
        } else {
          setAbout(false);
          if (!menuRef.current) lenis.start();
          if (abt.jump != null) {
            lenis.scrollTo(abt.jump, { immediate: true });
            target = lenis.limit ? lenis.scroll / lenis.limit : 0;
            cur = target;
          }
          abt.jump = null;
        }
        abt.phase = "open";
        u2.uP.value = 0;
      } else if (abt.phase === "open") {
        u2.uP.value = k;
        if (abt.t >= 1) abt.phase = "idle";
      }
      px2.render();
    };
    const wxPaths = [...el.wx.querySelectorAll("path")];
    // the card stretches sideways into a bar (fast, expo-out), then rises into the
    // full panel (soft in-out); a small skew gives the lunge some life
    const shape = (t) => {
      const s = pan.s,
        E = eRect();
      const pw = eoExpo(seg(t, 0, 0.6)),
        ph = eio(seg(t, 0.13, 0.95));
      const x = lerp(s.x, E.x, pw),
        w = lerp(s.w, E.w, pw),
        y = lerp(s.y, E.y, ph),
        h = lerp(s.h, E.h, ph);
      const cEnd = Math.min(0.186 * innerHeight, 0.24 * E.w, 0.4 * E.h);
      const c = Math.min(lerp(22, cEnd, (pw + ph) / 2), w * 0.4, h * 0.4);
      const sh = 0.16 * Math.sin(Math.PI * seg(t, 0, 0.75));
      return [
        [0, 0],
        [w - c, 0],
        [w, c],
        [w, h],
        [c, h],
        [0, h - c],
      ].map(([lx, ly]) => [x + lx + sh * (ly - h / 2), y + ly]);
    };
    const stepPanel = (dt, now) => {
      if (pan.open && pan.t > 0.6 && !clickish()) {
        // hover mode: leaving the full box closes it
        const E = eRect(),
          m = 8,
          inside =
            over &&
            mxp >= E.x - m &&
            mxp <= E.x + E.w + m &&
            myp >= E.y - m &&
            myp <= E.y + E.h + m;
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
      const t = pan.t,
        E = eRect(),
        kk = Math.floor(now / 45);
      const pts = shape(t);
      el.wpoly.style.clipPath = `polygon(${pts.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(",")})`;
      const ps = pts
        .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
        .join(" ");
      el.wedgeb.setAttribute("points", ps);
      el.wedges.setAttribute("points", ps);
      el.wpoly.style.opacity = lerp(0.8, 1, e(seg(t, 0.2, 0.6)));
      el.wpoly.style.filter = `brightness(${1 + 0.4 * (1 - e(seg(t, 0, 0.55)))})`;
      el.wpoly.style.setProperty(
        "--sx",
        lerp(100, 0, e(seg(t, 0.25, 0.92))) + "%",
      );
      el.wpoly.style.pointerEvents = "auto";
      // edge: a steady border + one bright streak that runs around it
      el.wedgeb.style.opacity = e(seg(t, 0.02, 0.2));
      el.wedges.setAttribute("stroke-dashoffset", -100 * e(seg(t, 0.12, 0.92)));
      el.wedges.style.opacity = Math.sin(Math.PI * seg(t, 0.1, 0.95));
      // backdrop: purple tint + soft blur of everything behind
      const dm = e(seg(t, 0.3, 0.95));
      el.wdim.style.opacity = dm;
      el.wdim.style.backdropFilter =
        el.wdim.style.webkitBackdropFilter = `blur(${(dm * 7).toFixed(2)}px)`;
      // text: decodes in with the same glyph scramble as the hero name
      Object.assign(el.wcontent.style, {
        left: E.x + "px",
        top: E.y + "px",
        width: E.w + "px",
        height: E.h + "px",
      });
      el.wtag.textContent = decode(pan.tag || "", e(seg(t, 0.6, 0.8)), kk);
      el.wtitle.textContent = decode(
        pan.title || "",
        e(seg(t, 0.66, 0.93)),
        kk + 5,
      );
      el.wrule.style.transform = `scaleX(${e(seg(t, 0.72, 0.95))})`;
      const dd = e(seg(t, 0.8, 1));
      el.wbody.style.opacity = dd;
      el.wbody.style.transform = `translateY(${(1 - dd) * 16}px)`;
      el.wpics.style.setProperty("--p1", e(seg(t, 0.74, 0.94)));
      el.wpics.style.setProperty("--p2", e(seg(t, 0.82, 1)));
      const nn = e(seg(t, 0.7, 1));
      el.wnum.style.opacity = nn;
      el.wnum.style.transform = `translateY(${(1 - nn) * 40}px)`;
      // close button: slides out of the corner, then its cross draws itself
      const L = Math.min(0.186 * innerHeight, 0.24 * E.w, 0.4 * E.h) * 0.86,
        xo = e(seg(t, 0.82, 1));
      Object.assign(el.wx.style, {
        left: E.x + E.w - L + "px",
        top: E.y + "px",
        width: L + "px",
        height: L + "px",
        opacity: Math.min(1, xo * 3),
        transform: `translate(${(1 - xo) * L * 0.4}px,${-(1 - xo) * L * 0.4}px)`,
        pointerEvents: xo > 0.6 ? "auto" : "none",
      });
      wxPaths.forEach((pp, n) =>
        pp.setAttribute(
          "stroke-dashoffset",
          20 * (1 - e(seg(t, 0.9 + n * 0.03, 1))),
        ),
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
      const W = innerWidth,
        H = innerHeight;
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
      const cell = W / 22,
        rows = Math.ceil(H / cell);
      let d = "";
      for (let ry = 0; ry < rows; ry++) {
        const y0 = Math.round(ry * cell),
          y1 = Math.min(H, Math.round((ry + 1) * cell));
        let run = -1;
        for (let cx = 0; cx <= 22; cx++) {
          let blk = false;
          if (cx < 22) {
            const h = fr(Math.sin(cx * 127.1 + ry * 311.7) * 43758.5453);
            blk = (1 - (cx + 0.5) / 22) * 0.72 + h * 0.28 <= ww * 1.0002;
          }
          if (blk && run < 0) run = cx;
          if (!blk && run >= 0) {
            const x0 = Math.round(run * cell),
              x1 = Math.round(cx * cell);
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
      S_(el.cbtn, 0, 0, ent * (1 - e(seg(a, 0.15, 0.55))));
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
          L.len *
          (1 -
            (L.g === 0
              ? lineT
              : e(clamp((vr - L.x0) / Math.max(1, L.x1 - L.x0)))));
      // ---- orange -> black: pixel cells turn black from the right, over everything ----
      setBlack(e(seg(wv, 1000, 1350)));
      // black traces connect, then the footer rises and pushes them up (1:1)
      const bl = seg(wv, 1150, 1650);
      btrP.forEach((p, i) => {
        p.style.strokeDashoffset =
          1 - e(clamp(bl * 1.6 - 0.6 * (i / (btrP.length - 1))));
      });
      // ---- experience box: a glowing pill grows into a box (frames 14 -> 17), all by scroll ----
      const KF = [
        [0.931, 0.133, 0.955, 0.225],
        [0.95, 0.202, 0.972, 0.828],
        [0.672, 0.202, 0.972, 0.828],
        [0.172, 0.185, 0.832, 0.815],
      ];
      const mixR = (a, b, t) => a.map((v, k) => lerp(v, b[k], t));
      let rc = mixR(KF[0], KF[1], e(seg(wv, 1680, 1780)));
      rc = mixR(rc, KF[2], e(seg(wv, 1780, 1880)));
      rc = mixR(rc, KF[3], e(seg(wv, 1880, 1990)));
      const xout = e(seg(wv, 2240, 2300)),
        xo = e(seg(wv, 1600, 1680)) * (1 - xout),
        xc = e(seg(wv, 1990, 2040)) * (1 - xout),
        Wd = innerWidth,
        Hd = innerHeight,
        bw = (rc[2] - rc[0]) * Wd,
        bh = (rc[3] - rc[1]) * Hd;
      Object.assign(el.xp.style, {
        left: rc[0] * Wd + "px",
        top: rc[1] * Hd + "px",
        width: bw + "px",
        height: bh + "px",
        borderRadius: Math.min(bw / 2, bh / 2, 0.016 * Wd) + "px",
        opacity: xo,
        transform: `scale(${1 - 0.04 * xout})`,
        visibility: xo > 0.003 ? "visible" : "hidden",
      });
      el.xp.style.setProperty("--xc", xc);
      [el.xpl, el.xpr].forEach((a) => {
        a.style.opacity = xc;
        a.style.pointerEvents = xc > 0.8 ? "auto" : "none";
      });
      xpOpen.current = xc > 0.8;
      el.btr.style.opacity = 1 - 0.65 * e(seg(wv, 1880, 2040)) * (1 - xout);
      // ---- footer rises, traces are pushed up 1:1 ----
      const fp = e(seg(wv, 2320, 2670)),
        cov = 0.71 * fp;
      el.bfoot.style.transform = `translate3d(0,${(1 - fp) * 100}%,0)`;
      el.bfoot.style.pointerEvents = fp > 0.5 ? "auto" : "none";
      el.btr.style.transform = `translate3d(0,${-cov * innerHeight}px,0)`;
      // back-to-first-page button: appears once you start scrolling, hides while a work panel is open
      const topO =
        phase.current === "ready" && !pan.open && pan.t < 0.001
          ? e(seg(cur, 0.012, 0.04))
          : 0;
      el.top.style.opacity = topO;
      el.top.style.visibility = topO < 0.003 ? "hidden" : "visible";
      el.top.style.pointerEvents = topO > 0.5 ? "auto" : "none";
      stepPanel(dt, now);
      stepAbout(dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      px.dispose();
      px2.dispose();
      removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onOut);
      removeEventListener("resize", onRz);
      removeEventListener("keydown", onKey);
      removeEventListener("wheel", onAboutWheel);
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
          <button
            data-id="cbtn"
            className="cbtn"
            onClick={() => ctl.current?.toFooter()}
          >
            CONTACT
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
              <button
                className="mb"
                style={{ "--i": 0 }}
                onClick={() => {
                  setMenu(false);
                  ctl.current?.openAbout();
                }}
              >
                ABOUT
              </button>
              <button
                className="mb"
                style={{ "--i": 1 }}
                onClick={() => {
                  setMenu(false);
                  setOrb(true);
                }}
              >
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
            {SKILLS.map((w, i) => (
              <div
                key={w.id}
                aria-label={w.title}
                role="button"
                ref={(n) => (cardRefs.current[i] = n)}
                className="wcard"
                style={{ "--x": POS[i][0], "--y": POS[i][1] }}
                onClick={() => ctl.current?.click(i)}
                onMouseEnter={() => ctl.current?.enter(i)}
                onMouseLeave={() => ctl.current?.leave()}
              >
                <div className="wcl">
                  <b>{w.title}</b>
                  <small>{w.tag}</small>
                  <ul>
                    {(CARD_META[w.id] || []).map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
                {w.logos.map((l) => (
                  <img
                    key={l.src}
                    className="wlogo"
                    src={l.src}
                    alt=""
                    draggable="false"
                    style={{
                      left: l.l + "%",
                      top: l.t + "%",
                      width: l.w + "%",
                    }}
                  />
                ))}
              </div>
            ))}
            <div data-id="whub" className="whub">
              <i className="hr hr1" />
              <i className="hr hr2" />
              <img
                className="chip"
                src="/Vector.png"
                alt=""
                draggable="false"
              />
            </div>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                ref={(n) => (boxRefs.current[i] = n)}
                className="wbox"
              />
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
              <div className="wleft">
                <small data-id="wtag" />
                <h4 data-id="wtitle" />
                <i data-id="wrule" className="wrule" />
                <div data-id="wbody" className="wbody">
                  {SKILLS.map((w, i) => (
                    <div
                      key={w.id}
                      ref={(n) => (skRefs.current[i] = n)}
                      className="wsk"
                    >
                      <SkillBody s={w} />
                    </div>
                  ))}
                </div>
              </div>
              <div data-id="wpics" className="wpics">
                {SKILLS.map((w, i) => (
                  <div
                    key={w.id}
                    ref={(n) => (picRefs.current[i] = n)}
                    className="wpicset"
                  >
                    {w.pics.map((P, j) => (
                      <div key={j} className="wpic">
                        <P />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <button
              data-id="wx"
              className="wx"
              aria-label="Close"
              onClick={() => ctl.current?.close()}
            >
              <svg viewBox="0 0 20 20">
                <path
                  d="M3 3L17 17"
                  strokeDasharray="20"
                  strokeDashoffset="20"
                />
                <path
                  d="M17 3L3 17"
                  strokeDasharray="20"
                  strokeDashoffset="20"
                />
              </svg>
            </button>
          </div>
        </div>
        <div data-id="bsec" className="bsec">
          <svg
            data-id="btr"
            className="btr"
            viewBox="0 0 1509 879"
            preserveAspectRatio="none"
          >
            <g transform="translate(-12,-28)">
              {BTR.map(([c, d], i) => (
                <path key={i} d={d} className={c === "p" ? "bp" : "bo"} />
              ))}
            </g>
          </svg>
          <div data-id="xp" className="xp">
            <div className="xpd" style={{ "--d": xp.d }}>
              {XP.map((x, i) => (
                <div
                  key={i}
                  className={
                    "xps" + (i === xp.i ? " on" : i === xp.p ? " off" : "")
                  }
                >
                  <h3>{x.title}</h3>
                  <p className="xpp">{x.period}</p>
                  {x.lines.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button
            data-id="xpl"
            className="xpa xpl"
            aria-label="Previous"
            onClick={() => goXp(-1)}
          >
            <svg viewBox="0 0 24 36">
              <path d="M20 3L4 18L20 33Z" />
            </svg>
          </button>
          <button
            data-id="xpr"
            className="xpa xpr"
            aria-label="Next"
            onClick={() => goXp(1)}
          >
            <svg viewBox="0 0 24 36">
              <path d="M4 3L20 18L4 33Z" />
            </svg>
          </button>
          <div data-id="bfoot" className="bfoot">
            <div className="ft-top">
              <div className="ft-l">
                <h2>LET’S BUILD SOMETHING TOGETHER</h2>
                <div className="ft-btns">
                  <a
                    className="ftb"
                    href={CONTACT.email ? "mailto:" + CONTACT.email : undefined}
                  >
                    SEND A MESSAGE
                  </a>
                  <a
                    className="ftb"
                    href={CONTACT.cv || undefined}
                    download={CONTACT.cv ? "" : undefined}
                  >
                    DOWNLOAD CV <span>↓</span>
                  </a>
                </div>
              </div>
              <div className="ft-r">
                <div className="ftc ftc1">
                  <span>{CONTACT.name}</span>
                  <a href={CONTACT.portfolio || undefined}>PORTFOLIO</a>
                  <span>{CONTACT.address}</span>
                </div>
                <div className="ftc">
                  <a
                    href={CONTACT.email ? "mailto:" + CONTACT.email : undefined}
                  >
                    EMAIL <i>↗</i>
                  </a>
                  <a href={CONTACT.linkedin || undefined}>
                    LINKEDIN <i>↗</i>
                  </a>
                </div>
                <div className="ftc">
                  <a href={CONTACT.github || undefined}>
                    GITHUB <i>↗</i>
                  </a>
                  <a href={CONTACT.facebook || undefined}>
                    FACEBOOK <i>↗</i>
                  </a>
                </div>
              </div>
            </div>
            <svg
              className="ft-px"
              viewBox={`0 0 ${PIX.cols} ${PIX.rows}`}
              preserveAspectRatio="xMidYMax meet"
              aria-label={CONTACT.big}
            >
              <defs>
                <pattern
                  id="pxd"
                  width="0.25"
                  height="0.25"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="0.215" height="0.215" fill="#050505" />
                </pattern>
              </defs>
              <path d={PIX.d} fill="url(#pxd)" />
            </svg>
          </div>
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
        {about && (
          <div className="about" ref={aboutScrollRef}>
            <svg
              width="0"
              height="0"
              style={{ position: "absolute" }}
              aria-hidden="true"
            >
              <filter id="aboil" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence
                  type="turbulence"
                  baseFrequency="0.012 0.04"
                  numOctaves="2"
                  seed="7"
                  result="n"
                >
                  <animate
                    attributeName="baseFrequency"
                    dur="2.6s"
                    values="0.012 0.04;0.02 0.07;0.012 0.04"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="n"
                  scale="26"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </svg>
            <div className="ahead">
              <p className="tl">MD. ASHRAFUL ALAM SHUVO</p>
              <div className="city">
                <p>DHAKA, BANGLADESH</p>
                <small>{time}</small>
              </div>
              <div className="modesw" data-mode={wMode}>
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
              <button
                className="x"
                aria-label="Close about"
                onClick={() => ctl.current?.closeAbout()}
              >
                <i />
                <i />
              </button>
            </div>
            <div className="ascroll">
              <div className="acontact">
                <p>{CONTACT.phone}</p>
                <p>{CONTACT.email}</p>
              </div>
              <h2 className="atitle">ABOUT</h2>
              {ABOUT.map((b, i) => (
                <div
                  key={b.id}
                  data-row-id={b.id}
                  className={
                    "arow a-" +
                    b.kind +
                    " " +
                    wMode +
                    (pulsing === b.id ? " pulsing" : "") +
                    (openBlock === b.id ? " is-open" : "") +
                    (seenRows.has(b.id) ? " in" : "")
                  }
                  onClick={() => {
                    if (wMode !== "click" || b.kind === "cta") return;
                    setPulsing(b.id);
                    setOpenBlock((o) => (o === b.id ? null : b.id));
                  }}
                  onMouseEnter={() => {
                    if (wMode !== "hover" || b.kind === "cta") return;
                    setOpenBlock(b.id);
                  }}
                  /* hover mode: the open panel covers the row, so the panel closes itself on mouse-leave */
                  onAnimationEnd={(e) => {
                    if (e.animationName === "aPulse") setPulsing(null);
                  }}
                >
                  <b className="arow-title">{b.title}</b>

                  {b.kind === "photo" && (
                    <>
                      <div
                        className="aimg adissolve"
                        style={{ backgroundImage: `url(${b.img})` }}
                      />
                    </>
                  )}

                  {b.kind === "icons" && (
                    <div className="aicons adissolve">
                      {b.icons.map((ic, k) => (
                        <span
                          key={ic.name}
                          className="aicon"
                          style={{
                            "--k": k,
                            "--x": ic.x + "%",
                            "--y": ic.y + "%",
                          }}
                        >
                          {ic.src ? (
                            <img src={ic.src} alt={ic.name} />
                          ) : (
                            <em>?</em>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  {b.kind === "cert" && (
                    <div className="acertwrap adissolve">
                      <div className="acerthex" />
                      <div className="acert">
                        <b>{b.name}</b>
                        <p>
                          <strong>{b.certA}</strong>
                          <span>{b.certB}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {b.kind === "cta" && (
                    <div className="actawrap adissolve">
                      <button
                        className="aopen"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrb(true);
                        }}
                      >
                        Open Projects &#8594;
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <p className="atag">Learn it. Build it. Break it. Improve it.</p>
            </div>
            {(() => {
              const o = ABOUT.find((x) => x.id === openBlock);
              if (!o) return null;
              return (
                <div
                  className={"apanel " + wMode}
                  key={o.id}
                  onMouseLeave={() => wMode === "hover" && setOpenBlock(null)}
                >
                  <h3 className="ap-title">{o.title}</h3>
                  <button
                    className="ap-close"
                    onClick={() => setOpenBlock(null)}
                  >
                    Close
                  </button>
                  <div className="ap-text">
                    {o.items
                      ? o.items.map((it) => (
                          <div className="ap-edu" key={it.name}>
                            <img src={it.logo} alt="" draggable="false" />
                            <div>
                              <b>{it.name}</b>
                              {it.rows.map((r) => (
                                <p key={r}>{r}</p>
                              ))}
                            </div>
                          </div>
                        ))
                      : o.text.map((t, n) =>
                          typeof t === "string" ? (
                            <p key={n}>{t}</p>
                          ) : (
                            <p key={n}>
                              <b className="ap-h">{t.h}</b>
                              <br />
                              {t.p}
                            </p>
                          ),
                        )}
                  </div>
                  <div className={"ap-media ap-" + o.kind}>
                    {o.kind === "icons" ? (
                      <div className="ap-tools">
                        {[...o.icons, ...(o.more || [])].map((ic) => (
                          <span key={ic.name}>
                            {ic.src && <img src={ic.src} alt="" />}
                            <i>{ic.name}</i>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <img src={o.img} alt={o.title} draggable="false" />
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        <button
          data-id="top"
          className="totop"
          aria-label="Back to the first page"
          title="Back to the first page"
          onClick={() => ctl.current?.toTop()}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20V5M5 11l7-7 7 7" />
          </svg>
        </button>
        {orb && <WorksOrb time={time} onClose={() => setOrb(false)} />}
        <div className="grain" />
        <canvas ref={cv} className="gl" />
        <canvas ref={cv2} className="gl about-gl" />
        <div ref={pct} className="pct">
          0%
        </div>
      </main>
    </>
  );
}