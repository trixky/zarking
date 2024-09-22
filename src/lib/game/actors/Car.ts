import * as THREE from "three";
import { Actor } from "../generic/Actor";
import type { Collider, ColliderDesc, ImpulseJoint, PrismaticImpulseJoint, RevoluteImpulseJoint, RigidBody, RigidBodyDesc, Rotation, SphericalImpulseJoint, World } from "@dimforge/rapier3d";
import type { Physic } from "../rapier";
import type { Vector } from "@dimforge/rapier3d";

const carSupportCoords: Array<{ x: number, z: number }> = [
    { x: 1, z: 1 }, // front right 0
    { x: -1, z: 1 }, // front left 1
    { x: -1, z: -1 }, // back left 2
    { x: 1, z: -1 }, // back right 3
]

// ----------------------------- suspensions
const suspensionSizeX = 0.2;
const suspensionSizeY = 0.4;
const suspensionSizeZ = 0.2;

const suspensionRelativePositionX = -0.8;
const suspensionRelativePositionY = 0.5;
const suspensionRelativePositionZ = -1.2;

// ----------------------------- wheel directions
const wheelDirectionSizeHalfHeight = 0.15;
const wheelDirectionSizeRadius = 0.25;

const wheelDirectionRelativePositionX = -0.2;
const wheelDirectionRelativePositionY = -0.5;
const wheelDirectionRelativePositionZ = 0;

// ----------------------------- wheel directions
const wheelSizeHalfHeight = wheelDirectionSizeRadius;
const wheelSizeRadius = wheelDirectionSizeRadius * 2;

interface CarPhysicPart {
    body: RigidBody | null;
    collider: Collider | null;
    joint: ImpulseJoint | null;
}

type CarPhysicGroupPart = Array<CarPhysicPart>;

interface CarPhysicParts {
    chassis: CarPhysicPart,
    suspensions: CarPhysicGroupPart,
    wheelDirections: CarPhysicGroupPart,
    wheels: CarPhysicGroupPart,
}

export class Car extends Actor {
    // ------------------------------------------------------------- PROPERTIES
    // --------------------- static
    // private static geometry = new THREE.CapsuleGeometry(1, 1, 8, 16)
    // private static material = new THREE.MeshStandardMaterial({ color: 0x69fffc, wireframe: true});
    // private static _lookAtRelativePosition: THREE.Vector3 = new THREE.Vector3(0, 1, -10);

    // --------------------- private
    private _lookAtAbsolutePosition: THREE.Vector3 = new THREE.Vector3();
    private _physicParts: CarPhysicParts | null = null;

    // --------------------- protected
    // --------------------- public

    // ============================================================= CONSTRUCTOR
    constructor() {
        super();

        this.position.y = 2;
        this.position.z = 0;
        this.position.x = 0;
        this.rotation.z = 0.5;
        this.rotation.order = 'YXZ';
    }

    // ============================================================= PRIVATE


    private initSuspensionsPhysic = (physic: Physic, physicalChassisBody: RigidBody): CarPhysicGroupPart => {
        return carSupportCoords.map((coords) => {
            // *** body
            const physicalSuspensionBodyDesc = physic.engine.RigidBodyDesc.dynamic()
            physicalSuspensionBodyDesc.setTranslation(this.position.x + (suspensionRelativePositionX * coords.x), this.position.y + suspensionRelativePositionY, this.position.z + (suspensionRelativePositionZ * coords.z))
            const physicalSuspensionBody = physic.world.createRigidBody(physicalSuspensionBodyDesc);

            // *** collider
            const physicalSuspensionColliderDesc = physic.engine.ColliderDesc.cuboid(suspensionSizeX, suspensionSizeY, suspensionSizeZ)
            const physicalSuspensionCollider = physic.world.createCollider(physicalSuspensionColliderDesc, physicalSuspensionBody)
            physicalSuspensionCollider.setCollisionGroups(0x00010002)
            // *** joint
            const joinData = physic.engine.JointData.prismatic(
                { x: suspensionRelativePositionX * coords.x, y: suspensionRelativePositionY, z: suspensionRelativePositionZ * coords.z },
                { x: 0, y: 0, z: 0 },
                { x: 0, y: -1, z: 0 }
            );
            joinData.limitsEnabled = true;
            joinData.limits = [0, 0.5]
            const phsyicalSuspensionJoint = physic.world.createImpulseJoint(joinData, physicalChassisBody!, physicalSuspensionBody!, true) as PrismaticImpulseJoint;
            phsyicalSuspensionJoint.setContactsEnabled(false);
            phsyicalSuspensionJoint.configureMotorPosition(0.5, 2000.0, 100.0);

            return <CarPhysicPart>{ body: physicalSuspensionBody, collider: physicalSuspensionCollider, joint: phsyicalSuspensionJoint }
        })
    }

