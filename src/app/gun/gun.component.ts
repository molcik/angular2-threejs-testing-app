import {Component, ViewChild, AfterViewInit, HostListener} from '@angular/core';
import {
  WebGLRenderer, Scene, PerspectiveCamera, PointLight, AmbientLight,  ObjectLoader
} from "three";

@Component({
  selector: 'app-gun',
  templateUrl: 'gun.component.html',
  styleUrls: ['gun.component.scss']
})
export class GunComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas;
  @ViewChild('bulletHole') public bulletHole;
  private _renderer: WebGLRenderer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _obj;



  ngAfterViewInit() {
    this.scene();
    this.lights();
    this.gun();
    this.render();
  }

  lights() {
    this._scene.add(this.light(2,2,2));
    this._scene.add(this.light(-2,2,2));
    var ambientLght = new AmbientLight(0xFFFFFFF);
    ambientLght.intensity = 1;
    this._scene.add(ambientLght);
  }

  scene() {
    this._renderer = new WebGLRenderer({
      canvas: this.canvas.nativeElement,
      antialias:true
    });
    this._scene = new Scene();
    this._camera = new PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 100);
    this._camera.position.z = 15;
    this._renderer.setClearColor("whitesmoke");
    this._renderer.setSize( window.innerWidth, window.innerHeight)
  }

  gun() {
    var loader = new ObjectLoader();
    loader.load('assets/gun/gun.json',
      ( o ) => {
        this._obj = o;
        this._scene.add( o );
        o.position.set(0, 0, -4.5);
        o.rotation.x = 0.2;
        o.rotation.y = 140 * Math.PI / 180;
        o.scale.z = 0.12;
        o.scale.y = 0.12;
        o.scale.x = 0.12;
        this.render();
      }
    )
  }

  light(x, y, z) {
    var light = new PointLight(0xfffffff);
    light.intensity = 0.3;
    light.distance = 10000;
    light.position.set(2,2,2);
    return light;
  }


  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (!this._obj) {
      return
    }
    var obj = this._obj;
    obj.position.x = (event.clientX - window.innerWidth / 2) / 100;
    obj.position.y = (window.innerHeight / 2 - event.clientY) / 100;
    obj.rotation.x = ((event.clientY - window.innerHeight / 2) / (window.innerHeight / 2) * 15) * Math.PI / 180 + 0.2;
    obj.rotation.y = ((event.clientX - window.innerWidth / 2) / (window.innerWidth / 2) * 15) * Math.PI / 180 - 140 * Math.PI / 180;
    this.render();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.fireSound();
    setTimeout(() => {
      this.buletHole(event.clientX, event.clientY);
      this.glassSound();
        this._obj.rotation.x = (-20 * Math.PI / 180)
        this._obj.position.z = -4;
        this.render();
        setTimeout(() => {
          this.onMousemove(event);
        }, 100);
        setTimeout(() => {
          this.shellSound();
        }, 700);
    }, 200);
  }

  fireSound() {
    var fire = new Audio('assets/gun/fire.mp3');
    fire.play();
  }

  shellSound() {
    var shell = new Audio('assets/gun/shell.mp3');
    shell.play();
  }

  glassSound() {
    var glass = new Audio('assets/gun/glass.mp3');
    glass.play();
  }

  buletHole(x,y) {
    this.bulletHole.nativeElement.style.display = 'inherit';
    this.bulletHole.nativeElement.style.top = y - this.bulletHole.nativeElement.offsetHeight / 2 + 'px';
    this.bulletHole.nativeElement.style.left = x - this.bulletHole.nativeElement.offsetWidth / 2 + 'px';
  }

  render() {
    this._renderer.render(this._scene, this._camera);
  }


}
