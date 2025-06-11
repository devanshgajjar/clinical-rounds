import { 
  StepType, 
  StepResult, 
  StepValidation, 
  XPCalculation, 
  RetryState,
  Question,
  Test,
  DiagnosisOption,
  TreatmentOption,
  Case
} from '../types/game';

// XP Calculation Logic
export const calculateXP = (
  baseXP: number,
  stepResults: StepResult[],
  isOptimalOrder: boolean
): XPCalculation => {
  let totalXP = 0;
  const breakdown: XPCalculation['breakdown'] = [];
  
  // Step multipliers for optimal order (History->Tests->Diagnosis->Treatment)
  // 1st: x2, 2nd: x3, 3rd: x4, 4th: x2
  const stepMultipliers = {
    [StepType.HISTORY_TAKING]: isOptimalOrder ? 2 : 1,
    [StepType.ORDERING_TESTS]: isOptimalOrder ? 3 : 1,
    [StepType.DIAGNOSIS]: isOptimalOrder ? 4 : 1,
    [StepType.TREATMENT]: isOptimalOrder ? 2 : 1
  };

  stepResults.forEach((result) => {
    const multiplier = stepMultipliers[result.stepType];
    
    // Apply retry penalties
    let retryPenalty = 1;
    if (result.attempts === 2) retryPenalty = 0.8; // -20% for first retry
    else if (result.attempts === 3) retryPenalty = 0.5; // -50% for second retry
    else if (result.attempts >= 4) retryPenalty = 0; // No XP for 3+ retries
    
    // Calculate final step XP based on score percentage
    const stepBaseXP = Math.floor(baseXP / 4); // Divide base XP among 4 steps
    const finalStepXP = Math.floor(stepBaseXP * multiplier * retryPenalty * (result.score / 100));
    totalXP += finalStepXP;
    
    breakdown.push({
      step: result.stepType,
      score: result.score,
      multiplier,
      xp: finalStepXP,
      attempts: result.attempts,
      penalty: 1 - retryPenalty
    });
  });

  return {
    baseXP,
    stepMultiplier: isOptimalOrder ? 1 : 0,
    orderBonus: isOptimalOrder ? Math.floor(baseXP * 0.2) : 0,
    retryPenalty: 0, // Applied per step above
    speedBonus: 0,
    empathyBonus: 0,
    finalXP: totalXP,
    totalXP: totalXP,
    breakdown,
    badgesEarned: []
  };
};

// Step Validation Logic
export const validateHistoryTaking = (
  selectedQuestions: string[],
  questions: Question[]
): StepValidation => {
  const relevantQuestions = questions.filter(q => q.isRelevant);
  const selectedRelevant = selectedQuestions.filter(id => 
    relevantQuestions.some(q => q.id === id)
  );
  const selectedIrrelevant = selectedQuestions.filter(id => 
    !relevantQuestions.some(q => q.id === id)
  );

  // Scoring: +25 points per relevant question, -10 per irrelevant
  const score = Math.max(0, Math.min(100, 
    (selectedRelevant.length * 25) - (selectedIrrelevant.length * 10)
  ));

  const isValid = selectedQuestions.length === 4 && selectedRelevant.length >= 2;

  let feedback = '';
  if (selectedRelevant.length === relevantQuestions.length) {
    feedback = 'Perfect! You selected all the relevant questions.';
  } else if (selectedRelevant.length >= 3) {
    feedback = 'Good job! You got most of the important questions.';
  } else if (selectedRelevant.length >= 2) {
    feedback = 'Decent history taking, but you missed some key questions.';
  } else {
    feedback = 'You need to focus more on relevant clinical questions.';
  }

  return {
    isValid,
    score,
    feedback,
    requiredSelections: 4,
    correctSelections: selectedRelevant,
    incorrectSelections: selectedIrrelevant,
    patientResponse: 'Thank you for asking those questions, doctor.',
    mentorFeedback: feedback,
    empathyImpact: 0
  };
};

