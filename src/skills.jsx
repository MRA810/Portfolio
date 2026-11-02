// Skills shown as cards on the works board. Each skill has: card logo(s) (positions
// are % of the card, fitted to the Figma frame), the text shown in the info window,
// and two illustrations drawn in code (SVG) that appear next to the text.

const C = {
  box: "#2a0b66",
  line: "#b98cff",
  ink: "#f4ecff",
  dim: "#9d7bd8",
  hot: "#ff3a00",
  hi: "#fff0a4",
  deep: "#14032e",
};
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const K = "#ff8a5b",
  F = "#d9b8ff",
  S = "#fff0a4",
  N = C.ink,
  D = C.dim;

/* ---------- drawing helpers ---------- */
const Pic = ({ children }) => (
  <svg
    viewBox="0 0 480 270"
    preserveAspectRatio="xMidYMid meet"
    style={{ width: "100%", height: "100%" }}
    fontFamily="Oxanium, sans-serif"
  >
    {children}
  </svg>
);
const Lbl = ({ x = 20, y = 24, dim, children }) => (
  <text x={x} y={y} fontSize="10.5" letterSpacing="2" fill={dim ? C.dim : C.hi}>
    {children}
  </text>
);
const Box = ({ x, y, w = 96, h, t, sub, hot, fs = 12.5 }) => {
  const hh = h || (sub ? 40 : 34);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={hh}
        rx="7"
        fill={hot ? "#4a0c8a" : C.box}
        stroke={hot ? C.hot : C.line}
        strokeWidth="1.5"
      />
      <text
        x={x + w / 2}
        y={y + hh / 2 + (sub ? -1 : 4.5)}
        textAnchor="middle"
        fontSize={fs}
        fill={C.ink}
      >
        {t}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + hh / 2 + 12}
          textAnchor="middle"
          fontSize="9.5"
          fill={C.dim}
        >
          {sub}
        </text>
      )}
    </g>
  );
};
const pts = (p) => p.map((q) => q.join(",")).join(" ");
const Ln = ({ p, hot, dash }) => (
  <polyline
    points={pts(p)}
    fill="none"
    stroke={hot ? C.hot : C.line}
    strokeWidth="1.5"
    strokeLinejoin="round"
    strokeDasharray={dash ? "4 4" : undefined}
  />
);
const Arr = ({ p, hot, dash }) => {
  const a = p[p.length - 2],
    b = p[p.length - 1],
    ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const h = (s) => [b[0] - 8 * Math.cos(ang + s), b[1] - 8 * Math.sin(ang + s)];
  return (
    <g>
      <Ln p={p} hot={hot} dash={dash} />
      <polygon
        points={`${b.join(",")} ${h(0.45).join(",")} ${h(-0.45).join(",")}`}
        fill={hot ? C.hot : C.line}
      />
    </g>
  );
};
const Code = ({ title, rows }) => (
  <Pic>
    <rect
      x="8"
      y="8"
      width="464"
      height="254"
      rx="10"
      fill={C.deep}
      stroke={C.line}
      strokeWidth="1.2"
    />
    <path
      d="M8 34V18a10 10 0 0 1 10-10H462a10 10 0 0 1 10 10V34Z"
      fill={C.box}
    />
    <circle cx="24" cy="21" r="4" fill={C.hot} />
    <circle cx="38" cy="21" r="4" fill={C.hi} />
    <circle cx="52" cy="21" r="4" fill={C.line} />
    <text x="240" y="25" textAnchor="middle" fontSize="11" fill={C.dim}>
      {title}
    </text>
    {rows.map((r, i) => (
      <text
        key={i}
        x="22"
        y={64 + i * 20}
        fontSize="12.5"
        fontFamily={MONO}
        style={{ whiteSpace: "pre" }}
      >
        {r.map(([s, c], j) => (
          <tspan key={j} fill={c || N}>
            {s}
          </tspan>
        ))}
      </text>
    ))}
  </Pic>
);
const Window = ({ x, y, w, h, title, children }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx="9"
      fill={C.deep}
      stroke={C.line}
      strokeWidth="1.3"
    />
    <path
      d={`M${x} ${y + 24}V${y + 9}a9 9 0 0 1 9-9H${x + w - 9}a9 9 0 0 1 9 9V${y + 24}Z`}
      transform={`translate(0 ${y ? 0 : 0})`}
      fill={C.box}
    />
    <circle cx={x + 14} cy={y + 12} r="3.5" fill={C.hot} />
    <circle cx={x + 27} cy={y + 12} r="3.5" fill={C.hi} />
    <circle cx={x + 40} cy={y + 12} r="3.5" fill={C.line} />
    {title && (
      <text
        x={x + w / 2}
        y={y + 16}
        textAnchor="middle"
        fontSize="10"
        fill={C.dim}
      >
        {title}
      </text>
    )}
    {children}
  </g>
);

/* ---------- React ---------- */
const ReactTree = () => (
  <Pic>
    <Lbl>COMPONENT TREE</Lbl>
    <Ln
      p={[
        [240, 64],
        [240, 84],
        [100, 84],
        [100, 106],
      ]}
    />
    <Ln
      p={[
        [240, 84],
        [240, 106],
      ]}
    />
    <Ln
      p={[
        [240, 84],
        [380, 84],
        [380, 106],
      ]}
    />
    <Ln
      p={[
        [100, 140],
        [100, 186],
      ]}
    />
    <Ln
      p={[
        [380, 140],
        [380, 162],
        [330, 162],
        [330, 186],
      ]}
    />
    <Ln
      p={[
        [380, 162],
        [430, 162],
        [430, 186],
      ]}
    />
    <Box x={190} y={30} t="<App />" hot />
    <Box x={50} y={106} t="<Header />" />
    <Box x={190} y={106} t="<Sidebar />" />
    <Box x={330} y={106} t="<Feed />" />
    <Box x={50} y={186} t="<Nav />" />
    <Box x={290} y={186} w={80} t="<Card />" />
    <Box x={390} y={186} w={80} t="<Card />" />
    <Lbl y={252} dim>
      PROPS FLOW DOWN · STATE LIVES WHERE IT IS NEEDED
    </Lbl>
  </Pic>
);
const ReactCode = () => (
  <Code
    title="Counter.jsx"
    rows={[
      [["function ", K], ["Counter", F], ["() {"]],
      [["  const ", K], ["[n, setN] = "], ["useState", F], ["(0);"]],
      [["  return", K], [" ("]],
      [["    <button "], ["onClick", F], ["={() => setN(n + 1)}>"]],
      [["      Clicked {n} times", S]],
      [["    </button>"]],
      [["  );", K]],
      [["}"]],
    ]}
  />
);

