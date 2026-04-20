import type { ReactNode } from 'react';
import { Line, Ellipse, Group, Path } from 'react-konva';
import { is2DShapeId } from '@/lib/shapes';

const DASH: [number, number] = [8, 6];
const STROKE_WIDTH = 2.5;

interface Props {
  shapeId: string;
  width: number;
  height: number;
  color: string;
}

export default function ShapeRenderer({ shapeId, width, height, color }: Props) {
  const twoD = is2DShapeId(shapeId);
  if (twoD) return render2D(twoD.base, width, height, color, twoD.dashed);
  return render3D(shapeId, width, height, color);
}

function polygon(points: number[], color: string, dashed = false) {
  return (
    <Line
      points={points}
      closed
      stroke={color}
      strokeWidth={STROKE_WIDTH}
      dash={dashed ? DASH : undefined}
      lineJoin="round"
      listening={false}
    />
  );
}

function seg(x1: number, y1: number, x2: number, y2: number, color: string, dashed = false, key?: string) {
  return (
    <Line
      key={key}
      points={[x1, y1, x2, y2]}
      stroke={color}
      strokeWidth={STROKE_WIDTH}
      dash={dashed ? DASH : undefined}
      lineCap="round"
      listening={false}
    />
  );
}

function arcPath(data: string, color: string, dashed = false, key?: string) {
  return (
    <Path
      key={key}
      data={data}
      stroke={color}
      strokeWidth={STROKE_WIDTH}
      dash={dashed ? DASH : undefined}
      lineCap="round"
      listening={false}
    />
  );
}

function regularPolygon(n: number, w: number, h: number): number[] {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2;
  const ry = h / 2;
  const pts: number[] = [];
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    pts.push(cx + rx * Math.cos(angle), cy + ry * Math.sin(angle));
  }
  return pts;
}

function render2D(base: string, w: number, h: number, color: string, dashed: boolean): ReactNode {
  switch (base) {
    case 'rect':
    case 'square':
      return polygon([0, 0, w, 0, w, h, 0, h], color, dashed);
    case 'circle':
    case 'ellipse':
      return (
        <Ellipse
          x={w / 2}
          y={h / 2}
          radiusX={w / 2}
          radiusY={h / 2}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          dash={dashed ? DASH : undefined}
          listening={false}
        />
      );
    case 'triangle':
      return polygon([w / 2, 0, w, h, 0, h], color, dashed);
    case 'triangle-right':
      return polygon([0, 0, 0, h, w, h], color, dashed);
    case 'parallelogram':
      return polygon([w * 0.25, 0, w, 0, w * 0.75, h, 0, h], color, dashed);
    case 'trapezoid':
      return polygon([w * 0.22, 0, w * 0.78, 0, w, h, 0, h], color, dashed);
    case 'rhombus':
      return polygon([w / 2, 0, w, h / 2, w / 2, h, 0, h / 2], color, dashed);
    case 'pentagon':
      return polygon(regularPolygon(5, w, h), color, dashed);
    case 'hexagon':
      return polygon(regularPolygon(6, w, h), color, dashed);
    default:
      return null;
  }
}

function render3D(id: string, w: number, h: number, color: string): ReactNode {
  switch (id) {
    case 'cube':
    case 'cuboid':
      return renderBox(w, h, color);
    case 'pyramid':
      return renderPyramid(w, h, color);
    case 'tetrahedron':
      return renderTetrahedron(w, h, color);
    case 'prism':
      return renderPrism(w, h, color);
    case 'cylinder':
      return renderCylinder(w, h, color);
    case 'cone':
      return renderCone(w, h, color);
    case 'sphere':
      return renderSphere(w, h, color);
    default:
      return null;
  }
}

