import React from 'react';
import { useGame } from '../../context/GameContext';
import { StepType } from '../../types/game';
import { playSound } from '../../utils/soundManager';

const StepSelection: React.FC = () => {
  const { gameState, dispatch } = useGame();
  const currentCase = gameState.currentCase;

  if (!currentCase) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Case Not Found</h2>
          <button 
            onClick={() => {
              playSound.pageTransition();
              dispatch({ type: 'BACK_TO_CASE_SELECTION' });
            }}
            onMouseEnter={() => playSound.buttonHover()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Cases
          </button>
        </div>
      </div>
    );
  }

  const handleStepSelect = (stepType: StepType, event?: React.MouseEvent) => {
    try {
      // Prevent any default behavior or event bubbling
      event?.preventDefault();
      event?.stopPropagation();
      
      // Play selection sound
      playSound.buttonClick();
      
      // Dispatch the action
      dispatch({ type: 'START_GAMEPLAY', payload: { stepType } });
    } catch (error) {
      console.error('Error selecting step:', error);
    }
  };

  const handleBack = () => {
    playSound.pageTransition();
    dispatch({ type: 'BACK_TO_CASE_SELECTION' });
  };

  const steps = [
    {
      type: StepType.HISTORY_TAKING,
      label: 'History',
      icon: '🩺',
      description: 'Take patient history'
    },
    {
      type: StepType.ORDERING_TESTS,
      label: 'Tests',
      icon: '📋',
      description: 'Order diagnostic tests'
    },
    {
      type: StepType.DIAGNOSIS,
      label: 'Diagnosis',
      icon: '🔍',
      description: 'Make a diagnosis'
    },
    {
      type: StepType.TREATMENT,
      label: 'Treatment',
      icon: '📄',
      description: 'Plan treatment'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <button 
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 text-2xl"
          >
            ←
          </button>
          
          <h1 className="text-2xl font-medium text-gray-900">
            {currentCase.title}
          </h1>
          
          <div className="w-8"></div>
        </div>

        {/* Step Selection */}
        <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto">
          {steps.map((step) => (
            <button
              key={step.type}
              type="button"
              onClick={(e) => handleStepSelect(step.type, e)}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => playSound.buttonHover()}
              className="group flex flex-col items-center p-8 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <span className="text-gray-900 font-medium">
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepSelection; 