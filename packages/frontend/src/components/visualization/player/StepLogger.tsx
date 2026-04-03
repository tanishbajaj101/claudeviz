import { useEffect, useRef, useMemo } from 'react';

const KINDS: Record<string, { bg: string, text: string, dot: string }> = {
  visit:          { bg: 'rgba(245,158,11,0.15)',  text: '#D97706', dot: '#F59E0B' },
  active:         { bg: 'rgba(16,185,129,0.15)',  text: '#059669', dot: '#10B981' },
  visited:        { bg: 'rgba(107,114,128,0.1)',  text: '#9CA3AF', dot: '#9CA3AF' },
  exploring:      { bg: 'rgba(59,130,246,0.15)',  text: '#3B82F6', dot: '#3B82F6' },
  compare:        { bg: 'rgba(139,92,246,0.15)',  text: '#8B5CF6', dot: '#8B5CF6' },
  swap:           { bg: 'rgba(239,68,68,0.15)',   text: '#EF4444', dot: '#EF4444' },
  update:         { bg: 'rgba(139,92,246,0.15)',  text: '#8B5CF6', dot: '#8B5CF6' },
  edge:           { bg: 'rgba(34,197,94,0.15)',   text: '#22C55E', dot: '#22C55E' },
  insert:         { bg: 'rgba(16,185,129,0.15)',  text: '#10B981', dot: '#10B981' },
  remove:         { bg: 'rgba(244,63,94,0.15)',   text: '#F43F5E', dot: '#F43F5E' },
  narrow:         { bg: 'rgba(14,165,233,0.15)',  text: '#0EA5E9', dot: '#0EA5E9' },
  level:          { bg: 'rgba(245,158,11,0.15)',  text: '#D97706', dot: '#F59E0B' },
  push:           { bg: 'rgba(22,163,74,0.15)',   text: '#16A34A', dot: '#16A34A' },
  pop:            { bg: 'rgba(234,88,12,0.15)',   text: '#EA580C', dot: '#EA580C' },
  shift:          { bg: 'rgba(124,58,237,0.15)',  text: '#7C3AED', dot: '#7C3AED' },
  reparent:       { bg: 'rgba(139,92,246,0.15)',  text: '#8B5CF6', dot: '#8B5CF6' },
  annotate:       { bg: 'rgba(124,58,237,0.15)',  text: '#7C3AED', dot: '#7C3AED' },
  'weight-update':{ bg: 'rgba(234,88,12,0.15)',   text: '#EA580C', dot: '#EA580C' },
  group:          { bg: 'rgba(22,163,74,0.15)',   text: '#16A34A', dot: '#16A34A' },
  'highlight-range':{ bg: 'rgba(37,99,235,0.15)', text: '#3B82F6', dot: '#2563EB' },
  'sub-create':   { bg: 'rgba(16,185,129,0.15)',  text: '#10B981', dot: '#10B981' },
  'sub-destroy':  { bg: 'rgba(244,63,94,0.15)',   text: '#F43F5E', dot: '#F43F5E' },
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
    <div style={{ display: 'flex', flexDirection: 'column', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, overflow: 'hidden', height: 160, flexShrink: 0 }}>
      <div style={{ padding: '6px 12px', borderBottom: '1px solid hsl(var(--border))', fontSize: 11, fontWeight: 700, color: 'hsl(var(--muted-foreground))',
        letterSpacing: '0.06em', textTransform: 'uppercase', background: 'hsl(var(--muted))', flexShrink: 0 }}>
        Event Log
        {currentIndex >= 0 && <span style={{ fontWeight: 400, marginLeft: 8, textTransform: 'none', letterSpacing: 0 }}>step {currentIndex + 1} / {steps?.length ?? 0}</span>}
      </div>
      <div ref={containerRef} className="viz-scrollable" style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {entries.length === 0 && <div style={{ padding: '12px 16px', fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>No events yet.</div>}
        {entries.map((entry, i) => {
          const isActive = i === activeEntryIndex;
          const isPast = i < activeEntryIndex;
          const kind = KINDS[entry.kind] || KINDS.visit;
          return (
            <div key={i} ref={isActive ? activeRef : null} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '3px 12px',
              background: isActive ? kind.bg : 'transparent',
              opacity: isPast ? 0.45 : 1, transition: 'background 150ms ease, opacity 150ms ease' }}>
              <span style={{ fontSize: 10, color: 'hsl(var(--muted-foreground))', fontFamily: 'monospace', minWidth: 32, flexShrink: 0 }}>{entry.stepIndex + 1}</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? kind.dot : 'hsl(var(--border))', flexShrink: 0, transition: 'background 150ms ease' }} />
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: isActive ? kind.text : 'hsl(var(--foreground))',
                fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
