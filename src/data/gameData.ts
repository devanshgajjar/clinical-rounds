import { 
  ClinicalSystem, 
  Case, 
  BodySystem, 
  StepType, 
  TestCategory,
  TreatmentCategory,
  Badge,
  CulturalScenario,
  RetryMechanics
} from '../types/game';

// Retry mechanics configuration
export const defaultRetryMechanics: RetryMechanics = {
  maxAttempts: 3,
  xpPenalties: { 2: 0.8, 3: 0.5 }, // 2nd try: -20%, 3rd try: -50%
  stepFailureThreshold: 3,
  casePenalty: 10
};

// Badge definitions
export const gameBadges: Badge[] = [
  {
    id: 'first_case',
    name: 'First Steps',
    description: 'Complete your first case',
    icon: '🏥',
    requirement: { type: 'cases_completed', value: 1 },
    xpBonus: 5
  },
  {
    id: 'cardio_master',
    name: 'Heart Expert',
    description: 'Complete all cardiology cases perfectly',
    icon: '❤️',
    requirement: { type: 'perfect_cases', value: 3, system: BodySystem.CARDIOVASCULAR },
    xpBonus: 25
  },
  {
    id: 'speed_demon',
    name: 'Lightning Fast',
    description: 'Complete a case in under 5 minutes',
    icon: '⚡',
    requirement: { type: 'speed_bonus', value: 300 },
    xpBonus: 15
  }
];

// Common questions for different specialties
const historyQuestions = {
  cardiovascular: [
    { id: 'cv_q1', text: 'Do you have chest pain or discomfort?', isRelevant: true },
    { id: 'cv_q2', text: 'Do you experience shortness of breath?', isRelevant: true },
    { id: 'cv_q3', text: 'Do you have a family history of heart disease?', isRelevant: true },
    { id: 'cv_q4', text: 'Do you smoke or have you ever smoked?', isRelevant: true },
    { id: 'cv_q5', text: 'Do you have any allergies to medications?', isRelevant: false },
    { id: 'cv_q6', text: 'Do you have trouble sleeping?', isRelevant: false },
    { id: 'cv_q7', text: 'Do you have any skin problems?', isRelevant: false },
    { id: 'cv_q8', text: 'Do you exercise regularly?', isRelevant: true },
    { id: 'cv_q9', text: 'Do you have diabetes or high blood pressure?', isRelevant: true },
    { id: 'cv_q10', text: 'Do you have any dental problems?', isRelevant: false }
  ],
  neurology: [
    { id: 'neuro_q1', text: 'Do you have headaches?', isRelevant: true },
    { id: 'neuro_q2', text: 'Have you experienced any vision changes?', isRelevant: true },
    { id: 'neuro_q3', text: 'Do you have weakness in any limbs?', isRelevant: true },
    { id: 'neuro_q4', text: 'Do you have numbness or tingling?', isRelevant: true },
    { id: 'neuro_q5', text: 'Do you have stomach pain?', isRelevant: false },
    { id: 'neuro_q6', text: 'Do you have balance problems or dizziness?', isRelevant: true },
    { id: 'neuro_q7', text: 'Have you had any seizures?', isRelevant: true },
    { id: 'neuro_q8', text: 'Do you have joint pain?', isRelevant: false },
    { id: 'neuro_q9', text: 'Do you have memory problems?', isRelevant: true },
    { id: 'neuro_q10', text: 'Do you have any allergies to seafood?', isRelevant: false }
  ]
};

