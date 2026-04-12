import { useEffect, useState, useMemo } from 'react';
import AnimatedElement from '../ui/AnimatedElement';
import PointerLabel from '../ui/PointerLabel';
import { STATE_COLORS, COMPARE_COLORS, VALUE_UPDATE_COLOR, POINTER_PALETTE } from '../constants';
import { RendererProps } from './types';

const BOX_SIZE = 44;
const GAP = 6;
const CELL = BOX_SIZE + GAP;
const ROW_HEIGHT = 110;
const H_PAD = 16;
const SUBTREE_GAP = 20;

function createSubArray(id: string, parentId: string | null, side: string | null, values: any[]) {
  return {
    id, parentId, side,
    elements: values.map((val, i) => ({
      id: `${id}-el-${i}`,
      value: val, index: i, color: STATE_COLORS.default.bg, textColor: STATE_COLORS.default.text,
      opacity: 1, pulse: false, flash: null as string | null, _fadingIn: false
    })),
    pointers: {} as Record<string, number>,
    opacity: 1,
    _fadingOut: false,
    _justMarkedFadeOut: false
  };
}

function initState(config: any) {
  const root = createSubArray('root', null, null, config?.data || []);
  return {
    subArrays: { 'root': root } as Record<string, any>
  };
}

function applyOperationalStep(sub: any, step: any, instant: boolean) {
  let { elements, pointers } = sub;
  switch (step.type) {
    case 'visit': {
      const sc = (STATE_COLORS as any)[step.state] || STATE_COLORS.default;
      return { ...sub, elements: elements.map((el: any) => el.index === step.target
        ? { ...el, color: sc.bg, textColor: sc.text, pulse: !instant, flash: null } : { ...el, pulse: false, flash: null }) };
    }
    case 'swap': {
      const [i, j] = step.targets;
      const ii = elements.findIndex((e: any) => e.index === i); const ij = elements.findIndex((e: any) => e.index === j);
      if (ii === -1 || ij === -1) return sub;
      const ne = [...elements];
      ne[ii] = { ...ne[ii], index: j }; ne[ij] = { ...ne[ij], index: i };
      return { ...sub, elements: ne.map((el: any) => ({ ...el, pulse: false, flash: null })) };
    }
    case 'compare': {
      const [a, b] = step.targets;
      let fc = COMPARE_COLORS.neutral;
      if (step.result === 'pass') fc = COMPARE_COLORS.pass;
      else if (step.result === 'fail') fc = COMPARE_COLORS.fail;
      const tgt = new Set([a, b]);
      return { ...sub, elements: elements.map((el: any) => tgt.has(el.index)
        ? { ...el, flash: instant ? null : fc, pulse: false } : { ...el, pulse: false, flash: null }) };
    }
    case 'value-update': {
      return { ...sub, elements: elements.map((el: any) => el.index === step.target
        ? { ...el, value: step.value, flash: instant ? null : VALUE_UPDATE_COLOR, pulse: false } : { ...el, pulse: false, flash: null }) };
    }
    case 'pointer': {
      const { label, to } = step;
      const np = { ...pointers };
      if (to === null || to === undefined) delete np[label]; else np[label] = to;
      return { ...sub, pointers: np };
    }
    default: return sub;
  }
}

function applyStepToState(state: any, step: any, instant: boolean) {
  if (!step) return state;
  if (step.type === 'batch') {
    return (step.steps as any[]).reduce(
      (s: any, sub: any) => applyStepToState(s, sub, instant),
      state
    );
  }
  const subArrays = { ...state.subArrays };

  if (step.type === 'sub-create') {
    const sub = createSubArray(step.id, step.parentId, step.side, step.values);
    if (!instant) {
      sub.opacity = 0;
      sub.elements = sub.elements.map(el => ({ ...el, opacity: 0, _fadingIn: true }));
    }
    subArrays[step.id] = sub;
    return { ...state, subArrays };
  }

  if (step.type === 'sub-destroy') {
    if (subArrays[step.id]) {
      if (instant) {
        delete subArrays[step.id];
      } else {
        subArrays[step.id] = { ...subArrays[step.id], opacity: 0, _fadingOut: true };
      }
    }
    return { ...state, subArrays };
  }

  const subId = step.subId || 'root';
  if (subArrays[subId]) {
    subArrays[subId] = applyOperationalStep(subArrays[subId], step, instant);
    return { ...state, subArrays };
  }

  return state;
}

