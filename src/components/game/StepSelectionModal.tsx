import React, { useEffect } from 'react';
import { StepType } from '../../types/game';
import { CaseData } from '../../data/cases';
import { playSound } from '../../utils/soundManager';

interface StepSelectionModalProps {
  caseData: CaseData;
  completedSteps: StepType[];
  onStepSelect: (stepType: StepType) => void;
  onFinishCase: () => void;
}

const StepSelectionModal: React.FC<StepSelectionModalProps> = ({
  caseData,
  completedSteps,
  onStepSelect,
  onFinishCase
}) => {
  const allSteps = [
    StepType.HISTORY_TAKING,
    StepType.ORDERING_TESTS,
    StepType.DIAGNOSIS,
    StepType.TREATMENT
  ];

  const availableSteps = allSteps.filter(
    step => !completedSteps.includes(step) ||
      (caseData.isEmergency && step === StepType.TREATMENT && !completedSteps.includes(StepType.TREATMENT))
  );
  const isLastStep = availableSteps.length === 0;

  // Play modal open sound when component mounts
  useEffect(() => {
    playSound.modalOpen();
  }, []);

  const stepConfig = {
    [StepType.HISTORY_TAKING]: {
      icon: '🩺',
      label: 'History Taking',
      description: 'Gather patient history and symptoms'
    },
    [StepType.ORDERING_TESTS]: {
      icon: '📋',
      label: 'Ordering Tests',
      description: 'Order diagnostic tests and investigations'
    },
    [StepType.DIAGNOSIS]: {
      icon: '🔍',
      label: 'Diagnosis',
      description: 'Make a clinical diagnosis'
    },
    [StepType.TREATMENT]: {
      icon: '📄',
      label: 'Treatment',
      description: 'Plan treatment and management'
    }
  };

  if (isLastStep) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Complete!</h2>
          <p className="text-gray-600 mb-6">
            You've completed all steps for {caseData.patient.name}'s case.
          </p>
          <button
            onClick={() => {
              playSound.caseComplete();
              onFinishCase();
            }}
            onMouseEnter={() => playSound.buttonHover()}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl mx-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Next Step</h2>
          <p className="text-gray-600">
            What would you like to do next for {caseData.patient.name}?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableSteps.map((stepType) => {
            const config = stepConfig[stepType];
            return (
              <button
                key={stepType}
                onClick={() => {
                  playSound.selectionMade();
                  onStepSelect(stepType);
                }}
                onMouseEnter={() => playSound.buttonHover()}
                className="p-6 border-2 border-gray-200 rounded-lg text-left transition-colors hover:bg-gray-50 hover:border-gray-300"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{config.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-gray-900">
                      {config.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {config.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {/* Progress indicator */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500">
            Progress: {completedSteps.length} / {allSteps.length} steps completed
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps.length / allSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepSelectionModal; 