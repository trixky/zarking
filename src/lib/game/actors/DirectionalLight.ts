import * as THREE from "three";
import { Actor } from "../generic/Actor";

export class DirectionalLight extends Actor {
    // ------------------------------------------------------------- PROPERTIES
    // --------------------- static
    private _light: THREE.DirectionalLight;
    // --------------------- private
    // --------------------- protected
    // --------------------- public

    // ============================================================= CONSTRUCTOR
    constructor() {
        super();

        this._light = new THREE.DirectionalLight(0xffffff, 0.5);
        this._light.position.set(0, 5, 0);
        // increase the shadow zone 
        this._light.shadow.camera.top = 10;
        this._light.shadow.camera.bottom = -10;
        this._light.shadow.camera.left = -10;
        this._light.shadow.camera.right = 10;
        this._light.shadow.camera.near = 0.1;
        this._light.shadow.camera.far = 10;

        // camera helper
        // const helper = new THREE.CameraHelper(this._light.shadow.camera);
        // this.add(helper);

        this.add(this._light);
    }

    // ============================================================= PRIVATE
    // ============================================================= PUBLIC
    public init(): void {
        this._light.castShadow = true;
    }

    public destroy(): void {
        this._light.dispose();
    }
}