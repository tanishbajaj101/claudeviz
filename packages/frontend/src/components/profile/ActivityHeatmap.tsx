

import { useState, useMemo } from "react";

interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
}

interface ActivityHeatmapProps {
  heatmap: HeatmapDay[];
}

const COLOR_SCALE = {
  0: "bg-muted/30",
  1: "bg-emerald-400/20",
  2: "bg-emerald-400/40",
  3: "bg-emerald-400/60",
  4: "bg-emerald-400/80",
  5: "bg-emerald-400",
} as const;

function getColorClass(count: number): string {
  if (count === 0) return COLOR_SCALE[0];
  if (count <= 2) return COLOR_SCALE[1];
  if (count <= 4) return COLOR_SCALE[2];
  if (count <= 8) return COLOR_SCALE[3];
  return COLOR_SCALE[5];
}

export function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Convert heatmap array to map for O(1) lookup
  const heatmapMap = useMemo(() => {
    const map = new Map<string, number>();
    heatmap.forEach((day) => map.set(day.date, day.count));
    return map;
  }, [heatmap]);

  // Generate grid data: 53 weeks × 7 days
  const gridData = useMemo(() => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setHours(0, 0, 0, 0);

    // Start from 365 days ago
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 364);

    // Find the Sunday before start date to align weeks properly
    const dayOfWeek = startDate.getDay();
    const alignedStart = new Date(startDate);
    alignedStart.setDate(alignedStart.getDate() - dayOfWeek);

    const weeks: HeatmapDay[][] = [];
    let currentWeek: HeatmapDay[] = [];
    const current = new Date(alignedStart);

    // Generate 53 weeks worth of data
    for (let i = 0; i < 371; i++) {
      const dateStr = current.toISOString().split("T")[0];
      const count = heatmapMap.get(dateStr) ?? 0;
      const isPastEnd = current > endDate;

      currentWeek.push({
        date: dateStr,
        count: isPastEnd ? -1 : count, // -1 = future date (don't render)
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      current.setDate(current.getDate() + 1);
    }

    return weeks;
  }, [heatmapMap]);

  // Generate month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    gridData.forEach((week, weekIndex) => {
      const firstValidDay = week.find((day) => day.count !== -1);
      if (!firstValidDay) return;

      const date = new Date(firstValidDay.date);
      const month = date.getMonth();

      if (month !== lastMonth && weekIndex > 0) {
        labels.push({
          month: date.toLocaleDateString("en-US", { month: "short" }),
          weekIndex,
        });
        lastMonth = month;
      }
    });

    return labels;
  }, [gridData]);

  const handleMouseEnter = (day: HeatmapDay, event: React.MouseEvent) => {
    if (day.count === -1) return;
    setHoveredDay(day);
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <div className="relative">
      <div className="mb-2 flex items-center gap-4">
        <h3 className="font-mono text-sm font-medium text-muted-foreground">
          Activity
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-2.5 w-2.5 rounded-sm ${getColorClass(level === 0 ? 0 : level === 1 ? 1 : level === 2 ? 3 : level === 3 ? 5 : level === 4 ? 7 : 10)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="relative overflow-x-auto rounded-md border border-border bg-card/50 p-4">
        {/* Month labels */}
        <div className="mb-1 flex" style={{ marginLeft: "20px" }}>
          {monthLabels.map((label, i) => (
            <div
              key={i}
              className="font-mono text-xs text-muted-foreground"
              style={{
                position: "absolute",
                left: `${20 + label.weekIndex * 13}px`,
              }}
            >
              {label.month}
            </div>
          ))}
        </div>

        {/* Day labels + Grid */}
        <div className="flex gap-1" style={{ marginTop: "16px" }}>
          {/* Day of week labels */}
          <div className="flex flex-col justify-around pr-1">
            <span className="font-mono text-xs text-zinc-600">Sun</span>
            <span className="font-mono text-xs text-zinc-600">Mon</span>
            <span className="font-mono text-xs text-zinc-600">Tue</span>
            <span className="font-mono text-xs text-zinc-600">Wed</span>
            <span className="font-mono text-xs text-zinc-600">Thu</span>
            <span className="font-mono text-xs text-zinc-600">Fri</span>
            <span className="font-mono text-xs text-zinc-600">Sat</span>
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {gridData.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) => {
                  if (day.count === -1) {
                    return <div key={dayIdx} className="h-2.5 w-2.5" />;
                  }

                  return (
                    <div
                      key={dayIdx}
                      className={`h-2.5 w-2.5 rounded-sm transition-all hover:ring-1 hover:ring-emerald-400 ${getColorClass(day.count)}`}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md border border-border bg-card px-3 py-1.5 shadow-lg"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="whitespace-nowrap font-mono text-xs text-foreground">
            <span className="font-semibold text-emerald-400">
              {hoveredDay.count}
            </span>{" "}
            submission{hoveredDay.count !== 1 ? "s" : ""} on{" "}
            {new Date(hoveredDay.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      )}
    </div>
  );
}
