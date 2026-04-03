interface RecursionFrame {
  label: string;
  args?: Record<string, any>;
}

interface RecursionStackProps {
  frames?: RecursionFrame[];
  returnFlash?: any;
}

export default function RecursionStack({ frames = [], returnFlash = null }: RecursionStackProps) {
  const MAX_VISIBLE = 8;
  const total = frames.length;
  const visible = total > MAX_VISIBLE ? frames.slice(total - MAX_VISIBLE) : frames;
  const hidden = total > MAX_VISIBLE ? total - MAX_VISIBLE : 0;

  return (
    <div
      style={{
        width: 200,
        flexShrink: 0,
        background: 'hsl(var(--card))',
        borderRadius: 8,
        border: '1px solid hsl(var(--border))',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'hsl(var(--muted-foreground))',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 4,
          flexShrink: 0,
        }}
      >
        Call Stack
      </div>

      {frames.length === 0 && (
        <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>Empty</div>
      )}

      {hidden > 0 && (
        <div
          style={{
            fontSize: 11,
            color: 'hsl(var(--muted-foreground))',
            textAlign: 'center',
            padding: '2px 0',
            borderBottom: '1px dashed hsl(var(--border))',
          }}
        >
          ...+{hidden} more
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 4 }}>
        {visible.map((frame, i) => {
          const isTop = i === visible.length - 1;
          return (
            <div
              key={i}
              style={{
                background: isTop ? 'hsl(var(--primary) / 0.1)' : 'hsl(var(--muted))',
                border: `1px solid ${isTop ? 'hsl(var(--primary) / 0.4)' : 'hsl(var(--border))'}`,
                borderRadius: 6,
                padding: '5px 8px',
                fontSize: 12,
                fontFamily: 'monospace',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ fontWeight: 700, color: isTop ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}>
                {frame.label}
              </div>
              {frame.args && (
                <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, marginTop: 2 }}>
                  {Object.entries(frame.args)
                    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
                    .join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {returnFlash !== null && (
        <div
          style={{
            fontSize: 11,
            color: 'hsl(var(--viz-active-text))',
            fontFamily: 'monospace',
            padding: '3px 6px',
            background: 'hsl(var(--viz-active-bg))',
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          return {JSON.stringify(returnFlash)}
        </div>
      )}
    </div>
  );
}
