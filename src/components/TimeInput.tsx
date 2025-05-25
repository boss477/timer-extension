import React from 'react';

interface TimeInputProps {
  onTimeSet: (seconds: number) => void;
}

export default function TimeInput({ onTimeSet }: TimeInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const minutes = Math.max(0, Math.min(59, Number(formData.get('minutes')) || 0));
    const seconds = Math.max(0, Math.min(59, Number(formData.get('seconds')) || 0));
    
    if (minutes === 0 && seconds === 0) {
      return; // Don't set timer if both values are 0
    }
    
    onTimeSet(minutes * 60 + seconds);
    e.currentTarget.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-1 mb-2">
      <div>
        <input
          type="number"
          name="minutes"
          min="0"
          max="59"
          placeholder="Min"
          className="w-full px-2 py-0.5 bg-gray-800 text-white rounded text-xs"
          onKeyDown={handleKeyDown}
        />
      </div>
      <div>
        <input
          type="number"
          name="seconds"
          min="0"
          max="59"
          placeholder="Sec"
          className="w-full px-2 py-0.5 bg-gray-800 text-white rounded text-xs"
          onKeyDown={handleKeyDown}
        />
      </div>
    </form>
  );
}