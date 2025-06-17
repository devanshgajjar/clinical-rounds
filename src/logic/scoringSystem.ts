import { StepType } from '../types/game';
import { CaseData } from '../types/game';

export interface StepResult {
  stepType: StepType;
  stepOrder: number;
  isCorrect: boolean;
  isCompleted: boolean;
  attempts: number;
  timeElapsed: number; // in seconds
  score: number; // percentage
  baseXP: number;
  multiplier: number;
  xpEarned: number;
  selectedAnswers: string[];
  performance: 'excellent' | 'good' | 'poor' | 'failed';
}

export interface GameResult {
  caseId: string;
  stepResults: StepResult[];
  totalTimeElapsed: number;
  totalXP: number;
  baseXP: number;
  bonusXP: number;
  penaltyXP: number;
  finalXP: number;
  completionPercentage: number;
  overallPerformance: 'excellent' | 'good' | 'poor' | 'failed';
  followedOptimalOrder: boolean;
}

export class ScoringSystem {
  private static getStepOrderMultiplier(stepOrder: number): number {
    // 1st step: x1.5, 2nd: x2, 3rd: x2.5, 4th: x2
    const multipliers = [1.5, 2.0, 2.5, 2.0];
    return multipliers[stepOrder - 1] || 1.0;
  }

  private static getRetryPenalty(attempts: number): number {
    switch (attempts) {
      case 1: return 1.0; // No penalty for first attempt
      case 2: return 0.7; // -30% for first retry
      case 3: return 0.4; // -60% for second retry
      default: return 0.1; // -90% for 3+ attempts (almost fail)
    }
  }

  private static getTimePerformance(timeElapsed: number, caseData: CaseData): 'excellent' | 'good' | 'poor' {
    const thresholds = (caseData.scoring && 'timeThresholds' in caseData.scoring && (caseData.scoring as any).timeThresholds)
      ? (caseData.scoring as any).timeThresholds
      : { excellent: 60, good: 120, poor: 180 };
    const { excellent, good, poor } = thresholds;
    if (timeElapsed <= excellent) return 'excellent';
    if (timeElapsed <= good) return 'good';
    if (timeElapsed <= poor) return 'poor';
    return 'poor';
  }

