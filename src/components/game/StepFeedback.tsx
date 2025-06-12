import React, { useState, useEffect } from 'react';
import { StepType } from '../../types/game';
import { CaseData } from '../../data/cases';
import { playSound } from '../../utils/soundManager';

interface StepFeedbackProps {
  stepType: StepType;
  caseData: CaseData;
  xpEarned: number;
  performance: 'excellent' | 'good' | 'poor' | 'failed';
  score: number;
  onContinue: () => void;
}

const StepFeedback: React.FC<StepFeedbackProps> = ({
  stepType,
  caseData,
  xpEarned,
  performance,
  score,
  onContinue
}) => {
  const [showXP, setShowXP] = useState(false);
  const [showPatient, setShowPatient] = useState(false);
  const [animatedXP, setAnimatedXP] = useState(0);

  useEffect(() => {
    // Sequence the animations
    const timer1 = setTimeout(() => {
      setShowXP(true);
      playSound.xpGain();
    }, 500);
    const timer2 = setTimeout(() => setShowPatient(true), 1200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (showXP) {
      // Animate XP counter
      let current = 0;
      const increment = Math.ceil(xpEarned / 30);
      const timer = setInterval(() => {
        current += increment;
        if (current >= xpEarned) {
          current = xpEarned;
          clearInterval(timer);
        }
        setAnimatedXP(current);
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [showXP, xpEarned]);

  const getStepName = (stepType: StepType): string => {
    switch (stepType) {
      case StepType.HISTORY_TAKING:
        return 'History Taking';
      case StepType.ORDERING_TESTS:
        return 'Ordering Tests';
      case StepType.DIAGNOSIS:
        return 'Diagnosis';
      case StepType.TREATMENT:
        return 'Treatment';
      default:
        return 'Step';
    }
  };

  const getStepIcon = (stepType: StepType): string => {
    switch (stepType) {
      case StepType.HISTORY_TAKING:
        return '🩺';
      case StepType.ORDERING_TESTS:
        return '📋';
      case StepType.DIAGNOSIS:
        return '🔍';
      case StepType.TREATMENT:
        return '💊';
      default:
        return '✅';
    }
  };



  const getPatientDialogue = (stepType: StepType, performance: string): string => {
    const stepMessages = {
      [StepType.HISTORY_TAKING]: {
        excellent: "Thank you for listening so carefully to my concerns. I feel like you really understand what I'm going through.",
        good: "I appreciate you taking the time to ask about my symptoms. That helps me feel more confident.",
        poor: "I wish you had asked more questions about how I'm feeling. I have more to tell you.",
        failed: "I don't feel like you really understood my situation. Can we talk more about my symptoms?"
      },
      [StepType.ORDERING_TESTS]: {
        excellent: "I'm glad you're being thorough with the right tests. I trust your medical judgment completely.",
        good: "These tests seem reasonable for my condition. I appreciate your careful approach.",
        poor: "I'm a bit worried about having so many tests. Are they all really necessary?",
        failed: "I'm concerned about the tests you've ordered. Some seem unnecessary and others seem missing."
      },
      [StepType.DIAGNOSIS]: {
        excellent: "Thank you for explaining my diagnosis clearly. It all makes sense now and I feel reassured.",
        good: "I understand my diagnosis and what it means. Thank you for your clear explanation.",
        poor: "I'm still a bit confused about my diagnosis. Could you explain it more clearly?",
        failed: "I'm not sure if this diagnosis is right. I'm worried you might have missed something important."
      },
      [StepType.TREATMENT]: {
        excellent: "This treatment plan sounds perfect! I feel confident this will help me get better quickly.",
        good: "I'm comfortable with this treatment plan. Thank you for explaining everything clearly.",
        poor: "I have some concerns about this treatment. Are you sure this is the best approach?",
        failed: "I'm worried this treatment isn't right for me. Can we reconsider the options?"
      }
    };

    return stepMessages[stepType][performance as keyof typeof stepMessages[StepType.HISTORY_TAKING]];
  };

  const getPatientAvatar = (gender: string): string => {
    return gender.toLowerCase() === 'female' ? '👩' : '👨';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl mx-4 text-center">
        
        {/* Step Complete Header */}
        <div className="mb-8">
          <div className="text-6xl mb-4">
            {getStepIcon(stepType)}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getStepName(stepType)} Complete!
          </h2>
        </div>

        {/* XP Animation */}
        {showXP && (
          <div className="mb-8 transform transition-all duration-1000 ease-out">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="text-blue-600 text-4xl font-bold mb-2">
                +{animatedXP} XP
              </div>
              <div className="text-blue-700 font-medium">
                Score: {score}%
              </div>
            </div>
          </div>
        )}

        {/* Patient Feedback */}
        {showPatient && (
          <div className="mb-8 transform transition-all duration-1000 ease-out">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">
                  {getPatientAvatar(caseData.patient.gender)}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 mb-2">
                    {caseData.patient.name}
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    "{getPatientDialogue(stepType, performance)}"
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {showPatient && (
          <div className="transform transition-all duration-500 ease-out">
            <button
              onClick={() => {
                playSound.buttonClick();
                onContinue();
              }}
              onMouseEnter={() => playSound.buttonHover()}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepFeedback; 