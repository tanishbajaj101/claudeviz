import { useState, useEffect, useRef, ReactNode } from 'react';
import { DURATIONS } from '../constants';

interface AnimatedElementProps {
  x: number;
  y: number;
  value: string | number;
  color?: string;
  textColor?: string;
  opacity?: number;
  scale?: number;
  flash?: string | null;
  pulse?: boolean;
  size?: number;
  children?: ReactNode;
  instant?: boolean;
  groupColor?: string | null;
}

export default function AnimatedElement({
  x,
  y,
  value,
  color = 'hsl(var(--muted))',
  textColor = 'hsl(var(--foreground))',
  opacity = 1,
  scale = 1,
  flash,
  pulse,
  size = 50,
  children,
  instant = false,
  groupColor = null,
}: AnimatedElementProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [oldValue, setOldValue] = useState<string | number | null>(null);
  const [oldOpacity, setOldOpacity] = useState(0);
  const [newOpacity, setNewOpacity] = useState(1);
  const [isPulsing, setIsPulsing] = useState(false);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const prevValueRef = useRef(value);

  // Value crossfade
  useEffect(() => {
    if (value !== prevValueRef.current) {
      if (instant) {
        prevValueRef.current = value;
        setDisplayValue(value);
        setOldValue(null);
        setOldOpacity(0);
        setNewOpacity(1);
        return;
      }
      setOldValue(prevValueRef.current);
      setOldOpacity(1);
      setNewOpacity(0);
      prevValueRef.current = value;
      setDisplayValue(value);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOldOpacity(0);
          setNewOpacity(1);
        });
      });
      const t = setTimeout(() => setOldValue(null), DURATIONS.fade);
      return () => clearTimeout(t);
    }
  }, [value, instant]);

  // Pulse
  useEffect(() => {
    if (pulse && !instant) {
      setIsPulsing(true);
      const t = setTimeout(() => setIsPulsing(false), DURATIONS.pulse);
      return () => clearTimeout(t);
    }
  }, [pulse, instant]);

  // Flash
  useEffect(() => {
    if (flash && !instant) {
      setFlashColor(flash);
      const t = setTimeout(() => setFlashColor(null), DURATIONS.color);
      return () => clearTimeout(t);
    }
  }, [flash, instant]);

  const bg = flashColor || color;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: bg,
        color: textColor,
        opacity,
        transform: `scale(${scale})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        fontFamily: 'monospace',
        fontWeight: 600,
        fontSize: size < 40 ? 11 : 14,
        border: groupColor ? `2px solid ${groupColor}` : '1px solid hsl(var(--border))',
        transition: instant
          ? 'none'
          : `left ${DURATIONS.move}ms ease-out, top ${DURATIONS.move}ms ease-out, background-color ${DURATIONS.color}ms ease, opacity ${DURATIONS.fade}ms ease, transform ${DURATIONS.fade}ms ease, border-color ${DURATIONS.color}ms ease`,
        animation: isPulsing ? `pulse ${DURATIONS.pulse}ms ease` : 'none',
        userSelect: 'none',
        overflow: 'visible',
        boxSizing: 'border-box',
      }}
    >
      {oldValue !== null && (
        <span
          style={{
            position: 'absolute',
            opacity: oldOpacity,
            transition: instant ? 'none' : `opacity ${DURATIONS.fade}ms ease`,
          }}
        >
          {oldValue}
        </span>
      )}
      <span
        style={{
          opacity: newOpacity,
          transition: instant ? 'none' : `opacity ${DURATIONS.fade}ms ease`,
        }}
      >
        {displayValue}
      </span>
      {children}
    </div>
  );
}