  public static calculateStepScore(
    stepType: StepType,
    selectedAnswers: string[],
    correctAnswers: string[],
    caseData: CaseData
  ): number {
    switch (stepType) {
      case StepType.HISTORY_TAKING:
        const relevantSelected = selectedAnswers.filter(id => 
          correctAnswers.includes(id)
        ).length;
        const irrelevantSelected = selectedAnswers.filter(id => 
          !correctAnswers.includes(id)
        ).length;
        const totalRelevant = correctAnswers.length;
        const minRequired = caseData.steps[StepType.HISTORY_TAKING].minimumRequired || 3;
        if (selectedAnswers.length < minRequired || relevantSelected < 2) return 0;
        // Proportional scoring
        const relevantScore = (relevantSelected / totalRelevant) * 100;
        const irrelevantPenalty = irrelevantSelected * 10;
        const historyScore = relevantScore - irrelevantPenalty;
        return Math.max(0, Math.min(100, historyScore));

      case StepType.ORDERING_TESTS:
        const testStepData = caseData.steps[StepType.ORDERING_TESTS];
        const necessaryTests = selectedAnswers.filter(id => 
          correctAnswers.includes(id)
        ).length;
        const totalNecessary = correctAnswers.length;
        
        // Check for contraindicated tests
        const contraindicated = selectedAnswers.filter(id => {
          const test = testStepData.tests.find((t: any) => t.id === id);
          return test?.contraindicated;
        }).length;
        
        // Penalty for contraindicated tests
        if (contraindicated > 0) {
          return Math.max(0, 30 - (contraindicated * 30));
        }
        
        // Calculate base score based on percentage of necessary tests selected
        const testPercentage = (necessaryTests / totalNecessary) * 100;
        
        // Calculate unnecessary test penalty
        const unnecessaryTests = selectedAnswers.filter(id => 
          !correctAnswers.includes(id) && !testStepData.tests.find((t: any) => t.id === id)?.contraindicated
        ).length;
        const unnecessaryPenalty = unnecessaryTests * 10;
        
        return Math.max(0, Math.min(100, testPercentage - unnecessaryPenalty));

      case StepType.DIAGNOSIS:
        const diagnosisStepData = caseData.steps[StepType.DIAGNOSIS];
        
        if (diagnosisStepData.type === 'multiple-choice') {
          // For single diagnosis cases, check if base diagnosis matches
          const selectedDiagnosis = selectedAnswers[0];
          const correctDiagnosis = correctAnswers[0];
          
          // If multiple selections, apply penalty but don't fail completely
          if (selectedAnswers.length > 1) {
            return Math.max(0, 50 - ((selectedAnswers.length - 1) * 15));
          }
          
          // Check if base diagnosis matches (ignoring secondary details)
          const selectedBaseDiagnosis = selectedDiagnosis?.split(' ')[0]?.toLowerCase();
          const correctBaseDiagnosis = correctDiagnosis?.split(' ')[0]?.toLowerCase();
          
          if (selectedDiagnosis === correctDiagnosis) {
            return 100; // Exact match
          } else if (selectedBaseDiagnosis === correctBaseDiagnosis) {
            return 80; // Base diagnosis matches
          }
          return 0;
        } else {
          // For multiple diagnosis cases
          const correctDiagnoses = selectedAnswers.filter(id => 
            correctAnswers.includes(id)
          ).length;
          const incorrectDiagnoses = selectedAnswers.filter(id => 
            !correctAnswers.includes(id)
          ).length;
          
          // Calculate score based on correct and incorrect selections
          const diagnosisScore = (correctDiagnoses / correctAnswers.length) * 100;
          const incorrectPenalty = incorrectDiagnoses * 15;
          
          return Math.max(0, diagnosisScore - incorrectPenalty);
        }

      case StepType.TREATMENT:
        const treatmentStepData = caseData.steps[StepType.TREATMENT];
        const correctTreatments = selectedAnswers.filter(id => 
          correctAnswers.includes(id)
        ).length;
        const totalCorrect = correctAnswers.length;
        
        // Check for contraindicated treatments
        const contraindicatedTx = selectedAnswers.filter(id => {
          const treatment = treatmentStepData.treatments.find((t: any) => t.id === id);
          return treatment?.contraindicated;
        }).length;
        
        // Penalty for contraindicated treatments
        if (contraindicatedTx > 0) {
          return Math.max(0, 30 - (contraindicatedTx * 30));
        }
        
        // Calculate base score based on percentage of correct treatments
        const treatmentPercentage = (correctTreatments / totalCorrect) * 100;
        
        // Calculate unnecessary treatment penalty
        const unnecessaryTreatments = selectedAnswers.filter(id => 
          !correctAnswers.includes(id) && !treatmentStepData.treatments.find((t: any) => t.id === id)?.contraindicated
        ).length;
        const unnecessaryTreatmentPenalty = unnecessaryTreatments * 10;
        
        return Math.max(0, Math.min(100, treatmentPercentage - unnecessaryTreatmentPenalty));

      default:
        return 0;
    }
  }

  private static getCorrectAnswers(stepType: StepType, caseData: CaseData): string[] {
    switch (stepType) {
      case StepType.HISTORY_TAKING:
        return caseData.steps[StepType.HISTORY_TAKING].correctAnswers;
      case StepType.ORDERING_TESTS:
        return caseData.steps[StepType.ORDERING_TESTS].correctTests;
      case StepType.DIAGNOSIS:
        return caseData.steps[StepType.DIAGNOSIS].correctDiagnoses;
      case StepType.TREATMENT:
        return caseData.steps[StepType.TREATMENT].correctTreatments;
      default:
        return [];
    }
  }

  private static getOptimalOrderMultiplier(
    stepType: StepType,
    stepOrder: number,
    completedSteps: StepType[],
    caseData: CaseData
  ): number {
    const optimalOrder = caseData.scoring?.optimalOrder ?? [];
    const expectedOptimalPosition = optimalOrder.indexOf(stepType);
    const actualPosition = stepOrder - 1; // Convert to 0-based
    
    // Bonus for following optimal order
    if (expectedOptimalPosition === actualPosition) {
      return 1.2; // 20% bonus for optimal order
    }
    
    // Small penalty for being significantly out of order
    const orderDifference = Math.abs(expectedOptimalPosition - actualPosition);
    if (orderDifference >= 2) {
      return 0.9; // 10% penalty for being 2+ steps out of order
    }
    
    return 1.0; // Neutral multiplier for being 1 step out of order
  }

