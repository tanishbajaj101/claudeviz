

import { Separator } from "react-resizable-panels";

interface ResizeHandleProps {
    direction?: "horizontal" | "vertical";
    className?: string;
}

export function ResizeHandle({ direction = "horizontal", className = "" }: ResizeHandleProps) {
    const isHorizontal = direction === "horizontal";

    return (
        <Separator
            className={`group relative flex items-center justify-center transition-colors
        ${isHorizontal ? "w-1.5 cursor-col-resize hover:bg-primary/20" : "h-1.5 cursor-row-resize hover:bg-primary/20"}
        ${className}
      `}
        >
            {/* Visible drag indicator */}
            <div
                className={`rounded-full bg-zinc-600 transition-all group-hover:bg-emerald-400 group-active:bg-emerald-300 group-data-[resize-handle-active]:bg-emerald-400
          ${isHorizontal ? "h-8 w-1" : "h-1 w-8"}
        `}
            />
        </Separator>
    );
}
