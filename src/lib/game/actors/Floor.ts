import * as THREE from "three";
import { Actor } from "../generic/Actor";
import type { Physic } from "../rapier";

export class Floor extends Actor {
    // ------------------------------------------------------------- PROPERTIES
    // --------------------- static
    private static readonly _size = 18;
    private static readonly _deepth = 1;
    private static geometry = new THREE.PlaneGeometry(Floor._size, Floor._size, 1, 1).rotateX(-Math.PI / 2);
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
    public init(physic: Physic): void {
        // // Create the ground
        let groundColliderDesc = physic.engine.ColliderDesc.cuboid(Floor._size / 2, Floor._deepth, Floor._size / 2).setTranslation(0, -Floor._deepth, 0);
        let groundCollider = physic.world.createCollider(groundColliderDesc);
        groundCollider.setCollisionGroups(0x00020001)


    }

    public destroy(): void {

    }
}