/* ---------- Django ---------- */
const DjangoMVT = () => (
  <Pic>
    <Lbl>REQUEST → RESPONSE</Lbl>
    <Box x={14} y={46} w={88} t="Browser" sub="HTTP" />
    <Box x={124} y={46} w={88} t="urls.py" sub="routes" />
    <Box x={234} y={46} w={88} t="views.py" sub="logic" hot />
    <Box x={344} y={46} w={96} t="models.py" sub="ORM" />
    <Arr
      p={[
        [102, 66],
        [124, 66],
      ]}
    />
    <Arr
      p={[
        [212, 66],
        [234, 66],
      ]}
    />
    <Arr
      p={[
        [322, 66],
        [344, 66],
      ]}
    />
    <Box x={234} y={166} w={88} t="Template" sub=".html" />
    <Box x={344} y={166} w={96} t="MySQL" sub="database" hot />
    <Arr
      p={[
        [278, 86],
        [278, 166],
      ]}
    />
    <Arr
      p={[
        [392, 86],
        [392, 166],
      ]}
    />
    <Arr
      p={[
        [234, 190],
        [58, 190],
        [58, 86],
      ]}
      hot
    />
    <text x="146" y="182" textAnchor="middle" fontSize="10" fill={C.dim}>
      HTML response
    </text>
    <Lbl y={252} dim>
      MODEL · VIEW · TEMPLATE
    </Lbl>
  </Pic>
);
const BARS = [3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2];
const BookinFly = () => {
  let bx = 350;
  return (
    <Pic>
      <rect
        x="24"
        y="30"
        width="432"
        height="190"
        rx="14"
        fill={C.box}
        stroke={C.line}
        strokeWidth="1.5"
      />
      <line
        x1="330"
        y1="30"
        x2="330"
        y2="220"
        stroke={C.line}
        strokeDasharray="5 5"
      />
      <text x="44" y="58" fontSize="10.5" letterSpacing="2" fill={C.hi}>
        BOOKINFLY · BOARDING PASS
      </text>
      <text x="44" y="116" fontSize="42" fontWeight="700" fill={C.ink}>
        DAC
      </text>
      <text x="224" y="116" fontSize="42" fontWeight="700" fill={C.ink}>
        CXB
      </text>
      <line
        x1="132"
        y1="102"
        x2="212"
        y2="102"
        stroke={C.dim}
        strokeDasharray="3 4"
      />
      <polygon points="172,95 186,102 172,109 175,102" fill={C.hot} />
      <text x="44" y="136" fontSize="11" fill={C.dim}>
        09:40 · Dhaka
      </text>
      <text x="224" y="136" fontSize="11" fill={C.dim}>
        10:50 · Cox’s Bazar
      </text>
      <text x="44" y="166" fontSize="11.5" fill={C.ink}>
        Economy · 1 Adult · Seat 14A
      </text>
      <rect x="44" y="180" width="112" height="26" rx="5" fill={C.hot} />
      <text
        x="100"
        y="197"
        textAnchor="middle"
        fontSize="12.5"
        fontWeight="700"
        fill="#fff"
      >
        Book now
      </text>
      {BARS.map((b, i) => {
        const r = (
          <rect key={i} x={bx} y="66" width={b} height="86" fill={C.ink} />
        );
        bx += b + 2.4;
        return r;
      })}
      <text
        x="392"
        y="176"
        textAnchor="middle"
        fontSize="10.5"
        letterSpacing="1.5"
        fill={C.dim}
      >
        PNR 7Q2K9M
      </text>
      <text x="392" y="196" textAnchor="middle" fontSize="10.5" fill={C.hi}>
        CONFIRMED
      </text>
      <Lbl y="250" dim>
        DJANGO + MYSQL
      </Lbl>
    </Pic>
  );
};

