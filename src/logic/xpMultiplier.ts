export interface StepPerformance {
  stepType: string;
  isCorrect: boolean;
  timeElapsed: number;
  attempts: number;
}

export interface XPMultiplierState {
  currentMultiplier: number; // 0, 2, 3, or 4
  stepNumber: number; // 1-4
  stepPerformances: StepPerformance[];
  showGlow: boolean;
}

export const TIME_TIERS = {
  TIER_1_FAST: 30, // Under 30 seconds = full multiplier
  TIER_2_MEDIUM: 60, // Under 60 seconds = partial multiplier
  // Over 60 seconds = fallback
};

export class XPMultiplierCalculator {
  static calculateMultiplier(stepPerformances: StepPerformance[]): number {
    if (stepPerformances.length === 0) return 0;

    let currentMultiplier = 0;
    
    for (const performance of stepPerformances) {
      if (!performance.isCorrect || performance.attempts > 1) {
        // Incorrect or multiple attempts = fallback to x2
        currentMultiplier = Math.max(currentMultiplier, 2);
        continue;
      }

      // Correct on first attempt - check timing
      if (performance.timeElapsed <= TIME_TIERS.TIER_1_FAST) {
        // Fast completion
        if (currentMultiplier === 0) {
          currentMultiplier = 2; // First fast step = x2
        } else if (currentMultiplier === 2) {
          currentMultiplier = 4; // Second fast step from x2 = x4
        }
        // If already at x3 or x4, maintain current level
      } else if (performance.timeElapsed <= TIME_TIERS.TIER_2_MEDIUM) {
        // Medium completion
        if (currentMultiplier === 0) {
          currentMultiplier = 2; // First step = x2
        } else if (currentMultiplier === 4) {
          currentMultiplier = 3; // Drop from x4 to x3 if slow
        }
        // If at x2 or x3, maintain current level
      } else {
        // Slow completion = fallback
        if (currentMultiplier === 0) {
          currentMultiplier = 2; // First step still gets x2
        } else {
          currentMultiplier = 2; // Fallback to x2
        }
      }
    }

    return currentMultiplier;
  }

  static shouldShowGlow(previousMultiplier: number, newMultiplier: number): boolean {
    return newMultiplier > previousMultiplier;
  }

  static getMultiplierProgress(multiplier: number): number {
    switch (multiplier) {
      case 0: return 0;
      case 2: return 33.33;
      case 3: return 66.66;
      case 4: return 100;
      default: return 0;
    }
  }

  static getMultiplierDescription(multiplier: number): string {
    switch (multiplier) {
      case 0: return "No multiplier";
      case 2: return "Good performance!";
      case 3: return "Excellent progress!";
      case 4: return "Perfect streak!";
      default: return "";
    }
  }

  static calculateFinalXP(baseXP: number, multiplier: number): number {
    return multiplier === 0 ? baseXP : baseXP * multiplier;
  }
}

export const createInitialXPState = (): XPMultiplierState => ({
  currentMultiplier: 0,
  stepNumber: 1,
  stepPerformances: [],
  showGlow: false
});

export const updateXPMultiplier = (
  currentState: XPMultiplierState,
  newPerformance: StepPerformance
): XPMultiplierState => {
  const newPerformances = [...currentState.stepPerformances, newPerformance];
  const previousMultiplier = currentState.currentMultiplier;
  const newMultiplier = XPMultiplierCalculator.calculateMultiplier(newPerformances);
  const showGlow = XPMultiplierCalculator.shouldShowGlow(previousMultiplier, newMultiplier);

  return {
    currentMultiplier: newMultiplier,
    stepNumber: Math.min(newPerformances.length + 1, 4),
    stepPerformances: newPerformances,
    showGlow
  };
};

export const resetXPMultiplier = (): XPMultiplierState => createInitialXPState(); 