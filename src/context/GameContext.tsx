import React, { createContext, useContext, useReducer, useState, ReactNode } from 'react';
import { 
  GameState, 
  GameProgress, 
  StepResult, 
  StepType, 
  GameScreen,
  UIState,
  RetryState,
  XPMultiplier,
  PatientEmotionalState,
  Case,
  StepOrderWarning,
  CaseData,
  BodySystem,
  TreatmentCategory
} from '../types/game';
import { getCase, defaultRetryMechanics } from '../data/gameData';
import { casesData } from '../data/cases';
import { XPSystem } from '../logic/xpSystem';

// Initial game state
const initialGameProgress: GameProgress = {
  currentSystem: '',
  currentCase: '',
  currentStep: StepType.HISTORY_TAKING,
  totalXP: 100, // Give user enough XP to access all systems
  completedCases: [],
  unlockedSystems: ['cardiovascular', 'neurology'], // Start with both systems unlocked
  stepResults: {},
  casesInProgress: {},
  badges: [],
  stats: {
    totalCasesCompleted: 0,
    perfectCases: 0,
    averageScore: 0,
    fastestCase: 0,
    empathyRating: 0
  }
};

const initialUIState: UIState = {
  currentScreen: GameScreen.DASHBOARD,
  navigationHistory: [],
  showXPAnimation: false,
  showBadgeNotification: false
};

const initialRetryState: RetryState = {
  totalWrongSteps: 0,
  stepAttempts: {},
  canRetry: true,
  mustRestart: false,
  retryMechanics: defaultRetryMechanics
};

const initialGameState: GameState = {
  progress: initialGameProgress,
  currentStepResults: [],
  currentStepOrder: [],
  currentPatientState: {
    trust: 50,
    anxiety: 50,
    satisfaction: 50,
    currentEmotion: 'happy'
  },
  currentXPMultiplier: XPSystem.createInitialXPMultiplier(),
  isInGame: false,
  showSummary: false,
  showCaseIntro: false,
  showStepSelection: false,
  showXPCutscene: false
};

// Updated action types
type GameAction = 
  | { type: 'SELECT_CASE'; payload: { caseId: string } }
  | { type: 'START_CASE'; payload: { caseId: string } }
  | { type: 'COMPLETE_STEP'; payload: { stepType: StepType; result: StepResult } }
  | { type: 'RESTART_CASE' }
  | { type: 'COMPLETE_CASE' }
  | { type: 'NAVIGATE_TO_SCREEN'; payload: { screen: GameScreen; systemId?: string } }
  | { type: 'UNLOCK_SYSTEM'; payload: { systemId: string } }
  | { type: 'RESET_GAME' }
  | { type: 'SHOW_SUMMARY' }
  | { type: 'HIDE_SUMMARY' }
  | { type: 'CLEAR_XP_GLOW' }
  | { type: 'BACK_TO_CASE_SELECTION' }
  | { type: 'SHOW_XP_CUTSCENE'; payload: { stepType: StepType; xpEarned: number } }
  | { type: 'CONTINUE_TO_STEP_SELECTION' }
  | { type: 'START_GAMEPLAY'; payload: { stepType: StepType } }
  | { type: 'SAVE_PROGRESS'; payload: { caseId: string; stepResults: StepResult[]; patientState: PatientEmotionalState } }
  | { type: 'LOAD_PROGRESS'; payload: { caseId: string } }
  | { type: 'CLOSE_CASE' };

