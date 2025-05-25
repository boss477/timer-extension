import React from 'react';

interface TimerSettingsProps {
  onTimeSet: (seconds: number) => void;
}

export default function TimerSettings({ onTimeSet }: TimerSettingsProps) {
  const presetTimes = [1, 3, 5, 10, 15, 30];

  return (
    <div className="absolute top-full left-0 right-0 bg-[#111] rounded-lg shadow-lg mt-2 p-3">
      <div className="space-y-1">
        {presetTimes.map((mins) => (
          <button
            key={mins}
            onClick={() => onTimeSet(mins * 60)}
            className="block w-full text-left px-3 py-1.5 rounded text-sm text-gray-200 hover:bg-gray-800"
          >
            {mins} minute{mins !== 1 ? 's' : ''}
          </button>
        ))}
      </div>
    </div>
  );
}