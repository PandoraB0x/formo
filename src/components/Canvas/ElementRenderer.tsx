'use client';

import { Group, Text, Line, Path } from 'react-konva';
import type { BoardElement } from '@/types/element';
import { useBoardStore } from '@/store/useBoardStore';
import { fontStack } from '@/lib/constants';
import ShapeRenderer from './ShapeRenderer';
import { parseFraction } from '@/lib/mathParse';

interface Props {
  element: BoardElement;
  fontFamilyId?: string;
}

export default function ElementRenderer({ element, fontFamilyId }: Props) {
  const { type, content, fontSize, color, width, height } = element;
  const storeFamily = useBoardStore((s) => s.board.fontFamily);
  const fontFamily = fontStack(fontFamilyId ?? storeFamily);

  switch (type) {
    case 'number':
    case 'operator':
    case 'paren':
    case 'variable':
    case 'function':
    case 'text': {
      const txt = typeof content === 'string' ? content : '';
      const fontStyle = type === 'variable' ? 'italic' : 'normal';
      return (
        <Text
          text={txt}
          fontSize={fontSize}
          fontStyle={fontStyle}
          fontFamily={fontFamily}
          fill={color}
          width={width}
          height={height}
          align="center"
          verticalAlign="middle"
          listening={false}
        />
      );
    }

    case 'line': {
      const strokeW = Math.max(1, Math.min(5, Math.round(height / 3)));
      return (
        <Line
          points={[0, height / 2, width, height / 2]}
          stroke={color}
          strokeWidth={strokeW}
          lineCap="round"
          listening={false}
        />
      );
    }

    case 'shape': {
      const shapeId = typeof content === 'string' ? content : '';
      return <ShapeRenderer shapeId={shapeId} width={width} height={height} color={color} />;
    }

    case 'fraction': {
      const c = content as { numerator: string; denominator: string };
      const num = typeof c?.numerator === 'string' ? c.numerator : '';
      const den = typeof c?.denominator === 'string' ? c.denominator : '';
      const partFs = Math.round(fontSize * 0.9);
      const lineY = height / 2;
      const numH = height * 0.45;
      const denH = height * 0.45;
      const denY = height * 0.55;
      return (
        <Group listening={false}>
          <Text
            text={num}
            fontSize={partFs}
            fontFamily={fontFamily}
            fill={color}
            width={width}
            height={numH}
            align="center"
            verticalAlign="bottom"
          />
          <Line
            points={[4, lineY, width - 4, lineY]}
            stroke={color}
            strokeWidth={Math.max(2, fontSize / 18)}
            lineCap="round"
          />
          <Text
            text={den}
            fontSize={partFs}
            fontFamily={fontFamily}
            fill={color}
            y={denY}
            width={width}
            height={denH}
            align="center"
            verticalAlign="top"
          />
        </Group>
      );
    }

    case 'power': {
      const c = content as { base: string; exponent: string };
      const baseFs = fontSize;
      const expFs = Math.max(12, fontSize * 0.55);
      const TEXT_WIDTH_FACTOR = 0.58;
      const baseTextW = Math.ceil(c.base.length * baseFs * TEXT_WIDTH_FACTOR);
      const expTextW = Math.max(20, Math.ceil(c.exponent.length * expFs * TEXT_WIDTH_FACTOR) + 8);
      const contentW = baseTextW + expTextW;
      const offsetX = Math.max(0, (width - contentW) / 2);
      return (
        <Group listening={false}>
          <Text
            text={c.base}
            fontSize={baseFs}
            fontFamily={fontFamily}
            fill={color}
            x={offsetX}
            width={baseTextW}
            height={height}
            align="left"
            verticalAlign="middle"
            wrap="none"
          />
          <Text
            text={c.exponent}
            fontSize={expFs}
            fontFamily={fontFamily}
            fill={color}
            x={offsetX + baseTextW}
            y={-expFs * 0.15}
            width={expTextW}
            height={height * 0.6}
            align="left"
            verticalAlign="top"
            wrap="none"
          />
        </Group>
      );
    }

    case 'subscript': {
      const c = content as { base: string; index: string };
      const baseFs = fontSize;
      const idxFs = Math.max(12, fontSize * 0.55);
      const TEXT_WIDTH_FACTOR = 0.58;
      const baseTextW = Math.ceil(c.base.length * baseFs * TEXT_WIDTH_FACTOR);
      const idxTextW = Math.max(20, Math.ceil(c.index.length * idxFs * TEXT_WIDTH_FACTOR) + 8);
      const contentW = baseTextW + idxTextW;
      const offsetX = Math.max(0, (width - contentW) / 2);
      return (
        <Group listening={false}>
          <Text
            text={c.base}
            fontSize={baseFs}
            fontFamily={fontFamily}
            fill={color}
            x={offsetX}
            width={baseTextW}
            height={height}
            align="left"
            verticalAlign="middle"
            wrap="none"
          />
          <Text
            text={c.index}
            fontSize={idxFs}
            fontFamily={fontFamily}
            fill={color}
            x={offsetX + baseTextW}
            y={height - idxFs * 1.1}
            width={idxTextW}
            height={idxFs * 1.2}
            align="left"
            verticalAlign="bottom"
            wrap="none"
          />
        </Group>
      );
    }

    case 'sqrt': {
      const txt = typeof content === 'string' ? content : '';
      const barY = height * 0.15;
      const hookX = height * 0.22;
      const dipX = height * 0.12;
      const barEndX = width - 4;
      const strokeW = Math.max(2, fontSize / 22);
      const radicalPath = `M2 ${height * 0.55} L${dipX} ${height - 6} L${hookX} ${barY} L${barEndX} ${barY}`;
      const contentX = hookX + 6;
      const contentW = barEndX - hookX - 10;
      const contentY = barY + 4;
      const contentH = height - barY - 8;

      const frac = parseFraction(txt);
      if (frac) {
        const partFs = Math.round(fontSize * 0.75);
        const midY = contentY + contentH / 2;
        return (
          <Group listening={false}>
            <Path data={radicalPath} stroke={color} strokeWidth={strokeW} lineCap="round" lineJoin="round" />
            <Text
              text={frac.numerator}
              fontSize={partFs}
              fontFamily={fontFamily}
              fill={color}
              x={contentX}
              y={contentY}
              width={contentW}
              height={contentH / 2 - 2}
              align="center"
              verticalAlign="bottom"
            />
            <Line
              points={[contentX + 4, midY, contentX + contentW - 4, midY]}
              stroke={color}
              strokeWidth={Math.max(1.5, fontSize / 24)}
              lineCap="round"
            />
            <Text
              text={frac.denominator}
              fontSize={partFs}
              fontFamily={fontFamily}
              fill={color}
              x={contentX}
              y={midY + 2}
              width={contentW}
              height={contentH / 2 - 2}
              align="center"
              verticalAlign="top"
            />
          </Group>
        );
      }

      return (
        <Group listening={false}>
          <Path data={radicalPath} stroke={color} strokeWidth={strokeW} lineCap="round" lineJoin="round" />
          <Text
            text={txt}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fill={color}
            x={contentX}
            y={contentY}
            width={contentW}
            height={contentH}
            align="center"
            verticalAlign="middle"
          />
        </Group>
      );
    }

    case 'path': {
      const c = content as { points: number[]; strokeWidth: number };
      const pts = Array.isArray(c?.points) ? c.points : [];
      const sw = Math.max(1, c?.strokeWidth ?? 3);
      if (pts.length < 2) return null;
      return (
        <Line
          points={pts}
          stroke={color}
          strokeWidth={sw}
          lineCap="round"
          lineJoin="round"
          tension={0.35}
          listening={false}
        />
      );
    }

    default:
      return null;
  }
}
