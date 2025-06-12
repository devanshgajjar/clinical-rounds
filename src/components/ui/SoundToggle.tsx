import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/soundManager';

const SoundToggle: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Check if sounds are enabled from localStorage
    const savedSetting = localStorage.getItem('soundEnabled');
    if (savedSetting !== null) {
      const enabled = savedSetting === 'true';
      setIsEnabled(enabled);
      soundManager.setEnabled(enabled);
    }
  }, []);

  const toggleSound = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    soundManager.setEnabled(newEnabled);
  };

  return (
    <button
      onClick={toggleSound}
      className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-2 shadow-lg hover:bg-gray-50 transition-colors"
      title={isEnabled ? 'Disable sounds' : 'Enable sounds'}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">
          {isEnabled ? '🔊' : '🔇'}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {isEnabled ? 'ON' : 'OFF'}
        </span>
      </div>
    </button>
  );
};

export default SoundToggle; 