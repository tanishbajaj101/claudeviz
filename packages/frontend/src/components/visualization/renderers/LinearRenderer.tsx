import { useEffect, useState } from 'react';
import AnimatedElement from '../ui/AnimatedElement';
import PointerLabel from '../ui/PointerLabel';
import DimOverlay from '../ui/DimOverlay';
import { STATE_COLORS, COMPARE_COLORS, VALUE_UPDATE_COLOR, POINTER_PALETTE, DURATIONS } from '../constants';
import { RendererProps } from './types';

const BOX_SIZE = 50;
const GAP = 8;
const CELL = BOX_SIZE + GAP;
const CONTAINER_HEIGHT = 140;
const ELEM_Y = 50;

function initState(config: any) {
  if (!config || !config.data) return { elements: [], pointers: {} as Record<string, any>, dimRegion: null as any, annotations: {} as Record<string, any>, elementGroups: {} as Record<string, any> };
  const elements = config.data.map((val: any, i: number) => ({
    id: i, value: val, index: i, color: STATE_COLORS.default.bg, textColor: STATE_COLORS.default.text,
    opacity: 1, pulse: false, flash: null as string | null,
  }));
  return { elements, pointers: {} as Record<string, any>, dimRegion: null as any, annotations: {} as Record<string, any>, elementGroups: {} as Record<string, any> };
}

function applyStepToState(state: any, step: any, instant: boolean) {
  if (!step) return state;
  let { elements, pointers, annotations, elementGroups } = state;

  switch (step.type) {
    case 'swap': {
      const [i, j] = step.targets;
      const elems = elements.map((el: any) => ({ ...el, pulse: false, flash: null }));
      const ii = elems.findIndex((e: any) => e.index === i); const ij = elems.findIndex((e: any) => e.index === j);
      if (ii === -1 || ij === -1) return state;
      const ne = [...elems];
      ne[ii] = { ...ne[ii], index: j }; ne[ij] = { ...ne[ij], index: i };
      return { ...state, elements: ne };
    }
    case 'batch-shift': {
      const [start, end] = step.range; const dir = step.direction === 'right' ? 1 : -1;
      return { ...state, elements: elements.map((el: any) => el.index >= start && el.index <= end
        ? { ...el, index: el.index + dir, pulse: false, flash: null } : { ...el, pulse: false, flash: null }) };
    }
    case 'fade-in': {
      const ne = elements.map((el: any) => ({ ...el, index: el.index >= step.target ? el.index + 1 : el.index, pulse: false, flash: null }));
      ne.push({ id: `fi-${Date.now()}-${Math.random()}`, value: step.value ?? step.target, index: step.target,
        color: STATE_COLORS.default.bg, textColor: STATE_COLORS.default.text, opacity: instant ? 1 : 0,
        pulse: false, flash: null, _fadingIn: !instant });
      return { ...state, elements: ne };
    }
    case 'fade-out': {
      const ne = elements.map((el: any) => el.index === step.target ? { ...el, opacity: 0, pulse: false, flash: null } : { ...el, pulse: false, flash: null });
      return { ...state, elements: ne, _pendingRemove: step.target };
    }
    case 'visit': {
      const sc = (STATE_COLORS as any)[step.state] || STATE_COLORS.default;
      return { ...state, elements: elements.map((el: any) => el.index === step.target
        ? { ...el, color: sc.bg, textColor: sc.text, pulse: !instant, flash: null } : { ...el, pulse: false, flash: null }) };
    }
    case 'pointer': {
      const { label, to } = step;
      if (to === null || to === undefined) { const np = { ...pointers }; delete np[label]; return { ...state, pointers: np }; }
      return { ...state, pointers: { ...pointers, [label]: to } };
    }
    case 'compare': {
      const [a, b] = step.targets;
      let fc = COMPARE_COLORS.neutral;
      if (step.result === 'pass') fc = COMPARE_COLORS.pass;
      else if (step.result === 'fail') fc = COMPARE_COLORS.fail;
      const tgt = new Set([a, b]);
      return { ...state, elements: elements.map((el: any) => tgt.has(el.index)
        ? { ...el, flash: instant ? null : fc, pulse: false } : { ...el, pulse: false, flash: null }) };
    }
    case 'search-narrow': return { ...state, dimRegion: { activeStart: step.active[0], activeEnd: step.active[1] } };
    case 'value-update': {
      return { ...state, elements: elements.map((el: any) => el.index === step.target
        ? { ...el, value: step.value, flash: instant ? null : VALUE_UPDATE_COLOR, pulse: false } : { ...el, pulse: false, flash: null }) };
    }
    case 'annotate': {
      const na = { ...annotations };
      if (step.text === null) delete na[String(step.target)]; else na[String(step.target)] = step.text;
      return { ...state, annotations: na };
    }
    case 'group': {
      if (!step.targets) return { ...state, elementGroups: {} };
      const ng = { ...elementGroups };
      step.targets.forEach((t: any) => { if (step.color === null) delete ng[String(t)]; else ng[String(t)] = step.color; });
      return { ...state, elementGroups: ng };
    }
    default: return state;
  }
}

