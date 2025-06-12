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

  // Time thresholds for multiplier tiers
  private static TIME_THRESHOLDS = {
    EXCELLENT: 120, // 2 minutes (green zone - fastest)
    GOOD: 240,      // 4 minutes (yellow zone - good)
    POOR: 360       // 6 minutes (red zone - slow)
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

  /**
   * XP Multiplier Flow Implementation:
   * Round 1: Correct & within time → 2x multiplier unlocked
   * Round 2: First tier time (fast) → +2x (total 4x), Second tier → +1x (total 3x), Missed time → fallback to 2x
   * Round 3: Depends on previous step performance, maintains or reduces multiplier
   * Round 4: Final step applies current multiplier to total XP earned
   */
  static updateMultiplier(
    currentMultiplier: XPMultiplier,
    stepType: StepType,
    stepResult: StepResult,
    timeElapsed: number,
    stepOrder: StepType[]
  ): XPMultiplier {
    const newMultiplier = { ...currentMultiplier };
    
    // Failed step resets multiplier significantly
    if (!stepResult.isCorrect) {
      newMultiplier.current = Math.max(1, newMultiplier.current * 0.5);
      return newMultiplier;
    }

    // Round 1: History Taking - Correct & within time unlocks 2x multiplier
    if (stepType === StepType.HISTORY_TAKING) {
      if (stepResult.isCorrect && timeElapsed <= this.TIME_THRESHOLDS.POOR) {
        newMultiplier.current = 2;
        newMultiplier.step1Bonus = true;
      } else {
        newMultiplier.current = 1; // No bonus if too slow or incorrect
      }
    }
    
    // Round 2: Ordering Tests - Time-based multiplier building
    else if (stepType === StepType.ORDERING_TESTS && stepResult.isCorrect) {
      if (timeElapsed <= this.TIME_THRESHOLDS.EXCELLENT) {
        // First tier time: +2x multiplier (2x + 2x = 4x total)
        newMultiplier.current = Math.min(newMultiplier.current + 2, 4);
        newMultiplier.step2Bonus = true;
        newMultiplier.fastCompletion = true;
      } else if (timeElapsed <= this.TIME_THRESHOLDS.GOOD) {
        // Second tier time: +1x multiplier (2x + 1x = 3x total)
        newMultiplier.current = Math.min(newMultiplier.current + 1, 3);
        newMultiplier.step2Bonus = true;
      } else {
        // Missed time: fallback to 2x (no change from previous step)
        // newMultiplier.current stays the same (should be 2x from step 1)
      }
    }
    
    // Round 3: Diagnosis - Depends on previous step performance
    else if (stepType === StepType.DIAGNOSIS && stepResult.isCorrect) {
      // From 4x: stay 4x if accurate & quick, otherwise drop to 2x
      if (newMultiplier.current >= 4) {
        if (timeElapsed <= this.TIME_THRESHOLDS.GOOD && stepResult.attempts === 1) {
          // Stay at 4x
        } else {
          newMultiplier.current = 2; // Drop to 2x
        }
      }
      // From 3x: stay 3x or drop to 2x
      else if (newMultiplier.current >= 3) {
        if (timeElapsed <= this.TIME_THRESHOLDS.POOR && stepResult.attempts === 1) {
          // Stay at 3x
        } else {
          newMultiplier.current = 2; // Drop to 2x
        }
      }
      // From 2x: no boost possible, just maintain
    }
    
    // Round 4: Treatment - Final step applies current multiplier
    // (No multiplier changes in treatment step, just applies whatever we have)
    
    // Order bonus: Following ideal sequence maintains multiplier
    const currentStepIndex = this.IDEAL_STEP_ORDER.indexOf(stepType);
    const expectedStepIndex = stepOrder.length;
    if (currentStepIndex === expectedStepIndex) {
      newMultiplier.orderBonus = true;
    } else {
      // Penalty for wrong order - reduce multiplier
      newMultiplier.current = Math.max(1, newMultiplier.current * 0.8);
    }
    
    return newMultiplier;
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
    
    // For the final calculation, we don't apply multipliers per step
    // Instead, we'll apply the final multiplier to the total case XP
    // This matches the flow: "Final step applies current multiplier to total XP earned"
    
    // No speed bonus here - that's handled by the multiplier system
    
    // Empathy bonus
    xp += empathyBonus;
    
    return Math.round(xp);
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
    let baseStepXP = 0;
    const breakdown: XPCalculation['breakdown'] = [];
    
    // Calculate each step's base XP (without multipliers)
    stepResults.forEach((result, index) => {
      const stepBaseXP = gameCase.baseXP / 4; // Divide base XP among 4 steps
      
      // Update multiplier based on this step's performance
      multiplier = this.updateMultiplier(
        multiplier, 
        result.stepType, 
        result, 
        result.timeElapsed || 0,
        stepOrder.slice(0, index)
      );
      
      // Calculate base XP for this step (no multiplier applied yet)
      const stepXP = this.calculateStepXP(
        result.stepType,
        result,
        stepBaseXP,
        { current: 1, step1Bonus: false, step2Bonus: false, fastCompletion: false, orderBonus: false }, // No multiplier yet
        result.timeElapsed || 0,
        empathyScore * 0.1
      );
      
      baseStepXP += stepXP;
      
      breakdown.push({
        step: result.stepType,
        score: result.score,
        multiplier: multiplier.current, // Show current multiplier for display
        xp: stepXP, // Base XP without multiplier
        attempts: result.attempts,
        penalty: result.attempts > 1 ? (1 - (result.attempts === 2 ? 0.8 : 0.5)) : 0
      });
    });
    
    // Apply final multiplier to total earned XP (this is the key change)
    const multipliedXP = baseStepXP * multiplier.current;
    
    // Additional bonuses
    let speedBonus = 0;
    if (totalTime < this.TIME_THRESHOLDS.EXCELLENT * 4) { // Fast completion of all steps
      speedBonus = gameCase.baseXP * 0.1; // Smaller bonus since multiplier is main reward
    }
    
    // Order bonus
    let orderBonus = 0;
    if (this.isIdealOrder(stepOrder)) {
      orderBonus = gameCase.baseXP * 0.1; // Smaller bonus since multiplier is main reward
    }
    
    // Cultural scenario bonus
    const empathyBonus = culturalBonus;
    
    const finalXP = multipliedXP + speedBonus + orderBonus + empathyBonus;
    
    return {
      baseXP: gameCase.baseXP,
      stepMultiplier: multiplier.current,
      orderBonus,
      retryPenalty: breakdown.reduce((sum, step) => sum + (step.penalty * gameCase.baseXP / 4), 0),
      speedBonus,
      empathyBonus,
      finalXP: Math.round(finalXP),
      totalXP: Math.round(finalXP),
      breakdown: breakdown.map(step => ({
        ...step,
        xp: Math.round(step.xp * multiplier.current) // Apply multiplier to display
      })),
      badgesEarned: [] // Will be calculated separately
    };
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
        message: "⚠️ Skipping history may reduce your XP multiplier. Consider taking history first.",
        severity: 'warning',
        xpPenalty: 0.2,
        allowProceed: true
      },
      [StepType.DIAGNOSIS]: {
        stepType,
        message: "⚠️ Diagnosis without proper history or tests will significantly impact your multiplier.",
        severity: 'warning',
        xpPenalty: 0.3,
        allowProceed: true
      },
      [StepType.TREATMENT]: {
        stepType,
        message: "🚫 Treatment without diagnosis is dangerous and will reset your multiplier to 1x!",
        severity: 'error',
        xpPenalty: 0.8,
        allowProceed: true
      }
    };
    
    return warnings[stepType] || null;
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

  /**
   * Helper method to get multiplier description for UI
   */
  static getMultiplierDescription(multiplier: XPMultiplier, stepType: StepType): string {
    const current = multiplier.current;
    
    if (current >= 4) {
      return "🔥 4x MULTIPLIER! Perfect streak - keep it up!";
    } else if (current >= 3) {
      return "⚡ 3x Multiplier - Excellent work!";
    } else if (current >= 2) {
      return "✨ 2x Multiplier - Good performance!";
    } else {
      return "📈 1x - Build your multiplier with accuracy and speed!";
    }
  }

  /**
   * Helper method to get time zone description
   */
  static getTimeZoneDescription(timeElapsed: number): { zone: string; color: string; description: string } {
    if (timeElapsed <= this.TIME_THRESHOLDS.EXCELLENT) {
      return { zone: "EXCELLENT", color: "#10B981", description: "Lightning fast! ⚡" };
    } else if (timeElapsed <= this.TIME_THRESHOLDS.GOOD) {
      return { zone: "GOOD", color: "#F59E0B", description: "Good pace 👍" };
    } else {
      return { zone: "SLOW", color: "#EF4444", description: "Too slow - hurry up! ⏰" };
    }
  }
} 