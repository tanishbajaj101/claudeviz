import { PlayerState } from '../hooks/usePlayer';

interface PlayerControlsProps {
  player: PlayerState;
  totalSteps: number;
  currentTime?: number | string | null;
}

export default function PlayerControls({ player, totalSteps, currentTime }: PlayerControlsProps) {
  const {
    currentStep,
    isPlaying,
    speed,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    seekTo,
    setSpeed,
  } = player;

  const displayStep = currentStep + 1;
  const progress = totalSteps > 0 ? Math.max(0, displayStep) / totalSteps : 0;

  const btnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 6,
    border: '1px solid hsl(var(--border))',
    background: 'hsl(var(--card))',
    cursor: 'pointer',
    fontSize: 14,
    color: 'hsl(var(--foreground))',
    userSelect: 'none',
    flexShrink: 0,
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (totalSteps === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(ratio * (totalSteps - 1));
    seekTo(idx);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        background: 'hsl(var(--card))',
        borderRadius: 8,
        border: '1px solid hsl(var(--border))',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}
    >
      {/* Reset */}
      <button style={btnStyle} onClick={reset} title="Reset">
        ↩
      </button>

      {/* Step back */}
      <button style={btnStyle} onClick={stepBack} title="Step back" disabled={currentStep <= 0}>
        ◀
      </button>

      {/* Play / Pause */}
      <button
        style={{ ...btnStyle, background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', border: 'none', width: 38, height: 38, borderRadius: 8 }}
        onClick={isPlaying ? pause : play}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Step forward */}
      <button
        style={btnStyle}
        onClick={stepForward}
        title="Step forward"
        disabled={currentStep >= totalSteps - 1}
      >
        ▶
      </button>

      {/* Progress bar */}
      <div
        style={{
          flex: 1,
          minWidth: 80,
          height: 8,
          background: 'hsl(var(--muted))',
          borderRadius: 4,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={handleProgressClick}
        title="Click to seek"
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress * 100}%`,
            background: 'hsl(var(--primary))',
            borderRadius: 4,
            transition: 'width 100ms ease',
          }}
        />
      </div>

      {/* Step counter */}
      <span
        style={{
          fontSize: 12,
          color: 'hsl(var(--muted-foreground))',
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {currentStep < 0 ? '—' : displayStep}/{totalSteps}
      </span>

      {/* Time counter — shown only when tracer emits setTime() steps */}
      {currentTime != null && (
        <span
          style={{
            fontSize: 12,
            color: 'hsl(var(--muted-foreground))',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            background: 'hsl(var(--muted))',
            borderRadius: 4,
            padding: '2px 6px',
          }}
        >
          t={currentTime}
        </span>
      )}

      {/* Speed */}
      <select
        value={speed}
        onChange={e => setSpeed(Number(e.target.value))}
        style={{
          fontSize: 12,
          padding: '3px 6px',
          borderRadius: 6,
          border: '1px solid hsl(var(--border))',
          background: 'hsl(var(--card))',
          color: 'hsl(var(--foreground))',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        title="Speed"
      >
        <option value={0.25}>0.25×</option>
        <option value={0.5}>0.5×</option>
        <option value={1}>1×</option>
        <option value={2}>2×</option>
        <option value={4}>4×</option>
        <option value={8}>8×</option>
      </select>
    </div>
  );
}
