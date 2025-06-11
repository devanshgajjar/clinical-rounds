import { StepType } from '../types/game';
import { CaseData } from '../data/cases';

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
    const { excellent, good, poor } = caseData.scoring.timeThresholds;
    
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
        const minRequired = caseData.steps[StepType.HISTORY_TAKING].minimumRequired;
        
        // Fail if minimum required questions not met
        if (relevantSelected < minRequired) return 0;
        
        // Base score: percentage of relevant questions asked (max 100%)
        const relevantScore = (relevantSelected / totalRelevant) * 100;
        
        // Strong penalty for irrelevant questions (realistic clinical efficiency)
        // Each irrelevant question costs 15 points to discourage shotgun approach
        const irrelevantPenalty = irrelevantSelected * 15;
        
        // Additional penalty for excessive selections (selecting ALL options)
        const totalSelected = selectedAnswers.length;
        const excessivePenalty = totalSelected > (totalRelevant + 2) ? (totalSelected - (totalRelevant + 2)) * 10 : 0;
        
        const historyScore = relevantScore - irrelevantPenalty - excessivePenalty;
        
        return Math.max(0, Math.min(100, historyScore));

      case StepType.ORDERING_TESTS:
        const testStepData = caseData.steps[StepType.ORDERING_TESTS];
        const necessaryTests = selectedAnswers.filter(id => 
          correctAnswers.includes(id)
        ).length;
        const totalNecessary = correctAnswers.length;
        
        // Check for contraindicated tests (high-risk clinical decisions)
        const contraindicated = selectedAnswers.filter(id => {
          const test = testStepData.tests.find((t: any) => t.id === id);
          return test?.contraindicated;
        }).length;
        
        // Severe penalty for contraindicated tests (potentially dangerous)
        if (contraindicated > 0) {
          // For high-risk cases like syncope, contraindicated tests are critical errors
          if (caseData.difficulty >= 4) return 0; // Automatic fail
          return Math.max(0, 30 - (contraindicated * 30)); // Heavy penalty for lower risk cases
        }
        
        // Reward essential test selection highly
        let baseScore = 0;
        if (necessaryTests === totalNecessary) {
          baseScore = 100; // Full points for getting all essential tests
        } else if (necessaryTests >= Math.ceil(totalNecessary * 0.8)) {
          baseScore = 85; // Good score for getting most essential tests
        } else if (necessaryTests >= Math.ceil(totalNecessary * 0.6)) {
          baseScore = 70; // Passing score for getting majority of essential tests
        } else {
          baseScore = (necessaryTests / totalNecessary) * 60; // Proportional score up to 60%
        }
        
        // Calculate cost efficiency penalty (simulates real clinical resource management)
        const selectedTestsData = selectedAnswers.map(id => 
          testStepData.tests.find((t: any) => t.id === id)
        ).filter(Boolean);
        
        const totalCost = selectedTestsData.reduce((sum: number, test: any) => sum + (test?.cost || 0), 0);
        const costPenalty = totalCost > 1000 ? Math.min(15, (totalCost - 1000) / 100) : 0;
        
        // Strong penalty for excessive unnecessary tests (clinical efficiency and cost)
        const unnecessaryTests = selectedAnswers.filter(id => 
          !correctAnswers.includes(id) && !testStepData.tests.find((t: any) => t.id === id)?.contraindicated
        ).length;
        const testEfficiencyPenalty = unnecessaryTests * 12; // 12 points per unnecessary test
        
        const finalScore = Math.max(0, baseScore - costPenalty - testEfficiencyPenalty);
        return Math.round(Math.min(100, finalScore));

      case StepType.DIAGNOSIS:
        const diagnosisStepData = caseData.steps[StepType.DIAGNOSIS];
        
        if (diagnosisStepData.type === 'multiple-choice') {
          // For single diagnosis cases, penalize multiple selections
          if (selectedAnswers.length > 1) return 0; // Fail for selecting multiple when only one should be chosen
          return selectedAnswers[0] === correctAnswers[0] ? 100 : 0;
        } else {
          // For multiple diagnosis cases
          const correctDiagnoses = selectedAnswers.filter(id => 
            correctAnswers.includes(id)
          ).length;
          const incorrectDiagnoses = selectedAnswers.filter(id => 
            !correctAnswers.includes(id)
          ).length;
          
          // Must get ALL correct diagnoses for full points, heavy penalty for wrong ones
          if (correctDiagnoses === correctAnswers.length && incorrectDiagnoses === 0) {
            return 100;
          } else if (correctDiagnoses > 0 && incorrectDiagnoses === 0) {
            return (correctDiagnoses / correctAnswers.length) * 80; // Max 80% for partial correct
          } else {
            return Math.max(0, (correctDiagnoses / correctAnswers.length) * 60 - (incorrectDiagnoses * 40));
          }
        }

      case StepType.TREATMENT:
        const treatmentStepData = caseData.steps[StepType.TREATMENT];
        const correctTreatments = selectedAnswers.filter(id => 
          correctAnswers.includes(id)
        ).length;
        const totalCorrect = correctAnswers.length;
        const contraindicatedTx = selectedAnswers.filter(id => {
          const treatment = treatmentStepData.treatments.find((t: any) => t.id === id);
          return treatment?.contraindicated;
        }).length;
        
        // Automatic fail for contraindicated treatments (dangerous)
        if (contraindicatedTx > 0) return 0;
        
        // Check for critical treatments (those marked as necessary)
        const criticalTreatments = treatmentStepData.treatments.filter((t: any) => t.necessary);
        const criticalSelected = selectedAnswers.filter(id => 
          criticalTreatments.some((t: any) => t.id === id && t.necessary)
        ).length;
        
        // Fail if critical treatments are missed
        if (criticalSelected < criticalTreatments.length) {
          return Math.max(0, (criticalSelected / criticalTreatments.length) * 50); // Max 50% if missing critical treatments
        }
        
        // Full score based on correct treatments selected
        return (correctTreatments / totalCorrect) * 100;

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
    const optimalOrder = caseData.scoring.optimalOrder;
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
    const stepBaseXP = Math.round((caseData.scoring.baseXP / 4) * (score / 100));
    
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
    const followedOptimalOrder = JSON.stringify(actualOrder) === JSON.stringify(caseData.scoring.optimalOrder);
    
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