/* ---------- Flutter ---------- */
const FlutterWidgets = () => (
  <Pic>
    <rect
      x="46"
      y="16"
      width="124"
      height="238"
      rx="18"
      fill={C.deep}
      stroke={C.line}
      strokeWidth="1.6"
    />
    <rect x="56" y="28" width="104" height="22" rx="4" fill={C.hot} />
    <rect
      x="56"
      y="58"
      width="104"
      height="52"
      rx="6"
      fill={C.box}
      stroke={C.line}
    />
    <rect
      x="56"
      y="118"
      width="104"
      height="52"
      rx="6"
      fill={C.box}
      stroke={C.line}
    />
    <rect
      x="56"
      y="178"
      width="104"
      height="30"
      rx="6"
      fill={C.box}
      stroke={C.line}
    />
    <circle cx="82" cy="232" r="6" fill={C.hi} />
    <circle cx="108" cy="232" r="6" fill={C.dim} />
    <circle cx="134" cy="232" r="6" fill={C.dim} />
    <Ln
      p={[
        [320, 62],
        [320, 82],
        [228, 82],
        [228, 100],
      ]}
    />
    <Ln
      p={[
        [320, 82],
        [320, 100],
      ]}
    />
    <Ln
      p={[
        [320, 82],
        [424, 82],
        [424, 100],
      ]}
    />
    <Ln
      p={[
        [324, 134],
        [324, 154],
        [292, 154],
        [292, 176],
      ]}
    />
    <Ln
      p={[
        [324, 154],
        [360, 154],
        [360, 176],
      ]}
    />
    <Box x={262} y={28} w={116} t="Scaffold" hot />
    <Box x={190} y={100} w={76} t="AppBar" />
    <Box x={282} y={100} w={84} t="ListView" />
    <Box x={382} y={100} w={84} t="BottomNav" fs={11.5} />
    <Box x={262} y={176} w={60} t="Card" />
    <Box x={330} y={176} w={60} t="Card" />
    <Lbl x={190} y={252} dim>
      EVERYTHING IS A WIDGET
    </Lbl>
  </Pic>
);
const FlutterCode = () => (
  <Code
    title="home.dart"
    rows={[
      [["class ", K], ["Home ", F], ["extends ", K], ["StatelessWidget {"]],
      [["  @override", D]],
      [["  Widget ", F], ["build", F], ["(BuildContext c) {"]],
      [["    return ", K], ["Scaffold", F], ["("]],
      [
        ["      appBar: "],
        ["AppBar", F],
        ["(title: "],
        ["Text", F],
        ["("],
        ["'Hello'", S],
        [")),"],
      ],
      [["      body: "], ["ListView", F], ["(children: cards),"]],
      [["    );", K]],
      [["  }"]],
      [["}"]],
    ]}
  />
);

/* ---------- Electron ---------- */
const ElectronProcess = () => (
  <Pic>
    <Window x={20} y={30} w={236} h={190} title="My Desktop App">
      <rect x="32" y="66" width="56" height="140" rx="4" fill={C.box} />
      <rect x="98" y="66" width="146" height="22" rx="4" fill={C.box} />
      <rect
        x="98"
        y="98"
        width="146"
        height="9"
        rx="3"
        fill={C.dim}
        opacity=".6"
      />
      <rect
        x="98"
        y="114"
        width="120"
        height="9"
        rx="3"
        fill={C.dim}
        opacity=".6"
      />
      <rect
        x="98"
        y="130"
        width="136"
        height="9"
        rx="3"
        fill={C.dim}
        opacity=".6"
      />
      <rect x="98" y="168" width="64" height="24" rx="5" fill={C.hot} />
    </Window>
    <text x="138" y="244" textAnchor="middle" fontSize="10" fill={C.dim}>
      RENDERER · HTML / CSS / JS
    </text>
    <Box x={330} y={34} w={136} t="Main process" sub="Node.js" hot />
    <Box x={330} y={176} w={136} t="Native OS" sub="fs · tray · dialogs" />
    <Arr
      p={[
        [256, 100],
        [294, 100],
        [294, 54],
        [330, 54],
      ]}
    />
    <Arr
      p={[
        [330, 66],
        [306, 66],
        [306, 112],
        [256, 112],
      ]}
      dash
    />
    <text
      x="300"
      y="90"
      fontSize="10"
      fill={C.hi}
      textAnchor="middle"
      transform="rotate(-90 300 90)"
    >
      IPC
    </text>
    <Arr
      p={[
        [398, 74],
        [398, 176],
      ]}
    />
  </Pic>
);
const ElectronCode = () => (
  <Code
    title="main.js"
    rows={[
      [
        ["const ", K],
        ["{ app, BrowserWindow } = "],
        ["require", F],
        ["("],
        ["'electron'", S],
        [");"],
      ],
      [[""]],
      [["app."], ["whenReady", F], ["()."], ["then", F], ["(() => {"]],
      [
        ["  const ", K],
        ["win = "],
        ["new ", K],
        ["BrowserWindow", F],
        ["({ width: 900 });"],
      ],
      [["  win."], ["loadFile", F], ["("], ["'index.html'", S], [");"]],
      [["});"]],
    ]}
  />
);

/* ---------- Express ---------- */
const ExpressFlow = () => (
  <Pic>
    <Lbl>REQUEST LIFECYCLE</Lbl>
    <Box x={20} y={50} w={110} t="Client" sub="HTTP request" />
    <Box x={185} y={50} w={110} t="Middleware" sub="app.use()" hot />
    <Box x={350} y={50} w={110} t="Router" sub="GET /api/items" />
    <Box x={350} y={170} w={110} t="Controller" sub="business logic" />
    <Box x={185} y={170} w={110} t="Response" sub="res.json()" hot />
    <Box x={20} y={170} w={110} t="Client" sub="200 OK" />
    <Arr
      p={[
        [130, 70],
        [185, 70],
      ]}
    />
    <Arr
      p={[
        [295, 70],
        [350, 70],
      ]}
    />
    <Arr
      p={[
        [405, 90],
        [405, 170],
      ]}
    />
    <Arr
      p={[
        [350, 190],
        [295, 190],
      ]}
    />
    <Arr
      p={[
        [185, 190],
        [130, 190],
      ]}
    />
    <Lbl y={252} dim>
      NODE.JS · EXPRESS.JS
    </Lbl>
  </Pic>
);
const ExpressCode = () => (
  <Code
    title="server.js"
    rows={[
      [
        ["const ", K],
        ["express = "],
        ["require", F],
        ["("],
        ["'express'", S],
        [");"],
      ],
      [["const ", K], ["app = "], ["express", F], ["();"]],
      [["app."], ["use", F], ["(express."], ["json", F], ["());"]],
      [[""]],
      [["app."], ["get", F], ["("], ["'/api/items'", S], [", (req, res) => {"]],
      [["  res."], ["json", F], ["({ ok: "], ["true", K], [" });"]],
      [["});"]],
      [["app."], ["listen", F], ["("], ["3000", S], [");"]],
    ]}
  />
);