// Common tests
const commonTests = {
  cardiovascular: [
    { id: 'cv_t1', name: 'ECG (Electrocardiogram)', category: TestCategory.VITALS, necessary: true, cost: 50, synonyms: [], commonTerms: [] },
    { id: 'cv_t2', name: 'Chest X-Ray', category: TestCategory.IMAGING, necessary: true, cost: 100, synonyms: [], commonTerms: [] },
    { id: 'cv_t3', name: 'Troponin I/T', category: TestCategory.LABS, necessary: true, cost: 75, synonyms: [], commonTerms: [] },
    { id: 'cv_t4', name: 'Complete Blood Count', category: TestCategory.LABS, necessary: false, cost: 25, synonyms: [], commonTerms: [] },
    { id: 'cv_t5', name: 'Echocardiogram', category: TestCategory.IMAGING, necessary: true, cost: 350, synonyms: [], commonTerms: [] },
    { id: 'cv_t6', name: 'Lipid Panel', category: TestCategory.LABS, necessary: true, cost: 25, synonyms: [], commonTerms: [] },
    { id: 'cv_t7', name: 'Bone Density Scan', category: TestCategory.IMAGING, necessary: false, cost: 200, synonyms: [], commonTerms: [] },
    { id: 'cv_t8', name: 'Urine Culture', category: TestCategory.LABS, necessary: false, cost: 45, synonyms: [], commonTerms: [] }
  ],
  neurology: [
    { id: 'neuro_t1', name: 'CT Head without contrast', category: TestCategory.IMAGING, necessary: true, cost: 400, synonyms: [], commonTerms: [] },
    { id: 'neuro_t2', name: 'MRI Brain', category: TestCategory.IMAGING, necessary: true, cost: 800, synonyms: [], commonTerms: [] },
    { id: 'neuro_t3', name: 'Blood Glucose', category: TestCategory.LABS, necessary: true, cost: 15, synonyms: [], commonTerms: [] },
    { id: 'neuro_t4', name: 'EEG (Electroencephalogram)', category: TestCategory.VITALS, necessary: true, cost: 500, synonyms: [], commonTerms: [] },
    { id: 'neuro_t5', name: 'Lumbar Puncture', category: TestCategory.LABS, necessary: false, cost: 200, synonyms: [], commonTerms: [] },
    { id: 'neuro_t6', name: 'Chest X-Ray', category: TestCategory.IMAGING, necessary: false, cost: 100, synonyms: [], commonTerms: [] },
    { id: 'neuro_t7', name: 'Neurological Examination', category: TestCategory.VITALS, necessary: true, cost: 0, synonyms: [], commonTerms: [] },
    { id: 'neuro_t8', name: 'Stool Sample', category: TestCategory.LABS, necessary: false, cost: 35, synonyms: [], commonTerms: [] }
  ]
};

// Cultural scenarios
const culturalScenarios: CulturalScenario[] = [
  {
    id: 'cost_concern',
    trigger: 'cost_concern',
    description: 'Patient expresses worry about medical costs',
    patientResponse: 'Doctor, I\'m worried about the cost of these tests. My insurance might not cover everything.',
    options: [
      { id: 'empathetic', text: 'I understand your concern. Let me explain which tests are most essential.', empathyBonus: 10, xpModifier: 1.1 },
      { id: 'dismissive', text: 'Don\'t worry about costs, just focus on getting better.', empathyBonus: -5, xpModifier: 0.9 },
      { id: 'practical', text: 'Let me check with the financial counselor about payment options.', empathyBonus: 5, xpModifier: 1.0 }
    ]
  },
  {
    id: 'family_gratitude',
    trigger: 'gratitude',
    description: 'Patient brings homemade food as thanks',
    patientResponse: 'Doctor, my family made these sweets for you. Thank you for taking such good care of me!',
    options: [
      { id: 'gracious', text: 'That\'s so thoughtful! Your recovery is the best thanks I could ask for.', empathyBonus: 15, xpModifier: 1.1 },
      { id: 'professional', text: 'Thank you, but I can\'t accept gifts. Your health improvement is reward enough.', empathyBonus: 5, xpModifier: 1.0 },
      { id: 'awkward', text: 'Oh, you didn\'t need to do that.', empathyBonus: -2, xpModifier: 0.95 }
    ]
  }
];