    private initWheelDirectionsPhysic = (physic: Physic, physicalChassisBody: RigidBody, carPhysicSuspensions: CarPhysicGroupPart): CarPhysicGroupPart => {
        // *** body
        return carSupportCoords.map((coords, index) => {
            const physicalWheelDirectionBodyDesc = physic.engine.RigidBodyDesc.dynamic()
            physicalWheelDirectionBodyDesc.setTranslation(this.position.x + (suspensionRelativePositionX + wheelDirectionRelativePositionX * coords.x), this.position.y + suspensionRelativePositionY + wheelDirectionRelativePositionY, this.position.z + (suspensionRelativePositionZ + wheelDirectionRelativePositionZ * coords.z))
            const physicalWheelDirectionBody = physic.world.createRigidBody(physicalWheelDirectionBodyDesc);
            // *** collider
            const physicalWheelDirectionColliderDesc = physic.engine.ColliderDesc.cylinder(wheelDirectionSizeHalfHeight, wheelDirectionSizeRadius)
            const physicalWheelDirectionCollider = physic.world.createCollider(physicalWheelDirectionColliderDesc, physicalWheelDirectionBody)
            physicalWheelDirectionCollider.setCollisionGroups(0x00010002)
            // *** joint
            const jointDataDir = physic.engine.JointData.revolute(
                { x: wheelDirectionRelativePositionX * coords.x, y: wheelDirectionRelativePositionY, z: wheelDirectionRelativePositionZ * coords.z },
                { x: 0, y: 0, z: 0 },
                { x: 0, y: 1, z: 0 }
            );
            const jointDir = physic.world.createImpulseJoint(jointDataDir, carPhysicSuspensions[index].body!, physicalWheelDirectionBody, true) as RevoluteImpulseJoint;
            jointDir.setContactsEnabled(false);

            return <CarPhysicPart>{ body: physicalWheelDirectionBody, collider: physicalWheelDirectionCollider, joint: jointDir }
        });
    }

    private initWheelsPhysic = (physic: Physic, physicalChassisBody: RigidBody, carPhysicWheelDirections: CarPhysicGroupPart): CarPhysicGroupPart => {
        // *** body
        return carSupportCoords.map((coords, index) => {
            const physicalWheelBodyDesc = physic.engine.RigidBodyDesc.dynamic()
            physicalWheelBodyDesc.setTranslation(this.position.x + (suspensionRelativePositionX + wheelDirectionRelativePositionX * coords.x), this.position.y + suspensionRelativePositionY + wheelDirectionRelativePositionY, this.position.z + (suspensionRelativePositionZ + wheelDirectionRelativePositionZ * coords.z))
            const physicalWheelBody = physic.world.createRigidBody(physicalWheelBodyDesc);
            // *** collider
            const physicalWheelOrientation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2))
            const physicalWheelColliderDesc = physic.engine.ColliderDesc.cylinder(wheelSizeHalfHeight, wheelSizeRadius)
            physicalWheelColliderDesc.setRotation(physicalWheelOrientation);
            const physicalWheelCollider = physic.world.createCollider(physicalWheelColliderDesc, physicalWheelBody)
            physicalWheelCollider.setCollisionGroups(0x00010002)
            // *** joint
            const jointData = physic.engine.JointData.revolute(
                { x: 0, y: 0, z: 0 } as Vector,
                { x: 0, y: 0, z: 0 } as Vector,
                { x: -1, y: 0, z: 0 } as Vector
            );
            jointData.limitsEnabled = true;
            const joint = physic.world.createImpulseJoint(jointData, carPhysicWheelDirections[index].body!, physicalWheelBody!, true) as RevoluteImpulseJoint;
            joint.setContactsEnabled(false);

            return <CarPhysicPart>{ body: physicalWheelBody, collider: physicalWheelCollider, joint: joint }
        })
    }

    // ============================================================= PUBLIC
    public init(physic: Physic): void {
        // ---------------- car chassis
        // *** body
        const physicalChassisBodyDesc = physic.engine.RigidBodyDesc.dynamic()

        physicalChassisBodyDesc.setTranslation(this.position.x, this.position.y, this.position.z)
        const physicalChassisBody = physic.world.createRigidBody(physicalChassisBodyDesc);
        // *** collider
        const physicalChassisColliderDesc = physic.engine.ColliderDesc.cuboid(1, 0.3, 1.8);
        const physicalChassisCollider = physic.world.createCollider(physicalChassisColliderDesc, physicalChassisBody);
        physicalChassisCollider.setCollisionGroups(0x00010002)
        physicalChassisCollider.setEnabled(false);

        // ---------------- car suspensions
        const carPhysicSuspensions = this.initSuspensionsPhysic(physic, physicalChassisBody);
        // ---------------- car wheelDirections
        const carPhysicWheelDirections = this.initWheelDirectionsPhysic(physic, physicalChassisBody, carPhysicSuspensions);
        // ---------------- car wheels
        const carPhysicWheels = this.initWheelsPhysic(physic, physicalChassisBody, carPhysicWheelDirections);
        (carPhysicWheelDirections[0].joint! as RevoluteImpulseJoint).configureMotorPosition(-0.5, 100000.0, 100.0);
        (carPhysicWheelDirections[1].joint! as RevoluteImpulseJoint).configureMotorPosition(-0.5, 100000.0, 100.0);
        (carPhysicWheelDirections[2].joint! as RevoluteImpulseJoint).configureMotorPosition(0, 100000.0, 100.0);
        (carPhysicWheelDirections[3].joint! as RevoluteImpulseJoint).configureMotorPosition(0, 100000.0, 100.0);
        (carPhysicWheels[2].joint! as RevoluteImpulseJoint).configureMotorVelocity(30.0, 100);
        (carPhysicWheels[3].joint! as RevoluteImpulseJoint).configureMotorVelocity(30.0, 100);


        this._physicParts = {
            chassis: { body: physicalChassisBody, collider: physicalChassisCollider, joint: null },
            suspensions: carPhysicSuspensions,
            wheelDirections: carPhysicWheelDirections,
            wheels: carPhysicWheels
        } as unknown as CarPhysicParts;

        setTimeout(() => {
            physicalChassisCollider.setEnabled(true);
        }, 1000);

    }

    // Update the player
    public update(delta: number): void {
        super.update(delta);
        this.position.copy(this._physicParts!.chassis.body?.translation() as THREE.Vector3Like);
        this.quaternion.copy(this._physicParts!.chassis.body?.rotation() as THREE.Quaternion);
        this.updateMatrixWorld();
    }

    get lookAtAbsolutePosition(): THREE.Vector3 {
        return this._lookAtAbsolutePosition;
    }

    public destroy(): void {

    }
}