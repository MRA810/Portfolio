import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { createPixels } from './pixels.js'

const SOCIALS = [ // TODO: replace with real profile URLs
  { name: 'LINKEDIN', href: '#', color: '#0a66c2' },
  { name: 'GITHUB', href: '#', color: '#c9c9c9' },
  { name: 'FACEBOOK', href: '#', color: '#1877f2' },
]
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const seg = (p, a, b) => clamp((p - a) / (b - a))
const e = x => x * x * (3 - 2 * x)
const lerp = (a, b, t) => a + (b - a) * t
const GL = '#*@%&$+/<>=~?'
const glyphs = (n, k) => { let s = ''; for (let i = 0; i < n; i++) s += GL[Math.floor(Math.abs(Math.sin((i + 1) * 12.9898 + k * 78.233)) * 43758) % GL.length]; return s }
const morph = (from, to, t, k, toHtml) => t < .3 ? from : t > .72 ? (toHtml ?? to) : `<span class="o">${glyphs(Math.round(lerp(from.length, to.length, (t - .3) / .42)), k)}</span>`
// loading line keyframes: [progress, v1, v2, h1, h2]
const KF = [[0, .05, .95, .06, .94], [.45, .22, .78, .235, .79], [.9, .39, .607, .395, .62], [.99, .46, .53, .476, .524], [1, .49, .51, .49, .51]]
function lines(p) {
  let i = 0; while (i < KF.length - 2 && p > KF[i + 1][0]) i++
  const a = KF[i], b = KF[i + 1], t = e(clamp((p - a[0]) / (b[0] - a[0])))
  return [1, 2, 3, 4].map(j => lerp(a[j], b[j], t))
}
function downloadVcf() {
  const v = 'BEGIN:VCARD\nVERSION:3.0\nFN:Md. Ashraful Alam Shuvo\nN:Shuvo;Md. Ashraful Alam;;;\nTEL;TYPE=CELL:+8801841995394\nEMAIL:ashshuvo1222.prof@gmail.com\nADR;TYPE=HOME:;;;Dhaka;;;Bangladesh\nEND:VCARD'
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([v], { type: 'text/vcard' })); a.download = 'ashraful-alam.vcf'; a.click()
}
const DOTS = [[17.8, 17, '#6306CA', 6], [2.6, 54, '#FF3A00', 9], [39.7, 51, '#FF3A00', -7], [65.2, 62, '#6306CA', 5], [87.2, 28, '#FF3A00', -8]]

