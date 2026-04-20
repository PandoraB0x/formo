import type { SVGAttributes } from 'react';
import { is2DShapeId, SHAPE_MAP } from '@/lib/shapes';

const DASH = '6 4';
const STROKE_WIDTH = 2;

interface Props {
  shapeId: string;
  color?: string;
  className?: string;
}

export default function ShapePreviewSVG({ shapeId, color = 'currentColor', className }: Props) {
  const def = SHAPE_MAP.get(shapeId);
  const w = def?.width ?? 140;
  const h = def?.height ?? 120;
  const pad = STROKE_WIDTH + 1;

  const twoD = is2DShapeId(shapeId);
  const content = twoD ? render2D(twoD.base, w, h, color, twoD.dashed) : render3D(shapeId, w, h, color);

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      className={className}
      aria-hidden
    >
      {content}
    </svg>
  );
}

type SegProps = SVGAttributes<SVGLineElement> & { dashed?: boolean };

function seg(x1: number, y1: number, x2: number, y2: number, color: string, dashed = false, key?: string) {
  const props: SegProps = {
    x1, y1, x2, y2,
    stroke: color,
    strokeWidth: STROKE_WIDTH,
    strokeLinecap: 'round',
    ...(dashed ? { strokeDasharray: DASH } : {}),
  };
  return <line key={key} {...props} />;
}

function poly(points: number[], color: string, dashed = false) {
  const pts = [];
  for (let i = 0; i < points.length; i += 2) pts.push(`${points[i]},${points[i + 1]}`);
  return (
    <polygon
      points={pts.join(' ')}
      stroke={color}
      strokeWidth={STROKE_WIDTH}
      strokeLinejoin="round"
      strokeDasharray={dashed ? DASH : undefined}
    />
  );
}

