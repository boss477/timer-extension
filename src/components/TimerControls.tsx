import React from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onToggle: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function TimerControls({ isRunning, isPaused, onToggle, onPause, onReset }: TimerControlsProps) {
  return (
    <div className="flex gap-2">
      {isRunning || isPaused ? (
        <>
          <button
            onClick={isPaused ? onToggle : onPause}
            className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-xs ${
              isPaused
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3" /> Resume
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" /> Pause
              </>
            )}
          </button>
          <button
            onClick={onReset}
            className="py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-xs bg-gray-700 hover:bg-gray-600 text-white"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </>
      ) : (
        <button
          onClick={onToggle}
          className="w-full py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors text-xs bg-gray-700 hover:bg-gray-600 text-white"
        >
          <Play className="w-3 h-3" /> Start
        </button>
      )}
    </div>
  );
}