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
  Case,
  Treatment
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
  questions: Question[],
  minimumRequired: number
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

  const isValid = selectedQuestions.length >= minimumRequired && selectedRelevant.length >= 2;

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
    requiredSelections: minimumRequired,
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
  const necessaryTests = tests.filter(t => t.necessary);
  const selectedNecessary = selectedTests.filter(id => 
    necessaryTests.some(t => t.id === id)
  );
  const selectedUnnecessary = selectedTests.filter(id => 
    !necessaryTests.some(t => t.id === id)
  );

  // Check for contraindicated tests
  const contraindicatedSelected = selectedTests.filter(id => 
    tests.some(t => t.id === id && t.contraindicated === true)
  );

  // Automatic fail if contraindicated tests are selected
  if (contraindicatedSelected.length > 0) {
    return {
      isValid: false,
      score: 0,
      feedback: 'You selected contraindicated tests that could harm the patient.',
      requiredSelections: necessaryTests.length,
      correctSelections: selectedNecessary,
      incorrectSelections: selectedUnnecessary,
      patientResponse: 'I\'m concerned about these test choices.',
      mentorFeedback: 'Review which tests are contraindicated in this case.',
      empathyImpact: -5
    };
  }

  // Calculate score based on necessary tests selected
  const necessaryScore = (selectedNecessary.length / necessaryTests.length) * 100;
  // Penalty for unnecessary tests
  const unnecessaryPenalty = (selectedUnnecessary.length * 15);
  const score = Math.max(0, Math.min(100, necessaryScore - unnecessaryPenalty));

  const isValid = selectedNecessary.length >= Math.ceil(necessaryTests.length * 0.5); // At least 50% of necessary tests

  let feedback = '';
  if (selectedNecessary.length === necessaryTests.length && selectedUnnecessary.length === 0) {
    feedback = 'Excellent test selection! Very efficient and targeted.';
  } else if (selectedNecessary.length >= Math.ceil(necessaryTests.length * 0.7)) {
    feedback = 'Good test ordering, but some key tests were missed or unnecessary ones added.';
  } else {
    feedback = 'Your test selection needs improvement. Focus on necessary diagnostic tests.';
  }

  return {
    isValid,
    score,
    feedback,
    requiredSelections: necessaryTests.length,
    correctSelections: selectedNecessary,
    incorrectSelections: selectedUnnecessary,
    patientResponse: 'I hope these tests will help find out what\'s wrong.',
    mentorFeedback: feedback,
    empathyImpact: score >= 80 ? 2 : 0
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
  treatments: Treatment[]
): StepValidation => {
  const necessaryTreatments = treatments.filter(t => t.necessary);
  const contraindicatedTreatments = treatments.filter(t => t.contraindicated);
  
  const selectedNecessary = selectedTreatments.filter(id => 
    necessaryTreatments.some(t => t.id === id)
  );
  const selectedContraindicated = selectedTreatments.filter(id => 
    contraindicatedTreatments.some(t => t.id === id)
  );

  // Automatic fail if contraindicated treatments are selected
  if (selectedContraindicated.length > 0) {
    return {
      isValid: false,
      score: 0,
      feedback: 'SAFETY CONCERN: You selected contraindicated treatments that could harm the patient!',
      correctSelections: selectedNecessary,
      incorrectSelections: selectedContraindicated,
      patientResponse: 'Doctor, I\'m worried about these treatments...',
      mentorFeedback: 'Review which treatments are contraindicated in this case.',
      empathyImpact: -5
    };
  }

  // Calculate score based on necessary treatments selected
  const necessaryScore = (selectedNecessary.length / necessaryTreatments.length) * 100;
  // Penalty for unnecessary treatments
  const unnecessaryTreatments = selectedTreatments.filter(id => 
    !necessaryTreatments.some(t => t.id === id) && 
    !contraindicatedTreatments.some(t => t.id === id)
  );
  const unnecessaryPenalty = unnecessaryTreatments.length * 15;
  const score = Math.max(0, Math.min(100, necessaryScore - unnecessaryPenalty));

  const isValid = selectedNecessary.length >= Math.ceil(necessaryTreatments.length * 0.7); // At least 70% of necessary treatments

  let feedback = '';
  if (score >= 90) {
    feedback = 'Excellent treatment plan! Comprehensive and appropriate.';
  } else if (score >= 70) {
    feedback = 'Good treatment approach, but consider additional therapies.';
  } else if (score >= 50) {
    feedback = 'Basic treatment plan, but missing some key interventions.';
  } else {
    feedback = 'Your treatment plan needs significant improvement. Review guidelines.';
  }

  return {
    isValid,
    score,
    feedback,
    correctSelections: selectedNecessary,
    incorrectSelections: [...selectedContraindicated, ...unnecessaryTreatments],
    patientResponse: score >= 70 ? 'Thank you for helping me feel better.' : 'I hope these treatments will help...',
    mentorFeedback: feedback,
    empathyImpact: score >= 80 ? 3 : score >= 60 ? 0 : -2
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