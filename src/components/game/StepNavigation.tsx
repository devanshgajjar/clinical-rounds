import React from 'react';
import { StepType, StepResult } from '../../types/game';
import './StepNavigation.css';

interface StepNavigationProps {
  currentStep: StepType;
  onStepChange: (step: StepType) => void;
  stepResults: StepResult[];
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  currentStep, 
  onStepChange, 
  stepResults 
}) => {
  const steps = [
    { type: StepType.HISTORY_TAKING, label: 'History', icon: '📋' },
    { type: StepType.ORDERING_TESTS, label: 'Tests', icon: '🧪' },
    { type: StepType.DIAGNOSIS, label: 'Diagnosis', icon: '🔍' },
    { type: StepType.TREATMENT, label: 'Treatment', icon: '💊' }
  ];

  const getStepStatus = (stepType: StepType) => {
    const result = stepResults.find(r => r.stepType === stepType);
    if (!result) return 'not-started';
    if (result.isCompleted && result.isCorrect) return 'completed';
    if (result.isCompleted && !result.isCorrect) return 'failed';
    return 'in-progress';
  };

  const getStepIcon = (stepType: StepType, defaultIcon: string) => {
    const status = getStepStatus(stepType);
    switch (status) {
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'in-progress':
        return '🔄';
      default:
        return defaultIcon;
    }
  };

  return (
    <nav className="step-navigation">
      <div className="nav-container">
        {steps.map((step, index) => {
          const status = getStepStatus(step.type);
          const isActive = currentStep === step.type;
          const stepResult = stepResults.find(r => r.stepType === step.type);
          
          return (
            <button
              key={step.type}
              className={`nav-step ${status} ${isActive ? 'active' : ''}`}
              onClick={() => onStepChange(step.type)}
            >
              <div className="step-icon">
                {getStepIcon(step.type, step.icon)}
              </div>
              
              <div className="step-info">
                <div className="step-label">{step.label}</div>
                <div className="step-number">{index + 1}</div>
              </div>

              {stepResult && stepResult.attempts > 1 && (
                <div className="attempt-indicator">
                  {stepResult.attempts}/3
                </div>
              )}

              {stepResult && stepResult.isCompleted && (
                <div className="score-indicator">
                  {stepResult.score}%
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default StepNavigation; 