export default function App() {
  const stage = useRef(), cv = useRef(), pct = useRef(), lenisRef = useRef()
  const [menu, setMenu] = useState(false)
  const [time, setTime] = useState('')
  useEffect(() => {
    const t = () => setTime(new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Dhaka' }).format(new Date()).toUpperCase())
    t(); const id = setInterval(t, 1000); return () => clearInterval(id)
  }, [])
  useEffect(() => { lenisRef.current?.[menu ? 'stop' : 'start']() ; if (!menu && phase.current !== 'ready') lenisRef.current?.stop() }, [menu])
  const phase = useRef('load')

  useEffect(() => {
    const px = createPixels(cv.current), S = stage.current
    const $ = id => S.querySelector(`[data-id=${id}]`)
    const el = Object.fromEntries(['portrait', 'ash', 'more', 'bd', 'n1', 'n2', 'bio', 'wifey', 'add', 'tag', 'contact', 'dots'].map(k => [k, $(k)]))
    const lenis = new Lenis({ lerp: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.2 : 0.055, wheelMultiplier: .85, touchMultiplier: 1.2, gestureOrientation: 'vertical', smoothWheel: true })
    lenisRef.current = lenis; lenis.stop(); scrollTo(0, 0)
    let target = 0, cur = 0, mx = 0, my = 0, tx = 0, ty = 0, ready = false, t0 = performance.now(), rT = 0, ent = 0, last = performance.now(), raf
    lenis.on('scroll', () => { target = lenis.limit ? lenis.scroll / lenis.limit : 0 })
    const onMove = ev => { if (ev.pointerType !== 'mouse') return; tx = ev.clientX / innerWidth - .5; ty = ev.clientY / innerHeight - .5 }
    addEventListener('pointermove', onMove)
    let port = innerWidth / innerHeight < 1; const onRz = () => { port = innerWidth / innerHeight < 1 }; addEventListener('resize', onRz)
    const img = new Image(); img.src = '/portrait.webp'
    Promise.all([document.fonts.ready, img.decode().catch(() => {})]).then(() => { ready = true })
    const S_ = (n, x, y, o, s = 1) => { if (!n) return; n.style.transform = `translate3d(${x}vw,${y}dvh,0) scale(${s})`; n.style.opacity = o; n.style.visibility = o < .003 ? 'hidden' : 'visible' }

    const tick = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now
      lenis.raf(now)
      cur += (target - cur) * (1 - Math.exp(-dt * 7))
      mx += (tx - mx) * (1 - Math.exp(-dt * 3)); my += (ty - my) * (1 - Math.exp(-dt * 3))
      const u = px.u
      if (phase.current === 'load') {
        const tt = clamp((now - t0) / 4600), base = tt < .5 ? 4 * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 3) / 2
        const v = ready ? base : Math.min(base, .99)
        const l = lines(v); u.uV.value.set(l[0], l[1]); u.uH.value.set(l[2], l[3]); u.uMode.value = 0
        pct.current.textContent = Math.floor(v * 100) + '%'
        if (v >= 1) { phase.current = 'hold'; rT = now }
      } else if (phase.current === 'hold' && now - rT > 450) { phase.current = 'reveal'; rT = now; u.uMode.value = 1; pct.current.style.opacity = 0 }
      else if (phase.current === 'reveal') {
        const k = clamp((now - rT) / 3000); u.uP.value = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
        ent = e(seg(k, .35, 1))
        if (k >= 1) { phase.current = 'ready'; u.uMode.value = 2; u.uP.value = 0; ent = 1; if (!menu) lenis.start() }
      }
      if (phase.current === 'ready') u.uP.value = clamp(seg(cur, .62, 1))
      if (phase.current !== 'load' && phase.current !== 'hold') S.classList.add('live')
      if (phase.current !== 'ready' || u.uP.value > 0 || cur < .01) px.render()

      // ---- scroll choreography ----
      const a = seg(cur, 0, .12), b = seg(cur, .12, .38), c = seg(cur, .38, .62), x = seg(cur, .6, .8)
      const ea = e(a), eb = e(b), ec = e(c), ex = e(x), k = Math.floor(now / 70), rise = (1 - ent) * 4
      S_(el.portrait, port ? mx * 1.4 : 3 + 14 * ea + 35 * eb - 27 * ec + mx * 1.4, (port ? 24 : 33) * ec + 90 * ex + (1 - ent) * 10 + my * .8, ent, 1 - .04 * ea + .1 * ec)
      el.n1.innerHTML = morph('ASHRAFUL', '#nFUL', a, k, '<span class="o">#n</span>FUL')
      el.n2.innerHTML = morph('ALAM', '5*0M', a, k + 3, '<span class="o">5*0</span>M')
      const nameO = ent * (1 - e(seg(b, 0, .3)))
      S_(el.n1, 0, rise, nameO); S_(el.n2, 0, rise, nameO)
      el.bd.innerHTML = morph('BD', 'LV', a, k + 7)
      S_(el.bd, 0, rise, ent * (1 - e(seg(b, 0, .25))))
      S_(el.bio, 0, rise, ent * (1 - e(seg(a, .15, .55))))
      const mid = e(seg(a, .5, .9)) * (1 - e(seg(b, 0, .3))) * ent
      S_(el.wifey, 0, 0, mid); S_(el.tag, 0, 0, mid)
      S_(el.add, 0, rise, ent * (1 - e(seg(a, .15, .55))))
      S_(el.contact, 0, rise, ent * (1 - e(seg(b, 0, .25))))
      S_(el.more, 0, 0, ent)
      S_(el.ash, (port ? -66 : -65) * ec - (port ? 140 : 90) * ex - mx * 1.2, 14 * (1 - e(seg(b, .05, .5))), e(seg(b, .05, .45)) * (1 - ex))
      el.ash.style.setProperty('--x', 0)
      S.style.setProperty('--go', e(seg(b, .5, .9)) * (1 - e(seg(c, 0, .25))))
      el.dots.querySelectorAll('i').forEach((d, i) => { d.style.transform = `translate3d(0,${((DOTS[i][1] + cur * DOTS[i][3] * 40) % 100 + 100) % 100}dvh,0)` })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); px.dispose(); removeEventListener('pointermove', onMove); removeEventListener('resize', onRz) }
  }, [])

  return (<>
    <div className="scroller" aria-hidden="true" />
    <main className={'stage' + (menu ? ' menu-open' : '')} ref={stage}>
      <div className="lines">{[2.6, 17.8, 39.7, 65.2, 87.2].map(l => <b key={l} style={{ left: l + 'vw' }} />)}
        <span data-id="dots">{DOTS.map((d, i) => <i key={i} style={{ left: `calc(${d[0]}vw - 2px)`, background: d[2] }} />)}</span></div>
      <div className="layer">
        <div data-id="portrait" className="portrait"><img src="/portrait.webp" alt="Md. Ashraful Alam Shuvo" /></div>
        <div data-id="ash" className="ash">ASH</div>
        <p className="tl">MD. ASHRAFUL ALAM SHUVO</p>
        <div className="city"><p>DHAKA, BANGLADESH</p><small>{time}</small></div>
        <button data-id="more" className="more" onClick={() => setMenu(true)}>EXPLORE MORE</button>
        <div data-id="bd" className="bd">BD</div>
        <div data-id="contact" className="contact"><p>+8801841995394</p><p>ashshuvo1222.prof@gmail.com</p></div>
        <p data-id="bio" className="bio">I’m a <em className="dev">developer</em> and <em className="bld">builder</em> who loves turning ideas into real things. From web experiences and software to electronics and robotics, I enjoy creating, experimenting, and learning along the way.</p>
        <p data-id="wifey" className="wifey">I LOVE MY WIFEY</p>
        <button data-id="add" className="add" onClick={downloadVcf}>ADD TO CONTACT</button>
        <div data-id="tag" className="tag">a#46</div>
        <h1 className="name"><span data-id="n1" className="n1">ASHRAFUL</span><span data-id="n2" className="n2">ALAM</span></h1>
        <p className="go">A LITTLE MORE TO GO --&gt;</p>
      </div>
      <div className={'menu' + (menu ? ' open' : '')} onClick={() => setMenu(false)}>
        <div className="panel" onClick={ev => ev.stopPropagation()}><div className="in">
          <button className="x" aria-label="Close menu" onClick={() => setMenu(false)}><i /><i /></button>
          <button className="mb" style={{ '--i': 0 }}>ABOUT</button><button className="mb" style={{ '--i': 1 }}>WORKS</button>
          <h3>CONTACTS</h3>
          {SOCIALS.map((s, i) => <a key={s.name} href={s.href} target="_blank" rel="noreferrer" style={{ '--i': i + 2 }}><u style={{ background: s.color }} />{s.name}</a>)}
        </div></div>
      </div>
      <div className="grain" />
      <canvas ref={cv} className="gl" />
      <div ref={pct} className="pct">0%</div>
    </main>
  </>)
}