/* ---------- JavaScript ---------- */
const EventLoop = () => (
  <Pic>
    <rect
      x="22"
      y="36"
      width="130"
      height="200"
      rx="8"
      fill={C.deep}
      stroke={C.line}
      strokeWidth="1.5"
    />
    <text
      x="87"
      y="56"
      textAnchor="middle"
      fontSize="10.5"
      letterSpacing="2"
      fill={C.hi}
    >
      CALL STACK
    </text>
    <rect
      x="34"
      y="190"
      width="106"
      height="30"
      rx="5"
      fill={C.box}
      stroke={C.line}
    />
    <text x="87" y="209" textAnchor="middle" fontSize="12" fill={C.ink}>
      main()
    </text>
    <rect
      x="34"
      y="154"
      width="106"
      height="30"
      rx="5"
      fill={C.box}
      stroke={C.line}
    />
    <text x="87" y="173" textAnchor="middle" fontSize="12" fill={C.ink}>
      load()
    </text>
    <rect
      x="34"
      y="118"
      width="106"
      height="30"
      rx="5"
      fill="#4a0c8a"
      stroke={C.hot}
    />
    <text x="87" y="137" textAnchor="middle" fontSize="12" fill={C.ink}>
      fetch()
    </text>
    <rect
      x="190"
      y="36"
      width="130"
      height="92"
      rx="8"
      fill={C.deep}
      stroke={C.line}
      strokeWidth="1.5"
    />
    <text
      x="255"
      y="56"
      textAnchor="middle"
      fontSize="10.5"
      letterSpacing="2"
      fill={C.hi}
    >
      WEB APIs
    </text>
    <text x="255" y="86" textAnchor="middle" fontSize="11.5" fill={C.ink}>
      fetch · timers
    </text>
    <text x="255" y="106" textAnchor="middle" fontSize="11.5" fill={C.dim}>
      DOM events
    </text>
    <rect
      x="190"
      y="160"
      width="270"
      height="76"
      rx="8"
      fill={C.deep}
      stroke={C.line}
      strokeWidth="1.5"
    />
    <text
      x="325"
      y="180"
      textAnchor="middle"
      fontSize="10.5"
      letterSpacing="2"
      fill={C.hi}
    >
      TASK QUEUE
    </text>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect
          x={206 + i * 80}
          y="194"
          width="68"
          height="28"
          rx="5"
          fill={i === 0 ? "#4a0c8a" : C.box}
          stroke={i === 0 ? C.hot : C.line}
        />
        <text
          x={240 + i * 80}
          y="212"
          textAnchor="middle"
          fontSize="11.5"
          fill={C.ink}
        >
          cb{i + 1}
        </text>
      </g>
    ))}
    <Arr
      p={[
        [152, 92],
        [190, 92],
      ]}
    />
    <Arr
      p={[
        [255, 128],
        [255, 160],
      ]}
    />
    <Arr
      p={[
        [190, 220],
        [162, 220],
        [162, 216],
        [152, 216],
      ]}
      hot
    />
    <circle
      cx="392"
      cy="82"
      r="28"
      fill="none"
      stroke={C.hot}
      strokeWidth="2"
      strokeDasharray="130 46"
    />
    <polygon
      points="414,56 424,72 406,70"
      fill={C.hot}
      transform="rotate(8 414 62)"
    />
    <text x="392" y="86" textAnchor="middle" fontSize="11" fill={C.ink}>
      loop
    </text>
  </Pic>
);
const JsCode = () => (
  <Code
    title="app.js"
    rows={[
      [["async function ", K], ["load", F], ["() {"]],
      [
        ["  const ", K],
        ["res = "],
        ["await ", K],
        ["fetch", F],
        ["("],
        ["'/api/items'", S],
        [");"],
      ],
      [
        ["  const ", K],
        ["data = "],
        ["await ", K],
        ["res."],
        ["json", F],
        ["();"],
      ],
      [["  "], ["render", F], ["(data);"]],
      [["}"]],
      [[""]],
      [["load", F], ["()."], ["catch", F], ["(console.error);"]],
    ]}
  />
);

