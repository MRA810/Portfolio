import * as THREE from 'three'
const frag = `precision highp float;
uniform vec2 uRes,uV,uH; uniform float uMode,uP;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 px=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
  vec3 o=vec3(1.0,0.2275,0.0);
  float cell=uRes.x/22.0; vec2 c=floor(px/cell); vec2 cc=(c+0.5)*cell/uRes; float h=hash(c); float on;
  if(uMode<0.5){
    float l=step(abs(px.x-uV.x*uRes.x),0.8)+step(abs(px.x-uV.y*uRes.x),0.8)+step(abs(px.y-uH.x*uRes.y),0.8)+step(abs(px.y-uH.y*uRes.y),0.8);
    gl_FragColor=vec4(mix(o,vec3(0.0196),clamp(l,0.,1.)*0.85),1.0); return;
  } else if(uMode<1.5){
    vec2 d=(cc-0.5)*vec2(uRes.x/uRes.y,1.0);
    on=step(uP*1.12,length(d)*0.6+h*0.4);
  } else { on=step(1.0001-uP*1.0002,cc.x*0.72+h*0.28); }
  gl_FragColor=vec4(o*on,on);
}`
export function createPixels(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
  const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const u = { uRes: { value: new THREE.Vector2() }, uMode: { value: 0 }, uP: { value: 0 }, uV: { value: new THREE.Vector2(.05, .95) }, uH: { value: new THREE.Vector2(.06, .94) } }
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: u, transparent: true, vertexShader: 'void main(){gl_Position=vec4(position.xy,0.,1.);}', fragmentShader: frag })))
  const resize = () => { const d = Math.min(devicePixelRatio, 2); r.setPixelRatio(d); r.setSize(innerWidth, innerHeight, false); u.uRes.value.set(innerWidth * d, innerHeight * d) }
  resize(); addEventListener('resize', resize)
  return { u, render: () => r.render(scene, cam), dispose: () => { removeEventListener('resize', resize); r.dispose() } }
}
