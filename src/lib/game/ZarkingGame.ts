import { Player } from './actors/Soldier';
import { Floor } from './actors/Floor';
import { Game } from './generic/Game';
import { AmbiantLight } from './actors/AmbiantLight';
import { DirectionalLight } from './actors/DirectionalLight';
import { getRapier, type Physic, type RAPIER } from './rapier';
import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, Vector3 } from 'three';
import { Car } from './actors/Car';



export class ZarkingGame extends Game {

    private _physic: Physic | undefined = undefined;
    private _player: Player;
    private _car: Car;
    private _floor: Floor;
    private _ambientLight: AmbiantLight;
    private _directionalLight: DirectionalLight;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this._player = new Player();
        this._car = new Car();
        this._floor = new Floor();
        this._ambientLight = new AmbiantLight();
        this._directionalLight = new DirectionalLight();
    }

    private async _initPhysicalWorld(): Promise<void> {
        const RAPIER = await getRapier();

        // Use the RAPIER module here.
        const physicalWorld = new RAPIER.World(Game._gravity);
        physicalWorld.timestep = 1 / 60;
        this._physic = {
            engine: RAPIER,
            world: physicalWorld,
            stepDebt: 0,
            debugMeshe: new LineSegments(new BufferGeometry(), new LineBasicMaterial({ color: 0xffffff, vertexColors: true }))
        };
    }

    override async init() {
        super.init('environment/Starfield_Free/StudioHDR_2_StarField_01_2K.hdr');

        await this._initPhysicalWorld();
        this._player.init(this._physic!);
        this._car.init(this._physic!);
        this._floor.init(this._physic!);
        this._ambientLight.init();
        this._directionalLight.init();

        this._scene.add(this._car);
        this._scene.add(this._player);
        this._scene.add(this._floor);
        this._scene.add(this._ambientLight);
        this._scene.add(this._directionalLight);

        this._scene.add(this._physic!.debugMeshe);

        this._camera
    }

    protected _loop = (delta: number) => {
        this._physic!.stepDebt += delta / this._physic!.world.timestep
        const physicStepsToDo = Math.floor(this._physic!.stepDebt)
        this._physic!.stepDebt -= physicStepsToDo
        for (let i = 0; i < physicStepsToDo; i++)
            this._physic!.world.step();

        const physicDebugRender = this._physic?.world.debugRender()
      this._physic?.debugMeshe.geometry.setAttribute('position', new BufferAttribute(physicDebugRender!.vertices, 3))
      this._physic?.debugMeshe.geometry.setAttribute('color', new BufferAttribute(physicDebugRender!.colors, 4))

        this._car.update(delta);
        this._player.update(delta);

        const rotationYAngleFromEuler: Vector3 = new Vector3().setFromEuler(this._player!.rotation);

        // this._camera.position.x = this._player!.position.x + Math.sin(rotationYAngleFromEuler.y) * 5;
        // this._camera.position.y = this._player!.position.y + 1;
        // this._camera.position.z = this._player!.position.z + Math.cos(rotationYAngleFromEuler.y) * 5;
        // this._camera.lookAt(this._player.position);
        // this._camera.lookAt(this._player!.lookAtAbsolutePosition);
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