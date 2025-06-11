import {
  StepType,
  StepResult,
  XPMultiplier,
  XPCalculation,
  Case,
  StepOrderWarning,
  PatientEmotionalState
} from '../types/game';

export class XPSystem {
  private static IDEAL_STEP_ORDER = [
    StepType.HISTORY_TAKING,
    StepType.ORDERING_TESTS,
    StepType.DIAGNOSIS,
    StepType.TREATMENT
  ];

  private static SPEED_THRESHOLDS = {
    FAST: 180, // 3 minutes
    NORMAL: 300, // 5 minutes
    SLOW: 600 // 10 minutes
  };

  static createInitialXPMultiplier(): XPMultiplier {
    return {
      current: 1,
      step1Bonus: false,
      step2Bonus: false,
      fastCompletion: false,
      orderBonus: false
    };
  }

  static calculateStepXP(
    step: StepType,
    stepResult: StepResult,
    baseXP: number,
    multiplier: XPMultiplier,
    timeElapsed: number,
    empathyBonus: number = 0
  ): number {
    let xp = baseXP;
    
    // Base score modifier
    xp *= (stepResult.score / 100);
    
    // Retry penalty
    if (stepResult.attempts > 1) {
      const penalties: { [key: number]: number } = { 2: 0.8, 3: 0.5 };
      xp *= penalties[stepResult.attempts] || 0.3;
    }
    
    // Speed bonus
    if (timeElapsed < this.SPEED_THRESHOLDS.FAST) {
      xp *= 1.2; // 20% bonus for fast completion
    } else if (timeElapsed > this.SPEED_THRESHOLDS.SLOW) {
      xp *= 0.9; // 10% penalty for slow completion
    }
    
    // Apply current multiplier
    xp *= multiplier.current;
    
    // Empathy bonus
    xp += empathyBonus;
    
    return Math.round(xp);
  }

  static updateMultiplier(
    currentMultiplier: XPMultiplier,
    stepType: StepType,
    stepResult: StepResult,
    timeElapsed: number,
    stepOrder: StepType[]
  ): XPMultiplier {
    const newMultiplier = { ...currentMultiplier };
    
    // Step 1 bonus (correct on first try)
    if (stepType === StepType.HISTORY_TAKING && stepResult.isCorrect && stepResult.attempts === 1) {
      newMultiplier.step1Bonus = true;
      newMultiplier.current *= 2;
    }
    
    // Step 2 bonus (fast and accurate)
    if (stepType === StepType.ORDERING_TESTS && stepResult.isCorrect) {
      if (timeElapsed < this.SPEED_THRESHOLDS.FAST && stepResult.attempts === 1) {
        newMultiplier.step2Bonus = true;
        newMultiplier.current = Math.min(newMultiplier.current * 2, 4); // Max 4x
      } else if (stepResult.attempts === 1) {
        newMultiplier.current = Math.min(newMultiplier.current * 1.5, 3); // Max 3x if slower
      }
    }
    
    // Order bonus (following ideal sequence)
    const currentStepIndex = this.IDEAL_STEP_ORDER.indexOf(stepType);
    const expectedStepIndex = stepOrder.length;
    if (currentStepIndex === expectedStepIndex) {
      newMultiplier.orderBonus = true;
    } else {
      // Penalty for wrong order
      newMultiplier.current *= 0.8;
    }
    
    // Reset multiplier if step failed
    if (!stepResult.isCorrect) {
      newMultiplier.current = Math.max(newMultiplier.current * 0.5, 1);
    }
    
    return newMultiplier;
  }

  static checkStepOrderWarning(
    stepType: StepType,
    completedSteps: StepType[]
  ): StepOrderWarning | null {
    const currentStepIndex = this.IDEAL_STEP_ORDER.indexOf(stepType);
    const shouldHaveCompleted = this.IDEAL_STEP_ORDER.slice(0, currentStepIndex);
    
    const missingSteps = shouldHaveCompleted.filter(step => !completedSteps.includes(step));
    
    if (missingSteps.length === 0) return null;
    
    const warnings: Partial<{ [key in StepType]: StepOrderWarning }> = {
      [StepType.ORDERING_TESTS]: {
        stepType,
        message: "Consider taking history first to guide your test selection.",
        severity: 'warning',
        xpPenalty: 0.1,
        allowProceed: true
      },
      [StepType.DIAGNOSIS]: {
        stepType,
        message: "Diagnosis without proper history or tests may be premature.",
        severity: 'warning',
        xpPenalty: 0.2,
        allowProceed: true
      },
      [StepType.TREATMENT]: {
        stepType,
        message: "Treatment without diagnosis is dangerous. Are you sure?",
        severity: 'error',
        xpPenalty: 0.5,
        allowProceed: true
      }
    };
    
    return warnings[stepType] || null;
  }

