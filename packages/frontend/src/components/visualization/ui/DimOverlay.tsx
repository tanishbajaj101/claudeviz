import { DURATIONS } from '../constants';

interface DimOverlayProps {
  totalWidth: number;
  totalHeight: number;
  activeStart: number | null;
  activeEnd: number | null;
  elementWidth: number;
  gap: number;
  instant?: boolean;
}

export default function DimOverlay({
  totalWidth,
  totalHeight,
  activeStart,
  activeEnd,
  elementWidth,
  gap,
  instant = false,
}: DimOverlayProps) {
  if (activeStart == null || activeEnd == null) return null;

  const cellSize = elementWidth + gap;
  const leftWidth = activeStart * cellSize;
  const rightLeft = (activeEnd + 1) * cellSize;
  const rightWidth = Math.max(0, totalWidth - rightLeft);

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    height: totalHeight,
    backgroundColor: 'hsl(var(--foreground) / 0.12)',
    borderRadius: 4,
    pointerEvents: 'none',
    transition: instant ? 'none' : `left ${DURATIONS.move}ms ease, width ${DURATIONS.move}ms ease`,
    zIndex: 5,
  };

  return (
    <>
      {leftWidth > 0 && (
        <div
          style={{
            ...overlayStyle,
            left: 0,
            width: leftWidth,
          }}
        />
      )}
      {rightWidth > 0 && (
        <div
          style={{
            ...overlayStyle,
            left: rightLeft,
            width: rightWidth,
          }}
        />
      )}
    </>
  );
}