/* ---------- IoT ---------- */
const IotArch = () => (
  <Pic>
    <Lbl>SENSORS → CLOUD → DASHBOARD</Lbl>
    <Box x={14} y={44} w={84} t="Temp" sub="DHT22" />
    <Box x={14} y={106} w={84} t="Gas" sub="MICS-5524" />
    <Box x={14} y={168} w={84} t="Motion" sub="PIR" />
    <Arr
      p={[
        [98, 64],
        [120, 64],
        [120, 108],
        [140, 108],
      ]}
    />
    <Arr
      p={[
        [98, 126],
        [140, 126],
      ]}
    />
    <Arr
      p={[
        [98, 188],
        [120, 188],
        [120, 144],
        [140, 144],
      ]}
    />
    <Box x={140} y={96} w={84} h={58} t="ESP32" sub="MCU" hot />
    {[10, 17, 24].map((r, i) => (
      <path
        key={i}
        d={`M${240 + i * 4} ${125 - r}A${r} ${r} 0 0 1 ${240 + i * 4} ${125 + r}`}
        fill="none"
        stroke={C.hot}
        strokeWidth="1.6"
      />
    ))}
    <text x="252" y="164" textAnchor="middle" fontSize="10" fill={C.dim}>
      Wi-Fi
    </text>
    <Box x={274} y={96} w={82} h={58} t="MQTT" sub="broker" />
    <Box x={388} y={96} w={80} h={58} t="Dashboard" sub="live" hot />
    <Arr
      p={[
        [356, 125],
        [388, 125],
      ]}
    />
    <text x="315" y="184" textAnchor="middle" fontSize="10" fill={C.dim}>
      sensors/temp · sensors/gas
    </text>
    <Lbl y={252} dim>
      REAL-TIME MONITORING · AUTOMATION
    </Lbl>
  </Pic>
);
const IotDash = () => (
  <Pic>
    <Window x={8} y={8} w={464} h={254} title="IoT Dashboard">
      <circle
        cx="78"
        cy="110"
        r="36"
        fill="none"
        stroke={C.box}
        strokeWidth="9"
      />
      <circle
        cx="78"
        cy="110"
        r="36"
        fill="none"
        stroke={C.hot}
        strokeWidth="9"
        strokeDasharray="150 226"
        transform="rotate(-90 78 110)"
        strokeLinecap="round"
      />
      <text
        x="78"
        y="115"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill={C.ink}
      >
        28°C
      </text>
      <text x="78" y="164" textAnchor="middle" fontSize="10" fill={C.dim}>
        TEMPERATURE
      </text>
      <circle
        cx="178"
        cy="110"
        r="36"
        fill="none"
        stroke={C.box}
        strokeWidth="9"
      />
      <circle
        cx="178"
        cy="110"
        r="36"
        fill="none"
        stroke={C.hi}
        strokeWidth="9"
        strokeDasharray="70 226"
        transform="rotate(-90 178 110)"
        strokeLinecap="round"
      />
      <text
        x="178"
        y="115"
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill={C.ink}
      >
        12 ppm
      </text>
      <text x="178" y="164" textAnchor="middle" fontSize="10" fill={C.dim}>
        GAS LEVEL
      </text>
      <line x1="246" y1="150" x2="454" y2="150" stroke={C.box} />
      <line x1="246" y1="76" x2="246" y2="150" stroke={C.box} />
      <polyline
        points="250,134 280,112 312,120 344,92 376,102 408,76 450,84"
        fill="none"
        stroke={C.hot}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <polygon
        points="250,134 280,112 312,120 344,92 376,102 408,76 450,84 450,150 250,150"
        fill={C.hot}
        opacity=".14"
      />
      <text x="250" y="68" fontSize="10" fill={C.dim}>
        LAST 24 H
      </text>
      {[
        ["Ventilation fan", true],
        ["Alarm buzzer", false],
      ].map(([t, on], i) => (
        <g key={t}>
          <rect
            x={36 + i * 214}
            y="196"
            width="40"
            height="20"
            rx="10"
            fill={on ? C.hot : C.box}
            stroke={on ? C.hot : C.line}
          />
          <circle cx={on ? 66 : 46 + i * 214} cy="206" r="7" fill="#fff" />
          <text x={86 + i * 214} y="210" fontSize="12" fill={C.ink}>
            {t}
          </text>
        </g>
      ))}
    </Window>
  </Pic>
);

/* ---------- ESP32 ---------- */
const EspBoard = () => {
  const rows = Array.from({ length: 11 }, (_, i) => 80 + i * 14);
  return (
    <Pic>
      <Lbl>ESP32 DEVKIT + SENSORS</Lbl>
      <rect
        x="170"
        y="30"
        width="140"
        height="214"
        rx="10"
        fill={C.deep}
        stroke={C.line}
        strokeWidth="1.6"
      />
      <polyline
        points="190,64 202,44 214,64 226,44 238,64 250,44 262,64 274,44 286,64"
        fill="none"
        stroke={C.hi}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect
        x="204"
        y="104"
        width="72"
        height="72"
        rx="5"
        fill="#4a0c8a"
        stroke={C.hot}
        strokeWidth="1.6"
      />
      <text
        x="240"
        y="146"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={C.ink}
      >
        ESP32
      </text>
      {rows.map((y) => (
        <g key={y}>
          <circle cx="180" cy={y + 4} r="3" fill={C.hi} />
          <circle cx="300" cy={y + 4} r="3" fill={C.hi} />
        </g>
      ))}
      <Box x={14} y={46} w={106} t="DHT22" sub="temp · humidity" />
      <Box x={14} y={158} w={106} t="MICS-5524" sub="gas sensor" />
      <Box x={360} y={46} w={106} t="Relay" sub="fan control" hot />
      <Box x={360} y={158} w={106} t="LED + Buzzer" sub="alerts" />
      <Ln
        p={[
          [120, 66],
          [148, 66],
          [148, 98],
          [180, 98],
        ]}
      />
      <Ln
        p={[
          [120, 178],
          [148, 178],
          [148, 154],
          [180, 154],
        ]}
      />
      <Ln
        p={[
          [360, 66],
          [332, 66],
          [332, 98],
          [300, 98],
        ]}
        hot
      />
      <Ln
        p={[
          [360, 178],
          [332, 178],
          [332, 154],
          [300, 154],
        ]}
      />
      <Lbl y={262} dim>
        WI-FI · MQTT · PLATFORMIO
      </Lbl>
    </Pic>
  );
};
const SpaemsFlow = () => (
  <Pic>
    <Lbl>S-SPAEMS SYSTEM</Lbl>
    <Box x={14} y={42} w={96} t="Solar panel" />
    <Box x={126} y={42} w={96} t="Battery" sub="charger" />
    <Box x={238} y={42} w={96} t="ESP32" sub="controller" hot />
    <Box x={350} y={42} w={116} t="Sensors" sub="DHT22 · MICS-5524" />
    <Arr
      p={[
        [110, 62],
        [126, 62],
      ]}
    />
    <Arr
      p={[
        [222, 62],
        [238, 62],
      ]}
    />
    <Arr
      p={[
        [350, 62],
        [334, 62],
      ]}
    />
    <Box x={126} y={158} w={96} t="Relay" sub="fan · ventilation" />
    <Box x={238} y={158} w={96} t="MQTT" sub="Wi-Fi" />
    <Box x={350} y={158} w={116} t="Flask + Socket.IO" fs={11.5} />
    <Arr
      p={[
        [256, 82],
        [256, 120],
        [174, 120],
        [174, 158],
      ]}
      hot
    />
    <Arr
      p={[
        [310, 82],
        [310, 158],
      ]}
    />
    <Arr
      p={[
        [334, 178],
        [350, 178],
      ]}
    />
    <Box x={350} y={214} w={116} t="Live dashboard" hot />
    <Arr
      p={[
        [408, 198],
        [408, 214],
      ]}
    />
    <Lbl y={262} dim>
      MONITORS AMMONIA, TEMPERATURE &amp; HUMIDITY
    </Lbl>
  </Pic>
);

