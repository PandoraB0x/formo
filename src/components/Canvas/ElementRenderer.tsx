'use client';

import { Group, Text, Line, Path } from 'react-konva';
import type { BoardElement } from '@/types/element';
import { useBoardStore } from '@/store/useBoardStore';
import { fontStack } from '@/lib/constants';
import ShapeRenderer from './ShapeRenderer';

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
      const baseW = width * 0.6;
      return (
        <Group listening={false}>
          <Text
            text={c.base}
            fontSize={baseFs}
            fontFamily={fontFamily}
            fill={color}
            width={baseW}
            height={height}
            align="center"
            verticalAlign="middle"
          />
          <Text
            text={c.exponent}
            fontSize={expFs}
            fontFamily={fontFamily}
            fill={color}
            x={baseW - 4}
            y={-expFs * 0.15}
            width={width - baseW + 4}
            height={height * 0.6}
            align="left"
            verticalAlign="top"
          />
        </Group>
      );
    }

    case 'subscript': {
      const c = content as { base: string; index: string };
      const baseFs = fontSize;
      const idxFs = Math.max(12, fontSize * 0.55);
      const baseW = width * 0.6;
      return (
        <Group listening={false}>
          <Text
            text={c.base}
            fontSize={baseFs}
            fontFamily={fontFamily}
            fill={color}
            width={baseW}
            height={height}
            align="center"
            verticalAlign="middle"
          />
          <Text
            text={c.index}
            fontSize={idxFs}
            fontFamily={fontFamily}
            fill={color}
            x={baseW - 4}
            y={height - idxFs * 1.1}
            width={width - baseW + 4}
            height={idxFs * 1.2}
            align="left"
            verticalAlign="bottom"
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
      return (
        <Group listening={false}>
          <Path data={radicalPath} stroke={color} strokeWidth={strokeW} lineCap="round" lineJoin="round" />
          <Text
            text={txt}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fill={color}
            x={hookX + 6}
            y={barY + 4}
            width={barEndX - hookX - 10}
            height={height - barY - 8}
            align="center"
            verticalAlign="middle"
          />
        </Group>
      );
    }

    default:
      return null;
  }
}
