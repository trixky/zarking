import * as THREE from 'three';
import { Player } from './actors/Player';
import { Floor } from './actors/Floor';
import { Game } from './generic/Game';
import { AmbiantLight } from './actors/AmbiantLight';
import { DirectionalLight } from './actors/DirectionalLight';
import { getRapier } from './rapier';

export class ZarkingGame extends Game {
    private _player: Player;
    private _floor: Floor;
    private _ambientLight: AmbiantLight;
    private _directionalLight: DirectionalLight;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this._player = new Player();
        this._floor = new Floor();
        this._ambientLight = new AmbiantLight();
        this._directionalLight = new DirectionalLight();
        this._initRapier();
    }

    private async _initRapier(): Promise<void> {
        const RAPIER = await getRapier();

        // Use the RAPIER module here.
        let gravity = { x: 0.0, y: -9.81, z: 0.0 };
        let world = new RAPIER.World(gravity);

        // Create the ground
        let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
        world.createCollider(groundColliderDesc);

        // Create a dynamic rigid-body.
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0.0, 1.0, 0.0);
        let rigidBody = world.createRigidBody(rigidBodyDesc);

        // Create a cuboid collider attached to the dynamic rigidBody.
        let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
        let collider = world.createCollider(colliderDesc, rigidBody);

        world.step()
        world.step()
        world.step()
        world.step()
        world.step()

        let position = rigidBody.translation();
        console.log("Rigid-body position: ", position.x, position.y);

        world.step()
        world.step()
        world.step()
        world.step()
        world.step()

        position = rigidBody.translation();
        console.log("1 Rigid-body position: ", position.x, position.y);

        world.step()
        world.step()
        world.step()
        world.step()
        world.step()

        position = rigidBody.translation();
        console.log("2 Rigid-body position: ", position.x, position.y);
        world.step()
        world.step()
        world.step()
        world.step()
        world.step()

        position = rigidBody.translation();
        console.log("3 Rigid-body position: ", position.x, position.y);
        world.step()
        world.step()
        world.step()
        world.step()
        world.step()

        position = rigidBody.translation();
        console.log("4 Rigid-body position: ", position.x, position.y);
        
    }

    override init() {
        super.init();

        this._player.init();
        this._floor.init();
        this._ambientLight.init();
        this._directionalLight.init();

        this._scene.add(this._player);
        this._scene.add(this._floor);
        this._scene.add(this._ambientLight);
        this._scene.add(this._directionalLight);


    }

    protected _loop = (delta: number) => {
        this._player.update(delta);

        this._camera.position.z = this._player!.position.z + 6;
        this._camera.position.y = this._player!.position.y + 4;
        this._camera.lookAt(this._player!.lookAtAbsolutePosition);
    }

    public addUpdateHandler(handler: (game: ZarkingGame) => void): void {
        this._updateHandlers.push(handler);
    }

    public removeUpdateHandler(handler: (game: ZarkingGame) => void): void {
        const index = this._updateHandlers.indexOf(handler);
        if (index !== -1) this._updateHandlers.splice(index, 1)
        else throw new Error('Handler not found');
    }

    public destroy(): void {
        super.init();

        this._player.destroy();
        this._floor.destroy();
        this._ambientLight.destroy();
        this._directionalLight.destroy();
    }
}