/* ---------- AI ---------- */
const NeuralNet = () => {
  const xs = [60, 170, 290, 410],
    ns = [4, 6, 6, 3];
  const ys = (n) =>
    Array.from(
      { length: n },
      (_, i) => 130 + (i - (n - 1) / 2) * (n > 4 ? 32 : 44),
    );
  const L = ns.map((n, i) => ys(n).map((y) => [xs[i], y]));
  const hot = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 1],
  ];
  return (
    <Pic>
      <Lbl>NEURAL NETWORK</Lbl>
      {L.slice(0, -1).map((layer, a) =>
        layer.map((p, i) =>
          L[a + 1].map((q, j) => (
            <line
              key={`${a}${i}${j}`}
              x1={p[0]}
              y1={p[1]}
              x2={q[0]}
              y2={q[1]}
              stroke={C.line}
              strokeOpacity=".28"
            />
          )),
        ),
      )}
      <polyline
        points={hot.map(([a, i]) => L[a][i].join(",")).join(" ")}
        fill="none"
        stroke={C.hot}
        strokeWidth="2"
      />
      {L.map((layer, a) =>
        layer.map(([x, y], i) => (
          <circle
            key={`${a}-${i}`}
            cx={x}
            cy={y}
            r="8.5"
            fill={hot.some(([h, k]) => h === a && k === i) ? C.hot : C.box}
            stroke={C.line}
            strokeWidth="1.4"
          />
        )),
      )}
      {["INPUT", "HIDDEN", "HIDDEN", "OUTPUT"].map((t, i) => (
        <text
          key={i}
          x={xs[i]}
          y="250"
          textAnchor="middle"
          fontSize="10"
          letterSpacing="1.5"
          fill={C.dim}
        >
          {t}
        </text>
      ))}
    </Pic>
  );
};
const VisionPipe = () => (
  <Pic>
    <Lbl>COMPUTER VISION PIPELINE</Lbl>
    {Array.from({ length: 64 }, (_, k) => {
      const i = k % 8,
        j = Math.floor(k / 8);
      return (
        <rect
          key={k}
          x={22 + i * 14}
          y={70 + j * 14}
          width="13"
          height="13"
          fill={`hsl(${268 + ((i * 7 + j * 13) % 40)}, 70%, ${26 + ((i * 5 + j * 11) % 36)}%)`}
        />
      );
    })}
    <text x="78" y="196" textAnchor="middle" fontSize="10" fill={C.dim}>
      INPUT IMAGE
    </text>
    <Arr
      p={[
        [140, 126],
        [162, 126],
      ]}
    />
    {[0, 1, 2].map((i) => (
      <rect
        key={i}
        x={170 + i * 8}
        y={96 - i * 5}
        width="40"
        height="62"
        rx="3"
        fill={C.box}
        stroke={C.line}
      />
    ))}
    <text x="198" y="196" textAnchor="middle" fontSize="10" fill={C.dim}>
      CONV
    </text>
    <Arr
      p={[
        [224, 126],
        [244, 126],
      ]}
    />
    {[0, 1].map((i) => (
      <rect
        key={i}
        x={252 + i * 7}
        y={106 - i * 4}
        width="26"
        height="40"
        rx="3"
        fill={C.box}
        stroke={C.line}
      />
    ))}
    <text x="268" y="196" textAnchor="middle" fontSize="10" fill={C.dim}>
      POOL
    </text>
    <Arr
      p={[
        [290, 126],
        [308, 126],
      ]}
    />
    {[0, 1, 2, 3, 4].map((i) => (
      <circle
        key={i}
        cx="320"
        cy={94 + i * 16}
        r="5"
        fill={i === 2 ? C.hot : C.box}
        stroke={C.line}
      />
    ))}
    <text x="320" y="196" textAnchor="middle" fontSize="10" fill={C.dim}>
      DENSE
    </text>
    <Arr
      p={[
        [332, 126],
        [352, 126],
      ]}
    />
    {[
      ["healthy", 78, C.hot],
      ["class B", 14, C.line],
      ["class C", 8, C.line],
    ].map(([t, w, c], i) => (
      <g key={t}>
        <text x="358" y={96 + i * 36} fontSize="10" fill={C.ink}>
          {t}
        </text>
        <rect
          x="358"
          y={102 + i * 36}
          width="104"
          height="8"
          rx="4"
          fill={C.box}
        />
        <rect x="358" y={102 + i * 36} width={w} height="8" rx="4" fill={c} />
      </g>
    ))}
    <Lbl y={252} dim>
      IMAGE CLASSIFICATION · HEALTHCARE RESEARCH
    </Lbl>
  </Pic>
);