export default function LinearRenderer({ config, steps, currentIndex, isSeek }: RendererProps) {
  const [state, setState] = useState(() => initState(config));
  useEffect(() => { setState(initState(config)); }, [config]);

  useEffect(() => {
    if (currentIndex < 0 || !steps) { setState(initState(config)); return; }
    if (isSeek) {
      let s = initState(config);
      for (let i = 0; i <= currentIndex; i++) {
        s = applyStepToState(s, steps[i], true);
        if (s._pendingRemove !== undefined) {
          const t = s._pendingRemove;
          s = { ...s, elements: s.elements.filter((el: any) => el.index !== t).map((el: any) => ({ ...el, index: el.index > t ? el.index - 1 : el.index })), _pendingRemove: undefined };
        }
        s = { ...s, elements: s.elements.map((el: any) => el._fadingIn ? { ...el, opacity: 1, _fadingIn: false } : el) };
      }
      setState(s);
    } else {
      setState(prev => {
        let cleaned = prev;
        if (prev._pendingRemove !== undefined) {
          const t = prev._pendingRemove;
          cleaned = { ...prev, elements: prev.elements.filter((el: any) => el.index !== t).map((el: any) => ({ ...el, index: el.index > t ? el.index - 1 : el.index })), _pendingRemove: undefined };
        }
        return applyStepToState(cleaned, steps[currentIndex], false);
      });
      if (steps[currentIndex]?.type === 'fade-in') {
        setTimeout(() => setState(prev => ({ ...prev, elements: prev.elements.map((el: any) => el._fadingIn ? { ...el, opacity: 1, _fadingIn: false } : el) })), 50);
      }
      if (steps[currentIndex]?.type === 'fade-out') {
        setTimeout(() => setState(prev => {
          if (prev._pendingRemove === undefined) return prev;
          const t = prev._pendingRemove;
          return { ...prev, elements: prev.elements.filter((el: any) => el.index !== t).map((el: any) => ({ ...el, index: el.index > t ? el.index - 1 : el.index })), _pendingRemove: undefined };
        }), DURATIONS.fade + 100);
      }
    }
  }, [currentIndex, isSeek, config, steps]);

  const { elements, pointers, dimRegion, annotations, elementGroups } = state;
  const maxIndex = elements.reduce((m, el) => Math.max(m, el.index), elements.length - 1);
  const totalWidth = (maxIndex + 1) * CELL + GAP;
  const pointerLabels = Object.entries(pointers);
  const pointerColorMap: Record<string, string> = {};
  pointerLabels.forEach(([label], i) => { pointerColorMap[label] = POINTER_PALETTE[i % POINTER_PALETTE.length]; });
  const pointersByTarget: Record<number, string[]> = {};
  pointerLabels.forEach(([label, ti]) => { if (!pointersByTarget[ti as number]) pointersByTarget[ti as number] = []; pointersByTarget[ti as number].push(label); });

  return (
    <div style={{ position: 'relative', width: totalWidth, height: CONTAINER_HEIGHT, minWidth: '100%' }}>
      {dimRegion && <DimOverlay totalWidth={totalWidth} totalHeight={CONTAINER_HEIGHT}
        activeStart={dimRegion.activeStart} activeEnd={dimRegion.activeEnd}
        elementWidth={BOX_SIZE} gap={GAP} />}
      {elements.map((el: any) => (
        <AnimatedElement key={el.id} x={el.index * CELL} y={ELEM_Y}
          value={el.value} color={el.color} textColor={el.textColor}
          opacity={el.opacity} pulse={el.pulse} flash={el.flash}
          size={BOX_SIZE} instant={isSeek}
          groupColor={elementGroups[String(el.index)] ?? null}
        />
      ))}
      {elements.map((el: any) => (
        <div key={`lbl-${el.id}`} style={{ position: 'absolute', left: el.index * CELL,
          top: ELEM_Y + BOX_SIZE + 4, width: BOX_SIZE, textAlign: 'center',
          fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace',
          transition: isSeek ? 'none' : `left ${DURATIONS.move}ms ease-out` }}>
          {config?.labels?.[el.index] ?? el.index}
        </div>
      ))}
      {pointerLabels.map(([label, targetIdx]) => {
        const stack = pointersByTarget[targetIdx as number] || []; const stackOffset = stack.indexOf(label);
        return <PointerLabel key={label} label={label} x={(targetIdx as number) * CELL + BOX_SIZE / 2} y={ELEM_Y}
          color={pointerColorMap[label]} position='above' stackOffset={stackOffset} instant={isSeek} />;
      })}
      {Object.entries(annotations).map(([annIdx, text]) => {
        const i = Number(annIdx);
        return <PointerLabel key={`ann-${annIdx}`} label={text}
          x={i * CELL + BOX_SIZE / 2} y={ELEM_Y + BOX_SIZE}
          color='#374151' position='below' instant={isSeek} />;
      })}
    </div>
  );
}
