import * as THREE from "three";
import { Actor } from "../generic/Actor";

export class AmbiantLight extends Actor {
    // ------------------------------------------------------------- PROPERTIES
    // --------------------- static
    // --------------------- private
    private _light: THREE.AmbientLight;
    // --------------------- protected
    // --------------------- public

    // ============================================================= CONSTRUCTOR
    constructor() {
        super();

        this._light = new THREE.AmbientLight(0xffffff, 0.5);
        this.add(this._light);
    }

    // ============================================================= PRIVATE
    // ============================================================= PUBLIC
    public init(): void {

    }

    public destroy(): void {

    }
}