// 5 Dummy Cases
const case1: Case = {
  id: 'case_stemi_001',
  title: 'Acute Chest Pain Emergency',
  description: 'A 58-year-old construction worker presents with crushing chest pain that started while lifting heavy equipment.',
  patientInfo: {
    name: 'Robert Martinez',
    age: 58,
    gender: 'Male',
    chiefComplaint: 'Severe crushing chest pain for 45 minutes, radiating to left arm',
    avatar: '👨‍🔧'
  },
  bodySystem: BodySystem.CARDIOVASCULAR,
  difficulty: 3,
      baseXP: 120, // Updated for consistency
  idealStepOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT],
  steps: {
    [StepType.HISTORY_TAKING]: {
      questions: historyQuestions.cardiovascular,
      requiredSelections: 4,
      maxSelections: 6
    },
    [StepType.ORDERING_TESTS]: {
      tests: commonTests.cardiovascular,
      requiredSelections: 3,
      maxSelections: 5
    },
    [StepType.DIAGNOSIS]: {
      diagnosisOptions: [
        { id: 'd1', text: 'ST-Elevation Myocardial Infarction (STEMI)', isCorrect: true, diagnosis: 'ST-Elevation Myocardial Infarction (STEMI)', correct: true, name: 'ST-Elevation Myocardial Infarction (STEMI)', synonyms: [], commonTerms: [] },
        { id: 'd2', text: 'Non-ST Elevation Myocardial Infarction (NSTEMI)', isCorrect: false, diagnosis: 'Non-ST Elevation Myocardial Infarction (NSTEMI)', correct: false, name: 'Non-ST Elevation Myocardial Infarction (NSTEMI)', synonyms: [], commonTerms: [] },
        { id: 'd3', text: 'Unstable Angina', isCorrect: false, diagnosis: 'Unstable Angina', correct: false, name: 'Unstable Angina', synonyms: [], commonTerms: [] },
        { id: 'd4', text: 'Gastroesophageal Reflux Disease', isCorrect: false, diagnosis: 'Gastroesophageal Reflux Disease', correct: false, name: 'Gastroesophageal Reflux Disease', synonyms: [], commonTerms: [] },
        { id: 'd5', text: 'Musculoskeletal Chest Pain', isCorrect: false, diagnosis: 'Musculoskeletal Chest Pain', correct: false, name: 'Musculoskeletal Chest Pain', synonyms: [], commonTerms: [] }
      ],
      requiredSelections: 1
    },
    [StepType.TREATMENT]: {
      treatmentOptions: [
        { id: 'tr1', text: 'Aspirin 325mg chewed', category: TreatmentCategory.MEDICATIONS, isCorrect: true, isSafe: true },
        { id: 'tr2', text: 'Clopidogrel 600mg loading dose', category: TreatmentCategory.MEDICATIONS, isCorrect: true, isSafe: true },
        { id: 'tr3', text: 'Primary PCI (Emergency catheterization)', category: TreatmentCategory.PROCEDURES, isCorrect: true, isSafe: true },
        { id: 'tr4', text: 'Morphine 2-4mg IV for pain', category: TreatmentCategory.MEDICATIONS, isCorrect: true, isSafe: true },
        { id: 'tr5', text: 'Discharge home with follow-up', category: TreatmentCategory.LIFESTYLE, isCorrect: false, isSafe: false },
        { id: 'tr6', text: 'High-dose steroids', category: TreatmentCategory.MEDICATIONS, isCorrect: false, isSafe: false }
      ],
      requiredSelections: 3,
      maxSelections: 4
    }
  },
  cutscenes: {
    [StepType.HISTORY_TAKING]: {
      intro: "Mr. Martinez is clutching his chest, sweating profusely. He looks anxious and in significant distress.",
      success: "You gather crucial information about his symptoms and risk factors. His pain is classic for cardiac origin.",
      failure: "The patient seems frustrated that you're asking seemingly unrelated questions while he's in pain."
    },
    [StepType.ORDERING_TESTS]: {
      intro: "Based on your history, you need to confirm your suspicions quickly. Time is critical.",
      success: "The tests reveal clear evidence of an acute cardiac event requiring immediate intervention.",
      failure: "The tests you ordered don't provide the crucial information needed for this emergency."
    },
    [StepType.DIAGNOSIS]: {
      intro: "The ECG shows ST-elevations in leads II, III, and aVF. Troponin is elevated.",
      success: "Your diagnosis is correct! This is indeed a STEMI requiring immediate reperfusion therapy.",
      failure: "Your diagnosis doesn't match the clear ECG and laboratory findings."
    },
    [StepType.TREATMENT]: {
      intro: "This is a STEMI - every minute counts. What's your immediate treatment plan?",
      success: "Excellent! You've initiated the appropriate STEMI protocol. The patient is being rushed to the cath lab.",
      failure: "Your treatment plan may delay life-saving intervention for this time-sensitive condition."
    }
  },
  mentorFeedback: {
    [StepType.HISTORY_TAKING]: {
      success: "Excellent history taking! You focused on the key cardiac symptoms and risk factors.",
      failure: "Remember to focus on chest pain characteristics and cardiac risk factors in suspected ACS.",
      hint: "Think about what makes chest pain cardiac vs non-cardiac.",
      gentle: "Good start! Let's focus on the most relevant questions for chest pain evaluation.",
      blunt: "You're missing critical information needed to evaluate acute coronary syndrome."
    },
    [StepType.ORDERING_TESTS]: {
      success: "Perfect test selection! You ordered exactly what's needed for STEMI diagnosis.",
      failure: "Focus on tests that can quickly diagnose acute MI in an emergency setting.",
      hint: "What tests can show heart muscle damage and electrical activity?",
      gentle: "Good thinking! Consider which tests are most urgent for chest pain evaluation.",
      blunt: "These tests won't help diagnose or rule out acute MI. Focus on cardiac-specific tests."
    },
    [StepType.DIAGNOSIS]: {
      success: "Correct! The ST-elevations and positive troponin confirm STEMI.",
      failure: "Look at the ECG changes and elevated troponin. What do these findings indicate?",
      hint: "ST-elevations in contiguous leads + positive troponin = ?",
      gentle: "You're close! Review the ECG findings - what type of MI shows ST-elevations?",
      blunt: "This is a textbook STEMI. The ECG and troponin couldn't be clearer."
    },
    [StepType.TREATMENT]: {
      success: "Outstanding! You've implemented the gold standard STEMI treatment protocol.",
      failure: "STEMI requires immediate reperfusion therapy. What's the best approach?",
      hint: "Think 'time is muscle' - what restores blood flow fastest?",
      gentle: "Good choices! Consider what urgent interventions this patient needs.",
      blunt: "This patient needs immediate reperfusion therapy. Primary PCI is the gold standard."
    }
  },
  culturalScenarios: [culturalScenarios[0]],
  patientInitialState: {
    trust: 70,
    anxiety: 85,
    satisfaction: 50,
    currentEmotion: 'worried'
  }
};

