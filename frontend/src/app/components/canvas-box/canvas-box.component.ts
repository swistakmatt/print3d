import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  Input,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-canvas-box',
  standalone: true,
  imports: [],
  templateUrl: './canvas-box.component.html',
  styleUrl: './canvas-box.component.scss',
})
export class CanvasBoxComponent implements AfterViewInit {
  @Input() stlFileUrl!: string;
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef<HTMLDivElement>;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private scene!: THREE.Scene;
  // private stats!: Stats;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.initLights();
    this.loadSTLModel(this.stlFileUrl);

    // this.stats = new Stats();
    // document.body.appendChild(this.stats.dom);

    this.animate();
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AxesHelper(5));
  }

  private initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 4;
  }

  private initRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  private initLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 3.0);
    this.scene.add(ambientLight);

    // Directional light 1
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 4.0);
    directionalLight1.position.set(5, 10, 7.5);
    directionalLight1.castShadow = true;
    this.scene.add(directionalLight1);

    // Directional light 2
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4.0);
    directionalLight2.position.set(-5, -10, -7.5);
    directionalLight2.castShadow = true;
    this.scene.add(directionalLight2);

    // Point light for more brightness
    const pointLight = new THREE.PointLight(0xffffff, 1.5, 50);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    // Hemisphere light for a softer overall lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5.0);
    hemisphereLight.position.set(0, 20, 0);
    this.scene.add(hemisphereLight);
  }

  private loadSTLModel(stlFileUrl?: string) {
    const loader = new STLLoader();

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xb2b2b2,
      metalness: 0.7,
      roughness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.8,
      sheen: 0.5,
    });

    if (stlFileUrl) {
      const request = new XMLHttpRequest();
      request.open('GET', stlFileUrl, true);

      request.setRequestHeader(
        'Authorization',
        `Bearer ${this.authService.currentUserValue?.token}`
      );

      request.responseType = 'arraybuffer';

      request.onload = () => {
        if (request.status === 200) {
          const geometry = loader.parse(request.response);

          const mesh = new THREE.Mesh(geometry, material);
          this.updateCameraPosition(mesh);
          this.scene.add(mesh);
        } else {
          console.error('Failed to load STL file:', request.statusText);
        }
      };

      request.onerror = () => {
        console.error('There was a network error.');
      };

      request.send();
    } else {
      loader.load('assets/models/print3d.stl', geometry => {
        const mesh = new THREE.Mesh(geometry, material);
        this.updateCameraPosition(mesh);
        this.scene.add(mesh);
      });
    }
  }

  private updateCameraPosition(mesh: THREE.Mesh) {
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5;
    this.camera.position.set(
      // center.x + cameraZ,
      // center.y + cameraZ,
      center.x,
      center.y,
      center.z + cameraZ
    );
    this.camera.lookAt(center);
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    // this.stats.update();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
