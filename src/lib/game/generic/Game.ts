import * as THREE from 'three';

const MIN_PIXEL_RATIO = 2;
const MAX_PIXEL_RATIO = 3;

export abstract class Game {
    // ------------------------------------------------------------- PROPERTIES
    // --------------------- arguments
    protected _canvas: HTMLCanvasElement;


    // --------------------- static
    // --------------------- private
    // --------------------- protected
    protected _scene: THREE.Scene;
    protected _renderer: THREE.WebGLRenderer;
    protected _camera: THREE.PerspectiveCamera;
    protected _clock: THREE.Clock;

    protected _initialized: boolean;
    protected _pauseNextFrame: boolean;
    protected _updateHandlers: Array<(game: any) => void>;

    // --------------------- public

    // ============================================================= CONSTRUCTOR
    constructor(canvas: HTMLCanvasElement) {
        // --------------------- arguments
        this._canvas = canvas;

        // --------------------- properties
        this._scene = new THREE.Scene();
        this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas });
        this._renderer.shadowMap.enabled = true;
        this._camera = new THREE.PerspectiveCamera(75, this._canvas.width / this._canvas.height, 0.1, 100);
        this._clock = new THREE.Clock();

        this._initialized = false;
        this._pauseNextFrame = false;
        this._updateHandlers = [];

        // --------------------- threejs
        this._resize();
        window.addEventListener('resize', this._resize);

        this._camera.position.z = 3;
        this._scene.add(this._camera);

        console.debug('New game created');
    }

    // ============================================================= PRIVATE
    // Resize the renderer and camera when the window is resized
    private _resize = (): void => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ratio = width / height;
        const pixelRatio = window.devicePixelRatio;

        this._renderer.setSize(width, height);
        this._camera.aspect = ratio;
        this._camera.updateProjectionMatrix();
        this._renderer.setPixelRatio(Math.max(Math.min(pixelRatio, MAX_PIXEL_RATIO), MIN_PIXEL_RATIO));
    }

    // Check if the game is initialized
    // Must be called before any other method
    private _isInitialized(throwError: boolean = false): boolean {
        if (!this._initialized && throwError)
            throw new Error('Game is not initialized');
        return this._initialized;
    }

    // Execute all the update handlers
    private _exeucuteHandlers() {
        this._updateHandlers.forEach(handler => handler(this));
    }

    // The game loop
    protected abstract _loop: (delta: number) => void;


    // Update the game renderer according to the game loop
    private _update(loop: boolean = true) {
        if (this._pauseNextFrame) return;

        const detla = this._clock.getDelta();
        this._loop(detla);
        this._exeucuteHandlers();

        this._renderer.render(this._scene, this._camera);
        if (loop) requestAnimationFrame(() => this._update());
    }

    // ============================================================= PUBLIC
    // Initialize the game
    // This method should be called only once
    // And before any other method
    public init() {
        if (this._isInitialized(false))
            throw new Error('Game is already initialized');

        this._initialized = true;

        return console.debug('Game initialized');
    }

    // Start or resume the game loop
    public start() {
        this._isInitialized(true);
        this._clock.start();
        this._pauseNextFrame = false;
        this._update();

        return console.debug('Game started');
    }

    // Stop the game loop
    public stop() {
        this._isInitialized(true);
        this._clock.stop();
        this._pauseNextFrame = true;

        return console.debug('Game stoped');
    }

    // Destroy the game
    public destroy() {
        this.stop();
        // --------------------- events
        window.removeEventListener('resize', this._resize);

        // --------------------- threejs
        this._isInitialized(true);
        this._scene?.remove(...this._scene.children);
        this._renderer?.dispose();
        this._initialized = false;

        return console.debug('Game destroyed');
    }

    // Destroy the game and reinitialize it
    public reset() {
        this._isInitialized(true);
        this.destroy();
        this.init();

        return console.debug('Game reseted');
    }

    // Add a handler to the update loop
    public abstract addUpdateHandler(handler: (game: any) => void): void;
    // Remove a handler from the update loop
    public abstract removeUpdateHandler(handler: (game: any) => void): void;
}