// Game state reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SELECT_CASE': {
      // First try to get case from cases.ts (new enhanced cases)
      const caseData = getCaseById(action.payload.caseId);
      if (caseData) {
        // Convert CaseData to Case format for game context
        const gameCase = convertCaseDataToCase(caseData);

        return {
          ...state,
          currentCase: gameCase,
          showCaseIntro: true,
          isInGame: false,
          showSummary: false,
          progress: {
            ...state.progress,
            currentCase: action.payload.caseId
          }
        };
      }

      // Fallback to original gameData.ts cases
      const gameCase = getCase(action.payload.caseId);
      if (!gameCase) return state;

      return {
        ...state,
        currentCase: gameCase,
        showCaseIntro: true,
        isInGame: false,
        showSummary: false,
        progress: {
          ...state.progress,
          currentCase: action.payload.caseId
        }
      };
    }

    case 'START_CASE': {
      // First try to get case from cases.ts (new enhanced cases)
      const caseData = getCaseById(action.payload.caseId);
      if (caseData) {
        // Convert CaseData to Case format for game context
        const gameCase = convertCaseDataToCase(caseData);

        const existingProgress = state.progress.casesInProgress[action.payload.caseId];
        
        return {
          ...state,
          currentCase: gameCase,
          currentStepResults: existingProgress?.stepResults || [],
          currentStepOrder: existingProgress?.stepOrder || [],
          currentPatientState: existingProgress?.patientState || gameCase.patientInitialState,
          currentXPMultiplier: XPSystem.createInitialXPMultiplier(),
          isInGame: false,
          showSummary: false,
          showCaseIntro: false,
          showStepSelection: true,
          progress: {
            ...state.progress,
            currentCase: action.payload.caseId,
            currentStep: StepType.HISTORY_TAKING
          }
        };
      }

      // Fallback to original gameData.ts cases
      const gameCase = getCase(action.payload.caseId);
      if (!gameCase) return state;

      // Load existing progress if available
      const existingProgress = state.progress.casesInProgress[action.payload.caseId];
      
      return {
        ...state,
        currentCase: gameCase,
        currentStepResults: existingProgress?.stepResults || [],
        currentStepOrder: existingProgress?.stepOrder || [],
        currentPatientState: existingProgress?.patientState || gameCase.patientInitialState,
        currentXPMultiplier: XPSystem.createInitialXPMultiplier(),
        isInGame: false,
        showSummary: false,
        showCaseIntro: false,
        showStepSelection: true,
        progress: {
          ...state.progress,
          currentCase: action.payload.caseId,
          currentStep: StepType.HISTORY_TAKING
        }
      };
    }

    case 'COMPLETE_STEP': {
      const { stepType, result } = action.payload;
      if (!state.currentCase) return state;

      // Update step results
      const newStepResults = [
        ...state.currentStepResults.filter(r => r.stepType !== stepType),
        { ...result, completedAt: new Date() }
      ];

      // Update step order
      const newStepOrder = state.currentStepOrder.includes(stepType) 
        ? state.currentStepOrder 
        : [...state.currentStepOrder, stepType];

      // Update XP multiplier
      const newXPMultiplier = XPSystem.updateMultiplier(
        state.currentXPMultiplier,
        stepType,
        result,
        result.timeElapsed || 0,
        state.currentStepOrder
      );

      // Update patient emotional state
      const { newState: newPatientState } = XPSystem.calculateEmpathyImpact(
        state.currentPatientState,
        stepType,
        result.isCorrect,
        result.timeElapsed || 0
      );

      // Check if case is complete (all 4 steps done)
      const isComplete = newStepResults.length === 4;

      // Save progress for this case
      const updatedCasesInProgress = {
        ...state.progress.casesInProgress,
        [state.progress.currentCase]: {
          stepResults: newStepResults,
          stepOrder: newStepOrder,
          patientState: newPatientState
        }
      };
      
      return {
        ...state,
        currentStepResults: newStepResults,
        currentStepOrder: newStepOrder,
        currentPatientState: newPatientState,
        currentXPMultiplier: newXPMultiplier,
        progress: {
          ...state.progress,
          currentStep: stepType,
          stepResults: {
            ...state.progress.stepResults,
            [state.progress.currentCase]: newStepResults
          },
          casesInProgress: updatedCasesInProgress
        },
        showSummary: isComplete
      };
    }

    case 'COMPLETE_CASE': {
      if (!state.currentCase) return state;

      // Calculate final XP
      const totalTimeElapsed = state.currentStepResults.reduce((sum, step) => sum + (step.timeElapsed || 0), 0);
      const empathyScore = state.currentPatientState.trust + state.currentPatientState.satisfaction - state.currentPatientState.anxiety;
      
      const xpCalculation = XPSystem.calculateFinalXP(
        state.currentCase,
        state.currentStepResults,
        state.currentStepOrder,
        totalTimeElapsed,
        empathyScore / 3, // Normalize empathy score
        0 // Cultural bonus - will be added later
      );

      // Update stats
      const newStats = {
        ...state.progress.stats,
        totalCasesCompleted: state.progress.stats.totalCasesCompleted + 1,
        perfectCases: state.progress.stats.perfectCases + (xpCalculation.finalXP === xpCalculation.baseXP * 2 ? 1 : 0),
        averageScore: ((state.progress.stats.averageScore * state.progress.stats.totalCasesCompleted) + 
                      (xpCalculation.finalXP / xpCalculation.baseXP * 100)) / (state.progress.stats.totalCasesCompleted + 1),
        fastestCase: Math.min(state.progress.stats.fastestCase || Infinity, totalTimeElapsed),
        empathyRating: ((state.progress.stats.empathyRating * state.progress.stats.totalCasesCompleted) + 
                       (empathyScore / 3)) / (state.progress.stats.totalCasesCompleted + 1)
      };

      // Check if this completion unlocks next system
      const newUnlockedSystems = [...state.progress.unlockedSystems];
      if (state.progress.totalXP + xpCalculation.finalXP >= 50 && !newUnlockedSystems.includes('neurology')) {
        newUnlockedSystems.push('neurology');
      }

      // Remove from in-progress cases
      const { [state.progress.currentCase]: removed, ...remainingInProgress } = state.progress.casesInProgress;

      return {
        ...state,
        isInGame: false,
        showSummary: true,
        xpCalculation,
        progress: {
          ...state.progress,
          totalXP: state.progress.totalXP + xpCalculation.finalXP,
          completedCases: [...state.progress.completedCases, state.currentCase.id],
          unlockedSystems: newUnlockedSystems,
          casesInProgress: remainingInProgress,
          stats: newStats
        }
      };
    }

    case 'RESTART_CASE': {
      if (!state.currentCase) return state;

      // Remove from in-progress and reset
      const { [state.progress.currentCase]: removed, ...remainingInProgress } = state.progress.casesInProgress;

      return {
        ...state,
        currentStepResults: [],
        currentStepOrder: [],
        currentPatientState: state.currentCase.patientInitialState,
        currentXPMultiplier: XPSystem.createInitialXPMultiplier(),
        progress: {
          ...state.progress,
          totalXP: Math.max(0, state.progress.totalXP - 10), // Penalty for restart
          casesInProgress: remainingInProgress
        }
      };
    }

    case 'NAVIGATE_TO_SCREEN': {
      return {
        ...state,
        progress: {
          ...state.progress,
          currentSystem: action.payload.systemId || state.progress.currentSystem
        }
      };
    }

    case 'SAVE_PROGRESS': {
      const { caseId, stepResults, patientState } = action.payload;
      
      return {
        ...state,
        progress: {
          ...state.progress,
          casesInProgress: {
            ...state.progress.casesInProgress,
            [caseId]: {
              stepResults,
              stepOrder: state.currentStepOrder,
              patientState
            }
          }
        }
      };
    }

    case 'SHOW_SUMMARY': {
      return { ...state, showSummary: true };
    }

    case 'HIDE_SUMMARY': {
      return { ...state, showSummary: false };
    }

    case 'RESET_GAME': {
      return initialGameState;
    }

    case 'CLEAR_XP_GLOW': {
      return state; // Will be implemented with UI animations
    }

    case 'BACK_TO_CASE_SELECTION': {
      return {
        ...state,
        currentCase: undefined,
        showCaseIntro: false,
        isInGame: false,
        showSummary: false,
        showStepSelection: false,
        showXPCutscene: false,
        progress: {
          ...state.progress,
          currentCase: ''
        }
      };
    }

    case 'SHOW_XP_CUTSCENE': {
      return {
        ...state,
        showXPCutscene: true,
        isInGame: false,
        showStepSelection: false,
        showCaseIntro: false
      };
    }

    case 'CONTINUE_TO_STEP_SELECTION': {
      return {
        ...state,
        showXPCutscene: false,
        showStepSelection: true
      };
    }

    case 'START_GAMEPLAY': {
      return {
        ...state,
        isInGame: true,
        showStepSelection: false,
        showXPCutscene: false,
        progress: {
          ...state.progress,
          currentStep: action.payload.stepType
        }
      };
    }

    case 'CLOSE_CASE': {
      return {
        ...state,
        currentCase: undefined,
        isInGame: false,
        showSummary: false,
        showCaseIntro: false,
        showStepSelection: false,
        showXPCutscene: false,
        progress: {
          ...state.progress,
          currentCase: ''
        }
      };
    }

    default:
      return state;
  }
};

