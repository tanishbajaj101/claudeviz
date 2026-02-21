'use client';

import { type ReactNode } from 'react';

export interface BaseRendererProps {
  title?: string;
  className?: string;
  children: ReactNode;
  enablePan?: boolean;
  enableZoom?: boolean;
}

/**
 * Base renderer with pan/zoom capabilities
 */
export function BaseRenderer({
  title,
  className = '',
  children,
}: BaseRendererProps) {
  return (
    <div className={`flex flex-col h-full bg-gray-900 rounded-lg border border-gray-700 overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-200 truncate">{title}</h3>
        </div>
      )}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}
