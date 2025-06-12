import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/soundManager';

const SoundToggle: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.08); // Match new default

  useEffect(() => {
    // Check if sounds are enabled from localStorage
    const savedSetting = localStorage.getItem('soundEnabled');
    const savedVolume = localStorage.getItem('soundVolume');
    
    if (savedSetting !== null) {
      const enabled = savedSetting === 'true';
      setIsEnabled(enabled);
      soundManager.setEnabled(enabled);
    }
    
    if (savedVolume !== null) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      soundManager.setVolume(vol);
    } else {
      // Set the new subtle default
      setVolume(0.08);
      soundManager.setVolume(0.08);
    }
  }, []);

  const toggleSound = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    soundManager.setEnabled(newEnabled);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
  };

  const getVolumeLevel = () => {
    if (volume === 0) return 'OFF';
    if (volume <= 0.05) return 'VERY LOW';
    if (volume <= 0.15) return 'LOW';
    if (volume <= 0.3) return 'MED';
    if (volume <= 0.6) return 'HIGH';
    return 'LOUD';
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
      <div className="flex flex-col gap-2 min-w-[120px]">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors rounded p-1"
            title={isEnabled ? 'Disable sounds' : 'Enable sounds'}
          >
            <span className="text-lg">
              {isEnabled ? '🔊' : '🔇'}
            </span>
            <span className="text-xs font-medium text-gray-700">
              {isEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
        
        {isEnabled && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Volume</span>
              <span className="text-xs font-mono text-gray-500">
                {getVolumeLevel()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.02"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(volume / 0.4) * 100}%, #e5e7eb ${(volume / 0.4) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Silent</span>
              <span>Subtle</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundToggle; 