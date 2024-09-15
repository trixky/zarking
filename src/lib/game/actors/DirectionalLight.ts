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

        this.add(this._light);
    }

    // ============================================================= PRIVATE
    // ============================================================= PUBLIC
    public init(): void {
        this._light.position.set(0.5, 1, 0.5);
        this._light.castShadow = true;
    }

    public destroy(): void {

    }
}