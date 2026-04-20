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

export interface Annotated {
  x: number;
  y: number;
  label: string;
  nx: number;
  ny: number;
}

const VERTEX_LETTERS = 'ABCDEFGHIJKL';
const EDGE_LETTERS = 'abcdefghijkl';

function normalize(x: number, y: number): [number, number] {
  const m = Math.hypot(x, y);
  if (m < 1e-6) return [0, -1];
  return [x / m, y / m];
}

function fromPolygon(points: readonly [number, number][], cx: number, cy: number): {
  vertices: Annotated[];
  edges: Annotated[];
} {
  const vertices = points.map((p, i) => {
    const [nx, ny] = normalize(p[0] - cx, p[1] - cy);
    return { x: p[0], y: p[1], label: VERTEX_LETTERS[i] ?? '', nx, ny };
  });
  const edges = points.map((p, i) => {
    const q = points[(i + 1) % points.length];
    const mx = (p[0] + q[0]) / 2;
    const my = (p[1] + q[1]) / 2;
    const [nx, ny] = normalize(mx - cx, my - cy);
    return { x: mx, y: my, label: EDGE_LETTERS[i] ?? '', nx, ny };
  });
  return { vertices, edges };
}

function regularPolygon(n: number, w: number, h: number): [number, number][] {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    pts.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)]);
  }
  return pts;
}

function getPolygon2D(base: string, w: number, h: number): [number, number][] | null {
  switch (base) {
    case 'rect':
    case 'square':
      return [[0, 0], [w, 0], [w, h], [0, h]];
    case 'triangle':
      return [[w / 2, 0], [w, h], [0, h]];
    case 'triangle-right':
      return [[0, 0], [w, h], [0, h]];
    case 'parallelogram':
      return [[w * 0.25, 0], [w, 0], [w * 0.75, h], [0, h]];
    case 'trapezoid':
      return [[w * 0.22, 0], [w * 0.78, 0], [w, h], [0, h]];
    case 'rhombus':
      return [[w / 2, 0], [w, h / 2], [w / 2, h], [0, h / 2]];
    case 'pentagon':
      return regularPolygon(5, w, h);
    case 'hexagon':
      return regularPolygon(6, w, h);
    default:
      return null;
  }
}

function boxPoints(w: number, h: number): [number, number][] {
  const d = Math.min(w, h) * 0.22;
  const dy = d * 0.8;
  return [
    [0, dy],          // TL (top front-left of top face)
    [w - d, dy],      // TR
    [w - d, h],       // FR (front bottom-right)
    [0, h],           // FL
    [d, 0],           // BTL (back top-left)
    [w, 0],           // BTR
    [w, h - dy],      // BR (back bottom-right, visible)
    [d, h - dy],      // BL (hidden back-bottom-left)
  ];
}

export function getShapeAnnotations(shapeId: string, w: number, h: number): {
  vertices: Annotated[];
  edges: Annotated[];
} {
  const cx = w / 2;
  const cy = h / 2;
  const twoD = is2DShapeId(shapeId);
  if (twoD) {
    if (twoD.base === 'circle' || twoD.base === 'ellipse') {
      return { vertices: [], edges: [] };
    }
    const poly = getPolygon2D(twoD.base, w, h);
    if (!poly) return { vertices: [], edges: [] };
    return fromPolygon(poly, cx, cy);
  }
  switch (shapeId) {
    case 'cube':
    case 'cuboid':
      return fromPolygon(boxPoints(w, h), cx, cy);
    case 'pyramid': {
      const d = w * 0.22;
      const dy = h * 0.18;
      const pts: [number, number][] = [
        [(0 + w) / 2, 0],  // A (apex)
        [0, h],            // FL
        [w - d, h],        // FR
        [w, h - dy],       // BR
        [d, h - dy],       // BL
      ];
      return fromPolygon(pts, cx, cy);
    }
    case 'tetrahedron': {
      const dy = h * 0.18;
      const pts: [number, number][] = [
        [w / 2, 0],        // A (apex)
        [w / 2, h],        // F (front bottom)
        [w, h - dy],       // BR
        [0, h - dy],       // BL
      ];
      return fromPolygon(pts, cx, cy);
    }
    case 'prism': {
      const d = w * 0.22;
      const dy = h * 0.18;
      const pts: [number, number][] = [
        [(w - d) / 2, dy],          // FA
        [0, h],                      // FL
        [w - d, h],                  // FR
        [(w - d) / 2 + d, 0],        // BA
        [d, h - dy],                 // BL
        [w, h - dy],                 // BR
      ];
      return fromPolygon(pts, cx, cy);
    }
    default:
      return { vertices: [], edges: [] };
  }
}