interface GameContextType {
  gameState: GameState;
  uiState: UIState;
  retryState: RetryState;
  dispatch: React.Dispatch<GameAction>;
  
  // Helper functions
  selectCase: (caseId: string) => void;
  startCase: (caseId: string) => void;
  completeStep: (stepType: StepType, result: StepResult) => void;
  restartCase: () => void;
  completeCase: () => void;
  navigateToScreen: (screen: GameScreen, systemId?: string) => void;
  showSummary: () => void;
  hideSummary: () => void;
  resetGame: () => void;
  clearXPGlow: () => void;
  saveProgress: (caseId: string, stepResults: StepResult[], patientState: PatientEmotionalState) => void;
  
  // Game state helpers
  getCurrentCase: () => Case | undefined;
  getStepResult: (stepType: StepType) => StepResult | undefined;
  isStepCompleted: (stepType: StepType) => boolean;
  canAccessStep: (stepType: StepType) => boolean;
  getStepProgress: () => { completed: number; total: number; currentStep?: StepType };
  getXPMultiplier: () => XPMultiplier;
  checkStepOrderWarning: (stepType: StepType) => StepOrderWarning | null;
  getPatientState: () => PatientEmotionalState;
  closeCase: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [uiState] = useState<UIState>(initialUIState);
  const [retryState] = useState<RetryState>(initialRetryState);

