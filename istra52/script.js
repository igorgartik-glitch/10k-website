// width/height:'100%' + minScale/maxScale:1 disable Reveal's default 960x700 virtual-canvas
// scaling transform — required because the custom CSS lays out slides as real full-bleed
// viewport content, not Reveal's scaled stage. Without this the two layout systems fight
// and clip text off the left edge.
const deck = new Reveal({ hash:true, controls:true, progress:true, slideNumber:false, transition:'fade', backgroundTransition:'fade', center:false, width:'100%', height:'100%', margin:0, minScale:1, maxScale:1 });
deck.initialize();

window.addEventListener('load',()=>setTimeout(()=>document.getElementById('preloader')?.classList.add('hidden'),650));

let scene,camera,renderer,group,water,particles,houseGroup,treeGroup,roadGroup;
let targetCamera = {x:8,y:8,z:13,rx:-0.48,ry:0.46};
let clock = new THREE.Clock();

init3D();
animate();
setScene('hero');
deck.on('slidechanged', e => setScene(e.currentSlide.dataset.scene || 'hero'));

function init3D(){
  const canvas=document.getElementById('village3d');
  scene=new THREE.Scene();
  scene.fog=new THREE.FogExp2(0x050706,0.032);
  camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;

  const amb=new THREE.AmbientLight(0xd7c7a4,.85);scene.add(amb);
  const sun=new THREE.DirectionalLight(0xffe1a1,1.6);sun.position.set(-8,12,8);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);
  sun.shadow.camera.left=-16;sun.shadow.camera.right=16;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;
  sun.shadow.bias=-0.0015;
  scene.add(sun);
  const rim=new THREE.PointLight(0x70a8af,1.6,30);rim.position.set(8,4,-7);scene.add(rim);

  group=new THREE.Group();scene.add(group);
  houseGroup=new THREE.Group();treeGroup=new THREE.Group();roadGroup=new THREE.Group();
  group.add(houseGroup,treeGroup,roadGroup);

  const groundMat=new THREE.MeshStandardMaterial({color:0x1b2d20,roughness:.9,metalness:0});
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(28,20,40,40),groundMat);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;group.add(ground);

  const roadMat=new THREE.MeshStandardMaterial({color:0xd8d1c3,roughness:.8});
  addRoad(0,0,25,.42,0);addRoad(0,0,16,.36,Math.PI/2);addRoad(-5,2,10,.32,.55);addRoad(5,-2,10,.32,.55);

  const waterMat=new THREE.MeshStandardMaterial({color:0x456f73,roughness:.25,metalness:.15,transparent:true,opacity:.72});
  water=new THREE.Mesh(new THREE.CircleGeometry(3.1,64),waterMat);water.rotation.x=-Math.PI/2;water.position.set(6.5,.025,4.2);group.add(water);

  createHouses();
  createTrees();
  createParticles();
  window.addEventListener('resize',onResize);
}
function addRoad(x,z,w,h,r){const m=new THREE.Mesh(new THREE.BoxGeometry(w,.035,h),new THREE.MeshStandardMaterial({color:0xcac3b5,roughness:.72}));m.position.set(x,.035,z);m.rotation.y=r;m.receiveShadow=true;roadGroup.add(m)}
function createHouses(){
  const houseMat=new THREE.MeshStandardMaterial({color:0xd6c6aa,roughness:.48,metalness:.05});
  const roofMat=new THREE.MeshStandardMaterial({color:0x121513,roughness:.35,metalness:.2});
  let count=0;
  for(let row=-4;row<=4;row+=2){
    for(let col=-6;col<=6;col+=2){
      if(count>=52)break;
      if(Math.abs(col)<1 && Math.abs(row)<1) continue;
      const h=new THREE.Group();
      const body=new THREE.Mesh(new THREE.BoxGeometry(1.1,.52,.82),houseMat);body.position.y=.26;body.castShadow=true;body.receiveShadow=true;
      const roof=new THREE.Mesh(new THREE.BoxGeometry(1.18,.12,.9),roofMat);roof.position.y=.58;roof.castShadow=true;
      const glass=new THREE.Mesh(new THREE.BoxGeometry(.38,.24,.025),new THREE.MeshStandardMaterial({color:0x9fb8bf,emissive:0x243e44,roughness:.2,metalness:.1}));glass.position.set(0,.32,.425);
      h.add(body,roof,glass);h.position.set(col+(Math.random()-.5)*.4,0,row+(Math.random()-.5)*.35);h.rotation.y=(Math.random()-.5)*.35;h.scale.setScalar(.86+Math.random()*.28);houseGroup.add(h);count++;
    }
  }
}
function createTrees(){
  const trunkMat=new THREE.MeshStandardMaterial({color:0x5c4330,roughness:.9});
  const leafMat=new THREE.MeshStandardMaterial({color:0x2d5939,roughness:.85});
  for(let i=0;i<170;i++){
    const t=new THREE.Group();
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.035,.055,.34,6),trunkMat);trunk.position.y=.17;
    const crown=new THREE.Mesh(new THREE.ConeGeometry(.26,.78,7),leafMat);crown.position.y=.72;crown.castShadow=true;
    t.add(trunk,crown);
    const edge=Math.random()<.55; const x=edge?(Math.random()<.5?-13+Math.random()*3:10+Math.random()*3):(Math.random()*25-12.5);
    const z=edge?(Math.random()*18-9):(Math.random()<.5?-9+Math.random()*2:7+Math.random()*2);
    t.position.set(x,0,z);t.scale.setScalar(.75+Math.random()*.8);treeGroup.add(t);
  }
}
function createParticles(){
  const geo=new THREE.BufferGeometry();const pts=[];
  for(let i=0;i<480;i++) pts.push((Math.random()-.5)*35,Math.random()*10+1,(Math.random()-.5)*25);
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  particles=new THREE.Points(geo,new THREE.PointsMaterial({color:0xd9b56f,size:.025,transparent:true,opacity:.55}));scene.add(particles);
}
function setScene(name){
  const presets={
    hero:{x:8,y:7,z:13,rx:-.46,ry:.47,scale:1,rot:.08},
    map:{x:-3,y:12,z:13,rx:-.82,ry:-.18,scale:1.05,rot:-.1},
    roads:{x:0,y:8,z:10,rx:-.58,ry:0,scale:1.1,rot:.6},
    orbit:{x:11,y:8,z:7,rx:-.5,ry:.85,scale:.98,rot:1.2},
    masterplan:{x:0,y:17,z:.01,rx:-1.565,ry:0,scale:1.18,rot:0},
    houses:{x:5,y:5,z:7,rx:-.46,ry:.55,scale:1.45,rot:-.35},
    lifestyle:{x:-7,y:5,z:8,rx:-.42,ry:-.62,scale:1.18,rot:.25},
    amenities:{x:0,y:6,z:12,rx:-.48,ry:0,scale:1.08,rot:.1},
    finance:{x:9,y:10,z:10,rx:-.7,ry:.58,scale:1,rot:-.4},
    sales:{x:-9,y:9,z:10,rx:-.62,ry:-.6,scale:1.05,rot:.75},
    finale:{x:0,y:10,z:15,rx:-.55,ry:0,scale:.9,rot:0}
  }[name]||presets.hero;
  gsap.to(camera.position,{x:presets.x,y:presets.y,z:presets.z,duration:1.35,ease:'power3.inOut'});
  gsap.to(camera.rotation,{x:presets.rx,y:presets.ry,z:0,duration:1.35,ease:'power3.inOut'});
  gsap.to(group.scale,{x:presets.scale,y:presets.scale,z:presets.scale,duration:1.35,ease:'power3.inOut'});
  gsap.to(group.rotation,{y:presets.rot,duration:1.35,ease:'power3.inOut'});
  gsap.fromTo('.present h1, .present h2, .present p, .present .metrics, .present .cards, .present .brand-board, .present .timeline, .present .lifestyle-grid',{y:24,opacity:.15},{y:0,opacity:1,duration:.85,stagger:.08,ease:'power2.out'});
}
function animate(){
  requestAnimationFrame(animate);const t=clock.getElapsedTime();
  if(water){water.scale.setScalar(1+Math.sin(t*1.2)*.025);water.rotation.z=t*.04}
  if(particles){particles.rotation.y=t*.015;particles.position.y=Math.sin(t*.4)*.15}
  houseGroup.children.forEach((h,i)=>{h.position.y=Math.sin(t*1.2+i)*.01});
  renderer.render(scene,camera);
}
function onResize(){camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight)}
