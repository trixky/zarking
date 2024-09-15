import * as THREE from "three";
import { Actor } from "../generic/Actor";

export class Player extends Actor {
    // ------------------------------------------------------------- PROPERTIES
    // --------------------- static
    private static geometry = new THREE.CapsuleGeometry(1, 1.5, 16, 32)
    private static material = new THREE.MeshStandardMaterial({ color: 0x69fffc });
    private static _lookAtRelativePosition: THREE.Vector3 = new THREE.Vector3(0, 1, -10);
    private _lookAtAbsolutePosition: THREE.Vector3 = new THREE.Vector3();

    // --------------------- private
    // --------------------- protected
    // --------------------- public

    // ============================================================= CONSTRUCTOR
    constructor() {
        super();

        const capsule = new THREE.Mesh(Player.geometry, Player.material);
        capsule.castShadow = true;
        this.position.y = 2.50;
        // this.position.y = 1.50;
        this.add(capsule);
        this._computeLookAt();
    }

    // ============================================================= PRIVATE
    private _computeLookAt(): void {
        this._lookAtAbsolutePosition = this.position.clone().add(Player._lookAtRelativePosition);
    }

    // ============================================================= PUBLIC
    public init(): void {

    }

    // Update the player
    public update(delta: number): void {
        super.update(delta);
    }

    get lookAtAbsolutePosition(): THREE.Vector3 {
        return this._lookAtAbsolutePosition;
    }

    public destroy(): void {

    }
}