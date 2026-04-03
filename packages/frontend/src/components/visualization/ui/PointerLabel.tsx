import { useState, useEffect } from 'react';
import { DURATIONS } from '../constants';

interface PointerLabelProps {
  label: string;
  x: number;
  y: number;
  color?: string;
  position?: 'above' | 'below';
  stackOffset?: number;
  instant?: boolean;
}

export default function PointerLabel({
  label,
  x,
  y,
  color = 'hsl(var(--primary))',
  position = 'above',
  stackOffset = 0,
  instant = false,
}: PointerLabelProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const defaultOffsetY = position === 'above' ? -28 - stackOffset * 22 : 28 + stackOffset * 22;
  const labelX = x + dragOffset.x;
  const labelY = y + defaultOffsetY + dragOffset.y;

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setDragOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <line
          x1={x}
          y1={y}
          x2={labelX}
          y2={labelY + 9}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray={isDragging ? '5 3' : '3 3'}
          opacity={isDragging ? 0.75 : 0.4}
        />
        <circle cx={x} cy={y} r={2.5} fill={color} opacity={isDragging ? 0.75 : 0.4} />
      </svg>
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        style={{
          position: 'absolute',
          left: labelX,
          top: labelY,
          transform: 'translateX(-50%)',
          backgroundColor: color,
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'monospace',
          padding: '2px 7px',
          borderRadius: 10,
          whiteSpace: 'nowrap',
          pointerEvents: 'all',
          userSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : (instant ? 'none' : `left ${DURATIONS.move}ms ease, top ${DURATIONS.move}ms ease, background-color ${DURATIONS.color}ms ease`),
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        {label}
      </div>
    </>
  );
}