// Continue with other cases...
const case2: Case = {
  id: 'case_stroke_001',
  title: 'Sudden Neurological Deficit',
  description: 'A 72-year-old retired teacher presents with sudden onset weakness and speech difficulty.',
  patientInfo: {
    name: 'Margaret Chen',
    age: 72,
    gender: 'Female',
    chiefComplaint: 'Sudden weakness on right side and difficulty speaking, started 2 hours ago',
    avatar: '👩‍🏫'
  },
  bodySystem: BodySystem.NEUROLOGY,
  difficulty: 4,
      baseXP: 140, // Updated for consistency
  idealStepOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT],
  steps: {
    [StepType.HISTORY_TAKING]: {
      questions: historyQuestions.neurology,
      requiredSelections: 4,
      maxSelections: 6
    },
    [StepType.ORDERING_TESTS]: {
      tests: commonTests.neurology,
      requiredSelections: 3,
      maxSelections: 5
    },
    [StepType.DIAGNOSIS]: {
      diagnosisOptions: [
        { id: 'sd1', text: 'Acute Ischemic Stroke', isCorrect: true, diagnosis: 'Acute Ischemic Stroke', correct: true, name: 'Acute Ischemic Stroke', synonyms: [], commonTerms: [] },
        { id: 'sd2', text: 'Hemorrhagic Stroke', isCorrect: false, diagnosis: 'Hemorrhagic Stroke', correct: false, name: 'Hemorrhagic Stroke', synonyms: [], commonTerms: [] },
        { id: 'sd3', text: 'Transient Ischemic Attack', isCorrect: false, diagnosis: 'Transient Ischemic Attack', correct: false, name: 'Transient Ischemic Attack', synonyms: [], commonTerms: [] },
        { id: 'sd4', text: 'Migraine with Aura', isCorrect: false, diagnosis: 'Migraine with Aura', correct: false, name: 'Migraine with Aura', synonyms: [], commonTerms: [] },
        { id: 'sd5', text: 'Seizure with Todd\'s Paralysis', isCorrect: false, diagnosis: 'Seizure with Todd\'s Paralysis', correct: false, name: 'Seizure with Todd\'s Paralysis', synonyms: [], commonTerms: [] }
      ],
      requiredSelections: 1
    },
    [StepType.TREATMENT]: {
      treatmentOptions: [
        { id: 'str1', text: 'IV tPA (tissue plasminogen activator)', category: TreatmentCategory.MEDICATIONS, isCorrect: true, isSafe: true },
        { id: 'str2', text: 'Aspirin 81mg (after tPA)', category: TreatmentCategory.MEDICATIONS, isCorrect: true, isSafe: true },
        { id: 'str3', text: 'Blood pressure management', category: TreatmentCategory.MEDICATIONS, isCorrect: true, isSafe: true },
        { id: 'str4', text: 'Immediate anticoagulation with heparin', category: TreatmentCategory.MEDICATIONS, isCorrect: false, isSafe: false },
        { id: 'str5', text: 'High-dose steroids', category: TreatmentCategory.MEDICATIONS, isCorrect: false, isSafe: false },
        { id: 'str6', text: 'Stroke unit admission', category: TreatmentCategory.PROCEDURES, isCorrect: true, isSafe: true }
      ],
      requiredSelections: 3,
      maxSelections: 4
    }
  },
  cutscenes: {
    [StepType.HISTORY_TAKING]: {
      intro: "Mrs. Chen is alert but has obvious right-sided weakness and slurred speech. Her daughter is with her, very worried.",
      success: "You obtain a clear timeline and identify key stroke risk factors. The onset time is crucial.",
      failure: "The patient and family seem frustrated by your questions when they expected immediate action."
    },
    [StepType.ORDERING_TESTS]: {
      intro: "You need to quickly determine if this is ischemic or hemorrhagic stroke. The clock is ticking.",
      success: "CT shows no hemorrhage. The patient is within the tPA window. Blood work is acceptable.",
      failure: "The tests you ordered either take too long or don't help differentiate stroke types."
    },
    [StepType.DIAGNOSIS]: {
      intro: "CT shows no blood. NIHSS score is 8. Onset was 2 hours ago. Labs are normal.",
      success: "Correct diagnosis! This is an acute ischemic stroke within the treatment window.",
      failure: "Your diagnosis doesn't fit with the clinical presentation and imaging findings."
    },
    [StepType.TREATMENT]: {
      intro: "This patient is a candidate for thrombolytic therapy. What's your treatment plan?",
      success: "Excellent! You've initiated appropriate acute stroke treatment. Mrs. Chen is getting tPA.",
      failure: "Your treatment plan may not optimize this patient's chance of recovery."
    }
  },
  mentorFeedback: {
    [StepType.HISTORY_TAKING]: {
      success: "Great job getting the stroke history! Timing and risk factors are crucial.",
      failure: "In stroke, focus on onset time, symptoms, and contraindications to treatment.",
      hint: "When did symptoms start? Any bleeding history? Current medications?",
      gentle: "Good approach! Remember that timing is everything in stroke care.",
      blunt: "You're missing critical information needed for stroke treatment decisions."
    },
    [StepType.ORDERING_TESTS]: {
      success: "Perfect! CT rules out hemorrhage and you checked for tPA contraindications.",
      failure: "Focus on tests that differentiate ischemic from hemorrhagic stroke quickly.",
      hint: "What imaging can rule out bleeding? What labs are needed before tPA?",
      gentle: "You're on the right track! Consider what's needed before giving clot-busting drugs.",
      blunt: "Time is brain! Get the essential tests to rule out hemorrhage and clear tPA."
    },
    [StepType.DIAGNOSIS]: {
      success: "Excellent! Acute ischemic stroke with treatment window still open.",
      failure: "Review the CT findings and clinical presentation. What type of stroke is this?",
      hint: "No blood on CT + acute onset = ischemic stroke",
      gentle: "Close! The CT and clinical findings point to which type of stroke?",
      blunt: "This is clearly an acute ischemic stroke. The CT shows no hemorrhage."
    },
    [StepType.TREATMENT]: {
      success: "Outstanding stroke care! tPA within 3 hours gives the best outcomes.",
      failure: "This patient is eligible for thrombolytic therapy. What's the treatment?",
      hint: "Clot-busting medication within the time window",
      gentle: "Good thinking! What medication can dissolve the clot?",
      blunt: "Give tPA immediately! This patient is within the treatment window."
    }
  },
  culturalScenarios: [culturalScenarios[1]],
  patientInitialState: {
    trust: 60,
    anxiety: 90,
    satisfaction: 45,
    currentEmotion: 'confused'
  }
};

