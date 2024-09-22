import type { World } from "@dimforge/rapier3d";
import { Object3D } from "three";
import type { Physic } from "../rapier";

export abstract class Actor extends Object3D {
    // ------------------------------------------------------------- PROPERTIES
    // --------------------- static
    // --------------------- private
    // --------------------- protected
    // --------------------- public

    // ============================================================= CONSTRUCTOR
    constructor() {
        super();
    }

    // ============================================================= PUBLIC
    // Initialize the actor
    public abstract init(physic?: Physic): void;

    // Update the actor
    public update(delta: number): void {

    }

    public abstract destroy(): void;
}