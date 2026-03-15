import { useEffect, useState } from 'react';
import AnimatedElement from '../ui/AnimatedElement';
import PointerLabel from '../ui/PointerLabel';
import { STATE_COLORS, COMPARE_COLORS, VALUE_UPDATE_COLOR, POINTER_PALETTE } from '../constants';
import { RendererProps } from './types';

const CELL = 44;
const GAP = 6;
const CELL_STEP = CELL + GAP;
const LABEL_OFFSET = 24;

function initState(config: any) {
  if (!config || !config.data) return { elements: [] as any[], pointers: {} as Record<string, any>, annotations: {} as Record<string, any>, elementGroups: {} as Record<string, any>, _pendingRemove: undefined as string | undefined };
  const data = config.data;
  const elements = [];
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      elements.push({ id: `${r}-${c}`, row: r, col: c, value: data[r][c],
        color: STATE_COLORS.default.bg, textColor: STATE_COLORS.default.text,
        opacity: 1, pulse: false, flash: null as string | null });
    }
  }
  return { elements, pointers: {} as Record<string, any>, annotations: {} as Record<string, any>, elementGroups: {} as Record<string, any>, _pendingRemove: undefined as string | undefined };
}

function applyStepToState(state: any, step: any, instant: boolean) {
  if (!step) return state;
  let { elements, pointers, annotations, elementGroups } = state;
  const matchTarget = (el: any, t: any) => Array.isArray(t) && el.row === t[0] && el.col === t[1];

  switch (step.type) {
    case 'visit': {
      const sc = (STATE_COLORS as any)[step.state] || STATE_COLORS.default;
      const newElems = elements.map((el: any) => matchTarget(el, step.target)
        ? { ...el, color: sc.bg, textColor: sc.text, pulse: !instant, flash: null }
        : { ...el, pulse: false, flash: null });
      return { ...state, elements: newElems };
    }
    case 'compare': {
      let fc = COMPARE_COLORS.neutral;
      if (step.result === 'pass') fc = COMPARE_COLORS.pass;
      else if (step.result === 'fail') fc = COMPARE_COLORS.fail;
      const newElems = elements.map((el: any) => step.targets.some((t: any) => matchTarget(el, t))
        ? { ...el, flash: instant ? null : fc, pulse: false }
        : { ...el, pulse: false, flash: null });
      return { ...state, elements: newElems };
    }
    case 'value-update': {
      const newElems = elements.map((el: any) => matchTarget(el, step.target)
        ? { ...el, value: step.value, flash: instant ? null : VALUE_UPDATE_COLOR, pulse: false }
        : { ...el, pulse: false, flash: null });
      return { ...state, elements: newElems };
    }
    case 'swap': {
      const [a, b] = step.targets;
      const ia = elements.findIndex((el: any) => matchTarget(el, a));
      const ib = elements.findIndex((el: any) => matchTarget(el, b));
      if (ia === -1 || ib === -1) return state;
      const ne = elements.map((el: any) => ({ ...el, pulse: false, flash: null }));
      const tv = ne[ia].value; ne[ia] = { ...ne[ia], value: ne[ib].value }; ne[ib] = { ...ne[ib], value: tv };
      return { ...state, elements: ne };
    }
    case 'pointer': {
      const { label, to } = step;
      if (to === null || to === undefined) { const np = { ...pointers }; delete np[label]; return { ...state, pointers: np }; }
      return { ...state, pointers: { ...pointers, [label]: to } };
    }
    case 'fade-in': {
      const [r, c] = step.target;
      const id = `${r}-${c}`;
      if (elements.find((el: any) => el.id === id)) return state;
      const newEl = { id, row: r, col: c, value: step.value ?? '',
        color: STATE_COLORS.default.bg, textColor: STATE_COLORS.default.text,
        opacity: instant ? 1 : 0, _fadingIn: !instant, pulse: false, flash: null as string | null };
      return { ...state, elements: [...elements, newEl] };
    }
    case 'fade-out': {
      const id = `${step.target[0]}-${step.target[1]}`;
      return { ...state, elements: elements.map((el: any) => el.id === id ? { ...el, opacity: 0 } : el), _pendingRemove: id };
    }
    case 'annotate': {
      const id = `${step.target[0]}-${step.target[1]}`;
      const na = { ...annotations };
      if (step.text === null) delete na[id]; else na[id] = step.text;
      return { ...state, annotations: na };
    }
    case 'group': {
      if (!step.targets) return { ...state, elementGroups: {} };
      const ng = { ...elementGroups };
      step.targets.forEach((t: any) => {
        const id = `${t[0]}-${t[1]}`;
        if (step.color === null) delete ng[id]; else ng[id] = step.color;
      });
      return { ...state, elementGroups: ng };
    }
    default: return state;
  }
}

