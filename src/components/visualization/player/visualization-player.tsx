'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { type Command } from '@/lib/tracers';
import { splitIntoChunks, type Chunk } from '../renderers/types';
import { Array1DRenderer } from '../renderers/array-1d-renderer';
import { Array2DRenderer } from '../renderers/array-2d-renderer';
import { GraphRenderer } from '../renderers/graph-renderer';
import { LogRenderer } from '../renderers/log-renderer';
import { ChartRenderer } from '../renderers/chart-renderer';

export interface VisualizationPlayerProps {
  commands: Command[];
  className?: string;
}

/**
 * Detect ALL tracers present in commands
 */
function detectTracerTypes(commands: Command[]): string[] {
  const tracerTypes = new Set<string>();

  for (const command of commands) {
    if (command.method.endsWith('Tracer') && command.key !== null) {
      const type = command.method;

      if (type === 'Array1DTracer') tracerTypes.add('array1d');
      else if (type === 'Array2DTracer') tracerTypes.add('array2d');
      else if (type === 'GraphTracer') tracerTypes.add('graph');
      else if (type === 'LogTracer') tracerTypes.add('log');
      else if (type === 'ChartTracer') tracerTypes.add('chart');
    }
  }

  return Array.from(tracerTypes);
}

/**
 * Render ALL visualization components detected
 */
function renderVisualizations(commands: Command[], tracerTypes: string[]) {
  if (tracerTypes.length === 0) {
    return <LogRenderer commands={commands} />;
  }

  // Separate visual tracers from log tracer
  const hasLog = tracerTypes.includes('log');
  const visualTracers = tracerTypes.filter(t => t !== 'log');

  const renderTracer = (type: string) => {
    switch (type) {
      case 'array1d':
        return <Array1DRenderer key={type} commands={commands} />;
      case 'array2d':
        return <Array2DRenderer key={type} commands={commands} />;
      case 'graph':
        return <GraphRenderer key={type} commands={commands} />;
      case 'chart':
        return <ChartRenderer key={type} commands={commands} />;
      case 'log':
        return <LogRenderer key={type} commands={commands} />;
      default:
        return null;
    }
  };

  // Layout: visual tracers on top, logs below
  return (
    <div className="flex flex-col gap-4">
      {/* Visual tracers */}
      {visualTracers.length > 0 && (
        <div className="flex flex-col gap-4">
          {visualTracers.map(type => renderTracer(type))}
        </div>
      )}

      {/* Logs always at bottom for step-by-step explanation */}
      {hasLog && (
        <div className="border-t border-gray-700 pt-4">
          <LogRenderer commands={commands} />
        </div>
      )}
    </div>
  );
}

/**
 * Visualization player with animation controls
 */
export function VisualizationPlayer({ commands, className = '' }: VisualizationPlayerProps) {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.25x to 4x
  const [tracerTypes, setTracerTypes] = useState<string[]>([]);

  // Initialize chunks and tracer types
  useEffect(() => {
    const newChunks = splitIntoChunks(commands);
    setChunks(newChunks);
    setCurrentChunk(0);
    setTracerTypes(detectTracerTypes(commands));
    setIsPlaying(false);
  }, [commands]);

  // Get commands up to current chunk
  const getCurrentCommands = useCallback(() => {
    const allCommands: Command[] = [];
    for (let i = 0; i <= currentChunk && i < chunks.length; i++) {
      allCommands.push(...chunks[i].commands);
    }
    return allCommands;
  }, [chunks, currentChunk]);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = 1000 / speed; // Base delay is 1 second
    const timer = setTimeout(() => {
      if (currentChunk < chunks.length - 1) {
        setCurrentChunk(c => c + 1);
      } else {
        setIsPlaying(false); // Stop at end
      }
    }, interval);

    return () => clearTimeout(timer);
  }, [isPlaying, currentChunk, chunks.length, speed]);

  const handlePlay = () => {
    if (currentChunk >= chunks.length - 1) {
      setCurrentChunk(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentChunk(c => Math.max(0, c - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentChunk(c => Math.min(chunks.length - 1, c + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentChunk(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    setCurrentChunk(parseInt(e.target.value));
  };

  if (!chunks.length) {
    return (
      <div className={`rounded-lg border border-gray-700 bg-gray-900 p-8 text-center ${className}`}>
        <p className="text-gray-500">No visualization data</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Visualization */}
      <div className="flex-1">
        {renderVisualizations(getCurrentCommands(), tracerTypes)}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono w-16">
            {currentChunk + 1} / {chunks.length}
          </span>
          <input
            type="range"
            min="0"
            max={chunks.length - 1}
            value={currentChunk}
            onChange={handleProgressChange}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-blue-500
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:w-4
                       [&::-moz-range-thumb]:h-4
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-blue-500
                       [&::-moz-range-thumb]:border-0
                       [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={handlePrevious}
            disabled={currentChunk === 0}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous"
          >
            <SkipBack size={18} />
          </button>

          {isPlaying ? (
            <button
              onClick={handlePause}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              title="Pause"
            >
              <Pause size={18} />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              title="Play"
            >
              <Play size={18} />
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={currentChunk >= chunks.length - 1}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next"
          >
            <SkipForward size={18} />
          </button>

          {/* Speed control */}
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Speed:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="4">4x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
