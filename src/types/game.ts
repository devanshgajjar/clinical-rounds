export enum BodySystem {
  CARDIOVASCULAR = 'cardiovascular',
  NEUROLOGY = 'neurology',
  INFECTIOUS_DISEASE = 'infectious_disease',
  RESPIRATORY = 'respiratory',
  GASTROENTEROLOGY = 'gastroenterology'
}

export enum StepType {
  HISTORY_TAKING = 'history_taking',
  ORDERING_TESTS = 'ordering_tests', 
  DIAGNOSIS = 'diagnosis',
  TREATMENT = 'treatment'
}

export enum TestCategory {
  BLOOD_WORK = 'BLOOD_WORK',
  MICROBIOLOGY = 'MICROBIOLOGY',
  SERIOLOGY = 'SERIOLOGY',
  IMAGING = 'IMAGING',
  CARDIAC = 'CARDIAC',
  NEUROLOGICAL = 'NEUROLOGICAL',
  HORMONES = 'HORMONES',
  URINALYSIS = 'URINALYSIS',
  VITALS = 'VITALS',
  LABS = 'LABS',
  MONITORING = 'MONITORING',
  OTHER = 'OTHER'
}

export enum TreatmentCategory {
  MEDICATIONS = 'Medication',
  PROCEDURES = 'Procedure',
  LIFESTYLE = 'Lifestyle',
  FOLLOW_UP = 'Follow-up'
}

export interface Question {
  id: string;
  text: string;
  isRelevant: boolean;
  category?: string;
}

export interface Test {
  id: string;
  name: string;
  category: TestCategory;
  cost: number;
  necessary: boolean;
  synonyms: string[];
  commonTerms: string[];
  contraindicated?: boolean;
}

export interface DiagnosisOption {
  id: string;
  text: string;
  diagnosis: string;
  correct: boolean;
  isCorrect: boolean;
  name: string;
  synonyms: string[];
  commonTerms: string[];
}

export interface TreatmentOption {
  id: string;
  text: string;
  category: string;
  isCorrect: boolean;
  isSafe: boolean;
}

export interface StepData {
  questions?: Question[];
  tests?: Test[];
  diagnosisOptions?: DiagnosisOption[];
  treatmentOptions?: TreatmentOption[];
  requiredSelections?: number;
  maxSelections?: number;
}

export interface StepResult {
  stepType: StepType;
  selections: string[];
  isCompleted: boolean;
  isCorrect: boolean;
  attempts: number;
  score: number;
  timeElapsed?: number;
  feedback?: string;
  completedAt?: Date;
  xpEarned: number;
  multiplierApplied: number;
}

export interface XPMultiplier {
  current: number;
  step1Bonus: boolean;
  step2Bonus: boolean;
  fastCompletion: boolean;
  orderBonus: boolean;
}

export interface RetryMechanics {
  maxAttempts: number;
  xpPenalties: { [attempt: number]: number }; // e.g., { 2: 0.8, 3: 0.5 }
  stepFailureThreshold: number;
  casePenalty: number;
}

export interface CulturalScenario {
  id: string;
  trigger: 'cost_concern' | 'family_interference' | 'gratitude' | 'cultural_barrier';
  description: string;
  patientResponse: string;
  options: {
    id: string;
    text: string;
    empathyBonus?: number;
    xpModifier?: number;
  }[];
}

export interface PatientEmotionalState {
  trust: number; // 0-100
  anxiety: number; // 0-100
  satisfaction: number; // 0-100
  currentEmotion: 'happy' | 'worried' | 'frustrated' | 'grateful' | 'confused';
}

export interface Case {
  id: string;
  title: string;
  description: string;
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    chiefComplaint: string;
    avatar?: string;
  };
  bodySystem: BodySystem;
  difficulty: 1 | 2 | 3 | 4 | 5;
  baseXP: number;
  idealStepOrder: StepType[];
  steps: {
    [StepType.HISTORY_TAKING]: StepData;
    [StepType.ORDERING_TESTS]: StepData;
    [StepType.DIAGNOSIS]: StepData;
    [StepType.TREATMENT]: StepData;
  };
  cutscenes: {
    [key in StepType]: {
      intro: string;
      success: string;
      failure: string;
    };
  };
  mentorFeedback: {
    [key in StepType]: {
      success: string;
      failure: string;
      hint: string;
      gentle: string;
      blunt: string;
    };
  };
  culturalScenarios?: CulturalScenario[];
  patientInitialState: PatientEmotionalState;
}

export interface ClinicalSystem {
  id: string;
  name: string;
  bodySystem: BodySystem;
  description: string;
  icon: string;
  color: string;
  cases: Case[];
  isUnlocked: boolean;
  requiredXP?: number;
  badge?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'cases_completed' | 'perfect_cases' | 'speed_bonus' | 'empathy_score';
    value: number;
    system?: BodySystem;
  };
  xpBonus: number;
}

