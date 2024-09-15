import * as THREE from "three";
import { Actor } from "../generic/Actor";

export class Floor extends Actor {
    // ------------------------------------------------------------- PROPERTIES
    // --------------------- static
    private static geometry = new THREE.PlaneGeometry(20, 20, 1, 1).rotateX(-Math.PI / 2);
    private static material = new THREE.MeshStandardMaterial({ color: 0x222222 });

    // --------------------- private
    // --------------------- protected
    // --------------------- public

    // ============================================================= CONSTRUCTOR
    constructor() {
        super();

        const floor = new THREE.Mesh(Floor.geometry, Floor.material);
        floor.receiveShadow = true;
        this.add(floor);
    }

    // ============================================================= PRIVATE
    // ============================================================= PUBLIC
    public init(): void {

    }

    public destroy(): void {

    }
}