// Simple case for testing
const case3: Case = {
  id: 'case_hypertension_001',
  title: 'Hypertension Management',
  description: 'A 55-year-old patient with newly diagnosed high blood pressure.',
  patientInfo: {
    name: 'John Davis',
    age: 55,
    gender: 'Male',
    chiefComplaint: 'High blood pressure found during routine check-up',
    avatar: '👨‍💼'
  },
  bodySystem: BodySystem.CARDIOVASCULAR,
  difficulty: 2,
      baseXP: 100, // Updated for consistency
  idealStepOrder: [StepType.HISTORY_TAKING, StepType.ORDERING_TESTS, StepType.DIAGNOSIS, StepType.TREATMENT],
  steps: {
    [StepType.HISTORY_TAKING]: {
      questions: historyQuestions.cardiovascular,
      requiredSelections: 3,
      maxSelections: 5
    },
    [StepType.ORDERING_TESTS]: {
      tests: commonTests.cardiovascular,
      requiredSelections: 2,
      maxSelections: 4
    },
    [StepType.DIAGNOSIS]: {
      diagnosisOptions: [
        { id: 'h1', text: 'Essential Hypertension', isCorrect: true, diagnosis: 'Essential Hypertension', correct: true, name: 'Essential Hypertension', synonyms: [], commonTerms: [] },
        { id: 'h2', text: 'Secondary Hypertension', isCorrect: false, diagnosis: 'Secondary Hypertension', correct: false, name: 'Secondary Hypertension', synonyms: [], commonTerms: [] },
        { id: 'h3', text: 'White Coat Hypertension', isCorrect: false, diagnosis: 'White Coat Hypertension', correct: false, name: 'White Coat Hypertension', synonyms: [], commonTerms: [] }
      ],
      requiredSelections: 1
    },
    [StepType.TREATMENT]: {
      treatmentOptions: [
        { id: 'ht1', text: 'ACE Inhibitor', category: TreatmentCategory.MEDICATIONS, isCorrect: true, isSafe: true },
        { id: 'ht2', text: 'Lifestyle modifications', category: TreatmentCategory.LIFESTYLE, isCorrect: true, isSafe: true },
        { id: 'ht3', text: 'Follow-up in 3 months', category: TreatmentCategory.LIFESTYLE, isCorrect: true, isSafe: true }
      ],
      requiredSelections: 2,
      maxSelections: 3
    }
  },
  cutscenes: {
    [StepType.HISTORY_TAKING]: {
      intro: "Mr. Davis seems calm but concerned about his blood pressure reading.",
      success: "You gather important cardiovascular risk factors and family history.",
      failure: "The patient expected more thorough questions about his health."
    },
    [StepType.ORDERING_TESTS]: {
      intro: "You need to assess cardiovascular risk and rule out secondary causes.",
      success: "The tests help establish baseline cardiovascular health.",
      failure: "Consider what tests help evaluate hypertension."
    },
    [StepType.DIAGNOSIS]: {
      intro: "Blood pressure is consistently elevated at 160/95 mmHg.",
      success: "Correct! This is essential hypertension requiring treatment.",
      failure: "Review the blood pressure readings and patient presentation."
    },
    [StepType.TREATMENT]: {
      intro: "This patient needs both lifestyle and medical management.",
      success: "Excellent hypertension management approach!",
      failure: "Consider both medication and lifestyle interventions."
    }
  },
  mentorFeedback: {
    [StepType.HISTORY_TAKING]: {
      success: "Good history taking for hypertension evaluation.",
      failure: "Focus on cardiovascular risk factors and family history.",
      hint: "What increases cardiovascular risk?",
      gentle: "Consider asking about lifestyle and family history.",
      blunt: "You need to assess cardiovascular risk factors."
    },
    [StepType.ORDERING_TESTS]: {
      success: "Appropriate tests for hypertension workup.",
      failure: "Consider baseline tests for new hypertension.",
      hint: "What tests establish cardiovascular baseline?",
      gentle: "Think about what tests help evaluate heart health.",
      blunt: "Basic cardiovascular tests are needed."
    },
    [StepType.DIAGNOSIS]: {
      success: "Correct diagnosis of essential hypertension.",
      failure: "Review the blood pressure criteria for hypertension.",
      hint: "Persistent elevated BP = hypertension",
      gentle: "Look at the blood pressure readings.",
      blunt: "This is clearly hypertension."
    },
    [StepType.TREATMENT]: {
      success: "Good hypertension management plan.",
      failure: "Hypertension needs both lifestyle and medical treatment.",
      hint: "Medication + lifestyle changes",
      gentle: "Consider both drug and non-drug approaches.",
      blunt: "Start an ACE inhibitor and lifestyle modifications."
    }
  },
  culturalScenarios: [],
  patientInitialState: {
    trust: 75,
    anxiety: 40,
    satisfaction: 60,
    currentEmotion: 'worried'
  }
};

