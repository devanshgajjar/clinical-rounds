import React, { useState, useEffect } from 'react';
import { XPMultiplier, StepType } from '../../types/game';
import { XPSystem } from '../../logic/xpSystem';

interface XPMultiplierDisplayProps {
  multiplier: XPMultiplier;
  currentStep: StepType;
  timeElapsed: number;
  isStepCompleted: boolean;
  className?: string;
}

const XPMultiplierDisplay: React.FC<XPMultiplierDisplayProps> = ({
  multiplier,
  currentStep,
  timeElapsed,
  isStepCompleted,
  className = ''
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [previousMultiplier, setPreviousMultiplier] = useState(multiplier.current);

  // Trigger animation when multiplier changes
  useEffect(() => {
    if (multiplier.current !== previousMultiplier && isStepCompleted) {
      setShowAnimation(true);
      setPreviousMultiplier(multiplier.current);
      
      setTimeout(() => setShowAnimation(false), 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiplier.current, previousMultiplier, isStepCompleted]);

  const getMultiplierColor = (current: number) => {
    if (current >= 4) return '#DC2626'; // Red hot
    if (current >= 3) return '#EA580C'; // Orange
    if (current >= 2) return '#CA8A04'; // Yellow
    return '#6B7280'; // Gray
  };

  const getTimeZone = () => XPSystem.getTimeZoneDescription(timeElapsed);
  const timeZone = getTimeZone();

  const getMultiplierTiers = () => {
    const tiers = [
      { value: 1, label: "1x", active: multiplier.current >= 1 },
      { value: 2, label: "2x", active: multiplier.current >= 2 },
      { value: 3, label: "3x", active: multiplier.current >= 3 },
      { value: 4, label: "4x", active: multiplier.current >= 4 },
    ];
    return tiers;
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm p-3 ${className}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">XP Multiplier</span>
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: timeZone.color }}
          />
          <span className="text-xs text-gray-500">{timeZone.zone}</span>
        </div>
        <div 
          className={`text-xl font-bold transition-all duration-300 ${
            showAnimation ? 'scale-110' : ''
          }`}
          style={{ color: getMultiplierColor(multiplier.current) }}
        >
          {multiplier.current.toFixed(1)}x
        </div>
      </div>

      {/* Compact Progress Bar */}
      <div className="flex items-center space-x-1">
        {getMultiplierTiers().map((tier) => (
          <div key={tier.value} className="flex-1">
            <div
              className={`h-1.5 rounded transition-all duration-300 ${
                tier.active
                  ? 'bg-gradient-to-r from-yellow-400 to-red-500'
                  : 'bg-gray-200'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Animation Effects */}
      {showAnimation && (
        <div className="absolute -top-1 -right-1 text-lg animate-bounce pointer-events-none">
          {multiplier.current >= 4 ? '🔥' : multiplier.current >= 3 ? '⚡' : '✨'}
        </div>
      )}
    </div>
  );
};

export default XPMultiplierDisplay; 