export default function RecursiveLinearRenderer({ config, steps, currentIndex, isSeek }: RendererProps) {
  const [state, setState] = useState(() => initState(config));
  useEffect(() => { setState(initState(config)); }, [config]);

  useEffect(() => {
    if (currentIndex < 0 || !steps) { setState(initState(config)); return; }
    if (isSeek) {
      let s = initState(config);
      for (let i = 0; i <= currentIndex; i++) {
        s = applyStepToState(s, steps[i], true);
      }
      // Cleanup fading out
      const cleanSubs: Record<string, any> = {};
      Object.entries(s.subArrays).forEach(([id, sub]: [string, any]) => {
        if (!sub._fadingOut) {
          cleanSubs[id] = { ...sub, opacity: 1, elements: sub.elements.map((el: any) => ({ ...el, opacity: 1, _fadingIn: false })) };
        }
      });
      setState({ subArrays: cleanSubs });
    } else {
      const step = steps[currentIndex];
      setState(prev => {
        // Remove actually destroyed subs from previous step's fade out
        const cleanedSubs: Record<string, any> = {};
        Object.entries(prev.subArrays).forEach(([id, sub]: [string, any]) => {
          if (!sub._fadingOut || sub._justMarkedFadeOut) {
             cleanedSubs[id] = { ...sub, _justMarkedFadeOut: false };
          }
        });
        const next = applyStepToState({ ...prev, subArrays: cleanedSubs }, step, false);
        if (step.type === 'sub-destroy') {
            if (next.subArrays[step.id]) next.subArrays[step.id]._justMarkedFadeOut = true;
        }
        return next;
      });

      if (step.type === 'sub-create') {
        setTimeout(() => setState(prev => {
          if (!prev.subArrays[step.id]) return prev;
          const sub = prev.subArrays[step.id];
          const nextSubs = { ...prev.subArrays, [step.id]: { ...sub, opacity: 1, elements: sub.elements.map((el: any) => ({ ...el, opacity: 1, _fadingIn: false })) } };
          return { ...prev, subArrays: nextSubs };
        }), 50);
      }
      if (step.type === 'sub-destroy') {
        setTimeout(() => setState(prev => {
          if (!prev.subArrays[step.id]) return prev;
          const nextSubs = { ...prev.subArrays };
          delete nextSubs[step.id];
          return { ...prev, subArrays: nextSubs };
        }), 350);
      }
    }
  }, [currentIndex, isSeek, config, steps]);

  // Layout calculation
  const layout = useMemo(() => {
    const subs = state.subArrays;
    const childrenMap: Record<string, string[]> = {};
    Object.keys(subs).forEach(id => childrenMap[id] = []);
    Object.entries(subs).forEach(([id, sub]: [string, any]) => {
      if (sub.parentId && childrenMap[sub.parentId]) {
        childrenMap[sub.parentId].push(id);
      }
    });

    const widths: Record<string, number> = {};
    function calcWidth(id: string) {
      const sub = subs[id];
      const ownWidth = sub.elements.length * CELL + H_PAD * 2;
      const children = childrenMap[id];
      let childrenWidth = 0;
      children.forEach((cid, i) => {
        childrenWidth += calcWidth(cid);
        if (i < children.length - 1) childrenWidth += SUBTREE_GAP;
      });
      widths[id] = Math.max(ownWidth, childrenWidth);
      return widths[id];
    }

    if (!subs['root']) return { nodes: {} as Record<string, any>, totalWidth: 0, totalHeight: 0, connectors: [] as any[] };
    const fullWidth = calcWidth('root');
    const nodes: Record<string, any> = {};
    let maxY = 0;

    function assignPos(id: string, x: number, y: number, allocatedWidth: number) {
      const sub = subs[id];
      const ownWidth = sub.elements.length * CELL;
      nodes[id] = {
        x: x + (allocatedWidth - ownWidth) / 2,
        y: y,
        midX: x + allocatedWidth / 2,
        bottomY: y + BOX_SIZE + 20
      };
      maxY = Math.max(maxY, y + ROW_HEIGHT);

      const children = childrenMap[id];
      if (children.length > 0) {
        const combined = children.reduce((acc, cid, i) => acc + widths[cid] + (i < children.length - 1 ? SUBTREE_GAP : 0), 0);
        let curX = x + (allocatedWidth - combined) / 2;
        children.forEach(cid => {
          assignPos(cid, curX, y + ROW_HEIGHT, widths[cid]);
          curX += widths[cid] + SUBTREE_GAP;
        });
      }
    }

    assignPos('root', 0, 20, fullWidth);

    const connectors: any[] = [];
    Object.entries(childrenMap).forEach(([parentId, children]) => {
        if (!nodes[parentId]) return;
        children.forEach(childId => {
            if (nodes[childId]) {
                connectors.push({
                    x1: nodes[parentId].midX,
                    y1: nodes[parentId].bottomY,
                    x2: nodes[childId].midX,
                    y2: nodes[childId].y - 5
                });
            }
        });
    });

    return { nodes, totalWidth: fullWidth, totalHeight: maxY + 50, connectors };
  }, [state.subArrays]);

  const pointerColorMap: Record<string, string> = {};
  let pIdx = 0;
  Object.values(state.subArrays).forEach((sub: any) => {
      Object.keys(sub.pointers).forEach(label => {
          if (!pointerColorMap[label]) pointerColorMap[label] = POINTER_PALETTE[pIdx++ % POINTER_PALETTE.length];
      });
  });

  return (
    <div style={{ position: 'relative', width: layout.totalWidth, height: layout.totalHeight, minWidth: '100%' }}>
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {layout.connectors.map((c, i) => (
          <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 2" />
        ))}
      </svg>

      {Object.entries(state.subArrays).map(([id, sub]: [string, any]) => {
        const pos = layout.nodes[id];
        if (!pos) return null;

        const pointersByTarget: Record<number, string[]> = {};
        Object.entries(sub.pointers).forEach(([label, targetIdx]) => {
          if (!pointersByTarget[targetIdx as number]) pointersByTarget[targetIdx as number] = [];
          pointersByTarget[targetIdx as number].push(label);
        });

        return (
          <div key={id} style={{
            position: 'absolute', left: pos.x, top: pos.y,
            opacity: sub.opacity, transition: isSeek ? 'none' : 'opacity 300ms ease, left 500ms ease, top 500ms ease',
            padding: '8px', border: '1px solid #F3F4F6', borderRadius: '8px', background: 'rgba(255,255,255,0.8)'
          }}>
            <div style={{ position: 'relative', width: sub.elements.length * CELL, height: BOX_SIZE + 20 }}>
              {sub.elements.map((el: any) => (
                <AnimatedElement key={el.id} x={el.index * CELL} y={10}
                  value={el.value} color={el.color} textColor={el.textColor}
                  opacity={el.opacity} pulse={el.pulse} flash={el.flash}
                  size={BOX_SIZE} instant={isSeek}
                />
              ))}
              {Object.entries(sub.pointers).map(([label, targetIdx]) => {
                const stack = pointersByTarget[targetIdx as number] || []; const stackOffset = stack.indexOf(label);
                return <PointerLabel key={label} label={label} x={(targetIdx as number) * CELL + BOX_SIZE / 2} y={10}
                  color={pointerColorMap[label]} position='above' stackOffset={stackOffset} instant={isSeek} />;
              })}
            </div>
            <div style={{ position: 'absolute', top: -12, left: 8, fontSize: 9, fontWeight: 700, color: '#9CA3AF', background: '#fff', padding: '0 4px', borderRadius: 4, border: '1px solid #F3F4F6' }}>
                {id === 'root' ? 'ARRAY' : id}
            </div>
          </div>
        );
      })}
    </div>
  );
}