function arc(d: string, color: string, dashed = false, key?: string) {
  return (
    <path
      key={key}
      d={d}
      stroke={color}
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="round"
      strokeDasharray={dashed ? DASH : undefined}
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

function render2D(base: string, w: number, h: number, color: string, dashed: boolean) {
  switch (base) {
    case 'rect':
    case 'square':
      return poly([0, 0, w, 0, w, h, 0, h], color, dashed);
    case 'circle':
    case 'ellipse':
      return (
        <ellipse
          cx={w / 2}
          cy={h / 2}
          rx={w / 2}
          ry={h / 2}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={dashed ? DASH : undefined}
        />
      );
    case 'triangle':
      return poly([w / 2, 0, w, h, 0, h], color, dashed);
    case 'triangle-right':
      return poly([0, 0, 0, h, w, h], color, dashed);
    case 'parallelogram':
      return poly([w * 0.25, 0, w, 0, w * 0.75, h, 0, h], color, dashed);
    case 'trapezoid':
      return poly([w * 0.22, 0, w * 0.78, 0, w, h, 0, h], color, dashed);
    case 'rhombus':
      return poly([w / 2, 0, w, h / 2, w / 2, h, 0, h / 2], color, dashed);
    case 'pentagon':
      return poly(regularPolygon(5, w, h), color, dashed);
    case 'hexagon':
      return poly(regularPolygon(6, w, h), color, dashed);
    default:
      return null;
  }
}

function render3D(id: string, w: number, h: number, color: string) {
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

function renderBox(w: number, h: number, color: string) {
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
    <g>
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
    </g>
  );
}

function renderPyramid(w: number, h: number, color: string) {
  const d = w * 0.22;
  const dy = h * 0.18;
  const FL: [number, number] = [0, h];
  const FR: [number, number] = [w - d, h];
  const BR: [number, number] = [w, h - dy];
  const BL: [number, number] = [d, h - dy];
  const A: [number, number] = [(FL[0] + BR[0]) / 2, 0];
  return (
    <g>
      {seg(FL[0], FL[1], FR[0], FR[1], color, false, 'v1')}
      {seg(FR[0], FR[1], BR[0], BR[1], color, false, 'v2')}
      {seg(A[0], A[1], FL[0], FL[1], color, false, 'v3')}
      {seg(A[0], A[1], FR[0], FR[1], color, false, 'v4')}
      {seg(A[0], A[1], BR[0], BR[1], color, false, 'v5')}
      {seg(BL[0], BL[1], FL[0], FL[1], color, true, 'h1')}
      {seg(BL[0], BL[1], BR[0], BR[1], color, true, 'h2')}
      {seg(A[0], A[1], BL[0], BL[1], color, true, 'h3')}
    </g>
  );
}

function renderTetrahedron(w: number, h: number, color: string) {
  const dy = h * 0.18;
  const F: [number, number] = [w / 2, h];
  const BR: [number, number] = [w, h - dy];
  const BL: [number, number] = [0, h - dy];
  const A: [number, number] = [w / 2, 0];
  return (
    <g>
      {seg(F[0], F[1], BR[0], BR[1], color, false, 'v1')}
      {seg(F[0], F[1], BL[0], BL[1], color, false, 'v2')}
      {seg(A[0], A[1], F[0], F[1], color, false, 'v3')}
      {seg(A[0], A[1], BR[0], BR[1], color, false, 'v4')}
      {seg(A[0], A[1], BL[0], BL[1], color, false, 'v5')}
      {seg(BR[0], BR[1], BL[0], BL[1], color, true, 'h1')}
    </g>
  );
}

function renderPrism(w: number, h: number, color: string) {
  const d = w * 0.22;
  const dy = h * 0.18;
  const FA: [number, number] = [(w - d) / 2, dy];
  const FL: [number, number] = [0, h];
  const FR: [number, number] = [w - d, h];
  const BA: [number, number] = [FA[0] + d, 0];
  const BL: [number, number] = [FL[0] + d, h - dy];
  const BR: [number, number] = [FR[0] + d, h - dy];
  return (
    <g>
      {seg(FA[0], FA[1], FL[0], FL[1], color, false, 'v1')}
      {seg(FL[0], FL[1], FR[0], FR[1], color, false, 'v2')}
      {seg(FR[0], FR[1], FA[0], FA[1], color, false, 'v3')}
      {seg(BA[0], BA[1], BR[0], BR[1], color, false, 'v4')}
      {seg(FA[0], FA[1], BA[0], BA[1], color, false, 'v5')}
      {seg(FR[0], FR[1], BR[0], BR[1], color, false, 'v6')}
      {seg(BA[0], BA[1], BL[0], BL[1], color, true, 'h1')}
      {seg(BL[0], BL[1], BR[0], BR[1], color, true, 'h2')}
      {seg(FL[0], FL[1], BL[0], BL[1], color, true, 'h3')}
    </g>
  );
}

function renderCylinder(w: number, h: number, color: string) {
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
    <g>
      <ellipse
        cx={cx}
        cy={cyT}
        rx={rx}
        ry={ry}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
      />
      {seg(lx, cyT, lx, cyB, color, false, 'l')}
      {seg(rxEnd, cyT, rxEnd, cyB, color, false, 'r')}
      {arc(frontArc, color, false, 'f')}
      {arc(backArc, color, true, 'b')}
    </g>
  );
}

function renderCone(w: number, h: number, color: string) {
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
    <g>
      {seg(apex[0], apex[1], left[0], left[1], color, false, 'l')}
      {seg(apex[0], apex[1], right[0], right[1], color, false, 'r')}
      {arc(frontArc, color, false, 'f')}
      {arc(backArc, color, true, 'b')}
    </g>
  );
}

function renderSphere(w: number, h: number, color: string) {
  const r = Math.min(w, h) / 2;
  const cx = w / 2;
  const cy = h / 2;
  const ry = r * 0.3;
  const lx = cx - r;
  const rxEnd = cx + r;
  const frontEq = `M ${lx} ${cy} A ${r} ${ry} 0 0 0 ${rxEnd} ${cy}`;
  const backEq = `M ${lx} ${cy} A ${r} ${ry} 0 0 1 ${rxEnd} ${cy}`;
  return (
    <g>
      <ellipse
        cx={cx}
        cy={cy}
        rx={r}
        ry={r}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
      />
      {arc(frontEq, color, false, 'f')}
      {arc(backEq, color, true, 'b')}
    </g>
  );
}
