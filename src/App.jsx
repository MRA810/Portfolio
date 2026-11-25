import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { createPixels } from "./pixels.js";
import { SKILLS, SkillBody } from "./skills.jsx";
import { pixelText } from "./pixelfont.js";
import WorksOrb from "./WorksOrb.jsx";

// menu "Contacts": every way to reach me; icons live in /public/icons (Simple Icons, CC0)
const CONTACTS = [
  {
    name: "Email",
    href: "mailto:ashshuvo1222.prof@gmail.com",
    icon: "gmail",
    color: "#ea4335",
  },
  {
    name: "Phone",
    href: "tel:+8801841995394",
    icon: "phone",
    color: "#fff0a4",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/8801841995394",
    icon: "whatsapp",
    color: "#25d366",
  },
  {
    name: "Telegram",
    href: "https://t.me/mrrelaxedash",
    icon: "telegram",
    color: "#26a5e4",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/ashrafulalamshuvo1222/",
    icon: "linkedin",
    color: "#2a8ae6",
  },
  {
    name: "GitHub",
    href: "https://github.com/mra810",
    icon: "github",
    color: "#f0f0f0",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/ashraful.alam.shuvo.16873",
    icon: "facebook",
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
    "FN:Md. Ashraful Alam Shuvo",
    "N:Shuvo;Ashraful;;;",
    "TITLE:Developer",
    "EMAIL:ashshuvo1222.prof@gmail.com",
    "TEL;TYPE=CELL:+8801841995394",
    "URL:https://wa.me/8801841995394",
    "URL:https://t.me/mrrelaxedash",
    "URL:https://github.com/mra810",
    "URL:https://linkedin.com/in/ashrafulalamshuvo1222/",
    "URL:https://www.facebook.com/ashraful.alam.shuvo.16873",
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
// experience slides (the arrows / tabs switch them; the box itself follows the scroll)
const XP = [
  {
    org: "Computer Programming Club",
    short: "Programming Club",
    role: "Assistant Graphics Designer",
    from: "2024",
    to: "2025",
    kind: "Design",
    did: "Designed graphics for the programming club.",
    tags: ["Graphic design", "Visual identity"],
    pic: "design",
  },
  {
    org: "Mastermind Coding Academy",
    short: "Mastermind Academy",
    role: "Coding Instructor",
    from: "2025",
    to: "2026",
    kind: "Teaching",
    did: "Taught kids how to code, from first programs to their own games and apps.",
    tags: [
      "Python",
      "HTML & CSS",
      "Games with Scratch",
      "Mobile apps with MIT App Inventor",
    ],
    pic: "teach",
  },
];
// line drawings for the experience box (viewBox 0 0 400 280)
const XpPic = ({ kind }) =>
  kind === "design" ? (
    <svg viewBox="0 0 400 280" className="xp-svg" aria-hidden="true">
      <rect x="40" y="30" width="250" height="190" className="xs-frame" />
      <text x="40" y="22" className="xs-lbl">
        ARTBOARD_01
      </text>
      <path d="M70 180 C 120 60, 200 60, 260 150" className="xs-curve" />
      <line x1="70" y1="180" x2="110" y2="90" className="xs-handle" />
      <line x1="260" y1="150" x2="235" y2="70" className="xs-handle" />
      <rect x="64" y="174" width="12" height="12" className="xs-anchor" />
      <rect x="254" y="144" width="12" height="12" className="xs-anchor" />
      <circle cx="110" cy="90" r="5" className="xs-knob" />
      <circle cx="235" cy="70" r="5" className="xs-knob" />
      <path
        d="M300 200 l26 -60 l10 4 l-26 60 z M300 200 l-4 14 l14 -10"
        className="xs-pen"
      />
      <g className="xs-sw">
        <rect x="320" y="40" width="44" height="30" fill="#ff3a00" />
        <rect x="320" y="76" width="44" height="30" fill="#6306ca" />
        <rect x="320" y="112" width="44" height="30" fill="#fff0a4" />
      </g>
      <text x="40" y="250" className="xs-lbl">
        #FF3A00 #6306CA #FFF0A4
      </text>
    </svg>
  ) : (
    <svg viewBox="0 0 400 280" className="xp-svg" aria-hidden="true">
      <rect x="20" y="20" width="230" height="150" className="xs-frame" />
      <line x1="20" y1="42" x2="250" y2="42" className="xs-handle" />
      <circle cx="34" cy="31" r="4" className="xs-knob" />
      <circle cx="48" cy="31" r="4" className="xs-knob" />
      <text x="36" y="70" className="xs-code">
        <tspan className="xs-k">def</tspan> hello(name):
      </text>
      <text x="36" y="94" className="xs-code">
        {" "}
        print(
        <tspan className="xs-s">
          f"hi {"{"}name{"}"}"
        </tspan>
        )
      </text>
      <text x="36" y="118" className="xs-code">
        hello(<tspan className="xs-s">"class"</tspan>)
      </text>
      <text x="36" y="148" className="xs-lbl">
        &gt;&gt;&gt; hi class_
      </text>
      <g className="xs-blocks">
        <path
          d="M30 196 h70 l6 6 h20 l6 -6 h48 v26 h-48 l-6 6 h-20 l-6 -6 h-70 z"
          fill="#ff3a00"
        />
        <path
          d="M30 228 h70 l6 6 h20 l6 -6 h78 v26 h-78 l-6 6 h-20 l-6 -6 h-70 z"
          fill="#6306ca"
        />
        <text x="42" y="214" className="xs-bt">
          when clicked
        </text>
        <text x="42" y="246" className="xs-bt">
          move 10 steps
        </text>
      </g>
      <rect
        x="290"
        y="40"
        width="90"
        height="170"
        rx="14"
        className="xs-frame"
      />
      <rect x="302" y="62" width="66" height="112" className="xs-screen" />
      <rect x="312" y="76" width="46" height="18" fill="#ff3a00" />
      <rect x="312" y="102" width="46" height="10" className="xs-dim" />
      <rect x="312" y="118" width="30" height="10" className="xs-dim" />
      <circle cx="335" cy="192" r="7" className="xs-knob" />
    </svg>
  );
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
// works-board skill cards: short chips + "since" year
const CARD_META = {
  react: { chips: ["JavaScript", "HTML / CSS", "Bootstrap"] },
  django: { chips: ["Python", "MySQL", "BookinFly"], since: "2025" },
  flutter: { chips: ["Dart", "Mobile apps"], since: "2024" },
  electron: {
    chips: ["Egg Timer", "JS \u00b7 HTML \u00b7 CSS"],
    since: "2025",
  },
  express: { chips: ["Node.js", "REST APIs", "Middleware"] },
  js: { chips: ["ES6+", "DOM", "Async"], since: "2022" },
  iot: { chips: ["Sensors", "MQTT", "Dashboards"] },
  esp32: { chips: ["SPAEMS", "PlatformIO", "C / C++"] },
  ai: { chips: ["Machine Learning", "Computer Vision"] },
  arduino: { chips: ["C / C++", "Soldering", "Digital Logic"] },
};
const PIX = pixelText(CONTACT.big);
// black-section traces, taken from the Figma frame (absolute frame coords)
const DEVICON = (slug, variant) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-${variant}.svg`;
// About page content. Pictures live in /public: portrait.webp (Me),
// Academic_logo/* (Education), Certificates/web/* (Certificates).
// Toolbox icons load from the devicon CDN.
// Certificates panel: web-sized copies live in /public/Certificates/web (originals sit
// next to them). SSC/HSC scans are left out on purpose: they show date of birth,
// parents' names and board registration numbers.
const CERT_DIR = "/Certificates/web/";
const CERTS = [
  {
    id: "aws",
    title: "AWS Academy Cloud Foundations",
    org: "AWS Academy",
    date: "Aug 2025",
    tag: "Course",
  },
  {
    id: "uiu-robo-soccer-2025",
    title: "UIU CSE Fest 2025 \u2014 Robo Soccer",
    org: "United International University",
    date: "2025",
    tag: "Robotics",
  },
  {
    id: "robotronics-2025",
    title: "Robotronics Fest 2025",
    org: "University of Dhaka \u00b7 RME & RMEDU Club",
    date: "Aug 2025",
    tag: "Robotics",
  },
  {
    id: "automech-2025",
    title: "Automech 2025",
    org: "IUT \u00b7 MPE & Automobile Society",
    date: "Aug 2025",
    tag: "Engineering",
  },
  {
    id: "icpc-volunteer-2024",
    title: "ICPC Asia Dhaka Regional 2024 \u2014 Volunteer",
    org: "ICPC Foundation \u00b7 DIU",
    date: "Dec 2024",
    tag: "Volunteer",
  },
  {
    id: "takeoff-2023",
    title: "Take-Off Programming Contest \u2014 Final Round",
    org: "DIU Computer & Programming Club",
    date: "Fall 2023",
    tag: "Contest",
  },
  {
    id: "unlock-algorithm-2024",
    title: "Unlock the Algorithm Programming Contest",
    org: "DIU Computer & Programming Club",
    date: "Fall 2024",
    tag: "Contest",
  },
  {
    id: "typetrek-2025",
    title: "TypeTrek Face-Off Speed Typing Contest",
    org: "DIU Computer & Programming Club",
    date: "Fall 2025",
    tag: "Contest",
  },
  {
    id: "typetrek-2024",
    title: "TypeTrek Face-Off",
    org: "DIU Computer & Programming Club",
    date: "Spring 2024",
    tag: "Contest",
  },
  {
    id: "astro-carnival-2023",
    title: "SUST Astro Carnival 2023",
    org: "CAM-SUST \u00b7 SUST, Sylhet",
    date: "Sep 2023",
    tag: "Science",
  },
  {
    id: "astro-code",
    title: "Astro-Code Intensive",
    org: "Copernicus Astronomical Memorial, SUST",
    date: "",
    tag: "Science",
  },
  {
    id: "goedu-oop",
    title: "Thinking in Object Oriented Programming",
    org: "GoEdu \u00b7 with distinction",
    date: "Oct 2025",
    tag: "Course",
  },
  {
    id: "goedu-chatgpt",
    title: "ChatGPT Basics, Usage and Prospects",
    org: "GoEdu \u00b7 with distinction",
    date: "Oct 2025",
    tag: "Course",
  },
  {
    id: "goedu-google",
    title: "Effective Use of Google",
    org: "GoEdu \u00b7 with distinction",
    date: "Oct 2025",
    tag: "Course",
  },
  {
    id: "goedu-ict-ai",
    title: "ICT Industry in Bangladesh and AI",
    org: "GoEdu \u00b7 with distinction",
    date: "Dec 2024",
    tag: "Course",
  },
];
const ABOUT_SECTIONS = [
  { id: "me", label: "Me", file: "whoami" },
  { id: "toolbox", label: "Toolbox", file: "ls ~/tools" },
  { id: "edu", label: "Education", file: "cat timeline" },
  { id: "cert", label: "Certificates", file: "open ./proof" },
  { id: "gallery", label: "Gallery", file: "ls ./moments" },
  { id: "works", label: "Works", file: "cd projects/" },
];
const ME = {
  bio: [
    "I’m Md. Ashraful Alam Shuvo, a Computer Science and Engineering student at Daffodil International University in Dhaka. I like building things that live between software and hardware: a small rover made from cardboard and motors, a dashboard that shows live sensor readings, an app that does one job well.",
    "I enjoy taking a rough idea, making it work, and then breaking it on purpose to see how it can be improved. Away from my own projects I’ve designed graphics for a programming club and taught kids how to code.",
  ],
  stats: [
    ["2020", "first line of HTML"],
    [String(CERTS.length), "certificates earned"],
    ["10+", "languages & frameworks"],
    ["2027", "expected CSE graduation"],
  ],
  path: [
    ["2020", "HTML & CSS"],
    ["2021", "Python"],
    ["2022", "JavaScript"],
    ["Then", "C / C++, DSA & contests"],
    ["Since", "Flutter, Spring Boot, Electron, Django, Flask"],
    ["Also", "Electronics: digital logic to soldering"],
  ],
  likes: [
    {
      g: "▶",
      h: "Video Games",
      p: "Games are a blend of art, storytelling and technology. Each one makes me think about how worlds are built, how mechanics drive emotion, and how creativity meets code. My dream is to make games that connect people and spark imagination, like the ones that shaped my own journey.",
    },
    {
      g: "⌖",
      h: "Travelling",
      p: "Travelling opens my mind to new cultures, people and ideas. Every trip teaches me something: how people live, how cities grow, how nature inspires. Seeing the world from new angles feeds my imagination as a developer and designer.",
    },
  ],
};
// [name, devicon slug, variant, invert-on-dark]; no slug = text chip
const TOOLBOX = [
  {
    k: "Languages",
    items: [
      ["C / C++", "cplusplus", "original"],
      ["Python", "python", "original"],
      ["Java", "java", "original"],
      ["JavaScript", "javascript", "original"],
      ["HTML", "html5", "original"],
      ["CSS", "css3", "original"],
    ],
  },
  {
    k: "Frameworks",
    items: [
      ["Django", "django", "plain", true],
      ["Flask", "flask", "original", true],
      ["Spring Boot", "spring", "original"],
      ["Flutter", "flutter", "original"],
      ["Bootstrap", "bootstrap", "original"],
      ["Electron", "electron", "original"],
    ],
  },
  {
    k: "Design",
    items: [
      ["Figma", "figma", "original"],
      ["Illustrator", "illustrator", "original"],
      ["Photoshop", "photoshop", "original"],
      ["Canva", "canva", "original"],
    ],
  },
  {
    k: "Dev tools",
    items: [
      ["Git", "git", "original"],
      ["GitHub", "github", "original", true],
      ["VS Code", "vscode", "original"],
      ["IntelliJ", "intellij", "original"],
      ["Linux", "linux", "original"],
    ],
  },
  {
    k: "Electronics",
    items: [
      ["Arduino", "arduino", "original"],
      ["ESP32"],
      ["Digital Logic"],
      ["Soldering"],
    ],
  },
  {
    k: "Soft skills",
    items: [
      ["Team Leadership"],
      ["Teamwork"],
      ["Project Management"],
      ["Problem Solving"],
    ],
  },
];
const EDU = [
  {
    year: "2020",
    level: "SSC · Science",
    name: "Chapain New Model High School",
    logo: "/Academic_logo/chapain.png",
    rows: ["Dhaka Board", "GPA 4.72 / 5.00"],
  },
  {
    year: "2022",
    level: "HSC · Science",
    name: "Savar Laboratory College",
    logo: "/Academic_logo/savarLaboratoryCollege.png",
    rows: ["Dhaka Board", "GPA 4.83 / 5.00"],
  },
  {
    year: "2023–27",
    level: "B.Sc. · Computer Science & Engineering",
    name: "Daffodil International University",
    logo: "/Academic_logo/daffodil.png",
    rows: ["Batch 65 · Fall 2023 session", "Expected graduation 2027"],
    now: true,
  },
];
// slight tilt per certificate on the pinboard (deg)
// viewer items: { src, alt, title?, badge?, meta?, text? } (text = shown beside the photo)
const CERT_ITEMS = CERTS.map((c) => ({
  src: `${CERT_DIR}${c.id}.webp`,
  alt: `Certificate: ${c.title}`,
}));
// gallery: one entry per event, newest first. Photos live in /public/gallery/<id>/
// as n.webp (full) + n-thumb.webp. Dates come from the photos' EXIF "date taken"
// where the camera recorded one (see the note on each).
const EVENTS = [
  {
    id: "robotech-olympiad-2026",
    title: "6th International Robo Tech Olympiad",
    date: "14 Nov 2026", // EXIF
    place: "Daffodil International University",
    n: 4,
    text: [
      "Took our robots to the 6th International Robo Tech Olympiad at Daffodil International University \u2014 onto the robo-soccer pitch and the line-following track, with the whole team in the pits.",
    ],
  },
  {
    id: "iot-final-project",
    title: "IoT Final Project",
    date: "22 Jul 2026", // EXIF
    place: "DIU \u00b7 Department of CSE",
    n: 2,
    text: [
      "Our final project for an IoT course at DIU: a solar-powered smart-house model wired to a microcontroller, streaming its sensor readings live to a dashboard. It wrapped up with a course certificate.",
    ],
  },
  {
    id: "ai-devfest",
    title: "AI DevFest",
    date: "2026", // no EXIF date; year from the event lanyard
    place: "DIU \u00b7 Computer & Programming Club",
    n: 1,
    text: [
      "Heads-down at a workstation during AI DevFest, an event with DIU\u2019s Computer & Programming Club.",
    ],
  },
  {
    id: "automech-2025",
    title: "Automech 2025",
    date: "8 Aug 2025", // EXIF (matches the Automech certificate, 8\u20139 Aug)
    place: "IUT \u00b7 Gazipur",
    n: 1,
    text: [
      "Brought our RC robot to Automech 2025, the fest run by IUT\u2019s Department of Mechanical & Production Engineering and the IUT Automobile Society.",
    ],
  },
  {
    id: "astrocode-intensive",
    title: "AstroCode Intensive Hackathon",
    date: "8\u20139 March", // no EXIF date (photos came from Facebook); year unknown
    place: "CAM-SUST \u00b7 SUST, Sylhet",
    badge: "Runner-up \u00b7 Team Cygnus X-1",
    n: 3,
    text: [
      "AstroCode Intensive \u2014 \u201cFrom Asteroid Hunting to Image Processing\u201d \u2014 was a two-day astronomy workshop at SUST, run by the Research & Project sector of CAM-SUST.",
      "It closed with a 48-hour virtual hackathon: seven registered teams of up to three people solved coding problems built around what the workshop covered, from finding asteroids to processing telescope images.",
      "My team, Cygnus X-1 \u2014 Miftahul Jannat Jessica (SUST) and me (DIU) \u2014 finished as runner-up.",
    ],
  },
];
// every gallery photo as a viewer item (the viewer can step through all of them)
const GALLERY_ITEMS = EVENTS.flatMap((ev) =>
  Array.from({ length: ev.n }, (_, k) => ({
    ev: ev.id,
    src: `/gallery/${ev.id}/${k + 1}.webp`,
    thumb: `/gallery/${ev.id}/${k + 1}-thumb.webp`,
    alt: `${ev.title}, photo ${k + 1}`,
    title: ev.title,
    badge: ev.badge,
    meta: `${ev.date} \u00b7 ${ev.place}`,
    text: ev.text,
  })),
);
const galleryIndex = (id, k = 0) =>
  GALLERY_ITEMS.findIndex((g) => g.ev === id) + k;
// works-board dark boxes: each cycles text -> that event's photos -> text ...
// box 0 is the AstroCode achievement, boxes 1-4 show the other events
const BOARD = [
  {
    ev: "astrocode-intensive",
    kicker: "ACHIEVEMENT",
    head: "Runner-up",
    sub: "AstroCode Intensive Hackathon",
    line: "Team Cygnus X-1 \u00b7 CAM-SUST",
  },
  ...[
    "robotech-olympiad-2026",
    "iot-final-project",
    "ai-devfest",
    "automech-2025",
  ].map((id) => {
    const e = EVENTS.find((x) => x.id === id);
    return {
      ev: id,
      kicker: "GALLERY",
      head: e.title,
      line: `${e.date} \u00b7 ${e.place}`,
    };
  }),
];
// pixel-dissolve cells for the board cards (stable pseudo-random delays, some cells orange)
const PX = Array.from({ length: 12 * 8 }, (_, i) => ({
  d: Math.floor((Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1) * 380),
  o: Math.abs(Math.sin((i + 1) * 78.233) * 9631.7) % 1 < 0.22,
}));
function BoardCard({ boxRef, card, offset = 0, onOpen, hoverMode }) {
  const ev = EVENTS.find((x) => x.id === card.ev);
  const [slide, setSlide] = useState(0); // 0 = text, 1..n = photo
  const [px, setPx] = useState(""); // "" | "in" | "out"
  const slideRef = useRef(0);
  const hover = useRef(false);
  const hto = useRef(0);
  useEffect(() => () => clearTimeout(hto.current), []);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ts = [];
    const later = (f, ms) => ts.push(setTimeout(f, ms));
    const tick = (first) =>
      later(
        () => {
          if (hover.current || document.hidden) return tick();
          setPx("in"); // cells cover the card
          later(() => {
            slideRef.current = (slideRef.current + 1) % (ev.n + 1);
            setSlide(slideRef.current); // swap under the cover
            setPx("out"); // cells clear in reverse order
            later(() => {
              setPx("");
              tick();
            }, 560);
          }, 560);
        },
        (slideRef.current === 0 ? 4200 : 3000) + (first ? offset : 0),
      );
    tick(true);
    return () => ts.forEach(clearTimeout);
  }, []);
  const long = card.head.length > 16;
  return (
    <button
      ref={boxRef}
      className="wbox wach"
      onClick={() => onOpen(Math.max(0, slide - 1))}
      onMouseEnter={() => {
        hover.current = true;
        // hover mode (mouse only): resting on the card opens it, like the skill cards
        if (!hoverMode || matchMedia("(pointer: coarse)").matches) return;
        clearTimeout(hto.current);
        hto.current = setTimeout(
          () => onOpen(Math.max(0, slideRef.current - 1), true),
          260,
        );
      }}
      onMouseLeave={() => {
        hover.current = false;
        clearTimeout(hto.current);
      }}
      aria-label={`${card.kicker === "ACHIEVEMENT" ? card.head + ": " : ""}${ev.title}, open photos`}
    >
      {slide === 0 ? (
        <span className={"wach-t" + (long ? " long" : "")}>
          <small>{card.kicker}</small>
          <b>{card.head}</b>
          {card.sub && <em>{card.sub}</em>}
          <i>{card.line}</i>
          <u>
            VIEW PHOTOS <span aria-hidden="true">&#8594;</span>
          </u>
        </span>
      ) : (
        <span
          className="wach-ph"
          style={{ "--bg": `url(/gallery/${ev.id}/${slide}-thumb.webp)` }}
        >
          <img
            src={`/gallery/${ev.id}/${slide}-thumb.webp`}
            alt=""
            draggable="false"
          />
          <span className="wach-cap">
            {pad2(slide)} / {pad2(ev.n)}
          </span>
        </span>
      )}
      <span className={"wpx " + px} aria-hidden="true">
        {PX.map((c, i) => (
          <i
            key={i}
            className={c.o ? "o" : ""}
            style={{ "--d": (px === "out" ? 380 - c.d : c.d) + "ms" }}
          />
        ))}
      </span>
    </button>
  );
}
const CERTS_SHOWN = 6; // certificates visible before "Show all"
const TILT = [
  -2.2, 1.4, -0.8, 2.4, -1.6, 0.9, 1.9, -2.6, 0.5, -1.1, 2.1, -0.4, 1.2, -1.9,
  0.7,
];
const pad2 = (n) => String(n).padStart(2, "0");
// footer contents: used by the main page's sliding footer and at the end of About
// (pid keeps the svg pattern id unique when both are in the DOM)
const SiteFooter = ({ pid }) => (
  <>
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
          <a href={CONTACT.portfolio || undefined}>
            PORTFOLIO <i>↗</i>
          </a>
          <span>{CONTACT.address}</span>
        </div>
        <div className="ftc">
          <a href={CONTACT.email ? "mailto:" + CONTACT.email : undefined}>
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
          id={pid}
          width="0.25"
          height="0.25"
          patternUnits="userSpaceOnUse"
        >
          <rect width="0.215" height="0.215" fill="#050505" />
        </pattern>
      </defs>
      <path d={PIX.d} fill={`url(#${pid})`} />
    </svg>
  </>
);
const SecHead = ({ n, title, file }) => (
  <header className="ahd">
    <span className="ahd-n">{pad2(n)}</span>
    <h2>{title}</h2>
    <i className="ahd-rule" />
    <code>
      <em>$</em> {file}
    </code>
  </header>
);
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
  // about page: which section is in view (drives the index), which have
  // been revealed, and the certificate viewer (index into CERTS, or null)
  const [aSec, setASec] = useState("me");
  const [seenSecs, setSeenSecs] = useState(() => new Set());
  // shared photo viewer: { items, i } or null (certificates, gallery, works board)
  const [lb, setLb] = useState(null);
  const [certsOpen, setCertsOpen] = useState(false);
  const lbRef = useRef(null);
  const lbIn = useRef(false), // pointer has been over the photo / write-up
    lbTo = useRef(0);
  useEffect(() => {
    lbRef.current = lb;
    if (!lb) {
      lbIn.current = false;
      clearTimeout(lbTo.current);
    }
  }, [lb]);
  // hover-opened viewer: close once the pointer leaves the content (armed on first entry)
  const lbEnter = () => {
    lbIn.current = true;
    clearTimeout(lbTo.current);
  };
  const lbLeave = () => {
    if (!lbRef.current?.hover || !lbIn.current) return;
    clearTimeout(lbTo.current);
    lbTo.current = setTimeout(() => setLb(null), 260);
  };
  useEffect(() => {
    if (!about) {
      setSeenSecs(new Set());
      setASec("me");
      setLb(null);
      setCertsOpen(false);
      return;
    }
    const root = aboutScrollRef.current;
    if (!root) return;
    const secs = [...root.querySelectorAll("[data-sec]")];
    const io = new IntersectionObserver(
      (ents) => {
        const hit = ents
          .filter((en) => en.isIntersecting)
          .map((en) => en.target.dataset.sec);
        if (hit.length) setSeenSecs((prev) => new Set([...prev, ...hit]));
      },
      { root, threshold: 0.06 },
    );
    const spy = () => {
      const line = root.getBoundingClientRect().top + root.clientHeight * 0.42;
      let cur = secs[0].dataset.sec;
      for (const el of secs)
        if (el.getBoundingClientRect().top <= line) cur = el.dataset.sec;
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 4)
        cur = secs[secs.length - 1].dataset.sec;
      setASec(cur);
    };
    secs.forEach((el) => io.observe(el));
    root.addEventListener("scroll", spy, { passive: true });
    spy();
    return () => {
      io.disconnect();
      root.removeEventListener("scroll", spy);
    };
  }, [about]);
  useEffect(() => {
    if (!lb) return;
    const n = lb.items.length;
    const k = (ev) => {
      if (ev.key === "Escape") setLb(null);
      if (n < 2) return;
      if (ev.key === "ArrowRight")
        setLb((v) => v && { ...v, i: (v.i + 1) % n });
      if (ev.key === "ArrowLeft")
        setLb((v) => v && { ...v, i: (v.i - 1 + n) % n });
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [lb]);
  const aboutJump = (id) => {
    const el = aboutScrollRef.current?.querySelector(`[data-sec="${id}"]`);
    el?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };
  const stepLb = (d) =>
    setLb((v) => v && { ...v, i: (v.i + d + v.items.length) % v.items.length });
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
    if (lb && aboutRef.current) return; // viewer over About: About owns scrolling
    lenisRef.current?.[menu || orb || lb ? "stop" : "start"]();
    if (!menu && !orb && !lb && phase.current !== "ready")
      lenisRef.current?.stop();
  }, [menu, orb, lb]);
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
      ev.preventDefault();
      if (lbRef.current) return; // viewer open: page stays put
      aboutScrollRef.current.scrollTop += ev.deltaY;
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
      if (ev.key !== "Escape" || orbRef.current || lbRef.current) return;
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
      el.xp.style.pointerEvents = xc > 0.8 ? "auto" : "none";
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
              <div className="pcons">
                {CONTACTS.map((c, i) => (
                  <a
                    key={c.name}
                    className="pcon"
                    href={c.href}
                    {...(c.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    style={{
                      "--i": i + 3,
                      "--c": c.color,
                      "--ic": `url(/icons/${c.icon}.svg)`,
                    }}
                  >
                    <u aria-hidden="true" />
                    {c.name}
                  </a>
                ))}
              </div>
              <button
                className="padd"
                style={{ "--i": CONTACTS.length + 3 }}
                onClick={downloadVcf}
              >
                <span aria-hidden="true">+</span> ADD TO CONTACTS
              </button>
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
                    {(CARD_META[w.id]?.chips || []).map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
                <span className="wcard-ft" aria-hidden="true">
                  {CARD_META[w.id]?.since && (
                    <em>SINCE {CARD_META[w.id].since}</em>
                  )}
                  <i>OPEN +</i>
                </span>
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
            <button
              data-id="whub"
              className="whub"
              onClick={() => setOrb(true)}
              aria-label="Click here to see works"
            >
              <span className="hrip" aria-hidden="true" />
              <span className="hcore" aria-hidden="true">
                <i className="hr hr1" />
                <i className="hr hr2" />
                <img
                  className="chip"
                  src="/Vector.png"
                  alt=""
                  draggable="false"
                />
              </span>
              <span className="hlbl">
                Click here to see works <b aria-hidden="true">&#8594;</b>
              </span>
            </button>
            {BOARD.map((card, i) => (
              <BoardCard
                key={card.ev}
                card={card}
                offset={i * 1100}
                boxRef={(n) => (boxRefs.current[i] = n)}
                hoverMode={wMode === "hover"}
                onOpen={(k, viaHover) =>
                  setLb({
                    items: GALLERY_ITEMS,
                    i: galleryIndex(card.ev, k),
                    hover: !!viaHover,
                  })
                }
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
              <div className="xp-bar">
                <span>
                  <i /> EXPERIENCE
                </span>
                <span>
                  {pad2(xp.i + 1)} / {pad2(XP.length)}
                </span>
              </div>
              {XP.map((x, i) => (
                <article
                  key={x.org}
                  className={
                    "xps" + (i === xp.i ? " on" : i === xp.p ? " off" : "")
                  }
                  aria-hidden={i !== xp.i}
                >
                  <div className="xp-txt">
                    <p className="xp-kind">
                      {pad2(i + 1)} <b>/</b> {x.kind}
                    </p>
                    <h3>{x.role}</h3>
                    <p className="xp-org">
                      <em>@</em> {x.org}
                    </p>
                    <div className="xp-per">
                      <span>{x.from}</span>
                      <i />
                      <span>{x.to}</span>
                    </div>
                    <p className="xp-did">{x.did}</p>
                    <ul className="xp-tags">
                      {x.tags.map((t, k) => (
                        <li key={t} style={{ "--k": k }}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="xp-pic">
                    <XpPic kind={x.pic} />
                  </div>
                </article>
              ))}
              <div className="xp-tabs" role="tablist">
                {XP.map((x, i) => (
                  <button
                    key={x.org}
                    role="tab"
                    aria-selected={i === xp.i}
                    className={i === xp.i ? "on" : ""}
                    onClick={() =>
                      i !== xp.i &&
                      setXp((st) => ({ i, p: st.i, d: i > st.i ? 1 : -1 }))
                    }
                  >
                    <b>{pad2(i + 1)}</b> {x.short}
                  </button>
                ))}
              </div>
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
            <SiteFooter pid="pxd" />
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
            <div className="ahead">
              <p className="tl">MD. ASHRAFUL ALAM SHUVO</p>
              <div className="city">
                <p>DHAKA, BANGLADESH</p>
                <small>{time}</small>
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
            <div className="awrap">
              <nav className="aidx" aria-label="About sections">
                <p className="aidx-k">ABOUT</p>
                <ol>
                  {ABOUT_SECTIONS.map((sec, n) => (
                    <li key={sec.id}>
                      <button
                        className={aSec === sec.id ? "on" : ""}
                        aria-current={aSec === sec.id ? "true" : undefined}
                        onClick={() => aboutJump(sec.id)}
                      >
                        <i>{pad2(n + 1)}</i>
                        <span>{sec.label}</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="aidx-num" aria-hidden="true">
                  <b key={aSec}>
                    {pad2(ABOUT_SECTIONS.findIndex((x) => x.id === aSec) + 1)}
                  </b>
                  <small>/{pad2(ABOUT_SECTIONS.length)}</small>
                </div>
                <div className="aidx-contact">
                  <p>{CONTACT.phone}</p>
                  <p>{CONTACT.email}</p>
                </div>
              </nav>

              <div className="amain">
                {/* 01 — me */}
                <section
                  data-sec="me"
                  className={"asec a-me" + (seenSecs.has("me") ? " in" : "")}
                >
                  <SecHead n={1} title="Me" file={ABOUT_SECTIONS[0].file} />
                  <h2 className="alead">
                    I build things that live between <em>software</em> and{" "}
                    <u>hardware</u>.
                  </h2>
                  <div className="ame-grid">
                    <figure className="aport">
                      <img
                        src="/portrait.webp"
                        alt="Md. Ashraful Alam Shuvo"
                        draggable="false"
                      />
                      <figcaption>
                        <span>CSE · DIU</span>
                        <span>DHAKA, BD</span>
                      </figcaption>
                    </figure>
                    <div className="abio">
                      {ME.bio.map((t) => (
                        <p key={t}>{t}</p>
                      ))}
                      <ul className="astats">
                        {ME.stats.map(([n, l]) => (
                          <li key={l}>
                            <b>{n}</b>
                            <span>{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <ol className="apath" aria-label="How I learned">
                    {ME.path.map(([y, t], n) => (
                      <li key={t} style={{ "--k": n }}>
                        <i>{y}</i>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="alikes">
                    {ME.likes.map((l) => (
                      <article key={l.h}>
                        <i aria-hidden="true">{l.g}</i>
                        <h3>{l.h}</h3>
                        <p>{l.p}</p>
                      </article>
                    ))}
                  </div>
                </section>

                {/* 02 — toolbox */}
                <section
                  data-sec="toolbox"
                  className={
                    "asec a-tools" + (seenSecs.has("toolbox") ? " in" : "")
                  }
                >
                  <SecHead
                    n={2}
                    title="Toolbox"
                    file={ABOUT_SECTIONS[1].file}
                  />
                  <div className="atools">
                    {TOOLBOX.map((g, n) => (
                      <div className="atool" key={g.k} style={{ "--k": n }}>
                        <p className="atool-k">
                          <i>{pad2(n + 1)}</i> {g.k}
                        </p>
                        <ul>
                          {g.items.map(([name, slug, v, inv]) => (
                            <li key={name} className={slug ? "" : "txt"}>
                              {slug && (
                                <img
                                  src={DEVICON(slug, v)}
                                  alt=""
                                  className={inv ? "inv" : ""}
                                  loading="lazy"
                                />
                              )}
                              <span>{name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 03 — education */}
                <section
                  data-sec="edu"
                  className={"asec a-edu" + (seenSecs.has("edu") ? " in" : "")}
                >
                  <SecHead
                    n={3}
                    title="Education"
                    file={ABOUT_SECTIONS[2].file}
                  />
                  <ol className="aedu">
                    {EDU.map((it, n) => (
                      <li
                        key={it.name}
                        className={it.now ? "now" : ""}
                        style={{ "--k": n }}
                      >
                        <span className="aedu-y">{it.year}</span>
                        <span className="aedu-dot" aria-hidden="true" />
                        <div className="aedu-card">
                          <img src={it.logo} alt="" draggable="false" />
                          <div>
                            <small>
                              {it.level}
                              {it.now && <em>NOW</em>}
                            </small>
                            <b>{it.name}</b>
                            <p>{it.rows.join("  ·  ")}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* 04 — certificates: images only */}
                <section
                  data-sec="cert"
                  className={
                    "asec a-cert" + (seenSecs.has("cert") ? " in" : "")
                  }
                >
                  <SecHead
                    n={4}
                    title="Certificates"
                    file={ABOUT_SECTIONS[3].file}
                  />
                  <div className="apins">
                    {CERTS.slice(0, certsOpen ? CERTS.length : CERTS_SHOWN).map(
                      (c, n) => (
                        <button
                          key={c.id}
                          className="apin"
                          style={{
                            "--r": TILT[n % TILT.length] + "deg",
                            "--k": n < CERTS_SHOWN ? n : n - CERTS_SHOWN,
                          }}
                          onClick={() => setLb({ items: CERT_ITEMS, i: n })}
                          aria-label={`View certificate: ${c.title}`}
                        >
                          <img
                            src={`${CERT_DIR}${c.id}-thumb.webp`}
                            alt=""
                            loading="lazy"
                            draggable="false"
                          />
                        </button>
                      ),
                    )}
                  </div>
                  <button
                    className={"amore" + (certsOpen ? " open" : "")}
                    aria-expanded={certsOpen}
                    onClick={() => {
                      // collapsing: shrink first, then bring the section back into view
                      if (certsOpen)
                        requestAnimationFrame(() => aboutJump("cert"));
                      setCertsOpen((o) => !o);
                    }}
                  >
                    <span className="amore-ic" aria-hidden="true">
                      <i />
                      <i />
                    </span>
                    <b>
                      {certsOpen ? "Show less" : `Show all ${CERTS.length}`}
                    </b>
                    <small>
                      {pad2(certsOpen ? CERTS.length : CERTS_SHOWN)} /{" "}
                      {pad2(CERTS.length)}
                    </small>
                  </button>
                </section>

                {/* 05 — gallery */}
                <section
                  data-sec="gallery"
                  className={
                    "asec a-gal" + (seenSecs.has("gallery") ? " in" : "")
                  }
                >
                  <SecHead
                    n={5}
                    title="Gallery"
                    file={ABOUT_SECTIONS[4].file}
                  />
                  <div className="agevs">
                    {EVENTS.map((ev, e) => (
                      <article
                        className={"agev n" + Math.min(ev.n, 4)}
                        key={ev.id}
                        style={{ "--k": e }}
                      >
                        <header className="agev-h">
                          <span className="agev-n">{pad2(e + 1)}</span>
                          <time>{ev.date}</time>
                          <h3>{ev.title}</h3>
                          <p className="agev-pl">{ev.place}</p>
                          {ev.badge && <p className="agev-badge">{ev.badge}</p>}
                          <p className="agev-tx">
                            {ev.text[ev.text.length > 1 ? 2 : 0]}
                          </p>
                        </header>
                        <div className="agal">
                          {Array.from({ length: ev.n }, (_, k) => (
                            <button
                              key={k}
                              className="agal-it"
                              style={{ "--k": k }}
                              onClick={() =>
                                setLb({
                                  items: GALLERY_ITEMS,
                                  i: galleryIndex(ev.id, k),
                                })
                              }
                              aria-label={`Open photo ${k + 1} of ${ev.title}`}
                            >
                              <img
                                src={`/gallery/${ev.id}/${k + 1}-thumb.webp`}
                                alt=""
                                loading="lazy"
                                draggable="false"
                              />
                              <span className="agal-zoom" aria-hidden="true">
                                <i />
                                <i />
                              </span>
                            </button>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* 06 — works */}
                <section
                  data-sec="works"
                  className={
                    "asec a-works" + (seenSecs.has("works") ? " in" : "")
                  }
                >
                  <SecHead n={6} title="Works" file={ABOUT_SECTIONS[5].file} />
                  <button className="acta" onClick={() => setOrb(true)}>
                    <span>Enough paper. See what I’ve built.</span>
                    <b>
                      Open Projects <i aria-hidden="true">&#8594;</i>
                    </b>
                  </button>
                </section>
              </div>
              <footer className="bfoot afoot">
                <SiteFooter pid="pxd-about" />
              </footer>
            </div>
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
        {lb &&
          (() => {
            const it = lb.items[lb.i],
              many = lb.items.length > 1,
              stop = (ev) => ev.stopPropagation();
            return (
              <div
                className={"acv" + (it.text ? " cap" : "")}
                role="dialog"
                aria-modal="true"
                aria-label={it.title || it.alt}
                onClick={() => setLb(null)}
              >
                <img
                  key={it.src}
                  src={it.src}
                  alt={it.alt}
                  draggable="false"
                  onClick={stop}
                  onMouseEnter={lbEnter}
                  onMouseLeave={lbLeave}
                />
                {it.text && (
                  <aside
                    className="acv-txt"
                    key={"t" + it.src}
                    onClick={stop}
                    onMouseEnter={lbEnter}
                    onMouseLeave={lbLeave}
                  >
                    {it.badge && <p className="acv-badge">{it.badge}</p>}
                    <h3>{it.title}</h3>
                    {it.meta && <p className="acv-meta">{it.meta}</p>}
                    {it.text.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </aside>
                )}
                {many && (
                  <>
                    <button
                      className="acv-b acv-p"
                      aria-label="Previous"
                      onClick={(ev) => {
                        stop(ev);
                        stepLb(-1);
                      }}
                    >
                      &#8592;
                    </button>
                    <button
                      className="acv-b acv-n"
                      aria-label="Next"
                      onClick={(ev) => {
                        stop(ev);
                        stepLb(1);
                      }}
                    >
                      &#8594;
                    </button>
                    <p className="acv-c">
                      {pad2(lb.i + 1)} / {pad2(lb.items.length)}
                    </p>
                  </>
                )}
                <button
                  className="x acv-x"
                  aria-label="Close viewer"
                  onClick={() => setLb(null)}
                >
                  <i />
                  <i />
                </button>
              </div>
            );
          })()}
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