  static calculateFinalXP(
    gameCase: Case,
    stepResults: StepResult[],
    stepOrder: StepType[],
    totalTime: number,
    empathyScore: number,
    culturalBonus: number = 0
  ): XPCalculation {
    let multiplier = this.createInitialXPMultiplier();
    let totalXP = 0;
    const breakdown: XPCalculation['breakdown'] = [];
    
    // Calculate each step
    stepResults.forEach((result, index) => {
      const stepBaseXP = gameCase.baseXP / 4; // Divide base XP among 4 steps
      multiplier = this.updateMultiplier(
        multiplier, 
        result.stepType, 
        result, 
        result.timeElapsed || 0,
        stepOrder.slice(0, index)
      );
      
      const stepXP = this.calculateStepXP(
        result.stepType,
        result,
        stepBaseXP,
        multiplier,
        result.timeElapsed || 0,
        empathyScore * 0.1
      );
      
      totalXP += stepXP;
      
      breakdown.push({
        step: result.stepType,
        score: result.score,
        multiplier: multiplier.current,
        xp: stepXP,
        attempts: result.attempts,
        penalty: result.attempts > 1 ? (1 - (result.attempts === 2 ? 0.8 : 0.5)) : 0
      });
    });
    
    // Speed bonus for overall completion
    let speedBonus = 0;
    if (totalTime < this.SPEED_THRESHOLDS.FAST * 4) { // Fast completion of all steps
      speedBonus = gameCase.baseXP * 0.3;
    }
    
    // Order bonus
    let orderBonus = 0;
    if (this.isIdealOrder(stepOrder)) {
      orderBonus = gameCase.baseXP * 0.2;
    }
    
    // Cultural scenario bonus
    const empathyBonus = culturalBonus;
    
    const finalXP = totalXP + speedBonus + orderBonus + empathyBonus;
    
    return {
      baseXP: gameCase.baseXP,
      stepMultiplier: multiplier.current,
      orderBonus,
      retryPenalty: breakdown.reduce((sum, step) => sum + (step.penalty * gameCase.baseXP / 4), 0),
      speedBonus,
      empathyBonus,
      finalXP: Math.round(finalXP),
      totalXP: Math.round(finalXP),
      breakdown,
      badgesEarned: [] // Will be calculated separately
    };
  }

  static calculateEmpathyImpact(
    patientState: PatientEmotionalState,
    stepType: StepType,
    isCorrect: boolean,
    timeElapsed: number
  ): { newState: PatientEmotionalState; empathyScore: number } {
    const newState = { ...patientState };
    let empathyScore = 0;
    
    if (isCorrect) {
      newState.trust += 10;
      newState.satisfaction += 15;
      newState.anxiety = Math.max(newState.anxiety - 10, 0);
      empathyScore += 5;
      
      if (timeElapsed < 60) { // Quick response
        newState.trust += 5;
        empathyScore += 3;
      }
    } else {
      newState.trust = Math.max(newState.trust - 15, 0);
      newState.satisfaction = Math.max(newState.satisfaction - 10, 0);
      newState.anxiety += 15;
      empathyScore -= 3;
    }
    
    // Update emotion based on overall state
    if (newState.trust > 80 && newState.satisfaction > 70) {
      newState.currentEmotion = 'grateful';
    } else if (newState.anxiety > 70) {
      newState.currentEmotion = 'worried';
    } else if (newState.satisfaction < 30) {
      newState.currentEmotion = 'frustrated';
    } else {
      newState.currentEmotion = 'happy';
    }
    
    // Clamp values
    newState.trust = Math.max(0, Math.min(100, newState.trust));
    newState.anxiety = Math.max(0, Math.min(100, newState.anxiety));
    newState.satisfaction = Math.max(0, Math.min(100, newState.satisfaction));
    
    return { newState, empathyScore };
  }

  private static isIdealOrder(stepOrder: StepType[]): boolean {
    return stepOrder.length === 4 && 
           stepOrder.every((step, index) => step === this.IDEAL_STEP_ORDER[index]);
  }

  static calculateRetryPenalty(attempts: number): number {
    const penalties: { [key: number]: number } = { 1: 1, 2: 0.8, 3: 0.5 };
    return penalties[attempts] || 0.3;
  }

  static shouldRestartCase(stepAttempts: { [stepType: string]: number }): boolean {
    return Object.values(stepAttempts).some(attempts => attempts >= 3);
  }
} 