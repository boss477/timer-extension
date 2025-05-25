import React, { useState, useEffect, useRef } from 'react';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TimerSettings from './TimerSettings';
import TimeInput from './TimeInput';
import SoundSettings from './SoundSettings';

interface Position {
  x: number;
  y: number;
}

interface SoundSettings {
  enabled: boolean;
  volume: number;
  tickInterval: number;
  soundType: 'paper' | 'clock' | 'digital' | 'custom';
  endSoundType: 'trumpet' | 'bell' | 'chime' | 'custom';
  customTickSound?: File;
  customEndSound?: File;
}

export default function Timer() {
  const [time, setTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({
    enabled: true,
    volume: 0.5,
    tickInterval: 1,
    soundType: 'paper',
    endSoundType: 'trumpet'
  });

  const timerRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const endSoundRef = useRef<HTMLAudioElement | null>(null);

  const soundUrls = {
    paper: 'https://cdn.freesound.org/previews/240/240776_4107740-lq.mp3',
    clock: 'https://cdn.freesound.org/previews/448/448080_6142149-lq.mp3',
    digital: 'https://cdn.freesound.org/previews/337/337049_5121236-lq.mp3',
    trumpet: 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3',
    bell: 'https://cdn.freesound.org/previews/337/337049_5121236-lq.mp3',
    chime: 'https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3'
  };

  useEffect(() => {
    if (soundSettings.enabled) {
      if (soundSettings.soundType === 'custom' && soundSettings.customTickSound) {
        tickSoundRef.current = new Audio(URL.createObjectURL(soundSettings.customTickSound));
      } else {
        tickSoundRef.current = new Audio(soundUrls[soundSettings.soundType]);
      }
      tickSoundRef.current.volume = soundSettings.volume;

      if (soundSettings.endSoundType === 'custom' && soundSettings.customEndSound) {
        endSoundRef.current = new Audio(URL.createObjectURL(soundSettings.customEndSound));
      } else {
        endSoundRef.current = new Audio(soundUrls[soundSettings.endSoundType]);
      }
      endSoundRef.current.volume = soundSettings.volume;

      return () => {
        if (tickSoundRef.current) {
          URL.revokeObjectURL(tickSoundRef.current.src);
        }
        if (endSoundRef.current) {
          URL.revokeObjectURL(endSoundRef.current.src);
        }
      };
    }
  }, [soundSettings]);

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            if (soundSettings.enabled && endSoundRef.current) {
              endSoundRef.current.currentTime = 0;
              endSoundRef.current.play().catch(() => {});
            }
            return 0;
          }
          
          if (soundSettings.enabled && tickSoundRef.current && prevTime % soundSettings.tickInterval === 0) {
            tickSoundRef.current.currentTime = 0;
            tickSoundRef.current.volume = Math.min(
              soundSettings.volume * (1 + (300 - prevTime) / 300),
              1
            );
            tickSoundRef.current.play().catch(() => {});
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, soundSettings]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleTimer = () => {
    if (time === 0) {
      setTime(300);
    }
    setIsRunning(!isRunning);
  };

  const handleTimeSet = (seconds: number) => {
    setTime(seconds);
    setShowSettings(false);
    setIsRunning(true);
  };

  return (
    <div
      ref={containerRef}
      className="fixed select-none"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 9999,
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        className={`bg-[#111] rounded-xl shadow-lg p-3 transition-all duration-300 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${time === 0 ? 'animate-pulse' : ''}`}
        style={{ width: '160px' }}
      >
        <TimerDisplay
          time={time}
          showSettings={showSettings}
          showSoundSettings={showSoundSettings}
          onSettingsToggle={() => {
            setShowSettings(!showSettings);
            setShowSoundSettings(false);
          }}
          onSoundSettingsToggle={() => {
            setShowSoundSettings(!showSoundSettings);
            setShowSettings(false);
          }}
        />
        
        <TimeInput onTimeSet={handleTimeSet} />
        
        <TimerControls
          isRunning={isRunning}
          onToggle={toggleTimer}
        />

        {showSettings && (
          <TimerSettings onTimeSet={handleTimeSet} />
        )}

        {showSoundSettings && (
          <SoundSettings
            settings={soundSettings}
            onChange={setSoundSettings}
          />
        )}
      </div>
    </div>
  );
}