/* ---------- Arduino ---------- */
const ArduinoBoard = () => {
  const holes = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 12; c++) holes.push([284 + c * 14, 82 + r * 14]);
  return (
    <Pic>
      <Lbl>ARDUINO UNO + BREADBOARD</Lbl>
      <rect
        x="20"
        y="52"
        width="210"
        height="150"
        rx="8"
        fill={C.deep}
        stroke={C.line}
        strokeWidth="1.6"
      />
      <rect
        x="20"
        y="86"
        width="38"
        height="44"
        rx="3"
        fill={C.box}
        stroke={C.line}
      />
      <rect
        x="112"
        y="116"
        width="74"
        height="24"
        rx="3"
        fill="#4a0c8a"
        stroke={C.hot}
      />
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i}>
          <rect x={74 + i * 14} y="58" width="9" height="9" fill={C.hi} />
          <rect x={74 + i * 14} y="187" width="9" height="9" fill={C.hi} />
        </g>
      ))}
      <circle
        cx="84"
        cy="160"
        r="9"
        fill="none"
        stroke={C.dim}
        strokeWidth="2"
      />
      <circle cx="206" cy="96" r="4" fill={C.hot} />
      <text
        x="150"
        y="170"
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        letterSpacing="3"
        fill={C.ink}
      >
        UNO
      </text>
      <rect
        x="262"
        y="60"
        width="200"
        height="146"
        rx="6"
        fill={C.box}
        stroke={C.line}
        strokeWidth="1.3"
      />
      {holes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={C.dim} />
      ))}
      <circle cx="326" cy="124" r="11" fill={C.hot} />
      <text
        x="326"
        y="128"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#fff"
      >
        LED
      </text>
      <polyline
        points="356,124 368,112 380,136 392,112 404,136 416,124"
        fill="none"
        stroke={C.hi}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Ln
        p={[
          [158, 58],
          [158, 34],
          [300, 34],
          [300, 124],
          [315, 124],
        ]}
        hot
        dash
      />
      <Ln
        p={[
          [416, 124],
          [440, 124],
          [440, 226],
          [120, 226],
          [120, 196],
        ]}
        dash
      />
      <text x="388" y="102" textAnchor="middle" fontSize="10" fill={C.dim}>
        220 Ω
      </text>
    </Pic>
  );
};
const RobotFlow = () => (
  <Pic>
    <Lbl>SOCCERBOT · RC CAR</Lbl>
    <Box x={150} y={44} w={104} t="Remote" sub="Bluetooth" />
    <Box x={14} y={116} w={108} t="Sensors" sub="ultrasonic · IR" />
    <Box x={150} y={116} w={104} t="Arduino" sub="C/C++" hot />
    <Box x={286} y={116} w={104} t="Motor driver" sub="PWM · H-bridge" />
    <Box x={286} y={200} w={104} t="Battery" />
    <Arr
      p={[
        [202, 84],
        [202, 116],
      ]}
    />
    <Arr
      p={[
        [122, 136],
        [150, 136],
      ]}
    />
    <Arr
      p={[
        [254, 136],
        [286, 136],
      ]}
    />
    <Arr
      p={[
        [338, 200],
        [338, 156],
      ]}
    />
    <text x="270" y="130" textAnchor="middle" fontSize="9.5" fill={C.hi}>
      PWM
    </text>
    {[70, 190].map((cy) => (
      <g key={cy}>
        <circle
          cx="436"
          cy={cy}
          r="24"
          fill={C.deep}
          stroke={C.line}
          strokeWidth="1.6"
        />
        <circle cx="436" cy={cy} r="7" fill={C.hot} />
        {[0, 60, 120].map((a) => (
          <line
            key={a}
            x1={436 - 20 * Math.cos((a * Math.PI) / 180)}
            y1={cy - 20 * Math.sin((a * Math.PI) / 180)}
            x2={436 + 20 * Math.cos((a * Math.PI) / 180)}
            y2={cy + 20 * Math.sin((a * Math.PI) / 180)}
            stroke={C.line}
          />
        ))}
      </g>
    ))}
    <Arr
      p={[
        [390, 126],
        [412, 126],
        [412, 70],
        [412, 70],
      ]}
    />
    <Arr
      p={[
        [390, 146],
        [412, 146],
        [412, 190],
      ]}
    />
    <Lbl y={262} dim>
      MOTOR CONTROL · SENSOR FEEDBACK
    </Lbl>
  </Pic>
);

/* ---------- card + info-window content ---------- */
const SkillBody = ({ s }) => (
  <>
    <p className="wp">{s.intro}</p>
    {s.project && (
      <div className="wproj">
        <small>{s.project.label || "PROJECT"}</small>
        <b>{s.project.name}</b>
        <span>{s.project.note}</span>
      </div>
    )}
    <h5>{s.areasLabel || "AREAS OF INTEREST"}</h5>
    <ul className="wchips">
      {s.areas.map((a) => (
        <li key={a}>{a}</li>
      ))}
    </ul>
  </>
);

