import React, { useEffect, useState } from 'react';
import './XPHeader.css';

interface XPHeaderProps {
  currentMultiplier: number; // 0, 2, 3, or 4
  stepNumber: number; // 1-4
  totalSteps?: number; // Total number of steps (default 4)
  completedSteps?: number; // Number of completed steps
  userName?: string;
  userAvatar?: string;
  dob?: string;
  gender?: string;
  baseXP: number;
  showGlow?: boolean;
  onGlowComplete?: () => void;
}

const XPHeader: React.FC<XPHeaderProps> = ({
  currentMultiplier,
  stepNumber,
  totalSteps = 4,
  completedSteps = 0,
  userName = "Dr. Smith",
  userAvatar = "👨‍⚕️",
  dob = "1990-01-01",
  gender = "M",
  baseXP,
  showGlow = false,
  onGlowComplete
}) => {
  const [glowEffect, setGlowEffect] = useState(false);

  useEffect(() => {
    if (showGlow) {
      setGlowEffect(true);
      const timer = setTimeout(() => {
        setGlowEffect(false);
        onGlowComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showGlow, onGlowComplete]);

  const getStepProgressPercentage = () => {
    return (completedSteps / totalSteps) * 100;
  };

  const getXPMultiplierPercentage = () => {
    switch (currentMultiplier) {
      case 0:
        return 0;
      case 2:
        return 33.33; // Green section
      case 3:
        return 66.66; // Yellow section
      case 4:
        return 100; // Red section
      default:
        return 0;
    }
  };

  const getCurrentXP = () => {
    return currentMultiplier === 0 ? baseXP : baseXP * currentMultiplier;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStepStatusText = () => {
    if (completedSteps === totalSteps) {
      return "All steps completed! 🎉";
    } else if (completedSteps > 0) {
      return `Step ${stepNumber} of ${totalSteps} • ${completedSteps} completed`;
    } else {
      return `Step ${stepNumber} of ${totalSteps} • Get started!`;
    }
  };



  return (
    <div className="enhanced-xp-header" role="banner" aria-label="Progress and XP header">
      {/* Primary Progress Section */}
      <div className="primary-progress-section" role="region" aria-label="Step progress">
        {/* Step Status */}
        <div className="step-status-header">
          <h1 className="step-title" aria-live="polite">
            {getStepStatusText()}
          </h1>
        </div>

        {/* Step Progress Bar */}
        <div className="step-progress-container">
          <div className="step-progress-header">
            <span className="progress-label">Overall Progress</span>
            <span className="progress-value" aria-live="polite">
              {completedSteps}/{totalSteps} steps
            </span>
          </div>
          <div 
            className="step-progress-bar"
            role="progressbar"
            aria-valuenow={completedSteps}
            aria-valuemin={0}
            aria-valuemax={totalSteps}
            aria-label={`Step progress: ${completedSteps} of ${totalSteps} steps completed`}
          >
            <div 
              className="step-progress-fill"
              style={{ width: `${getStepProgressPercentage()}%` }}
            />
            {/* Step Markers */}
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`step-marker ${index < completedSteps ? 'completed' : ''} ${index === stepNumber - 1 ? 'current' : ''}`}
                style={{ left: `${(index / (totalSteps - 1)) * 100}%` }}
                aria-label={`Step ${index + 1} ${index < completedSteps ? 'completed' : index === stepNumber - 1 ? 'current' : 'upcoming'}`}
              >
                <span className="step-marker-number">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* XP Multiplier Section */}
      <div className="xp-multiplier-section" role="region" aria-label="XP multiplier progress">
        <div className="multiplier-header">
          <span className="multiplier-label">XP Multiplier</span>
          <span className="multiplier-value" aria-live="polite">
            {currentMultiplier > 0 ? `${currentMultiplier}x` : 'Base'}
          </span>
        </div>
        <div className={`xp-multiplier-bar ${glowEffect ? 'glow' : ''}`}>
          {/* Background segments */}
          <div className="multiplier-segment segment-base" aria-label="Base XP"></div>
          <div className="multiplier-segment segment-green" aria-label="2x multiplier zone"></div>
          <div className="multiplier-segment segment-yellow" aria-label="3x multiplier zone"></div>
          <div className="multiplier-segment segment-red" aria-label="4x multiplier zone"></div>
          
          {/* Progress fill */}
          <div 
            className="multiplier-progress-fill"
            style={{ width: `${getXPMultiplierPercentage()}%` }}
            role="progressbar"
            aria-valuenow={getXPMultiplierPercentage()}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`XP multiplier progress: ${currentMultiplier > 0 ? currentMultiplier + 'x' : 'base'} multiplier`}
          />
          
          {/* Multiplier indicators */}
          <div className="multiplier-indicators">
            <div 
              className={`multiplier-indicator ${currentMultiplier >= 2 ? 'active' : ''}`}
              aria-label="2x multiplier"
              title="2x XP Bonus"
            >
              <span className="indicator-text">2x</span>
            </div>
            <div 
              className={`multiplier-indicator ${currentMultiplier >= 3 ? 'active' : ''}`}
              aria-label="3x multiplier"
              title="3x XP Bonus"
            >
              <span className="indicator-text">3x</span>
            </div>
            <div 
              className={`multiplier-indicator ${currentMultiplier >= 4 ? 'active' : ''}`}
              aria-label="4x multiplier"
              title="4x XP Bonus"
            >
              <span className="indicator-text">4x</span>
            </div>
          </div>
        </div>
      </div>

      {/* User XP Card */}
      <div className="enhanced-user-card" role="region" aria-label="User profile and XP">
        <div className="user-avatar" aria-hidden="true">{userAvatar}</div>
        <div className="user-info">
          <div className="user-name">{userName}</div>
          <div className="user-details">
            {dob && <span className="user-dob">{formatDate(dob)}</span>}
            {gender && <span className="user-gender">• {gender}</span>}
          </div>
        </div>
        <div className="current-xp">
          <div className="xp-value" aria-label={`Current XP: ${getCurrentXP()}`}>
            {getCurrentXP()}
          </div>
          <div className="xp-label">XP</div>
          {currentMultiplier > 0 && (
            <div className="xp-multiplier-badge" aria-label={`${currentMultiplier}x multiplier active`}>
              {currentMultiplier}x
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XPHeader; 