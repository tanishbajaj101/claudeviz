import { useEffect, useRef, useMemo } from 'react';

const KINDS: Record<string, { bg: string, text: string, dot: string }> = {
  visit:          { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  active:         { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  visited:        { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
  exploring:      { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  compare:        { bg: '#EDE9FE', text: '#5B21B6', dot: '#8B5CF6' },
  swap:           { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
  update:         { bg: '#EDE9FE', text: '#5B21B6', dot: '#8B5CF6' },
  edge:           { bg: '#F0FDF4', text: '#166534', dot: '#22C55E' },
  insert:         { bg: '#ECFDF5', text: '#065F46', dot: '#10B981' },
  remove:         { bg: '#FFF1F2', text: '#9F1239', dot: '#F43F5E' },
  narrow:         { bg: '#F0F9FF', text: '#0C4A6E', dot: '#0EA5E9' },
  level:          { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
  push:           { bg: '#F0FDF4', text: '#14532D', dot: '#16A34A' },
  pop:            { bg: '#FFF7ED', text: '#7C2D12', dot: '#EA580C' },
  shift:          { bg: '#F5F3FF', text: '#4C1D95', dot: '#7C3AED' },
  reparent:       { bg: '#EDE9FE', text: '#5B21B6', dot: '#8B5CF6' },
  annotate:       { bg: '#F5F3FF', text: '#5B21B6', dot: '#7C3AED' },
  'weight-update':{ bg: '#FFF7ED', text: '#9A3412', dot: '#EA580C' },
  group:          { bg: '#F0FDF4', text: '#14532D', dot: '#16A34A' },
  'highlight-range':{ bg: '#EFF6FF', text: '#1E3A8A', dot: '#2563EB' },
  'sub-create':   { bg: '#ECFDF5', text: '#065F46', dot: '#10B981' },
  'sub-destroy':  { bg: '#FFF1F2', text: '#9F1239', dot: '#F43F5E' },
};

function fmt(target: any) {
  if (target === null || target === undefined) return 'null';
  if (Array.isArray(target)) return `[${target.join(', ')}]`;
  return String(target);
}

function describeStep(step: any) {
  const r = step._renderer ? ` · ${step._renderer}` : '';
  const sub = step.subId ? ` (@${step.subId})` : '';
  
  switch (step.type) {
    case 'visit': {
      const sl = step.state.charAt(0).toUpperCase() + step.state.slice(1);
      const kind = ['active', 'visited', 'exploring'].includes(step.state) ? step.state : 'visit';
      return { kind, text: `${sl}: ${fmt(step.target)}${sub}${r}` };
    }
    case 'swap': return { kind: 'swap', text: `Swap ${fmt(step.targets[0])} ↔ ${fmt(step.targets[1])}${sub}${r}` };
    case 'compare': {
      const res = step.result === 'pass' ? ' → ✓' : step.result === 'fail' ? ' → ✗' : '';
      return { kind: 'compare', text: `Compare ${fmt(step.targets[0])} vs ${fmt(step.targets[1])}${res}${sub}${r}` };
    }
    case 'value-update': return { kind: 'update', text: `Set ${fmt(step.target)} = ${fmt(step.value)}${sub}${r}` };
    case 'edge-update': {
      const sm: Record<string, string> = { exploring: 'Exploring', accepted: 'Accept', rejected: 'Reject', default: 'Reset' };
      return { kind: 'edge', text: `Edge ${step.edge[0]} → ${step.edge[1]}: ${sm[step.state] ?? step.state}${r}` };
    }
    case 'fade-in': { const val = step.value !== undefined ? ` (${step.value})` : ''; return { kind: 'insert', text: `Insert ${fmt(step.target)}${val}${r}` }; }
    case 'fade-out': return { kind: 'remove', text: `Remove ${fmt(step.target)}${r}` };
    case 'search-narrow': return { kind: 'narrow', text: `Narrow → [${step.active[0]}, ${step.active[1]}]${r}` };
    case 'level-highlight': return { kind: 'level', text: `Level: ${step.targets.join(', ')}${r}` };
    case 'recursion-push': {
      const args = Object.entries(step.frame.args || {}).map(([k, v]) => `${k}=${v}`).join(', ');
      return { kind: 'push', text: `→ ${step.frame.label}(${args})` };
    }
    case 'recursion-pop': {
      const rv = step.returnValue != null ? ` = ${Array.isArray(step.returnValue) ? `[${step.returnValue.join(', ')}]` : step.returnValue}` : '';
      return { kind: 'pop', text: `← return${rv}` };
    }
    case 'batch-shift': return { kind: 'shift', text: `Shift [${step.range[0]}..${step.range[1]}] ${step.direction}${r}` };
    case 'reparent': return { kind: 'reparent', text: `Reparent ${fmt(step.target)} → ${fmt(step.newParent)}${r}` };
    case 'annotate': return { kind: 'annotate', text: `annotate ${fmt(step.target)}: "${step.text ?? ''}"${r}` };
    case 'weight-update': return { kind: 'weight-update', text: `weight ${step.edge?.[0]}→${step.edge?.[1]} = ${step.weight}${r}` };
    case 'group': return { kind: 'group', text: step.targets ? `group [${step.targets.join ? step.targets.join(', ') : step.targets}]${r}` : `clear groups${r}` };
    case 'highlight-range': return { kind: 'highlight-range', text: `range [${(step.targets || []).join(', ')}]${r}` };
    case 'sub-create': return { kind: 'sub-create', text: `Split [${step.id}]: [${step.values.join(', ')}]` };
    case 'sub-destroy': return { kind: 'sub-destroy', text: `Done [${step.id}]` };
    default: return null;
  }
}

interface StepLoggerProps {
  steps: any[] | null;
  currentIndex: number;
}

export default function StepLogger({ steps, currentIndex }: StepLoggerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const entries = useMemo(() => {
    if (!steps) return [];
    const result: any[] = [];
    steps.forEach((step, i) => { const desc = describeStep(step); if (desc) result.push({ ...desc, stepIndex: i }); });
    return result;
  }, [steps]);

  const activeEntryIndex = useMemo(() => {
    if (currentIndex < 0) return -1;
    let last = -1;
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].stepIndex <= currentIndex) last = i; else break;
    }
    return last;
  }, [entries, currentIndex]);

  useEffect(() => {
    if (activeRef.current && containerRef.current) activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeEntryIndex]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', height: 160, flexShrink: 0 }}>
      <div style={{ padding: '6px 12px', borderBottom: '1px solid #F3F4F6', fontSize: 11, fontWeight: 700, color: '#6B7280',
        letterSpacing: '0.06em', textTransform: 'uppercase', background: '#FAFAFA', flexShrink: 0 }}>
        Event Log
        {currentIndex >= 0 && <span style={{ fontWeight: 400, marginLeft: 8, textTransform: 'none', letterSpacing: 0 }}>step {currentIndex + 1} / {steps?.length ?? 0}</span>}
      </div>
      <div ref={containerRef} className="viz-scrollable" style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {entries.length === 0 && <div style={{ padding: '12px 16px', fontSize: 12, color: '#9CA3AF' }}>No events yet.</div>}
        {entries.map((entry, i) => {
          const isActive = i === activeEntryIndex;
          const isPast = i < activeEntryIndex;
          const kind = KINDS[entry.kind] || KINDS.visit;
          return (
            <div key={i} ref={isActive ? activeRef : null} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '3px 12px',
              background: isActive ? kind.bg : 'transparent',
              opacity: isPast ? 0.45 : 1, transition: 'background 150ms ease, opacity 150ms ease' }}>
              <span style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace', minWidth: 32, flexShrink: 0 }}>{entry.stepIndex + 1}</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? kind.dot : '#D1D5DB', flexShrink: 0, transition: 'background 150ms ease' }} />
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: isActive ? kind.text : '#374151',
                fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
