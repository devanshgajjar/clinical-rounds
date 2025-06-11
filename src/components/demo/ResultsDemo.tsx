import React from 'react';
import ResultsScreen from '../game/ResultsScreen';
import { StepType } from '../../types/game';
import { getCaseById } from '../../data/cases';

const ResultsDemo: React.FC = () => {
  const handleContinue = () => {
    console.log('Continue to next case clicked');
    alert('This would navigate to the next case!');
  };

  const handleReview = () => {
    console.log('Review case decisions clicked');
    alert('This would show case review!');
  };

  // Mock game result data for demo
  const mockGameResult = {
    caseId: 'inf-001',
    stepResults: [
      {
        stepType: StepType.HISTORY_TAKING,
        stepOrder: 1,
        isCorrect: true,
        isCompleted: true,
        attempts: 1,
        timeElapsed: 145,
        score: 95,
        baseXP: 25,
        multiplier: 2.0,
        xpEarned: 50,
        selectedAnswers: ['q1', 'q3', 'q5'],
        performance: 'excellent' as const
      },
      {
        stepType: StepType.ORDERING_TESTS,
        stepOrder: 2,
        isCorrect: true,
        isCompleted: true,
        attempts: 2,
        timeElapsed: 180,
        score: 82,
        baseXP: 20,
        multiplier: 3.0,
        xpEarned: 48,
        selectedAnswers: ['t1', 't4'],
        performance: 'good' as const
      },
      {
        stepType: StepType.DIAGNOSIS,
        stepOrder: 3,
        isCorrect: true,
        isCompleted: true,
        attempts: 1,
        timeElapsed: 120,
        score: 98,
        baseXP: 30,
        multiplier: 4.0,
        xpEarned: 120,
        selectedAnswers: ['d1'],
        performance: 'excellent' as const
      },
      {
        stepType: StepType.TREATMENT,
        stepOrder: 4,
        isCorrect: true,
        isCompleted: true,
        attempts: 3,
        timeElapsed: 200,
        score: 78,
        baseXP: 25,
        multiplier: 2.0,
        xpEarned: 25,
        selectedAnswers: ['tx1', 'tx3'],
        performance: 'good' as const
      }
    ],
    totalTimeElapsed: 645,
    totalXP: 243,
    baseXP: 100,
    bonusXP: 20,
    penaltyXP: 15,
    finalXP: 248,
    completionPercentage: 100,
    overallPerformance: 'excellent' as const,
    followedOptimalOrder: true
  };

  // Use actual case data
  const caseData = getCaseById('inf-001');

  if (!caseData) {
    return <div>Error: Could not load case data for demo</div>;
  }

  return (
    <ResultsScreen 
      gameResult={mockGameResult}
      caseData={caseData}
      onContinue={handleContinue}
      onReview={handleReview}
    />
  );
};

export default ResultsDemo; 