// import { Component } from '@angular/core';
// import * as THREE from 'three';

// @Component({
//   selector: 'app-canvas-box',
//   standalone: true,
//   imports: [],
//   templateUrl: './canvas-box.component.html',
//   styleUrl: './canvas-box.component.scss',
// })
// export class CanvasBoxComponent {
//   constructor() {}

//   ngAfterViewInit() {
//     const scene = new THREE.Scene();

//     const canvasSizes = {
//       width: window.innerWidth,
//       height: window.innerHeight,
//     };

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       canvasSizes.width / canvasSizes.height,
//       0.1,
//       1000
//     );

//     const renderer = new THREE.WebGLRenderer();
//     renderer.setClearColor(0xe232222, 1);
//     renderer.setSize(canvasSizes.width, canvasSizes.height);

//     window.addEventListener('resize', () => {
//       canvasSizes.width = window.innerWidth;
//       canvasSizes.height = window.innerHeight;

//       camera.aspect = canvasSizes.width / canvasSizes.height;
//       camera.updateProjectionMatrix();

//       renderer.setSize(canvasSizes.width, canvasSizes.height);
//       renderer.render(scene, camera);
//     });

//     document.body.appendChild(renderer.domElement);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 1);
//     scene.add(ambientLight);
//     const pointLight = new THREE.PointLight(0xffffff, 5);
//     pointLight.position.set(2, 2, 2);
//     scene.add(pointLight);

//     const material = new THREE.MeshToonMaterial();
//     const box = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), material);
//     const torus = new THREE.Mesh(
//       new THREE.TorusGeometry(5, 1.5, 16, 100),
//       material
//     );

//     scene.add(torus, box);

//     camera.position.z = 30;

//     const clock = new THREE.Clock();

//     const animateGeometry = () => {
//       const elapsedTime = clock.getElapsedTime();

//       box.rotation.x = elapsedTime;
//       box.rotation.y = elapsedTime;
//       box.rotation.z = elapsedTime;

//       torus.rotation.x = -elapsedTime;
//       torus.rotation.y = -elapsedTime;
//       torus.rotation.z = -elapsedTime;

//       // Render
//       renderer.render(scene, camera);

//       // Call tick again on the next frame
//       window.requestAnimationFrame(animateGeometry);
//     };

//     animateGeometry();
//   }
// }

import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

@Component({
  selector: 'app-canvas-box',
  standalone: true,
  imports: [],
  templateUrl: './canvas-box.component.html',
  styleUrl: './canvas-box.component.scss',
})
export class CanvasBoxComponent {
  @ViewChild('rendererContainer')
  rendererContainer!: ElementRef<HTMLDivElement>;

  constructor() {}

  ngAfterViewInit() {
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    const material = new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0x111111,
      shininess: 200,
    });

    // const material = new THREE.MeshToonMaterial();

    const loader = new STLLoader();

    loader.load(
      'assets/models/example.stl',
      function (geometry) {
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      },
      xhr => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      error => {
        console.log(error);
      }
    );

    const stats = new Stats();
    document.body.appendChild(stats.dom);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      stats.update();
    }

    animate();
  }
}