export const validateTestOrdering = (
  selectedTests: string[],
  tests: Test[]
): StepValidation => {
  const relevantTests = tests.filter(t => t.isRelevant);
  const selectedRelevant = selectedTests.filter(id => 
    relevantTests.some(t => t.id === id)
  );
  const selectedIrrelevant = selectedTests.filter(id => 
    !relevantTests.some(t => t.id === id)
  );

  // Scoring: +25 points per relevant test, -15 per irrelevant (higher penalty)
  const score = Math.max(0, Math.min(100, 
    (selectedRelevant.length * 25) - (selectedIrrelevant.length * 15)
  ));

  const isValid = selectedTests.length <= 4 && selectedRelevant.length >= 2;

  let feedback = '';
  if (selectedRelevant.length >= 3 && selectedIrrelevant.length === 0) {
    feedback = 'Excellent test selection! Very efficient and targeted.';
  } else if (selectedRelevant.length >= 2) {
    feedback = 'Good test ordering, but consider cost-effectiveness.';
  } else {
    feedback = 'Your test selection needs improvement. Focus on diagnostic yield.';
  }

  return {
    isValid,
    score,
    feedback,
    requiredSelections: 4,
    correctSelections: selectedRelevant,
    incorrectSelections: selectedIrrelevant,
    patientResponse: 'I hope these tests will help find out what\'s wrong.',
    mentorFeedback: feedback,
    empathyImpact: 0
  };
};

export const validateDiagnosis = (
  selectedDiagnoses: string[],
  diagnosisOptions: DiagnosisOption[]
): StepValidation => {
  const correctDiagnoses = diagnosisOptions.filter(d => d.isCorrect);
  const selectedCorrect = selectedDiagnoses.filter(id => 
    correctDiagnoses.some(d => d.id === id)
  );
  const selectedIncorrect = selectedDiagnoses.filter(id => 
    !correctDiagnoses.some(d => d.id === id)
  );

  // All or nothing scoring for diagnosis
  const score = selectedCorrect.length === correctDiagnoses.length && 
                selectedIncorrect.length === 0 ? 100 : 0;

  const isValid = selectedCorrect.length === correctDiagnoses.length && 
                  selectedIncorrect.length === 0;

  let feedback = '';
  if (isValid) {
    feedback = 'Correct diagnosis! Your clinical reasoning is spot on.';
  } else if (selectedCorrect.length > 0) {
    feedback = 'Close, but not quite right. Review your clinical findings.';
  } else {
    feedback = 'Incorrect diagnosis. Consider the patient presentation more carefully.';
  }

  return {
    isValid,
    score,
    feedback,
    correctSelections: selectedCorrect,
    incorrectSelections: selectedIncorrect,
    patientResponse: isValid ? 'I understand, doctor.' : 'Are you sure about this diagnosis?',
    mentorFeedback: feedback,
    empathyImpact: isValid ? 5 : -2
  };
};

export const validateTreatment = (
  selectedTreatments: string[],
  treatmentOptions: TreatmentOption[]
): StepValidation => {
  const correctTreatments = treatmentOptions.filter(t => t.isCorrect);
  const safeTreatments = treatmentOptions.filter(t => t.isSafe);
  
  const selectedCorrect = selectedTreatments.filter(id => 
    correctTreatments.some(t => t.id === id)
  );
  const selectedUnsafe = selectedTreatments.filter(id => 
    !safeTreatments.some(t => t.id === id)
  );

  // Scoring: +20 per correct, -30 per unsafe (patient safety critical)
  let score = (selectedCorrect.length * 20) - (selectedUnsafe.length * 30);
  score = Math.max(0, Math.min(100, score));

  const isValid = selectedCorrect.length >= 2 && selectedUnsafe.length === 0;

  let feedback = '';
  if (selectedUnsafe.length > 0) {
    feedback = 'SAFETY CONCERN: You selected potentially harmful treatments!';
  } else if (selectedCorrect.length >= 3) {
    feedback = 'Excellent treatment plan! Comprehensive and appropriate.';
  } else if (selectedCorrect.length >= 2) {
    feedback = 'Good treatment approach, but consider additional therapies.';
  } else {
    feedback = 'Your treatment plan needs improvement. Consider evidence-based options.';
  }

  return {
    isValid,
    score,
    feedback,
    correctSelections: selectedCorrect,
    incorrectSelections: selectedUnsafe,
    patientResponse: selectedUnsafe.length > 0 ? 'Doctor, I\'m worried about this treatment...' : 'Thank you for helping me feel better.',
    mentorFeedback: feedback,
    empathyImpact: selectedUnsafe.length > 0 ? -5 : 3
  };
};