// logo boxes: l/t/w are % of the card (fitted against the Figma frame)
export const SKILLS = [
  {
    id: "react",
    title: "React.js",
    tag: "Frontend · UI library",
    logos: [{ src: "/logos/react.png", l: 45.5, t: 29.9, w: 63 }],
    intro:
      "I’m developing my skills in React.js to build modern, component-based web applications. I enjoy creating reusable UI components, managing application state, integrating APIs and developing responsive interfaces.",
    areas: [
      "Component-Based Architecture",
      "React Hooks",
      "State Management",
      "React Router",
      "API Integration",
      "Reusable Components",
      "Tailwind CSS",
      "Interactive User Interfaces",
    ],
    pics: [ReactTree, ReactCode],
  },
  {
    id: "django",
    title: "Django",
    tag: "Backend · Python framework",
    logos: [
      { src: "/logos/django-d.png", l: 40.3, t: 40.8, w: 37 },
      { src: "/logos/django-j.png", l: 73.9, t: 29.9, w: 23.2 },
    ],
    intro:
      "I work with Django for backend development and database-driven web applications. I enjoy designing application logic, managing data, handling user requests and connecting frontend interfaces with backend services.",
    project: {
      name: "BookinFly",
      note: "An airline ticket booking application built with Django and MySQL.",
    },
    areas: [
      "Python",
      "Django Framework",
      "MySQL",
      "Database Design",
      "CRUD Operations",
      "Authentication",
      "Backend Architecture",
      "Server-Side Applications",
    ],
    pics: [DjangoMVT, BookinFly],
  },
  {
    id: "flutter",
    title: "Flutter",
    tag: "Mobile · cross-platform",
    logos: [{ src: "/logos/flutter.png", l: 45, t: 26.1, w: 51.7 }],
    intro:
      "I’m interested in cross-platform mobile development with Flutter, exploring responsive layouts, reusable widgets, application logic and backend connectivity. My goal is practical apps with smooth experiences across devices.",
    areas: [
      "Flutter Framework",
      "Dart",
      "Widget-Based UI",
      "Navigation",
      "State Management",
      "API Integration",
      "Cross-Platform Development",
    ],
    pics: [FlutterWidgets, FlutterCode],
  },
  {
    id: "electron",
    title: "Electron",
    tag: "Desktop · cross-platform",
    logos: [{ src: "/logos/electron.png", l: 45.5, t: 33.8, w: 52.1 }],
    intro:
      "Electron lets me combine JavaScript, HTML and CSS with desktop capabilities, so my web development knowledge can extend into cross-platform desktop software engineering.",
    areas: [
      "Electron Framework",
      "HTML, CSS & JavaScript",
      "Desktop Application Architecture",
      "Native OS Integration",
      "File System Operations",
      "Cross-Platform Applications",
    ],
    pics: [ElectronProcess, ElectronCode],
  },
  {
    id: "express",
    title: "Express.js",
    tag: "Backend · Node.js",
    logos: [{ src: "/logos/express.png", l: 33.6, t: 50.3, w: 88.2 }],
    intro:
      "I’m exploring Express.js as part of the Node.js ecosystem to understand server-side JavaScript development and API-driven application architecture.",
    areas: [
      "Node.js",
      "Express.js",
      "RESTful API Development",
      "Middleware",
      "Routing",
      "Request & Response Handling",
      "Backend Integration",
    ],
    pics: [ExpressFlow, ExpressCode],
  },
  {
    id: "js",
    title: "JavaScript",
    tag: "Language · modern web",
    logos: [{ src: "/logos/javascript.png", l: 39.8, t: 45.2, w: 63 }],
    intro:
      "I work with JavaScript to build interactive, dynamic web applications. I’m interested in modern development practices, component-based architecture, API integration and responsive user interfaces.",
    areas: [
      "JavaScript (ES6+)",
      "DOM Manipulation",
      "Asynchronous JavaScript",
      "REST API Integration",
      "JSON",
      "Responsive Web Development",
      "Frontend Architecture",
    ],
    pics: [EventLoop, JsCode],
  },
  {
    id: "iot",
    title: "Internet of Things",
    tag: "Connected systems",
    logos: [{ src: "/logos/iot.png", l: 39.3, t: 24.2, w: 73 }],
    intro:
      "IoT is one of my strongest technical interests. I enjoy working with sensors, microcontrollers, electronic components and communication protocols to build systems that interact with the physical world, combining embedded programming, hardware integration, automation and software dashboards.",
    areas: [
      "Sensor Integration",
      "Embedded Programming",
      "Hardware-Software Integration",
      "Wireless Communication",
      "MQTT",
      "Real-Time Monitoring",
      "Automation Systems",
      "IoT Dashboard Development",
    ],
    pics: [IotArch, IotDash],
  },
  {
    id: "esp32",
    title: "ESP32",
    tag: "Embedded · microcontroller",
    logos: [{ src: "/logos/esp32.png", l: 17.5, t: 29.9, w: 106.6 }],
    intro:
      "I have hands-on experience with ESP32 microcontrollers and sensor-based embedded systems.",
    project: {
      name: "S-SPAEMS",
      note: "Smart Solar-Powered Poultry Ammonia & Environmental Management System. It monitors temperature and gas levels and uses automated control to help keep a safer poultry environment.",
    },
    areasLabel: "TECHNOLOGIES & COMPONENTS",
    areas: [
      "ESP32 Dev Board",
      "PlatformIO",
      "C/C++",
      "DHT22 Sensor",
      "MICS-5524 Gas Sensor",
      "Relay Modules",
      "LEDs & Buzzers",
      "MQTT",
      "Wi-Fi",
      "Flask & Socket.IO",
    ],
    pics: [EspBoard, SpaemsFlow],
  },
  {
    id: "ai",
    title: "Artificial Intelligence",
    tag: "Machine learning",
    logos: [{ src: "/logos/ai.png", l: 44.1, t: 41.4, w: 59.2 }],
    intro:
      "I’m interested in building intelligent systems that analyze information, recognize patterns and help with real-world problems: AI inside software, computer vision, research and automation. I’m also exploring AI applications in healthcare and skin-related problem analysis.",
    areas: [
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "Image Classification",
      "Data Analysis",
      "AI-Powered Applications",
      "Model Training & Evaluation",
      "Intelligent Automation",
    ],
    pics: [NeuralNet, VisionPipe],
  },
  {
    id: "arduino",
    title: "Arduino & Robotics",
    tag: "Electronics · robotics",
    logos: [{ src: "/logos/arduino.svg", l: 32.5, t: 47.5, w: 68.6 }],
    intro:
      "I enjoy experimenting with Arduino-based electronics, microcontrollers, sensors, actuators and robotics: interactive hardware prototypes, electronic circuits and automated robotic systems.",
    project: {
      label: "PROJECTS",
      name: "Soccerbot · RC Car",
      note: "Robotics projects alongside other embedded-systems experiments.",
    },
    areas: [
      "Arduino Programming",
      "C/C++",
      "Digital & Analog Electronics",
      "Sensors & Actuators",
      "Motor Control",
      "PWM",
      "Robotics",
      "Circuit Prototyping",
      "Embedded Systems",
    ],
    pics: [ArduinoBoard, RobotFlow],
  },
];

export { SkillBody };
