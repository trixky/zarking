import { Object3D } from "three";

export abstract class PoolActor {
    // ------------------------------------------------------------- PROPERTIES
    // --------------------- static
    // --------------------- private
    // --------------------- protected
    // --------------------- public

    // ============================================================= CONSTRUCTOR
    constructor() {
    }

    // ============================================================= PUBLIC
    // Initialize the actor
    public abstract init(): void;

    // Update the actor
    public update(delta: number): void {

    }

    public abstract destroy(): void;
}