export type ShapeCategory = '2d-solid' | '2d-dashed' | '3d';

export interface ShapeDef {
  id: string;
  label: string;
  hint: string;
  category: ShapeCategory;
  width: number;
  height: number;
}

interface Shape2DBase {
  id: string;
  label: string;
  hint: string;
  w: number;
  h: number;
}

const SHAPES_2D_BASE: Shape2DBase[] = [
  { id: 'rect', label: '▭', hint: 'Ristkülik', w: 160, h: 100 },
  { id: 'square', label: '□', hint: 'Ruut', w: 120, h: 120 },
  { id: 'circle', label: '○', hint: 'Ring', w: 120, h: 120 },
  { id: 'ellipse', label: '⬭', hint: 'Ellips', w: 160, h: 100 },
  { id: 'triangle', label: '△', hint: 'Kolmnurk', w: 140, h: 120 },
  { id: 'triangle-right', label: '◣', hint: 'Täisnurkne kolmnurk', w: 140, h: 120 },
  { id: 'parallelogram', label: '▱', hint: 'Rööpkülik', w: 160, h: 100 },
  { id: 'trapezoid', label: '⏢', hint: 'Trapets', w: 160, h: 100 },
  { id: 'rhombus', label: '◇', hint: 'Romb', w: 140, h: 120 },
  { id: 'pentagon', label: '⬠', hint: 'Viisnurk', w: 130, h: 130 },
  { id: 'hexagon', label: '⬡', hint: 'Kuusnurk', w: 140, h: 120 },
];

const SHAPES_3D_BASE: Shape2DBase[] = [
  { id: 'cube', label: '⬛', hint: 'Kuup', w: 160, h: 140 },
  { id: 'cuboid', label: '▰', hint: 'Risttahukas', w: 200, h: 130 },
  { id: 'pyramid', label: '◮', hint: 'Püramiid (ruudukujuline alus)', w: 160, h: 140 },
  { id: 'tetrahedron', label: '▲', hint: 'Tetraeeder', w: 140, h: 140 },
  { id: 'prism', label: '◭', hint: 'Kolmnurkne prisma', w: 180, h: 140 },
  { id: 'cylinder', label: '⌭', hint: 'Silinder', w: 140, h: 170 },
  { id: 'cone', label: '▽', hint: 'Koonus', w: 140, h: 170 },
  { id: 'sphere', label: '●', hint: 'Kera', w: 140, h: 140 },
];

const SHAPES_2D_SOLID: ShapeDef[] = SHAPES_2D_BASE.map((s) => ({
  id: `${s.id}-solid`,
  label: s.label,
  hint: s.hint,
  category: '2d-solid',
  width: s.w,
  height: s.h,
}));

const SHAPES_2D_DASHED: ShapeDef[] = SHAPES_2D_BASE.map((s) => ({
  id: `${s.id}-dashed`,
  label: s.label,
  hint: `${s.hint} (punktiir)`,
  category: '2d-dashed',
  width: s.w,
  height: s.h,
}));

const SHAPES_3D: ShapeDef[] = SHAPES_3D_BASE.map((s) => ({
  id: s.id,
  label: s.label,
  hint: s.hint,
  category: '3d',
  width: s.w,
  height: s.h,
}));

export const SHAPES: readonly ShapeDef[] = [
  ...SHAPES_2D_SOLID,
  ...SHAPES_2D_DASHED,
  ...SHAPES_3D,
];

export const SHAPE_MAP: ReadonlyMap<string, ShapeDef> = new Map(
  SHAPES.map((s) => [s.id, s]),
);

export function getShapesByCategory(category: ShapeCategory): ShapeDef[] {
  return SHAPES.filter((s) => s.category === category);
}

export function is2DShapeId(id: string): { base: string; dashed: boolean } | null {
  if (id.endsWith('-solid')) return { base: id.slice(0, -'-solid'.length), dashed: false };
  if (id.endsWith('-dashed')) return { base: id.slice(0, -'-dashed'.length), dashed: true };
  return null;
}

