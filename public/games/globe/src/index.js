
let scene, camera, renderer ;

let lastX=50, lastY=50;
let lastTime , sph1;
const group = new THREE.Group();


window.focus(); // Capture keys right away (by default focus is on editor)

function init(){
  // Initialize ThreeJs
  const aspect = window.innerWidth / window.innerHeight;
  const width = 2000;
  const height = width / aspect;

camera = new THREE.OrthographicCamera(
    width / -2, // left
    width / 2, // right
    height / 2, // top
    height / -2, // bottom
    1, // near plane
    4000 // far plane
  );

  /*
  // If you want to use perspective camera instead, uncomment these lines
  camera = new THREE.PerspectiveCamera(
    45, // field of view
    aspect, // aspect ratio
    1, // near plane
    100 // far plane
  );
  */

  camera.position.set(2000, 0, 0);
  camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

  
  // Set up lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(-1000, -300, -200);
  scene.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, .7);
  dirLight2.position.set(1000, 0, 1500);
  scene.add(dirLight2);

  // Set up renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  document.body.appendChild(renderer.domElement);

  renderer.domElement.addEventListener('mousemove',mousemove)

  }

  function sphere(x,y,z,width){
    const geometry = new THREE.SphereGeometry(width,600,600);
    const color = new THREE.Color(`hsl(${210 }, 50%, 20%)`);
    // const texture = new THREE.CanvasTexture(document.getElementById('imgmap'));
    // const material = new THREE.MeshStandardMaterial({ bumpMap:texture,color,bumpScale:50});
    const material = new THREE.MeshStandardMaterial({ color});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    group.add(mesh);
    
    renderer.render(scene,camera);
    return mesh;
    }
  function sphere2(x,y,z,width){
    const geometry = new THREE.SphereGeometry(width,600,600);
    const color = new THREE.Color(12,15,19);
    const material = new THREE.MeshLambertMaterial({ color, transparent:true, opacity:0.1 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    group.add(mesh);
    
    renderer.render(scene,camera);
    return mesh;
    }

function animation(time) {
  if (lastTime) {
    const timePassed = time - lastTime;
    const speed = 0.0002;
    if(group){
        group.rotation.y += speed * timePassed;
        renderer.render(scene,camera)
    }
  }
    
  lastTime = time;
    
}


window.addEventListener("resize", () => {
  // Adjust camera
  console.log("resize", window.innerWidth, window.innerHeight);
  const aspect = window.innerWidth / window.innerHeight;
  const width = 2000;
  const height = width / aspect;

  camera.top = height / 2;
  camera.bottom = height / -2;

  // Reset renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});


function mousemove(e){
 if(e.buttons == 1){
    group.rotation.y += 0.005 *( e.clientX - lastX);
    group.rotation.z -= 0.005 *( e.clientY - lastY);

    if(dotMeshes && dotMeshes.length){
      dotMeshes.forEach(m=>m.scale.x =m.scale.y =m.scale.z = 1+Math.random()*0.03)
    }
}
else if(dotMeshes && dotMeshes.length){
  dotMeshes.forEach(m=>m.scale.x =m.scale.y =m.scale.z = 1)
}
lastX = e.clientX;
lastY = e.clientY;
}

let dotMeshes = [];
function drawDotsFromImg(img){
  let data = getImageData(img);
  // console.log(data)
  d = data
  // Create 60000 tiny dots and spiral them around the sphere.
const DOT_COUNT = 35000; //10000


// The XYZ coordinate of each dot
const positions = [];

// A random identifier for each dot
const rndId = [];

// The country border each dot falls within
const countryIds = [];

const vector = new THREE.Vector3();

for (let i = DOT_COUNT; i >= 0; i--) {

  const phi = Math.acos(-1 + (2 * i) / DOT_COUNT);
  const theta = Math.sqrt(DOT_COUNT * Math.PI) * phi;
    // if(Math.random() > 0.5)continue;
  let x = Math.floor((theta % (2* Math.PI) ) / (2*Math.PI) * data.width)%data.width;
  let y = Math.floor((phi / Math.PI)  * data.height)%data.height; 
  let con = data.data[Math.floor(y *data.width + x )*4];
  // console.log(x ,y,(y *data.width + x )*4,con)
  if(con==0)continue;

  // Pass the angle between this dot an the Y-axis (phi)
  // Pass this dot’s angle around the y axis (theta)
  // Scale each position by 600 (the radius of the globe)
  vector.setFromSphericalCoords(500+con*0.03, phi, theta);
  // vector.setFromSphericalCoords(500, phi, theta);            //varient
// A hexagon with a radius of 2 pixels looks like a circle
const dotGeometry = new THREE.CircleGeometry(3,5);
// const dotGeometry = new THREE.SphereGeometry(3,5,5);         //varient
  dotGeometry.lookAt(vector);

  // Move the dot to the newly calculated position
  dotGeometry.translate(vector.x, vector.y, vector.z);
  // const color = new THREE.Color(`hsl(${260-con}, 100%, 50%)`);   //varient
  const color = new THREE.Color(`hsl(${i*0.01}, 100%, 50%)`);
  const material = new THREE.MeshLambertMaterial({color});
  const mesh = new THREE.Mesh(dotGeometry, material);
  mesh.position.set(0,0,0);
  dotMeshes.push(mesh)
  group.add(mesh);
}

}
// let c;
function getImageData(img){
  // console.log(img);
  let canvas = document.createElement('canvas');
  // canvas.style.display = 'none';
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  document.body.appendChild(canvas);
  let ctx = canvas.getContext('2d');
  // c = ctx
  ctx.fillStyle= '#000000'
  ctx.fillRect(0,0,canvas.width,canvas.height)
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  let data = ctx.getImageData(0,0,canvas.width,canvas.height);
  // ctx.putImageData(data,500,500)
  document.body.removeChild(canvas);
  return data;
}



init();
sph1 = sphere(0,0,0,500);
// sph2 = sphere2(0,0,0,510);

drawDotsFromImg(document.getElementById('imgmap'))
scene.add(group);
renderer.render(scene,camera)