// Define the clinical systems
export const clinicalSystems: ClinicalSystem[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular Medicine',
    bodySystem: BodySystem.CARDIOVASCULAR,
    description: 'Master heart conditions, from angina to heart attacks. Learn to save lives in cardiac emergencies.',
    icon: '❤️',
    color: '#ef4444',
    cases: [case1, case3],
    isUnlocked: true
  },
  {
    id: 'neurology',
    name: 'Neurology',
    bodySystem: BodySystem.NEUROLOGY,
    description: 'Navigate the complexities of the nervous system. From strokes to seizures.',
    icon: '🧠',
    color: '#8b5cf6',
    cases: [case2],
    isUnlocked: true,
    requiredXP: 50
  },
  {
    id: 'infectious_disease',
    name: 'Infectious Disease',
    bodySystem: BodySystem.INFECTIOUS_DISEASE,
    description: 'Battle infections and learn antimicrobial stewardship. Coming soon!',
    icon: '🦠',
    color: '#10b981',
    cases: [],
    isUnlocked: false,
    requiredXP: 100
  }
];

// Helper functions
export const getClinicalSystem = (systemId: string): ClinicalSystem | undefined => {
  return clinicalSystems.find(system => system.id === systemId);
};

export const getCase = (caseId: string): Case | undefined => {
  console.log('getCase called with:', caseId);
  console.log('Available case IDs:', clinicalSystems.flatMap(s => s.cases.map(c => c.id)));
  
  for (const system of clinicalSystems) {
    const foundCase = system.cases.find(c => c.id === caseId);
    if (foundCase) {
      console.log('Found case:', foundCase.title);
      return foundCase;
    }
  }
  console.log('Case not found for ID:', caseId);
  return undefined;
}; 