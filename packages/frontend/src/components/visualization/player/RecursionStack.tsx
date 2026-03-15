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
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
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
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 4,
          flexShrink: 0,
        }}
      >
        Call Stack
      </div>

      {frames.length === 0 && (
        <div style={{ fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }}>Empty</div>
      )}

      {hidden > 0 && (
        <div
          style={{
            fontSize: 11,
            color: '#9CA3AF',
            textAlign: 'center',
            padding: '2px 0',
            borderBottom: '1px dashed #E5E7EB',
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
                background: isTop ? '#EFF6FF' : '#F9FAFB',
                border: `1px solid ${isTop ? '#BFDBFE' : '#E5E7EB'}`,
                borderRadius: 6,
                padding: '5px 8px',
                fontSize: 12,
                fontFamily: 'monospace',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ fontWeight: 700, color: isTop ? '#1D4ED8' : '#374151' }}>
                {frame.label}
              </div>
              {frame.args && (
                <div style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
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
            color: '#059669',
            fontFamily: 'monospace',
            padding: '3px 6px',
            background: '#D1FAE5',
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