function renderBox(w: number, h: number, color: string): ReactNode {
  const d = Math.min(w, h) * 0.22;
  const dy = d * 0.8;
  const FL: [number, number] = [0, h];
  const FR: [number, number] = [w - d, h];
  const TR: [number, number] = [w - d, dy];
  const TL: [number, number] = [0, dy];
  const BL: [number, number] = [d, h - dy];
  const BR: [number, number] = [w, h - dy];
  const BTR: [number, number] = [w, 0];
  const BTL: [number, number] = [d, 0];
  return (
    <Group listening={false}>
      {seg(TL[0], TL[1], TR[0], TR[1], color, false, 'v1')}
      {seg(TR[0], TR[1], FR[0], FR[1], color, false, 'v2')}
      {seg(FR[0], FR[1], FL[0], FL[1], color, false, 'v3')}
      {seg(FL[0], FL[1], TL[0], TL[1], color, false, 'v4')}
      {seg(BTL[0], BTL[1], BTR[0], BTR[1], color, false, 'v5')}
      {seg(BTR[0], BTR[1], BR[0], BR[1], color, false, 'v6')}
      {seg(TL[0], TL[1], BTL[0], BTL[1], color, false, 'v7')}
      {seg(TR[0], TR[1], BTR[0], BTR[1], color, false, 'v8')}
      {seg(FR[0], FR[1], BR[0], BR[1], color, false, 'v9')}
      {seg(BL[0], BL[1], BTL[0], BTL[1], color, true, 'h1')}
      {seg(BL[0], BL[1], BR[0], BR[1], color, true, 'h2')}
      {seg(BL[0], BL[1], FL[0], FL[1], color, true, 'h3')}
    </Group>
  );
}

function renderPyramid(w: number, h: number, color: string): ReactNode {
  const d = w * 0.22;
  const dy = h * 0.18;
  const FL: [number, number] = [0, h];
  const FR: [number, number] = [w - d, h];
  const BR: [number, number] = [w, h - dy];
  const BL: [number, number] = [d, h - dy];
  const A: [number, number] = [(FL[0] + BR[0]) / 2, 0];
  return (
    <Group listening={false}>
      {seg(FL[0], FL[1], FR[0], FR[1], color, false, 'v1')}
      {seg(FR[0], FR[1], BR[0], BR[1], color, false, 'v2')}
      {seg(A[0], A[1], FL[0], FL[1], color, false, 'v3')}
      {seg(A[0], A[1], FR[0], FR[1], color, false, 'v4')}
      {seg(A[0], A[1], BR[0], BR[1], color, false, 'v5')}
      {seg(BL[0], BL[1], FL[0], FL[1], color, true, 'h1')}
      {seg(BL[0], BL[1], BR[0], BR[1], color, true, 'h2')}
      {seg(A[0], A[1], BL[0], BL[1], color, true, 'h3')}
    </Group>
  );
}

function renderTetrahedron(w: number, h: number, color: string): ReactNode {
  const dy = h * 0.18;
  const F: [number, number] = [w / 2, h];
  const BR: [number, number] = [w, h - dy];
  const BL: [number, number] = [0, h - dy];
  const A: [number, number] = [w / 2, 0];
  return (
    <Group listening={false}>
      {seg(F[0], F[1], BR[0], BR[1], color, false, 'v1')}
      {seg(F[0], F[1], BL[0], BL[1], color, false, 'v2')}
      {seg(A[0], A[1], F[0], F[1], color, false, 'v3')}
      {seg(A[0], A[1], BR[0], BR[1], color, false, 'v4')}
      {seg(A[0], A[1], BL[0], BL[1], color, false, 'v5')}
      {seg(BR[0], BR[1], BL[0], BL[1], color, true, 'h1')}
    </Group>
  );
}

