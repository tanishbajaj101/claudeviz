import { DURATIONS } from '../constants';

interface AnimatedEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  opacity?: number;
  directed?: boolean;
  weight?: string | number | null;
  instant?: boolean;
}

export default function AnimatedEdge({
  x1,
  y1,
  x2,
  y2,
  color = '#9CA3AF',
  opacity = 1,
  directed = false,
  weight = null,
  instant = false,
}: AnimatedEdgeProps) {
  const markerId = `arrow-${Math.abs(Math.round(x1 + y1 + x2 + y2))}`;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  return (
    <>
      {directed && (
        <defs>
          <marker
            id={markerId}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill={color} />
          </marker>
        </defs>
      )}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={2}
        opacity={opacity}
        markerEnd={directed ? `url(#${markerId})` : undefined}
        style={{
          transition: instant ? 'none' : `x1 ${DURATIONS.move}ms ease-out, y1 ${DURATIONS.move}ms ease-out, x2 ${DURATIONS.move}ms ease-out, y2 ${DURATIONS.move}ms ease-out, stroke ${DURATIONS.color}ms ease, opacity ${DURATIONS.fade}ms ease`,
        }}
      />
      {weight !== null && (
        <>
          <rect
            x={mx - 12}
            y={my - 10}
            width={24}
            height={18}
            fill="white"
            rx={3}
            opacity={0.9}
            style={{
              transition: instant ? 'none' : `x ${DURATIONS.move}ms ease-out, y ${DURATIONS.move}ms ease-out`,
            }}
          />
          <text
            x={mx}
            y={my + 4}
            textAnchor="middle"
            fontSize={11}
            fontFamily="monospace"
            fontWeight={600}
            fill="#374151"
            style={{
              transition: instant ? 'none' : `x ${DURATIONS.move}ms ease-out, y ${DURATIONS.move}ms ease-out`,
            }}
          >
            {weight}
          </text>
        </>
      )}
    </>
  );
}