  public static calculateStepResult(
    stepType: StepType,
    stepOrder: number,
    selectedAnswers: string[],
    attempts: number,
    timeElapsed: number,
    caseData: CaseData,
    completedSteps: StepType[] = []
  ): StepResult {
    const correctAnswers = this.getCorrectAnswers(stepType, caseData);
    const score = this.calculateStepScore(stepType, selectedAnswers, correctAnswers, caseData);
    
    // More realistic success thresholds
    const isCorrect = score >= 60; // 60% threshold for basic competency
    
    // Calculate step base XP as quarter of case base XP, scaled by score
    const stepBaseXP = Math.round(((caseData.scoring?.baseXP ?? 100) / 4) * (score / 100));
    
    const stepMultiplier = this.getStepOrderMultiplier(stepOrder);
    const optimalOrderMultiplier = this.getOptimalOrderMultiplier(stepType, stepOrder, completedSteps, caseData);
    const retryPenalty = this.getRetryPenalty(attempts);
    
    // Combined multiplier includes step importance, optimal order bonus/penalty, and retry penalty
    const totalMultiplier = stepMultiplier * optimalOrderMultiplier * retryPenalty;
    const xpEarned = Math.round(stepBaseXP * totalMultiplier);
    

    
    // More nuanced performance categories
    let performance: 'excellent' | 'good' | 'poor' | 'failed';
    if (score >= 85) performance = 'excellent';
    else if (score >= 75) performance = 'good';
    else if (score >= 60) performance = 'poor';
    else performance = 'failed';

    return {
      stepType,
      stepOrder,
      isCorrect,
      isCompleted: true,
      attempts,
      timeElapsed,
      score: Math.round(score),
      baseXP: stepBaseXP,
      multiplier: totalMultiplier,
      xpEarned,
      selectedAnswers,
      performance
    };
  }

  public static calculateGameResult(
    caseData: CaseData,
    stepResults: StepResult[],
    totalTimeElapsed: number
  ): GameResult {
    const totalXP = stepResults.reduce((sum, step) => sum + step.xpEarned, 0);
    const baseXP = stepResults.reduce((sum, step) => sum + step.baseXP, 0);
    
    // Check if optimal order was followed
    const actualOrder = [...stepResults].sort((a, b) => a.stepOrder - b.stepOrder).map(r => r.stepType);
    const followedOptimalOrder = JSON.stringify(actualOrder) === JSON.stringify(caseData.scoring?.optimalOrder ?? []);
    
    // Calculate bonus XP for optimal order
    const bonusXP = followedOptimalOrder ? Math.round(baseXP * 0.15) : 0;
    
    // Calculate penalty XP from retries
    const penaltyXP = stepResults.reduce((sum, step) => {
      const maxPossibleXP = step.baseXP * step.multiplier;
      return sum + (maxPossibleXP - step.xpEarned);
    }, 0);
    
    const finalXP = totalXP + bonusXP;
    
    // Calculate completion percentage based on competency, not just completion
    const competentSteps = stepResults.filter(step => step.score >= 60).length;
    const completionPercentage = Math.round((competentSteps / stepResults.length) * 100);
    
    // Overall performance with more sophisticated calculation
    const averageScore = stepResults.reduce((sum, step) => sum + step.score, 0) / stepResults.length;
    const timePerformance = this.getTimePerformance(totalTimeElapsed, caseData);
    
    // Check for critical failures (any step with score 0 indicates dangerous decisions)
    const hasCriticalFailure = stepResults.some(step => step.score === 0);
    
    let overallPerformance: 'excellent' | 'good' | 'poor' | 'failed';
    
    if (hasCriticalFailure) {
      overallPerformance = 'failed'; // Automatic fail for dangerous decisions
    } else if (averageScore >= 85 && timePerformance === 'excellent' && followedOptimalOrder) {
      overallPerformance = 'excellent';
    } else if (averageScore >= 75 && timePerformance !== 'poor') {
      overallPerformance = 'good';
    } else if (averageScore >= 60) {
      overallPerformance = 'poor';
    } else {
      overallPerformance = 'failed';
    }

    return {
      caseId: caseData.id,
      stepResults,
      totalTimeElapsed,
      totalXP,
      baseXP,
      bonusXP,
      penaltyXP,
      finalXP,
      completionPercentage,
      overallPerformance,
      followedOptimalOrder
    };
  }

  public static getReaction(
    performance: 'excellent' | 'good' | 'poor' | 'failed',
    caseData: CaseData,
    type: 'patient' | 'mentor'
  ): string {
    return caseData.reactions[type][performance];
  }
} 