  const selectCase = (caseId: string) => {
    console.log('Selecting case with ID:', caseId);
    dispatch({ type: 'SELECT_CASE', payload: { caseId } });
  };

  const startCase = (caseId: string) => {
    console.log('Starting case with ID:', caseId);
    const testCase = getCase(caseId);
    console.log('Found case:', testCase);
    dispatch({ type: 'START_CASE', payload: { caseId } });
  };

  const completeStep = (stepType: StepType, result: StepResult) => {
    dispatch({ type: 'COMPLETE_STEP', payload: { stepType, result } });
  };

  const restartCase = () => {
    dispatch({ type: 'RESTART_CASE' });
  };

  const completeCase = () => {
    dispatch({ type: 'COMPLETE_CASE' });
  };

  const navigateToScreen = (screen: GameScreen, systemId?: string) => {
    dispatch({ type: 'NAVIGATE_TO_SCREEN', payload: { screen, systemId } });
  };

  const showSummary = () => {
    dispatch({ type: 'SHOW_SUMMARY' });
  };

  const hideSummary = () => {
    dispatch({ type: 'HIDE_SUMMARY' });
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const clearXPGlow = () => {
    dispatch({ type: 'CLEAR_XP_GLOW' });
  };

  const saveProgress = (caseId: string, stepResults: StepResult[], patientState: PatientEmotionalState) => {
    dispatch({ type: 'SAVE_PROGRESS', payload: { caseId, stepResults, patientState } });
  };

  // Helper functions
  const getCurrentCase = (): Case | undefined => {
    return gameState.currentCase;
  };

  const getStepResult = (stepType: StepType): StepResult | undefined => {
    return gameState.currentStepResults.find(result => result.stepType === stepType);
  };

  const isStepCompleted = (stepType: StepType): boolean => {
    return gameState.currentStepResults.some(result => result.stepType === stepType && result.isCompleted);
  };

  const canAccessStep = (stepType: StepType): boolean => {
    // In the new system, all steps can be accessed in any order
    return true;
  };

  const getStepProgress = () => {
    const completed = gameState.currentStepResults.filter(r => r.isCompleted).length;
    const currentStep = gameState.currentStepResults.length > 0 
      ? gameState.currentStepResults[gameState.currentStepResults.length - 1].stepType 
      : undefined;
    
    return { completed, total: 4, currentStep };
  };

  const getXPMultiplier = (): XPMultiplier => {
    return gameState.currentXPMultiplier;
  };

  const checkStepOrderWarning = (stepType: StepType): StepOrderWarning | null => {
    const completedSteps = gameState.currentStepResults
      .filter(r => r.isCompleted)
      .map(r => r.stepType);
    
    return XPSystem.checkStepOrderWarning(stepType, completedSteps);
  };

  const getPatientState = (): PatientEmotionalState => {
    return gameState.currentPatientState;
  };

  const closeCase = () => {
    dispatch({ type: 'CLOSE_CASE' });
  };

  const contextValue: GameContextType = {
    gameState,
    uiState,
    retryState,
    dispatch,
    selectCase,
    startCase,
    completeStep,
    restartCase,
    completeCase,
    navigateToScreen,
    showSummary,
    hideSummary,
    resetGame,
    clearXPGlow,
    saveProgress,
    getCurrentCase,
    getStepResult,
    isStepCompleted,
    canAccessStep,
    getStepProgress,
    getXPMultiplier,
    checkStepOrderWarning,
    getPatientState,
    closeCase
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const getCaseById = (id: string) => casesData.find(c => c.id === id);

const convertCaseDataToCase = (caseData: CaseData): Case => {
  const mapTreatmentCategory = (category: TreatmentCategory): TreatmentCategory => {
    return category;
  };

  return {
    id: caseData.id,
    title: caseData.title,
    description: caseData.patient.background || '',
    bodySystem: caseData.system as BodySystem,
    difficulty: caseData.difficulty as 1 | 2 | 3 | 4 | 5,
    baseXP: caseData.scoring?.baseXP || 100,
    idealStepOrder: caseData.scoring?.optimalOrder || [],
    patientInfo: {
      name: caseData.patient.name,
      age: caseData.patient.age,
      gender: caseData.patient.gender,
      chiefComplaint: caseData.patient.chiefComplaint,
      avatar: caseData.avatar
    },
    steps: {
      [StepType.HISTORY_TAKING]: {
        questions: caseData.steps[StepType.HISTORY_TAKING].questions,
        requiredSelections: caseData.steps[StepType.HISTORY_TAKING].minimumRequired,
        maxSelections: caseData.steps[StepType.HISTORY_TAKING].minimumRequired + 2
      },
      [StepType.ORDERING_TESTS]: {
        tests: caseData.steps[StepType.ORDERING_TESTS].tests,
        requiredSelections: caseData.steps[StepType.ORDERING_TESTS].maxAllowed,
        maxSelections: caseData.steps[StepType.ORDERING_TESTS].maxAllowed
      },
      [StepType.DIAGNOSIS]: {
        diagnosisOptions: caseData.steps[StepType.DIAGNOSIS].options,
        requiredSelections: 1,
        maxSelections: 1
      },
      [StepType.TREATMENT]: {
        treatmentOptions: caseData.steps[StepType.TREATMENT].treatments.map(t => ({
          id: t.id,
          text: t.name,
          category: t.category as TreatmentCategory,
          isCorrect: t.necessary,
          isSafe: true
        })),
        requiredSelections: caseData.steps[StepType.TREATMENT].maxAllowed,
        maxSelections: caseData.steps[StepType.TREATMENT].maxAllowed
      }
    },
    cutscenes: {
      [StepType.HISTORY_TAKING]: {
        intro: '',
        success: '',
        failure: ''
      },
      [StepType.ORDERING_TESTS]: {
        intro: '',
        success: '',
        failure: ''
      },
      [StepType.DIAGNOSIS]: {
        intro: '',
        success: '',
        failure: ''
      },
      [StepType.TREATMENT]: {
        intro: '',
        success: '',
        failure: ''
      }
    },
    mentorFeedback: {
      [StepType.HISTORY_TAKING]: {
        success: '',
        failure: '',
        hint: '',
        gentle: '',
        blunt: ''
      },
      [StepType.ORDERING_TESTS]: {
        success: '',
        failure: '',
        hint: '',
        gentle: '',
        blunt: ''
      },
      [StepType.DIAGNOSIS]: {
        success: '',
        failure: '',
        hint: '',
        gentle: '',
        blunt: ''
      },
      [StepType.TREATMENT]: {
        success: '',
        failure: '',
        hint: '',
        gentle: '',
        blunt: ''
      }
    },
    patientInitialState: {
      trust: 50,
      anxiety: 50,
      satisfaction: 50,
      currentEmotion: 'worried' as const
    }
  };
}; 