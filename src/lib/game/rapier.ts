import type { World } from '@dimforge/rapier3d';
import type { LineSegments } from 'three';

export type RAPIER = typeof import('@dimforge/rapier3d');

export interface Physic {
  engine: RAPIER
  world: World
  stepDebt: number,
  debugMeshe: LineSegments,
}

export async function getRapier(): Promise<RAPIER> {
  // eslint-disable-next-line import/no-named-as-default-member
  const rapier = await import('@dimforge/rapier3d');

  return rapier;
}
