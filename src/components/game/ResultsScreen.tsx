import React, { useEffect } from 'react';
import { StepType } from '../../types/game';
import { GameResult } from '../../logic/scoringSystem';
import { CaseData, casesData } from '../../data/cases';
import { medicalTests, medicalDiagnoses, medicalTreatments } from '../../data/medicalOptions';
import { playSound } from '../../utils/soundManager';

interface ResultsScreenProps {
  gameResult: GameResult;
  caseData: CaseData;
  onContinue: () => void;
  onReview: () => void;
  onNextCase?: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ gameResult, caseData, onContinue, onReview, onNextCase }) => {
  // Save results to localStorage for performance tracking
  useEffect(() => {
    const averageScore = Math.round(
      gameResult.stepResults.reduce((sum, step) => sum + step.score, 0) / gameResult.stepResults.length
    );
    
    const results = {
      caseId: caseData.id,
      averageScore,
      performance: gameResult.overallPerformance,
      xpEarned: gameResult.finalXP,
      completedAt: new Date().toISOString(),
      stepResults: gameResult.stepResults
    };
    
    localStorage.setItem(`case_${caseData.id}_results`, JSON.stringify(results));
    localStorage.setItem(`case_${caseData.id}_completed`, 'true');
    
    console.log('Saved case results:', results);
  }, [gameResult, caseData.id]);

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return '🌟';
      case 'good': return '✅';
      case 'poor': return '⚠️';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const getStepIcon = (stepType: StepType): string => {
    switch (stepType) {
      case StepType.HISTORY_TAKING: return '🩺';
      case StepType.ORDERING_TESTS: return '📋';
      case StepType.DIAGNOSIS: return '🔍';
      case StepType.TREATMENT: return '📄';
      default: return '❓';
    }
  };

  const getStepName = (stepType: StepType): string => {
    switch (stepType) {
      case StepType.HISTORY_TAKING: return 'History Taking';
      case StepType.ORDERING_TESTS: return 'Ordering Tests';
      case StepType.DIAGNOSIS: return 'Diagnosis';
      case StepType.TREATMENT: return 'Treatment';
      default: return 'Unknown Step';
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const averageScore = Math.round(
    gameResult.stepResults.reduce((sum, step) => sum + step.score, 0) / gameResult.stepResults.length
  );

  // Find the next case
  const getNextCase = () => {
    const currentIndex = casesData.findIndex(c => c.id === caseData.id);
    if (currentIndex !== -1 && currentIndex < casesData.length - 1) {
      return casesData[currentIndex + 1];
    }
    return null;
  };

  const nextCase = getNextCase();

  // Get user's actual selections for each step
  const getUserSelections = (stepType: StepType) => {
    const stepResult = gameResult.stepResults.find(r => r.stepType === stepType);
    return stepResult?.selectedAnswers || [];
  };

  // Get correct answers for each step
  const getCorrectAnswers = (stepType: StepType) => {
    switch (stepType) {
      case StepType.HISTORY_TAKING:
        const historyData = caseData.steps[StepType.HISTORY_TAKING];
        return historyData.questions
          .filter((q: any) => q.relevant)
          .map((q: any) => ({ id: q.id, name: q.text }));

      case StepType.ORDERING_TESTS:
        const correctTestIds = caseData.steps[StepType.ORDERING_TESTS].correctTests;
        const caseTestsData = caseData.steps[StepType.ORDERING_TESTS].tests;
        
        return correctTestIds.map(id => {
          // First look in comprehensive database
          const comprehensiveTest = medicalTests.find(t => t.id === id);
          if (comprehensiveTest) {
            return { id, name: comprehensiveTest.name, cost: comprehensiveTest.cost || 50 };
          }
          
          // Fall back to case data
          const caseTest = caseTestsData.find((t: any) => t.id === id);
          if (caseTest) {
            return { id, name: caseTest.name, cost: caseTest.cost || 50 };
          }
          
          return null;
        }).filter(Boolean);

      case StepType.DIAGNOSIS:
        const correctDiagnosisIds = caseData.steps[StepType.DIAGNOSIS].correctDiagnoses;
        const caseDiagnosisData = caseData.steps[StepType.DIAGNOSIS].options;
        
        return correctDiagnosisIds.map(id => {
          // Try comprehensive database first
          const comprehensiveDiagnosis = medicalDiagnoses.find(d => d.id === id);
          if (comprehensiveDiagnosis) {
            return { id, name: comprehensiveDiagnosis.name };
          }
          
          // Fall back to case data
          const caseDiagnosis = caseDiagnosisData.find((d: any) => d.id === id);
          if (caseDiagnosis) {
            return { id, name: caseDiagnosis.diagnosis };
          }
          
          return null;
        }).filter(Boolean);

      case StepType.TREATMENT:
        const correctTreatmentIds = caseData.steps[StepType.TREATMENT].correctTreatments;
        const caseTreatmentData = caseData.steps[StepType.TREATMENT].treatments;
        
        return correctTreatmentIds.map(id => {
          // Try comprehensive database first
          const comprehensiveTreatment = medicalTreatments.find(t => t.id === id);
          if (comprehensiveTreatment) {
            return { id, name: comprehensiveTreatment.name };
          }
          
          // Fall back to case data
          const caseTreatment = caseTreatmentData.find((t: any) => t.id === id);
          if (caseTreatment) {
            return { id, name: caseTreatment.name };
          }
          
          return null;
        }).filter(Boolean);

      default:
        return [];
    }
  };



  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">
            {getPerformanceIcon(gameResult.overallPerformance)}
          </div>
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Case Complete!
          </h1>
          <p className="text-xl text-gray-600 capitalize">
            {gameResult.overallPerformance} Performance
          </p>
        </div>

        {/* Case Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            {caseData.title}
          </h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-medium text-gray-900">
                {formatTime(gameResult.totalTimeElapsed)}
              </div>
              <div className="text-sm text-gray-600">Completion Time</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-gray-900">
                {averageScore}%
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-gray-900">
                {gameResult.finalXP}
              </div>
              <div className="text-sm text-gray-600">XP Earned</div>
            </div>
          </div>
        </div>

        {/* Detailed Results by Step */}
        <div className="space-y-8 mb-8">
          {gameResult.stepResults.map((stepResult, index) => {
            const userSelections = getUserSelections(stepResult.stepType);
            const correctAnswers = getCorrectAnswers(stepResult.stepType);
            
            return (
              <div key={stepResult.stepType} className="border border-gray-200 rounded-lg p-6">
                {/* Step Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getStepIcon(stepResult.stepType)}</span>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900">
                        {getStepName(stepResult.stepType)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Step {index + 1} • {formatTime(stepResult.timeElapsed)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-medium text-gray-900">{stepResult.score}%</div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-medium text-gray-900">{stepResult.xpEarned}</div>
                      <div className="text-sm text-gray-600">XP</div>
                    </div>
                    <div className="text-3xl">
                      {getPerformanceIcon(stepResult.performance)}
                    </div>
                  </div>
                </div>

                {/* Correct Answers with User Selection Status */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Correct Selections:</h4>
                  <div className="space-y-2">
                    {correctAnswers.map((item: any, idx: number) => {
                      const userSelected = userSelections.includes(item.id);
                      
                      return (
                        <div key={idx} className={`flex items-start justify-between p-3 rounded-lg border ${
                          userSelected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-start space-x-2 flex-1">
                            <span className="text-lg">
                              {userSelected ? '✅' : '❌'}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-900">{item.name}</p>
                              {item.cost && (
                                <p className="text-sm text-gray-600">${item.cost}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {userSelected ? (
                              <span className="text-green-700">Selected ✓</span>
                            ) : (
                              <span className="text-red-700">Missed ✗</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {correctAnswers.length === 0 && (
                      <p className="text-gray-500 italic">No correct answers defined</p>
                    )}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Selected: {userSelections.filter(id => correctAnswers.some((a: any) => a.id === id)).length} / {correctAnswers.length} correct answers
                    </span>
                    {stepResult.stepType === StepType.ORDERING_TESTS && (
                      <span>
                        Recommended Cost: ${(correctAnswers as any[])
                          .filter(item => item && item.cost !== undefined)
                          .reduce((sum: number, item: any) => sum + (item.cost || 0), 0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">👨</span>
              <div>
                <div className="font-medium text-gray-900">Patient Response</div>
                <div className="text-sm text-gray-600">{caseData.patient.name}</div>
              </div>
            </div>
            <p className="text-gray-700">
              {caseData.reactions.patient[gameResult.overallPerformance]}
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">👨‍⚕️</span>
              <div>
                <div className="font-medium text-gray-900">Dr. Holmes</div>
                <div className="text-sm text-gray-600">Mentor Feedback</div>
              </div>
            </div>
            <p className="text-gray-700">
              {caseData.reactions.mentor[gameResult.overallPerformance]}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 flex-wrap gap-y-3">
          <button 
            onClick={() => {
              playSound.buttonClick();
              onReview();
            }}
            onMouseEnter={() => playSound.buttonHover()}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            📖 Review Case Decisions
          </button>
          
          <button 
            onClick={() => {
              playSound.pageTransition();
              onContinue();
            }}
            onMouseEnter={() => playSound.buttonHover()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            📋 Case Selection
          </button>
          
          {nextCase && (
            <button 
              onClick={() => {
                playSound.caseStart();
                onNextCase && onNextCase();
              }}
              onMouseEnter={() => playSound.buttonHover()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              ➡️ Next Case: {nextCase.title}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen; 