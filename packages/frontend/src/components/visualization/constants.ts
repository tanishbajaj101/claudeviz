export const STATE_COLORS = {
  default:   { bg: 'hsl(var(--muted))',          text: 'hsl(var(--foreground))' },
  current:   { bg: 'hsl(var(--primary) / 0.2)',  text: 'hsl(var(--primary))' },
  exploring: { bg: 'hsl(var(--accent))',          text: 'hsl(var(--accent-foreground))' },
  visited:   { bg: 'hsl(var(--secondary))',       text: 'hsl(var(--secondary-foreground))' },
  active:    { bg: 'hsl(var(--viz-active-bg))',   text: 'hsl(var(--viz-active-text))' },
};

export const EDGE_COLORS = {
  default:   'hsl(var(--muted-foreground))',
  exploring: 'hsl(var(--primary))',
  accepted:  'hsl(var(--viz-active-text))',
  rejected:  'hsl(var(--border))',
};

export const POINTER_PALETTE = ['hsl(var(--primary))','#EF4444','#10B981','#F59E0B','#8B5CF6'];

export const COMPARE_COLORS = {
  neutral: 'hsl(var(--muted))',
  pass:    'hsl(var(--viz-active-bg))',
  fail:    'hsl(var(--destructive) / 0.25)',
};

export const VALUE_UPDATE_COLOR = 'hsl(var(--primary) / 0.15)';


export const GROUP_COLORS = ['#EF4444','#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899'];
export const HIGHLIGHT_RANGE_COLOR = { border: 'hsl(var(--primary))', bg: 'hsl(var(--primary) / 0.12)' };

export const DURATIONS = {
  move: 300,
  fade: 250,
  color: 200,
  pulse: 200,
  layout: 500,
};