function renderPrism(w: number, h: number, color: string): ReactNode {
  const d = w * 0.22;
  const dy = h * 0.18;
  const FA: [number, number] = [(w - d) / 2, dy];
  const FL: [number, number] = [0, h];
  const FR: [number, number] = [w - d, h];
  const BA: [number, number] = [FA[0] + d, 0];
  const BL: [number, number] = [FL[0] + d, h - dy];
  const BR: [number, number] = [FR[0] + d, h - dy];
  return (
    <Group listening={false}>
      {seg(FA[0], FA[1], FL[0], FL[1], color, false, 'v1')}
      {seg(FL[0], FL[1], FR[0], FR[1], color, false, 'v2')}
      {seg(FR[0], FR[1], FA[0], FA[1], color, false, 'v3')}
      {seg(BA[0], BA[1], BR[0], BR[1], color, false, 'v4')}
      {seg(FA[0], FA[1], BA[0], BA[1], color, false, 'v5')}
      {seg(FR[0], FR[1], BR[0], BR[1], color, false, 'v6')}
      {seg(BA[0], BA[1], BL[0], BL[1], color, true, 'h1')}
      {seg(BL[0], BL[1], BR[0], BR[1], color, true, 'h2')}
      {seg(FL[0], FL[1], BL[0], BL[1], color, true, 'h3')}
    </Group>
  );
}

function renderCylinder(w: number, h: number, color: string): ReactNode {
  const rx = w / 2;
  const ry = Math.min(h * 0.12, w * 0.18);
  const cx = w / 2;
  const cyT = ry;
  const cyB = h - ry;
  const lx = cx - rx;
  const rxEnd = cx + rx;
  const frontArc = `M ${lx} ${cyB} A ${rx} ${ry} 0 0 0 ${rxEnd} ${cyB}`;
  const backArc = `M ${lx} ${cyB} A ${rx} ${ry} 0 0 1 ${rxEnd} ${cyB}`;
  return (
    <Group listening={false}>
      <Ellipse
        x={cx}
        y={cyT}
        radiusX={rx}
        radiusY={ry}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        listening={false}
      />
      {seg(lx, cyT, lx, cyB, color, false, 'l')}
      {seg(rxEnd, cyT, rxEnd, cyB, color, false, 'r')}
      {arcPath(frontArc, color, false, 'f')}
      {arcPath(backArc, color, true, 'b')}
    </Group>
  );
}

function renderCone(w: number, h: number, color: string): ReactNode {
  const rx = w / 2;
  const ry = Math.min(h * 0.12, w * 0.18);
  const cx = w / 2;
  const cyB = h - ry;
  const apex: [number, number] = [cx, 0];
  const left: [number, number] = [cx - rx, cyB];
  const right: [number, number] = [cx + rx, cyB];
  const frontArc = `M ${left[0]} ${left[1]} A ${rx} ${ry} 0 0 0 ${right[0]} ${right[1]}`;
  const backArc = `M ${left[0]} ${left[1]} A ${rx} ${ry} 0 0 1 ${right[0]} ${right[1]}`;
  return (
    <Group listening={false}>
      {seg(apex[0], apex[1], left[0], left[1], color, false, 'l')}
      {seg(apex[0], apex[1], right[0], right[1], color, false, 'r')}
      {arcPath(frontArc, color, false, 'f')}
      {arcPath(backArc, color, true, 'b')}
    </Group>
  );
}

function renderSphere(w: number, h: number, color: string): ReactNode {
  const r = Math.min(w, h) / 2;
  const cx = w / 2;
  const cy = h / 2;
  const ry = r * 0.3;
  const lx = cx - r;
  const rxEnd = cx + r;
  const frontEq = `M ${lx} ${cy} A ${r} ${ry} 0 0 0 ${rxEnd} ${cy}`;
  const backEq = `M ${lx} ${cy} A ${r} ${ry} 0 0 1 ${rxEnd} ${cy}`;
  return (
    <Group listening={false}>
      <Ellipse
        x={cx}
        y={cy}
        radiusX={r}
        radiusY={r}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        listening={false}
      />
      {arcPath(frontEq, color, false, 'f')}
      {arcPath(backEq, color, true, 'b')}
    </Group>
  );
}
