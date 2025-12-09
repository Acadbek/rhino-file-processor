import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Rhino3dmLoader } from 'three/addons/loaders/3DMLoader.js';

export default class Viewer3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error("Container topilmadi:", containerId);
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;

    this.init();
  }

  init() {
    // 1. Sahna
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd0d0d0); // To'qroq kulrang (model oq bo'lsa ko'rinishi uchun)

    // 2. O'lchamlar
    // Agar container balandligi 0 bo'lsa, majburlab 400px qilamiz
    if (this.container.clientHeight === 0) {
      this.container.style.height = "400px";
    }
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // 3. Kamera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    this.camera.position.set(50, 50, 50); // Boshlang'ich uzoqlik

    // 4. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 5. Chiroqlar (Juda kuchli qilamiz, qorong'u bo'lmasligi uchun)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);

    // 6. Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // 7. Grid Helper (Pol chizib qo'yamiz, kamera ishlayotganini bilish uchun)
    const gridHelper = new THREE.GridHelper(1000, 20);
    this.scene.add(gridHelper);

    // 8. Animatsiya
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  loadModel(arrayBuffer) {
    // Eski modelni tozalash
    if (this.model) {
      this.scene.remove(this.model);

      // Xotirani tozalash (Memory leak oldini olish uchun)
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          if (child.material) child.material.dispose();
        }
      });
      this.model = null;
    }

    const loader = new Rhino3dmLoader();
    loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.4.0/');

    loader.parse(arrayBuffer, (object) => {
      this.model = object;

      // --- PROFESSIONAL DESIGN STILI ---
      this.model.traverse((child) => {
        if (child.isMesh) {
          // Dizayndagi kabi "Oq, Toza" ko'rinish
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,      // Oppoq rang
            roughness: 0.5,       // Yarim matviy (plastik yoki bo'yalgan yog'och kabi)
            metalness: 0.1,       // Metall emas
            flatShading: false,   // Silliq yuzalar
          });

          // Soyalar tushishi uchun (agar keyinchalik shadow yoqsangiz)
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Modelni to'g'ri qo'yish
      this.model.rotation.x = -Math.PI / 2;
      this.scene.add(this.model);

      // Kamerani modelga moslash
      this.fitCameraToObject(this.model);

    }, (err) => {
      console.error("Xatolik:", err);
    });
  }
  fitCameraToObject(object) {
    const box = new THREE.Box3().setFromObject(object);

    // Agar model bo'sh bo'lsa (Mesh yo'q bo'lsa)
    if (box.isEmpty()) {
      console.warn("DIQQAT: Model bo'sh yoki Render Mesh yo'q!");
      return;
    }

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Kamerani uzoqlashtirish
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2));
    cameraZ *= 2.0; // Modelni sig'dirish uchun koeffitsiyent

    // Kamera yangi joyga ko'chsin
    const direction = new THREE.Vector3(1, 1, 1).normalize();
    this.camera.position.copy(center).add(direction.multiplyScalar(cameraZ));

    this.camera.lookAt(center);
    this.controls.target.copy(center);
    this.controls.update();
  }

  onWindowResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
