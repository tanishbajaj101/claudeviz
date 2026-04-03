import { useState, useRef, useCallback, useEffect } from 'react';

export interface PlayerState {
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  seekTo: (index: number) => void;
  setSpeed: (speed: number) => void;
}

export function usePlayer(steps: any[] | null, onStep: (step: any, index: number, seek?: boolean) => void, initialStep?: number): PlayerState {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<any>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep(prev => {
      const next = prev + 1;
      if (!stepsRef.current || next >= stepsRef.current.length) {
        stopInterval();
        setIsPlaying(false);
        return prev;
      }
      onStepRef.current?.(stepsRef.current[next], next);
      return next;
    });
  }, [stopInterval]);

  const stepBack = useCallback(() => {
    setCurrentStep(prev => {
      if (prev <= 0) {
        onStepRef.current?.(stepsRef.current?.[0], 0, true);
        return 0;
      }
      const next = prev - 1;
      onStepRef.current?.(stepsRef.current?.[next], next, true);
      return next;
    });
  }, []);

  const play = useCallback(() => {
    if (isPlaying) return;
    if (!stepsRef.current || stepsRef.current.length === 0) return;
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (!stepsRef.current || next >= stepsRef.current.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsPlaying(false);
          return prev;
        }
        onStepRef.current?.(stepsRef.current[next], next);
        return next;
      });
    }, 500 / speedRef.current);
  }, [isPlaying]);

  const pause = useCallback(() => {
    stopInterval();
    setIsPlaying(false);
  }, [stopInterval]);

  const reset = useCallback(() => {
    stopInterval();
    setIsPlaying(false);
    setCurrentStep(-1);
    onStepRef.current?.(null, -1);
  }, [stopInterval]);

  const seekTo = useCallback((index: number) => {
    stopInterval();
    setIsPlaying(false);
    if (!stepsRef.current) return;
    const clamped = Math.max(0, Math.min(index, stepsRef.current.length - 1));
    setCurrentStep(clamped);
    onStepRef.current?.(stepsRef.current[clamped], clamped, true);
  }, [stopInterval]);

  const changeSpeed = useCallback((s: number) => {
    setSpeed(s);
    if (intervalRef.current) {
      stopInterval();
      // Re-start with new speed if was playing
      // But for simplicity, we just pause. Most players do this.
      setIsPlaying(false);
    }
  }, [stopInterval]);

  // Reset when steps change — seek to initialStep if provided
  useEffect(() => {
    stopInterval();
    setIsPlaying(false);
    if (initialStep != null && initialStep >= 0 && steps && steps.length > 0) {
      const idx = Math.min(initialStep, steps.length - 1);
      setCurrentStep(idx);
      onStepRef.current?.(steps[idx], idx, true);
    } else {
      setCurrentStep(-1);
    }
  }, [steps, stopInterval, initialStep]);

  // Cleanup on unmount
  useEffect(() => () => stopInterval(), [stopInterval]);

  return {
    currentStep,
    isPlaying,
    speed,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    seekTo,
    setSpeed: changeSpeed,
  };
}