export interface XPCalculation {
  baseXP: number;
  stepMultiplier: number;
  orderBonus: number;
  retryPenalty: number;
  speedBonus: number;
  empathyBonus: number;
  finalXP: number;
  totalXP: number;
  breakdown: {
    step: StepType;
    score: number;
    multiplier: number;
    xp: number;
    attempts: number;
    penalty: number;
  }[];
  badgesEarned: Badge[];
}

export interface GameProgress {
  currentSystem: string;
  currentCase: string;
  currentStep: StepType;
  totalXP: number;
  completedCases: string[];
  unlockedSystems: string[];
  stepResults: { [caseId: string]: StepResult[] };
  casesInProgress: { [caseId: string]: { 
    stepResults: StepResult[]; 
    stepOrder: StepType[];
    patientState: PatientEmotionalState;
  }};
  badges: Badge[];
  stats: {
    totalCasesCompleted: number;
    perfectCases: number;
    averageScore: number;
    fastestCase: number;
    empathyRating: number;
  };
}

export interface GameState {
  progress: GameProgress;
  currentCase?: Case;
  currentStepResults: StepResult[];
  currentStepOrder: StepType[];
  currentPatientState: PatientEmotionalState;
  currentXPMultiplier: XPMultiplier;
  isInGame: boolean;
  showSummary: boolean;
  showCaseIntro: boolean;
  showStepSelection: boolean;
  showXPCutscene: boolean;
  xpCalculation?: XPCalculation;
}

export interface RetryState {
  totalWrongSteps: number;
  stepAttempts: { [stepType: string]: number };
  canRetry: boolean;
  mustRestart: boolean;
  retryMechanics: RetryMechanics;
}

export interface StepValidation {
  isValid: boolean;
  score: number;
  feedback: string;
  requiredSelections?: number;
  correctSelections: string[];
  incorrectSelections: string[];
  patientResponse: string;
  mentorFeedback: string;
  empathyImpact: number;
}

// UI State types
export enum GameScreen {
  DASHBOARD = 'dashboard',
  SYSTEM_SELECT = 'system_select',
  CASE_SELECT = 'case_select', 
  GAME_PLAY = 'game_play',
  CASE_SUMMARY = 'case_summary',
  PROFILE = 'profile',
  BADGES = 'badges'
}

export interface UIState {
  currentScreen: GameScreen;
  selectedSystem?: string;
  selectedCase?: string;
  navigationHistory: GameScreen[];
  showXPAnimation: boolean;
  showBadgeNotification: boolean;
}

// Edge case handling types
export interface StepOrderWarning {
  stepType: StepType;
  message: string;
  severity: 'warning' | 'error';
  xpPenalty: number;
  allowProceed: boolean;
}

export interface GameSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  casesPlayed: string[];
  xpEarned: number;
  achievements: string[];
}

// Save/Load game state
export interface SavedGameState {
  progress: GameProgress;
  timestamp: Date;
  version: string;
}

export interface MedicalTerm {
  id: string;
  name: string;
  synonyms: string[];
  commonTerms: string[];
  description?: string;
}

export interface Treatment extends MedicalTerm {
  category: 'Medication' | 'Procedure' | 'Lifestyle' | 'Follow-up';
  necessary: boolean;
  contraindicated?: boolean;
  dosage?: string;
}

export interface CaseData {
  id: string;
  title: string;
  shortDescription?: string;
  avatar?: string;
  xpReward?: number;
  stars?: number;
  unlocked?: boolean;
  system: string;
  difficulty: number;
  patient: {
    name: string;
    age: number;
    gender: string;
    chiefComplaint: string;
    background?: string;
  };
  steps: {
    [StepType.HISTORY_TAKING]: {
      questions: Question[];
      correctAnswers: string[];
      minimumRequired: number;
    };
    [StepType.ORDERING_TESTS]: {
      tests: Test[];
      correctTests: string[];
      maxAllowed: number;
    };
    [StepType.DIAGNOSIS]: {
      type: 'multiple-choice';
      options: DiagnosisOption[];
      correctDiagnoses: string[];
    };
    [StepType.TREATMENT]: {
      treatments: Treatment[];
      correctTreatments: string[];
      maxAllowed: number;
    };
  };
  reactions: {
    patient: {
      excellent: string;
      good: string;
      poor: string;
      failed: string;
    };
    mentor: {
      excellent: string;
      good: string;
      poor: string;
      failed: string;
    };
  };
  isEmergency: boolean;
  scoring?: {
    baseXP: number;
    optimalOrder: StepType[];
  };
} 