function finalizeFadeIn(state: any) {
  const ne = state.elements.map((el: any) => el._fadingIn ? { ...el, opacity: 1, _fadingIn: false } : el);
  return ne.some((el: any, i: number) => el !== state.elements[i]) ? { ...state, elements: ne } : state;
}

function finalizePendingRemove(state: any) {
  if (state._pendingRemove === undefined) return state;
  const id = state._pendingRemove;
  return { ...state, elements: state.elements.filter((el: any) => el.id !== id), _pendingRemove: undefined };
}

export default function GridRenderer({ config, steps, currentIndex, isSeek }: RendererProps) {
  const [state, setState] = useState(() => initState(config));
  useEffect(() => { setState(initState(config)); }, [config]);

  useEffect(() => {
    if (currentIndex < 0 || !steps) { setState(initState(config)); return; }
    if (isSeek) {
      let s = initState(config);
      for (let i = 0; i <= currentIndex; i++) {
        s = applyStepToState(s, steps[i], true);
        if (s._pendingRemove !== undefined) s = finalizePendingRemove(s);
        s = finalizeFadeIn(s);
      }
      setState(s);
    } else {
      setState(prev => applyStepToState(prev, steps[currentIndex], false));
      if (steps[currentIndex]?.type === 'fade-in') setTimeout(() => setState(prev => finalizeFadeIn(prev)), 50);
      if (steps[currentIndex]?.type === 'fade-out') setTimeout(() => setState(prev => finalizePendingRemove(prev)), 350);
    }
  }, [currentIndex, isSeek, config, steps]);

  const { elements, pointers, annotations, elementGroups } = state;
  const rows = elements.length > 0 ? Math.max(...elements.map((el: any) => el.row)) + 1 : (config?.data?.length || 0);
  const cols = elements.length > 0 ? Math.max(...elements.map((el: any) => el.col)) + 1 : (config?.data?.[0]?.length || 0);
  const containerW = LABEL_OFFSET + cols * CELL_STEP + GAP;
  const containerH = LABEL_OFFSET + rows * CELL_STEP + GAP + 20;
  const pointerLabels = Object.entries(pointers);
  const pointerColorMap: Record<string, string> = {};
  pointerLabels.forEach(([label], i) => { pointerColorMap[label] = POINTER_PALETTE[i % POINTER_PALETTE.length]; });

  return (
    <div style={{ position: 'relative', width: containerW, height: containerH }}>
      {Array.from({ length: cols }, (_, c) => (
        <div key={`col-${c}`} style={{ position: 'absolute', left: LABEL_OFFSET + c * CELL_STEP,
          top: 4, width: CELL, textAlign: 'center', fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{c}</div>
      ))}
      {Array.from({ length: rows }, (_, r) => (
        <div key={`row-${r}`} style={{ position: 'absolute', left: 4,
          top: LABEL_OFFSET + r * CELL_STEP + CELL / 2 - 8,
          fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{r}</div>
      ))}
      {elements.map((el: any) => (
        <AnimatedElement key={el.id}
          x={LABEL_OFFSET + el.col * CELL_STEP} y={LABEL_OFFSET + el.row * CELL_STEP}
          value={el.value} color={el.color} textColor={el.textColor}
          opacity={el.opacity} pulse={el.pulse} flash={el.flash}
          size={CELL} instant={isSeek}
          groupColor={elementGroups[el.id] ?? null}
        />
      ))}
      {pointerLabels.map(([label, target]) => {
        if (!Array.isArray(target)) return null;
        const [r, c] = target;
        return <PointerLabel key={label} label={label}
          x={LABEL_OFFSET + c * CELL_STEP + CELL / 2} y={LABEL_OFFSET + r * CELL_STEP}
          color={pointerColorMap[label]} position='above' instant={isSeek} />;
      })}
      {Object.entries(annotations).map(([id, text]) => {
        const el = elements.find((e: any) => e.id === id); if (!el) return null;
        return <PointerLabel key={`ann-${id}`} label={text}
          x={LABEL_OFFSET + el.col * CELL_STEP + CELL / 2}
          y={LABEL_OFFSET + el.row * CELL_STEP + CELL}
          color='#374151' position='below' instant={isSeek} />;
      })}
    </div>
  );
}
