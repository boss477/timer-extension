import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import AudioUpload from './AudioUpload';

interface SoundSettingsProps {
  settings: {
    enabled: boolean;
    volume: number;
    tickInterval: number;
    soundType: string;
    endSoundType: string;
    customTickSound?: File;
    customEndSound?: File;
  };
  onChange: (settings: any) => void;
}

export default function SoundSettings({ settings, onChange }: SoundSettingsProps) {
  const handleTickAudioSelect = (file: File) => {
    onChange({ ...settings, soundType: 'custom', customTickSound: file });
  };

  const handleEndAudioSelect = (file: File) => {
    onChange({ ...settings, endSoundType: 'custom', customEndSound: file });
  };

  const removeTickAudio = () => {
    const { customTickSound, ...rest } = settings;
    onChange({ ...rest, soundType: 'paper' });
  };

  const removeEndAudio = () => {
    const { customEndSound, ...rest } = settings;
    onChange({ ...rest, endSoundType: 'trumpet' });
  };

  return (
    <div className="absolute top-full left-0 right-0 bg-[#111] rounded-lg shadow-lg mt-2 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-200">Sound Effects</span>
        <button
          onClick={() => onChange({ ...settings, enabled: !settings.enabled })}
          className="text-gray-400 hover:text-gray-200"
        >
          {settings.enabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
        </button>
      </div>

      <div className="space-y-2">
        <label className="block">
          <span className="text-xs text-gray-400">Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.volume}
            onChange={(e) => onChange({ ...settings, volume: parseFloat(e.target.value) })}
            className="w-full"
          />
        </label>

        <label className="block">
          <span className="text-xs text-gray-400">Tick Interval (seconds)</span>
          <select
            value={settings.tickInterval}
            onChange={(e) => onChange({ ...settings, tickInterval: parseInt(e.target.value) })}
            className="w-full bg-gray-900 text-white rounded text-xs p-1"
          >
            <option value="1">Every second</option>
            <option value="2">Every 2 seconds</option>
            <option value="5">Every 5 seconds</option>
          </select>
        </label>

        <div className="space-y-1">
          <span className="text-xs text-gray-400">Tick Sound</span>
          {settings.soundType !== 'custom' && (
            <select
              value={settings.soundType}
              onChange={(e) => onChange({ ...settings, soundType: e.target.value })}
              className="w-full bg-gray-900 text-white rounded text-xs p-1"
            >
              <option value="paper">Paper Flip</option>
              <option value="clock">Clock Tick</option>
              <option value="digital">Digital Beep</option>
              <option value="custom">Custom Sound</option>
            </select>
          )}
          {settings.soundType === 'custom' && (
            <AudioUpload
              onAudioSelect={handleTickAudioSelect}
              onRemove={removeTickAudio}
              currentFileName={settings.customTickSound?.name}
            />
          )}
        </div>

        <div className="space-y-1">
          <span className="text-xs text-gray-400">End Sound</span>
          {settings.endSoundType !== 'custom' && (
            <select
              value={settings.endSoundType}
              onChange={(e) => onChange({ ...settings, endSoundType: e.target.value })}
              className="w-full bg-gray-900 text-white rounded text-xs p-1"
            >
              <option value="trumpet">Trumpet Fanfare</option>
              <option value="bell">Bell Ring</option>
              <option value="chime">Wind Chime</option>
              <option value="custom">Custom Sound</option>
            </select>
          )}
          {settings.endSoundType === 'custom' && (
            <AudioUpload
              onAudioSelect={handleEndAudioSelect}
              onRemove={removeEndAudio}
              currentFileName={settings.customEndSound?.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}