// Retry Logic
export const updateRetryState = (
  currentState: RetryState,
  stepType: StepType,
  isCorrect: boolean
): RetryState => {
  const newState = { ...currentState };
  
  if (!isCorrect) {
    newState.totalWrongSteps += 1;
    newState.stepAttempts[stepType] = (newState.stepAttempts[stepType] || 0) + 1;
    
    // Check if player must restart case (3 total wrong steps)
    if (newState.totalWrongSteps >= 3) {
      newState.mustRestart = true;
      newState.canRetry = false;
    }
    // Check if step has reached max attempts (3 per step)
    else if (newState.stepAttempts[stepType] >= 3) {
      newState.canRetry = false;
    }
  }
  
  return newState;
};

// Step Order Validation
export const isOptimalStepOrder = (stepResults: StepResult[]): boolean => {
  const completedSteps = stepResults
    .filter(r => r.isCompleted)
    .sort((a, b) => (a.completedAt?.getTime() || 0) - (b.completedAt?.getTime() || 0))
    .map(r => r.stepType);

  const optimalOrder = [
    StepType.HISTORY_TAKING,
    StepType.ORDERING_TESTS,
    StepType.DIAGNOSIS,
    StepType.TREATMENT
  ];

  // Check if completed steps follow optimal order
  for (let i = 0; i < completedSteps.length; i++) {
    if (completedSteps[i] !== optimalOrder[i]) {
      return false;
    }
  }

  return true;
};

// Step Progress Tracking
export const getStepProgress = (stepResults: StepResult[]): {
  completed: number;
  total: number;
  currentStep?: StepType;
} => {
  const total = 4; // Always 4 steps
  const completed = stepResults.filter(r => r.isCompleted).length;
  
  // Find next step to complete
  const stepOrder = [
    StepType.HISTORY_TAKING,
    StepType.ORDERING_TESTS,
    StepType.DIAGNOSIS,
    StepType.TREATMENT
  ];
  
  let currentStep: StepType | undefined;
  for (const step of stepOrder) {
    if (!stepResults.some(r => r.stepType === step && r.isCompleted)) {
      currentStep = step;
      break;
    }
  }

  return { completed, total, currentStep };
};

// Case Completion Check
export const isCaseComplete = (stepResults: StepResult[]): boolean => {
  const requiredSteps = [
    StepType.HISTORY_TAKING,
    StepType.ORDERING_TESTS,
    StepType.DIAGNOSIS,
    StepType.TREATMENT
  ];

  return requiredSteps.every(step => 
    stepResults.some(r => r.stepType === step && r.isCompleted && r.isCorrect)
  );
};

// Get Step Data Helper
export const getStepData = (gameCase: Case, stepType: StepType) => {
  return gameCase.steps[stepType];
};

// Get Mentor Feedback Helper
export const getMentorFeedback = (
  gameCase: Case, 
  stepType: StepType, 
  isSuccess: boolean, 
  needsHint: boolean = false
): string => {
  const feedback = gameCase.mentorFeedback[stepType];
  
  if (needsHint) return feedback.hint;
  return isSuccess ? feedback.success : feedback.failure;
};

// Get Cutscene Text Helper
export const getCutsceneText = (
  gameCase: Case, 
  stepType: StepType, 
  phase: 'intro' | 'success' | 'failure'
): string => {
  return gameCase.cutscenes[stepType][phase];
}; 