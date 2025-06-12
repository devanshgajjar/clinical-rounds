import React, { useState, useEffect, useRef } from 'react';
import { StepType } from '../../types/game';
import { CaseData, getGameCaseById, casesData } from '../../data/cases';
import { ScoringSystem, StepResult } from '../../logic/scoringSystem';

import HistoryTaking from '../steps/HistoryTaking';
import HistorySummary from '../steps/HistorySummary';
import OrderingTests from '../steps/OrderingTests';
import TestResultsSummary from '../steps/TestResultsSummary';
import Diagnosis from '../steps/Diagnosis';
import Treatment from '../steps/Treatment';
import ResultsScreen from './ResultsScreen';
import StepFeedback from './StepFeedback';
import StepSelectionModal from './StepSelectionModal';
import XPMultiplierDisplay from './XPMultiplierDisplay';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../utils/soundManager';
import '../../styles/duolingo-theme.css';
import './GamePlay.css';

interface GamePlayProps {
  caseId?: string;
}

const GamePlay: React.FC<GamePlayProps> = ({ caseId }) => {
  const {
    getCurrentCase,
    clearXPGlow,
    dispatch,
    gameState
  } = useGame();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [currentStep, setCurrentStep] = useState<StepType>(StepType.HISTORY_TAKING);
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [stepAttempts, setStepAttempts] = useState<Record<StepType, number>>({
    [StepType.HISTORY_TAKING]: 0,
    [StepType.ORDERING_TESTS]: 0,
    [StepType.DIAGNOSIS]: 0,
    [StepType.TREATMENT]: 0
  });
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [showResults, setShowResults] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
  // New state for tracking summary steps and user selections
  const [currentView, setCurrentView] = useState<'step' | 'history-summary' | 'test-summary'>('step');
  const [historyAnswers, setHistoryAnswers] = useState<string[]>([]);
  const [testSelections, setTestSelections] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // State for step feedback cut-scene
  const [showStepFeedback, setShowStepFeedback] = useState(false);
  const [currentStepResult, setCurrentStepResult] = useState<any>(null);
  
  // State for step selection after feedback
  const [showStepSelection, setShowStepSelection] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<StepType[]>([]);

  const maxAttempts = 3;
  
  // Helper function to get current step number
  const getCurrentStepNumber = (): number => {
    const completedSteps = stepResults.filter(r => r.isCompleted).length;
    return Math.min(completedSteps + 1, 4);
  };
  


  // Load case data - prioritize case from prop, then comprehensive Dog Bite case from cases.ts
  useEffect(() => {
    // Use the case ID from props if provided, otherwise default to Dog Bite case
    const targetCaseId = caseId || 'inf-001';
    
    const loadedCase = getGameCaseById(targetCaseId);
    if (loadedCase) {
      setCaseData(loadedCase);
      setGameStartTime(Date.now());
      setStepStartTime(Date.now());
      console.log('GamePlay: Loaded case from cases.ts:', loadedCase.title);
      return;
    }

    // Fallback to context case if no case found in cases.ts
    const contextCase = getCurrentCase();
    if (contextCase) {
      console.log('GamePlay: Adapting context case:', contextCase.title);
      // Convert the context case (from gameData.ts) to the format expected by GamePlay
      const adaptedCase = {
        id: contextCase.id,
        title: contextCase.title,
        system: contextCase.bodySystem, // Convert bodySystem to system
        level: 1, // Default level
        difficulty: contextCase.difficulty,
        patient: {
          name: contextCase.patientInfo.name,
          age: contextCase.patientInfo.age,
          gender: contextCase.patientInfo.gender as 'Male' | 'Female',
          chiefComplaint: contextCase.patientInfo.chiefComplaint,
          background: contextCase.description
        },
        scoring: {
          baseXP: contextCase.baseXP,
          timeThresholds: {
            excellent: 180,
            good: 300,
            poor: 420
          },
          optimalOrder: contextCase.idealStepOrder
        },
        steps: {
           [StepType.HISTORY_TAKING]: {
             questions: contextCase.steps[StepType.HISTORY_TAKING].questions?.map((q: any) => ({
               id: q.id,
               text: q.text,
               relevant: q.isRelevant,
               category: 'Present Illness' // Default category
             })) || [],
             correctAnswers: contextCase.steps[StepType.HISTORY_TAKING].questions?.filter((q: any) => q.isRelevant).map((q: any) => q.id) || [],
             minimumRequired: contextCase.steps[StepType.HISTORY_TAKING].requiredSelections || 3
           },
           [StepType.ORDERING_TESTS]: {
             tests: contextCase.steps[StepType.ORDERING_TESTS].tests?.map((t: any) => ({
               id: t.id,
               name: t.name,
               category: t.category,
               cost: 100,
               necessary: t.isRelevant,
               contraindicated: false
             })) || [],
             correctTests: contextCase.steps[StepType.ORDERING_TESTS].tests?.filter((t: any) => t.isRelevant).map((t: any) => t.id) || [],
             maxAllowed: contextCase.steps[StepType.ORDERING_TESTS].maxSelections || 5
           },
           [StepType.DIAGNOSIS]: {
             type: 'multiple-choice' as const,
             options: contextCase.steps[StepType.DIAGNOSIS].diagnosisOptions?.map((d: any) => ({
               id: d.id,
               diagnosis: d.text,
               correct: d.isCorrect
             })) || [],
             correctDiagnoses: contextCase.steps[StepType.DIAGNOSIS].diagnosisOptions?.filter((d: any) => d.isCorrect).map((d: any) => d.id) || []
           },
           [StepType.TREATMENT]: {
             treatments: contextCase.steps[StepType.TREATMENT].treatmentOptions?.map((t: any) => ({
               id: t.id,
               name: t.text,
               category: t.category,
               necessary: t.isCorrect,
               contraindicated: !t.isSafe
             })) || [],
             correctTreatments: contextCase.steps[StepType.TREATMENT].treatmentOptions?.filter((t: any) => t.isCorrect).map((t: any) => t.id) || [],
             maxAllowed: contextCase.steps[StepType.TREATMENT].maxSelections || 5
           }
         },
        reactions: {
          patient: {
            excellent: "Thank you doctor! I feel much better.",
            good: "I appreciate your care.",
            poor: "I'm still concerned but I trust you.",
            failed: "I'm worried about my condition."
          },
          mentor: {
            excellent: "Excellent clinical decision making!",
            good: "Good approach to this case.",
            poor: "Consider reviewing the guidelines.",
            failed: "This case needs immediate attention."
          }
        }
      };
      
      setCaseData(adaptedCase as any);
      setGameStartTime(Date.now());
      setStepStartTime(Date.now());
    }
  }, [caseId, getCurrentCase]);

  // Timer effect - stops when showing results
  useEffect(() => {
    if (!showResults) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - stepStartTime) / 1000));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stepStartTime, showResults]);

  // Reset step timer when step changes
  useEffect(() => {
    setStepStartTime(Date.now());
    setTimeElapsed(0);
  }, [currentStep]);

  // Clear XP glow when step changes
  useEffect(() => {
    clearXPGlow();
  }, [clearXPGlow, currentStep]);

  const handleNextCase = () => {
    // Check if caseData exists
    if (!caseData) return;
    
    // Find the next case
    const currentIndex = casesData.findIndex(c => c.id === caseData.id);
    if (currentIndex !== -1 && currentIndex < casesData.length - 1) {
      const nextCase = casesData[currentIndex + 1];
      
      // Navigate to the case introduction page by setting URL parameter
      window.location.href = `/?case=${nextCase.id}`;
      
      console.log('Navigating to next case introduction:', nextCase.title);
    }
  };

  // If no case data is available, navigate back to dashboard
  if (!caseData) {
    // Add a button for manual navigation
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="card max-w-md">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🏥</div>
            <h2 className="text-2xl font-bold text-primary mb-2">No case available</h2>
            <p className="text-secondary mb-4">Unable to load case data.</p>
            <button 
              onClick={() => {
                // Force page refresh to completely reset the application
                window.location.reload();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const totalTimeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const gameResult = ScoringSystem.calculateGameResult(caseData, stepResults, totalTimeElapsed);
    
    return (
      <ResultsScreen 
        gameResult={gameResult}
        caseData={caseData}
        onContinue={() => {
          // Return to dashboard
          dispatch({ type: 'BACK_TO_CASE_SELECTION' });
          // Clear URL parameter if it exists
          const url = new URL(window.location.href);
          if (url.searchParams.has('case')) {
            url.searchParams.delete('case');
            window.history.replaceState({}, '', url.toString());
          }
        }}
        onReview={() => {
          setShowResults(false);
        }}
        onNextCase={handleNextCase}
      />
    );
  }

  const handleStepSubmit = (stepType: StepType, selectedAnswers: string[]) => {
    console.log('Submitting step:', stepType, 'with answers:', selectedAnswers);
    
    const currentAttempts = stepAttempts[stepType] + 1;
    const currentTimeElapsed = Math.floor((Date.now() - stepStartTime) / 1000);
    
    // Get the step result from local calculation
    const stepResult = ScoringSystem.calculateStepResult(
      stepType,
      getCurrentStepNumber(),
      selectedAnswers,
      currentAttempts,
      currentTimeElapsed,
      caseData,
      completedSteps
    );
    
    console.log('Step result:', stepResult);
    
    setStepResults(prev => {
      const filtered = prev.filter(r => r.stepType !== stepType);
      const newResults = [...filtered, stepResult];
      console.log('Updated step results:', newResults);
      return newResults;
    });
    
    setStepAttempts(prev => ({
      ...prev,
      [stepType]: currentAttempts
    }));
    
    // Store user selections and show step feedback
    setCurrentStepResult(stepResult);
    setShowStepFeedback(true);
    
    // Store user selections for summary pages
    if (stepType === StepType.HISTORY_TAKING) {
      setHistoryAnswers(selectedAnswers);
    } else if (stepType === StepType.ORDERING_TESTS) {
      setTestSelections(selectedAnswers);
    }
  };

  const handleStepRetry = (stepType: StepType) => {
    setStepStartTime(Date.now());
    setTimeElapsed(0);
  };

  const getStepAttempts = (stepType: StepType): number => {
    return stepAttempts[stepType];
  };

  const handleHistorySummaryContinue = () => {
    // After history summary, show step selection
    setCurrentView('step');
    setCurrentStepResult(null);
    setShowStepSelection(true);
  };

  const handleTestSummaryContinue = () => {
    // After test summary, show step selection
    setCurrentView('step');
    setCurrentStepResult(null);
    setShowStepSelection(true);
  };

  const handleStepFeedbackContinue = () => {
    setShowStepFeedback(false);
    
    const stepType = currentStepResult?.stepType;
    
    // Add completed step to the list
    if (stepType && !completedSteps.includes(stepType)) {
      setCompletedSteps(prev => [...prev, stepType]);
    }
    
    if (stepType === StepType.HISTORY_TAKING) {
      // Show history summary first, then step selection
      setCurrentView('history-summary');
    } else if (stepType === StepType.ORDERING_TESTS) {
      // Show test results summary first, then step selection
      setCurrentView('test-summary');
    } else {
      // For diagnosis and treatment, show step selection immediately
      setCurrentStepResult(null);
      setShowStepSelection(true);
    }
  };

  const handleStepSelect = (stepType: StepType) => {
    setShowStepSelection(false);
    setCurrentStep(stepType);
    setCurrentView('step');
    setStepStartTime(Date.now());
  };

  const handleFinishCase = () => {
    setShowStepSelection(false);
    setShowResults(true);
  };

  const renderStepContent = () => {
    // Handle summary views
    if (currentView === 'history-summary') {
      return (
        <HistorySummary 
          caseData={caseData!}
          selectedAnswers={historyAnswers}
          onContinue={handleHistorySummaryContinue}
        />
      );
    }

    if (currentView === 'test-summary') {
      return (
        <TestResultsSummary 
          caseData={caseData!}
          selectedTests={testSelections}
          onContinue={handleTestSummaryContinue}
        />
      );
    }

    // Handle regular step views
    const attempts = getStepAttempts(currentStep);

    const commonProps = {
      caseData,
      attempts: attempts + 1,
      maxAttempts,
      timeElapsed,
      onSubmit: (selectedAnswers: string[]) => handleStepSubmit(currentStep, selectedAnswers),
      onRetry: () => handleStepRetry(currentStep)
    };

    switch (currentStep) {
      case StepType.HISTORY_TAKING:
        return <HistoryTaking {...commonProps} />;
      case StepType.ORDERING_TESTS:
        return <OrderingTests {...commonProps} />;
      case StepType.DIAGNOSIS:
        return <Diagnosis {...commonProps} />;
      case StepType.TREATMENT:
        return <Treatment {...commonProps} />;
      default:
        return <div>Unknown step</div>;
    }
  };





  // Note: These variables are used in the header display
  // const currentCaseData = getCurrentCase();
  // const xpMultiplier = getXPMultiplier();

  return (
    <div className="min-h-screen bg-white">
      {/* Step Feedback Cut-scene */}
      {showStepFeedback && currentStepResult && (
        <StepFeedback
          stepType={currentStepResult.stepType}
          caseData={caseData!}
          xpEarned={currentStepResult.xpEarned}
          performance={currentStepResult.performance}
          score={currentStepResult.score}
          onContinue={handleStepFeedbackContinue}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header with Close Button and Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between p-4">
            {/* Close Button */}
            <button 
              onClick={() => {
                playSound.pageTransition();
                
                // Clear URL parameter and force navigation to home
                const url = new URL(window.location.href);
                if (url.searchParams.has('case')) {
                  url.searchParams.delete('case');
                  window.history.replaceState({}, '', url.toString());
                  
                  // Force page reload to reset all state
                  window.location.reload();
                } else {
                  // Use proper navigation to case selection
                  dispatch({ type: 'BACK_TO_CASE_SELECTION' });
                }
              }}
              onMouseEnter={() => playSound.buttonHover()}
              className="text-gray-600 hover:text-gray-900 text-2xl"
              title="Back to Cases"
            >
              ✕
            </button>

            {/* Case Title */}
            <div className="text-lg font-medium text-gray-900">
              {currentView === 'history-summary' && '📋 History Summary'}
              {currentView === 'test-summary' && '🧪 Test Results'}
              {currentView === 'step' && (caseData?.title || 'Loading...')}
            </div>

            <div className="w-8"></div> {/* Spacer for balance */}
          </div>
          
          {/* XP Multiplier Display - only show during regular steps */}
          {currentView === 'step' && gameState?.currentXPMultiplier && (
            <div className="px-4 pb-4">
              <XPMultiplierDisplay
                multiplier={gameState.currentXPMultiplier}
                currentStep={currentStep}
                timeElapsed={timeElapsed}
                isStepCompleted={completedSteps.includes(currentStep)}
                className="max-w-md mx-auto"
              />
            </div>
          )}
        </div>

        {/* Main Game Content */}
        <main className="pb-24">
          {renderStepContent()}
        </main>

        {/* Bottom Step Navigation - present at all times */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-6">
              {Object.values(StepType).map((step) => {
                const isActive = step === currentStep && currentView === 'step';
                const stepResult = stepResults.find(r => r.stepType === step);
                const isCompleted = stepResult?.isCompleted || false;
                const canNavigate = isCompleted || step === currentStep;
                
                const stepConfig = {
                  [StepType.HISTORY_TAKING]: { icon: '🩺', label: 'History' },
                  [StepType.ORDERING_TESTS]: { icon: '📋', label: 'Tests' },
                  [StepType.DIAGNOSIS]: { icon: '🔍', label: 'Diagnosis' },
                  [StepType.TREATMENT]: { icon: '📄', label: 'Treatment' }
                }[step];
                
                return (
                  <button
                    key={step}
                    onClick={() => {
                      if (canNavigate) {
                        playSound.buttonClick();
                        setCurrentStep(step);
                        setCurrentView('step');
                        setStepStartTime(Date.now());
                        setTimeElapsed(0);
                        setShowStepSelection(false);
                      }
                    }}
                    onMouseEnter={() => canNavigate && playSound.buttonHover()}
                    disabled={!canNavigate}
                    className={`flex flex-col items-center text-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                        : canNavigate
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    title={
                      isCompleted 
                        ? `Navigate to ${stepConfig.label} (Completed - ${stepResult?.score}%)`
                        : canNavigate
                        ? `Navigate to ${stepConfig.label}`
                        : `Complete previous steps to unlock ${stepConfig.label}`
                    }
                  >
                    <div className="text-xl mb-1">
                      {isCompleted ? '✅' : stepConfig.icon}
                    </div>
                    <span className="text-xs font-medium">
                      {stepConfig.label}
                    </span>
                    {stepResult && stepResult.score && (
                      <span className="text-xs opacity-75">
                        {stepResult.score}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(stepResults.filter(r => r.isCompleted).length / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Selection Modal */}
      {showStepSelection && caseData && (
        <StepSelectionModal
          caseData={caseData}
          completedSteps={completedSteps}
          onStepSelect={handleStepSelect}
          onFinishCase={handleFinishCase}
        />
      )}
    </div>
  );
};

export default GamePlay; 