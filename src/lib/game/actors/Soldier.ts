import * as THREE from "three";
import { Actor } from "../generic/Actor";
import type { Collider, ColliderDesc, RigidBody, RigidBodyDesc, World } from "@dimforge/rapier3d";
import type { Physic } from "../rapier";

const RADIUS = 0.45;
const HEIGHT = RADIUS * 2;

export class Player extends Actor {
    // ------------------------------------------------------------- PROPERTIES
    // --------------------- static
    private static geometry = new THREE.CapsuleGeometry(RADIUS, HEIGHT, 8, 16)
    private static material = new THREE.MeshStandardMaterial({ color: 0x42f58d, wireframe: false});
    private static _lookAtRelativePosition: THREE.Vector3 = new THREE.Vector3(0, 1, -10);

    // --------------------- private
    private _lookAtAbsolutePosition: THREE.Vector3 = new THREE.Vector3();
    private _physicalBodyDesc: RigidBodyDesc | null = null;
    private _physicalBody: RigidBody | null = null;
    private _physicalColliderDesc: ColliderDesc | null = null;
    private _physicalCollider: Collider | null = null;

    // --------------------- protected
    // --------------------- public

    // ============================================================= CONSTRUCTOR
    constructor() {
        super();

        const capsule = new THREE.Mesh(Player.geometry, Player.material);
        capsule.castShadow = true;
        this.position.y = 4;
        this.position.z = -4;
        this.position.x = 4;
        // this.rotation.z = 0.2;
        this.add(capsule);
        this.rotation.order = 'YXZ';
        this._computeLookAt();
    }

    // ============================================================= PRIVATE
    private _computeLookAt(): void {
        this._lookAtAbsolutePosition = this.position.clone().add(Player._lookAtRelativePosition);
    }

    // ============================================================= PUBLIC
    public init(physic: Physic): void {
        // Create a dynamic rigid-body.
        this._physicalBodyDesc = physic.engine.RigidBodyDesc.dynamic();
        this._physicalBodyDesc.setTranslation(this.position.x, this.position.y, this.position.z);
        this._physicalBodyDesc.setRotation({x: this.rotation.x, y: this.rotation.y, z: this.rotation.z, w: 1});

        this._physicalBody = physic.world.createRigidBody(this._physicalBodyDesc);
        this._physicalBody.setEnabledRotations(false, true, false, true);
        // this._physicalBody?.lockRotations(true, true);

        // Create a cuboid collider attached to the dynamic rigidBody.
        this._physicalColliderDesc = physic.engine.ColliderDesc.capsule(HEIGHT / 2, RADIUS);
        this._physicalCollider = physic.world.createCollider(this._physicalColliderDesc, this._physicalBody);
    }

    // Update the player
    public update(delta: number): void {
        super.update(delta);

        // this._physicalBody?.applyTorqueImpulse({x: 0, y: 1, z: 0}, true);
        // this._physicalBody?.
        // apply impule in rotation axe y
        // this._physicalBody?.applyTorqueImpulse({x: 0, y: 0.01, z: 0}, true);
        // this._physicalBody?.setAngvel({x: 0, y: 0.3, z: 0}, true);

// update to yxz the priority of the rotation

        this.position.copy(this._physicalBody?.translation() as THREE.Vector3Like);
        this.quaternion.copy(this._physicalBody?.rotation() as THREE.Quaternion);
        this.updateMatrixWorld();
    }

    get lookAtAbsolutePosition(): THREE.Vector3 {
        return this._lookAtAbsolutePosition;
    }

    public destroy(): void {

    }
}